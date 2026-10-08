import "server-only";

import { randomUUID } from "node:crypto";

import { serverEnv } from "@/config/env";
import type { StorageProvider } from "@/core/ports";

import { signParams } from "./sign";
import { cloudinaryUrl } from "./url";

// Cloudinary StorageProvider (NEXT_PUBLIC_STORAGE_PROVIDER=cloudinary, decision T5). The browser
// uploads one compressed WebP straight to Cloudinary with a short-lived signed ticket, so image
// bytes never pass through Vercel; the server only signs, verifies and deletes.

const API = "https://api.cloudinary.com/v1_1";
const TICKET_MINUTES = 10;

function credentials() {
  const env = serverEnv();
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary needs NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET",
    );
  }
  return { cloudName, apiKey, apiSecret, folder: env.CLOUDINARY_UPLOAD_FOLDER };
}

type ResourceInfo = { width: number; height: number; colors?: [string, number][] };

export function createCloudinaryStorage(): StorageProvider {
  return {
    async createUploadTicket({ userId, purpose }) {
      const { cloudName, apiKey, apiSecret, folder } = credentials();
      // The user id in the name is how confirmUpload proves who uploaded what.
      const key = `${folder}/${purpose}/${userId}-${randomUUID()}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const signed = { public_id: key, timestamp, allowed_formats: "webp" };
      return {
        uploadUrl: `${API}/${cloudName}/image/upload`,
        fields: {
          api_key: apiKey,
          timestamp: String(timestamp),
          public_id: key,
          allowed_formats: "webp",
          signature: signParams(signed, apiSecret),
        },
        key,
        expiresAt: new Date((timestamp + TICKET_MINUTES * 60) * 1000),
      };
    },

    async confirmUpload({ key, userId }) {
      const { cloudName, apiKey, apiSecret, folder } = credentials();
      if (!key.startsWith(`${folder}/`) || !key.split("/").at(-1)?.startsWith(`${userId}-`)) {
        throw new Error("Upload does not belong to this user");
      }
      const response = await fetch(
        `${API}/${cloudName}/resources/image/upload/${encodeURI(key)}?colors=true`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
          },
        },
      );
      if (!response.ok)
        throw new Error(`Cloudinary could not find the upload (${response.status})`);
      const info = (await response.json()) as ResourceInfo;
      return {
        id: key,
        key,
        width: info.width,
        height: info.height,
        dominantColor: info.colors?.[0]?.[0]?.toLowerCase() ?? null,
      };
    },

    async delete(key) {
      const { cloudName, apiKey, apiSecret } = credentials();
      const timestamp = Math.floor(Date.now() / 1000);
      const body = new URLSearchParams({
        public_id: key,
        timestamp: String(timestamp),
        api_key: apiKey,
        signature: signParams({ public_id: key, timestamp }, apiSecret),
      });
      const response = await fetch(`${API}/${cloudName}/image/destroy`, { method: "POST", body });
      if (!response.ok) throw new Error(`Cloudinary delete failed (${response.status})`);
    },

    url(key, variant) {
      return cloudinaryUrl(credentials().cloudName, key, variant);
    },
  };
}

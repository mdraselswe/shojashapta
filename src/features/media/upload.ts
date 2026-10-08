"use client";

import { compressToWebp } from "@/lib/image/compress";

import { requestUploadTicket } from "./actions";

/**
 * Compresses each picked photo and uploads it straight to the image host with its own signed
 * ticket. Returns the keys that made it; a photo that fails is skipped, never blocking the rest.
 */
export async function uploadPhotos(files: File[]): Promise<{ keys: string[]; failed: number }> {
  const keys: string[] = [];
  let failed = 0;
  for (const file of files) {
    try {
      const { blob } = await compressToWebp(file);
      const ticket = await requestUploadTicket({ purpose: "experience" });
      if (!ticket.ok) throw new Error(ticket.error.code);
      const form = new FormData();
      for (const [name, value] of Object.entries(ticket.data.fields)) form.append(name, value);
      form.append("file", blob, "photo.webp");
      const response = await fetch(ticket.data.uploadUrl, { method: "POST", body: form });
      if (!response.ok) throw new Error(`upload ${response.status}`);
      keys.push(ticket.data.key);
    } catch {
      failed += 1;
    }
  }
  return { keys, failed };
}

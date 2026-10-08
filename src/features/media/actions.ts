"use server";

import { z } from "zod";

import { appConfig } from "@/config/app.config";
import { defineAction } from "@/infrastructure/container";

/** A short-lived signed ticket to upload one photo straight to the image host. */
export const requestUploadTicket = defineAction(
  z.object({ purpose: z.literal("experience") }),
  async (input, { services, user }) => {
    const ticket = await services.media.ticket(user, input.purpose);
    return { ok: true as const, data: { ...ticket, expiresAt: ticket.expiresAt.toISOString() } };
  },
  { auth: true, rateLimit: "upload" },
);

/** Attaches photos the browser has uploaded to the person's own experience. */
export const attachPhotos = defineAction(
  z.object({
    experienceId: z.string().min(1).max(64),
    keys: z.array(z.string().min(1).max(300)).min(1).max(appConfig.media.maxPhotosPerExperience),
  }),
  async (input, { services, user }) => services.media.attachToExperience(user, input),
  { auth: true },
);

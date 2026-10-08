"use server";

import { z } from "zod";

import { appConfig } from "@/config/app.config";
import { defineAction } from "@/infrastructure/container";
import { REPORT_REASONS } from "@/services/moderation-service";

const id = z.string().min(1).max(64);

const editSchema = z.object({
  entity: z.enum(["place", "food"]),
  entityId: id,
  field: z.string().min(1).max(40),
  proposedValue: z.string().min(1).max(300),
  note: z.string().max(appConfig.text.noteMax).nullish(),
});

/** ✏️ সংশোধন: goes to the admin queue, never changes content directly. */
export const suggestEdit = defineAction(
  editSchema,
  async (input, { services, user }) => services.moderation.suggestEdit(user, input),
  { auth: true, rateLimit: "edit_suggestion" },
);

const reportSchema = z.object({
  entity: z.enum(["place", "food", "dish", "experience"]),
  entityId: id,
  reason: z.enum(REPORT_REASONS),
  note: z.string().max(appConfig.text.noteMax).nullish(),
});

/** Report content; enough independent reports hide it until an admin looks. */
export const reportContent = defineAction(
  reportSchema,
  async (input, { services, user }) => services.moderation.report(user, input),
  { auth: true, rateLimit: "report" },
);

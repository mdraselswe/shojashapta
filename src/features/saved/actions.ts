"use server";

import { z } from "zod";

import { defineAction } from "@/infrastructure/container";

const schema = z.object({
  entity: z.enum(["food", "place"]),
  entityId: z.string().min(1).max(64),
});

/** Bookmark toggle: signed-in only, counted against the daily `save` limit. */
export const toggleSaved = defineAction(
  schema,
  async (input, { services, user }) => services.saved.toggle(user, input),
  { auth: true, rateLimit: "save" },
);

"use client";

import { useCallback } from "react";

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

/**
 * Shares a page: the phone's share sheet when the browser has one (Messenger, WhatsApp...), else
 * copies the link. Cancelling the sheet is not an error.
 */
export function useShare() {
  return useCallback(async (input: { title: string; path: string }): Promise<ShareResult> => {
    const url = new URL(input.path, window.location.origin).toString();
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: input.title, url });
        return "shared";
      }
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch (error) {
      return error instanceof DOMException && error.name === "AbortError" ? "cancelled" : "failed";
    }
  }, []);
}

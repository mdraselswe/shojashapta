// Images (decision T5): originals are never stored; providers serve two WebP variants.

export type MediaVariant = "thumb" | "large";

export type MediaPurpose = "experience" | "place" | "food" | "evidence" | "avatar";

/** Enough to render an image: the StorageProvider turns `key` into a URL. */
export type MediaRef = {
  id: string;
  key: string;
  width: number;
  height: number;
  /** Placeholder color until the image decodes, e.g. "#c48a3a". */
  dominantColor: string | null;
};

export type UploadTicket = {
  /** Where the browser uploads directly (signed, short-lived). */
  uploadUrl: string;
  /** Provider fields to send with the upload. */
  fields: Record<string, string>;
  key: string;
  expiresAt: Date;
};

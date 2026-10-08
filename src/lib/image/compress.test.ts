import { describe, expect, it } from "vitest";

import { checkPickedFile, fitWithin } from "./compress";

describe("fitWithin", () => {
  it("shrinks wide photos to the target width and keeps the ratio", () => {
    expect(fitWithin(4000, 3000, 1080)).toEqual({ width: 1080, height: 810 });
    expect(fitWithin(3000, 4000, 1080)).toEqual({ width: 1080, height: 1440 });
  });

  it("never enlarges a small image", () => {
    expect(fitWithin(600, 400, 1080)).toEqual({ width: 600, height: 400 });
  });

  it("keeps at least one pixel of height", () => {
    expect(fitWithin(100000, 1, 1080).height).toBe(1);
  });
});

describe("checkPickedFile", () => {
  it("accepts ordinary phone photos", () => {
    expect(checkPickedFile({ type: "image/jpeg", size: 6_000_000 })).toBeNull();
    expect(checkPickedFile({ type: "image/HEIC", size: 2_000_000 })).toBeNull();
  });

  it("refuses non-images and very large files", () => {
    expect(checkPickedFile({ type: "application/pdf", size: 1000 })).toBe("not_image");
    expect(checkPickedFile({ type: "image/gif", size: 1000 })).toBe("not_image");
    expect(checkPickedFile({ type: "image/jpeg", size: 9_000_000 })).toBe("too_big");
  });
});

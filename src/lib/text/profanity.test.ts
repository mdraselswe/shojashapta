import { describe, expect, it } from "vitest";

import { containsProfanity } from "./profanity";

describe("containsProfanity", () => {
  it("catches blocked words in Bangla and English, whatever the case or punctuation", () => {
    expect(containsProfanity("তুই একটা হারামজাদা!")).toBe(true);
    expect(containsProfanity("What the FUCK, this is shit.")).toBe(true);
  });

  it("only matches whole words, so ordinary words that contain one are fine", () => {
    expect(containsProfanity("বালিশের মতো নরম দই")).toBe(false);
    expect(containsProfanity("Scunthorpe classic diced pickle")).toBe(false);
    expect(containsProfanity("টক-মিষ্টি ঠিকঠাক, হাঁড়ির দই।")).toBe(false);
  });

  it("is false for empty text", () => {
    expect(containsProfanity("")).toBe(false);
  });
});

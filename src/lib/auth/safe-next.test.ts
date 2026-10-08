import { describe, expect, it } from "vitest";

import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it("keeps site paths, with query strings", () => {
    expect(safeNext("/add")).toBe("/add");
    expect(safeNext("/food/doi?x=1#top")).toBe("/food/doi?x=1#top");
  });

  it.each([
    null,
    undefined,
    "",
    "https://evil.example",
    "//evil.example",
    "/" + String.fromCharCode(92) + "evil.example",
    "javascript:alert(1)",
    "add",
    "/ok\nlocation: https://evil.example",
    `/${"a".repeat(400)}`,
  ])("falls back to home for %j", (value) => {
    expect(safeNext(value)).toBe("/");
  });

  it("uses a custom fallback", () => {
    expect(safeNext("//x", "/me")).toBe("/me");
  });
});

import { describe, expect, it } from "vitest";

import { createT, messages } from "./t";

function keys(tree: object, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : keys(value as object, `${prefix}${key}.`),
  );
}

describe("i18n", () => {
  it("en.json has exactly the keys of bn.json", () => {
    expect(keys(messages.en).sort()).toEqual(keys(messages.bn).sort());
  });

  it("translates nested keys per locale", () => {
    expect(createT("bn")("nav.home")).toBe("হোম");
    expect(createT("en")("nav.home")).toBe("Home");
  });

  it("falls back to the key and ignores unused params", () => {
    const t = createT("bn");
    // @ts-expect-error — unknown keys are a type error; at runtime they fall back to the key.
    expect(t("missing.key")).toBe("missing.key");
    expect(t("common.loading", { unused: 1 })).toBe("লোড হচ্ছে…");
  });

  it("never uses the banned words (AGENTS.md §5)", () => {
    const all = JSON.stringify(messages);
    expect(all).not.toMatch(/সেরা|Verified/);
  });
});

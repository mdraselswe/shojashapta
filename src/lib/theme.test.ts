import { describe, expect, it } from "vitest";

import { isThemeId, resolveTheme, themeInitScript, toPreference } from "./theme";

describe("theme helpers", () => {
  it("accepts only registered theme ids", () => {
    expect(isThemeId("dark")).toBe(true);
    expect(isThemeId("system")).toBe(false);
    expect(isThemeId("eid")).toBe(false);
  });

  it("treats missing or unknown stored values as system", () => {
    expect(toPreference(null)).toBe("system");
    expect(toPreference("removed-theme")).toBe("system");
    expect(toPreference("light")).toBe("light");
  });

  it("resolves system to the OS scheme", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("init script sets data-theme only for a registered theme", () => {
    const run = (stored: string | null) => {
      const attrs: Record<string, string> = {};
      const fakeDocument = {
        documentElement: { setAttribute: (key: string, value: string) => (attrs[key] = value) },
      };
      const fakeStorage = { getItem: () => stored };
      new Function("document", "localStorage", themeInitScript())(fakeDocument, fakeStorage);
      return attrs["data-theme"];
    };
    expect(run("dark")).toBe("dark");
    expect(run("system")).toBeUndefined();
    expect(run("<script>")).toBeUndefined();
    expect(run(null)).toBeUndefined();
  });
});

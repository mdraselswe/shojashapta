import { describe, expect, it } from "vitest";

import { routes } from "./routes";

describe("routes", () => {
  it("builds entity paths", () => {
    expect(routes.food("doi")).toBe("/food/doi");
    expect(routes.place("sample-place")).toBe("/place/sample-place");
    expect(routes.districtFood("bogura", "doi")).toBe("/district/bogura/doi");
  });

  it("encodes Bangla and unsafe characters in slugs", () => {
    expect(routes.food("দই")).toBe(`/food/${encodeURIComponent("দই")}`);
    expect(routes.place("a/b")).toBe("/place/a%2Fb");
  });

  it("adds the search query only when present", () => {
    expect(routes.search()).toBe("/search");
    expect(routes.search({ q: "" })).toBe("/search");
    expect(routes.search({ q: "কাচ্চি বিরিয়ানি" })).toBe(
      "/search?q=%E0%A6%95%E0%A6%BE%E0%A6%9A%E0%A7%8D%E0%A6%9A%E0%A6%BF+%E0%A6%AC%E0%A6%BF%E0%A6%B0%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%A8%E0%A6%BF",
    );
  });
});

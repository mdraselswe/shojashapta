import { describe, expect, it } from "vitest";

import { absoluteUrl, withSearchParams } from "./url";

describe("withSearchParams", () => {
  it("adds parameters and skips empty values", () => {
    expect(withSearchParams("/search", { q: "doi", page: 2, empty: "", none: undefined })).toBe(
      "/search?q=doi&page=2",
    );
    expect(withSearchParams("/search", {})).toBe("/search");
  });

  it("merges with an existing query and removes cleared keys", () => {
    expect(withSearchParams("/search?q=doi&page=3", { page: null, type: "street" })).toBe(
      "/search?q=doi&type=street",
    );
  });

  it("encodes Bangla", () => {
    expect(withSearchParams("/search", { q: "দই" })).toBe(`/search?q=${encodeURIComponent("দই")}`);
  });
});

describe("absoluteUrl", () => {
  it("joins paths to the site origin", () => {
    // NEXT_PUBLIC_SITE_URL is unset in tests → local default.
    expect(absoluteUrl("/food/doi")).toBe("http://localhost:3000/food/doi");
    expect(absoluteUrl()).toBe("http://localhost:3000/");
  });
});

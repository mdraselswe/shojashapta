import { describe, expect, it } from "vitest";

import { mapSearchUrl } from "./map-url";

describe("mapSearchUrl", () => {
  it("encodes Bangla text for the map search URL", () => {
    expect(mapSearchUrl("নমুনা দই ঘর বগুড়া")).toBe(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("নমুনা দই ঘর বগুড়া")}`,
    );
  });

  it("cannot be broken out of the query by special characters", () => {
    const url = new URL(mapSearchUrl("a&b=c#d"));
    expect(url.searchParams.get("query")).toBe("a&b=c#d");
    expect(url.hostname).toBe("www.google.com");
  });
});

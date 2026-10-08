import { describe, expect, it } from "vitest";

import { breadcrumbLd, itemListLd, placeLd, serializeLd, websiteLd } from "./jsonld";

describe("structured data", () => {
  it("numbers breadcrumb items from 1 with absolute URLs", () => {
    const ld = breadcrumbLd([
      { name: "হোম", path: "/" },
      { name: "দই", path: "/food/doi" },
    ]);
    expect(ld.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(ld.itemListElement[1]?.item).toMatch(/^https?:\/\/.+\/food\/doi$/);
  });

  it("describes the site with a search action", () => {
    const ld = websiteLd();
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.potentialAction.target.urlTemplate).toContain("/search?q={search_term_string}");
  });

  it("maps place types to schema.org types and never adds a rating", () => {
    const base = {
      slug: "sample",
      nameBn: "নমুনা",
      nameEn: null,
      districtNameBn: "বগুড়া",
      address: null,
    } as const;
    expect(placeLd({ ...base, type: "restaurant" })["@type"]).toBe("Restaurant");
    expect(placeLd({ ...base, type: "bakery" })["@type"]).toBe("Bakery");
    expect(placeLd({ ...base, type: "street_food" })["@type"]).toBe("FoodEstablishment");
    const ld = placeLd({ ...base, type: "shop", address: "মেইন রোড" });
    expect(ld).not.toHaveProperty("aggregateRating");
    expect(ld).not.toHaveProperty("geo");
    expect(ld.address).toMatchObject({ streetAddress: "মেইন রোড", addressLocality: "বগুড়া" });
  });

  it("lists items in order", () => {
    const ld = itemListLd("বগুড়া", [
      { name: "ক", path: "/place/a" },
      { name: "খ", path: "/place/b" },
    ]);
    expect(ld.itemListElement.map((item) => item.name)).toEqual(["ক", "খ"]);
  });

  it("escapes < so content cannot close the script tag", () => {
    expect(serializeLd({ name: "</script><b>" })).not.toContain("<");
  });
});

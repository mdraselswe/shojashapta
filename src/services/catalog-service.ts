import type { Repositories } from "@/core/ports";

// Read-side business logic for the catalog pages (docs/03-architecture.md §2). Pure: depends on
// ports only, so it runs the same on mock data, Supabase and in plain Vitest.

type Deps = { repos: Pick<Repositories, "districts"> };

export type FoodRef = { slug: string; nameBn: string };
export type DistrictRef = { slug: string; nameBn: string };

export type HomeFamous = { district: DistrictRef; food: FoodRef; noteBn: string | null };
export type HomeDistrict = DistrictRef & { famous: FoodRef | null };
export type HomeDivision = { nameBn: string; districts: HomeDistrict[] };

export type HomeData = {
  /** Every curated "famous for" pair, in editor order. */
  famous: HomeFamous[];
  /** Districts that have a famous food, for the quick-pick row. */
  famousDistricts: HomeDistrict[];
  /** All districts grouped by division, in division order. */
  divisions: HomeDivision[];
};

export function createCatalogService({ repos }: Deps) {
  return {
    async home(): Promise<HomeData> {
      const [districts, fame] = await Promise.all([
        repos.districts.list(),
        repos.districts.allFame(),
      ]);
      const byId = new Map(districts.map((district) => [district.id, district]));

      const famous: HomeFamous[] = fame.flatMap((entry) => {
        const district = byId.get(entry.districtId);
        if (!district) return [];
        return [
          {
            district: { slug: district.slug, nameBn: district.nameBn },
            food: { slug: entry.food.slug, nameBn: entry.food.nameBn },
            noteBn: entry.noteBn,
          },
        ];
      });

      const firstFamousOf = new Map<string, FoodRef>();
      for (const entry of famous) {
        if (!firstFamousOf.has(entry.district.slug))
          firstFamousOf.set(entry.district.slug, entry.food);
      }

      const divisions: HomeDivision[] = [];
      for (const district of districts) {
        let division = divisions.find((candidate) => candidate.nameBn === district.divisionBn);
        if (!division) {
          division = { nameBn: district.divisionBn, districts: [] };
          divisions.push(division);
        }
        division.districts.push({
          slug: district.slug,
          nameBn: district.nameBn,
          famous: firstFamousOf.get(district.slug) ?? null,
        });
      }

      const famousDistricts = divisions.flatMap((division) =>
        division.districts.filter((district) => district.famous !== null),
      );
      return { famous, famousDistricts, divisions };
    },
  };
}

export type CatalogService = ReturnType<typeof createCatalogService>;

import { HomePageSkeleton } from "@/features/home/components/home-page";

// The (site) group's own page is the home page; every other route has its own loading.tsx.
export default function Loading() {
  return <HomePageSkeleton />;
}

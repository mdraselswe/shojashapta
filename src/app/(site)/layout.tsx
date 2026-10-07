import { BottomNav } from "@/components/layout/bottom-nav";

// App pages: content column + floating bottom nav (docs/03-architecture.md §3).
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

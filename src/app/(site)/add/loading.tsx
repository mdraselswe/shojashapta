import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageShell>
      <section className="page-x pt-6 lg:pt-12" aria-hidden>
        <Skeleton className="mb-4 h-9 w-1/3" />
        <Skeleton className="h-52 w-full rounded-card-lg" />
      </section>
    </PageShell>
  );
}

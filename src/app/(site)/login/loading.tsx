import { PageShell } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageShell>
      <section className="page-x pt-10 lg:max-w-xl" aria-hidden>
        <Skeleton className="h-9 w-1/2" />
        <Skeleton className="mt-4 h-20 w-full" />
        <Skeleton className="mt-5 h-14 w-full rounded-button" />
      </section>
    </PageShell>
  );
}

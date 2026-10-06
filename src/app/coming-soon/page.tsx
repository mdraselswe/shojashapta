import type { Metadata } from "next";

// Placeholder until launch. Phase 0.5 brings the logo, fonts and final tokens; 0.8 moves the copy to bn.json.
export const metadata: Metadata = {
  title: "সোজাসাপ্টা — শিগগিরই আসছে",
  description: "বাংলাদেশে কোথায় কী খাবেন — খাবার নিয়ে সোজাসাপ্টা কথা।",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-end gap-4 bg-background px-6 pt-16 pb-24 text-foreground">
      <h1 className="text-5xl leading-tight font-bold">সোজাসাপ্টা</h1>
      <p className="text-lg text-muted-foreground">খাবার নিয়ে সোজাসাপ্টা কথা</p>
      <p className="mt-6 text-base">
        বাংলাদেশে কোথায় কী খাবেন, তা জানাবে কমিউনিটির সত্যিকারের অভিজ্ঞতা। শিগগিরই আসছে।
      </p>
    </main>
  );
}

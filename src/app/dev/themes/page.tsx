import { CheckIcon, PlusIcon, SearchIcon, ShareIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LogoLockup, LogoMark } from "@/components/brand/logo";
import { ThemePreferenceControl } from "@/components/theme/theme-preference-control";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/layout/empty-state";
import { ErrorState } from "@/components/layout/error-state";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { serverEnv } from "@/config/env";
import { routes } from "@/config/routes";
import { THEME_IDS, themes } from "@/config/themes";

import { InteractiveSamples } from "./interactive-samples";

// Dev-only: every primitive, the logo and the tokens in every registered theme side by side
// (docs/06-design-system.md §2b). Sample copy here is fixture text, not app UI.
export const metadata: Metadata = { title: "Themes", robots: { index: false } };

const SWATCHES = [
  "background",
  "card",
  "foreground",
  "muted",
  "muted-foreground",
  "border",
  "primary",
  "primary-text",
  "primary-soft",
  "reward",
  "reward-soft",
  "success",
  "success-soft",
  "warning",
  "warning-soft",
  "danger",
  "danger-soft",
  "stale",
  "toast",
  "skeleton",
  "stamp-1",
  "stamp-2",
  "stamp-3",
  "stamp-4",
] as const;

const TYPE_SCALE = [
  ["text-display", "বগুড়ার দই"],
  ["text-title-1", "আজ কী খাবেন?"],
  ["text-stat", "৯২%"],
  ["text-heading", "কমিউনিটির প্রিয়"],
  ["text-card-title", "আকবরিয়া হোটেল"],
  ["text-body", "দই খুব ভালো ছিল, দাম একটু বেশি।"],
  ["text-meta", "সাতমাথা · ৳১২০–৳১৮০ · ৩ দিন আগে"],
  ["text-caption", "শেষ নিশ্চিত ১২ দিন আগে"],
  ["text-nav", "হোম"],
] as const;

const LIST_SAMPLE = ["কাচ্চি বিরিয়ানি", "চিকেন চাপ", "দই"];

export default function ThemesPage() {
  if (serverEnv().VERCEL_ENV === "production") notFound();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-5">
      <header className="flex flex-col gap-3">
        <h1 className="text-title-1">Themes</h1>
        <p className="text-meta text-muted-foreground">
          Page theme (affects sheets, dialogs and toasts):
        </p>
        <ThemePreferenceControl className="max-w-sm" />
        <InteractiveSamples />
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {THEME_IDS.map((id) => (
          <section
            key={id}
            data-theme={id}
            className="flex flex-col gap-6 rounded-card-lg border border-border bg-background p-5 text-foreground"
          >
            <h2 className="text-heading">
              {themes[id].label} <span className="text-meta text-muted-foreground">({id})</span>
            </h2>

            <div className="flex items-center gap-4">
              <LogoMark className="size-12" />
              <LogoMark simple className="size-6" />
              <LogoLockup tagline className="h-11" />
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {SWATCHES.map((token) => (
                <div key={token} className="flex flex-col gap-1">
                  <div
                    className="h-10 rounded-xl border border-border"
                    style={{ background: `var(--${token})` }}
                  />
                  <span className="text-[11px] leading-tight text-muted-foreground">{token}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {TYPE_SCALE.map(([className, sample]) => (
                <p key={className} className={className}>
                  {sample} <span className="text-nav text-muted-foreground">{className}</span>
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button>
                  <PlusIcon /> যোগ করুন
                </Button>
                <Button variant="soft">খেতে চাই</Button>
                <Button variant="outline" size="sm">
                  ফিল্টার
                </Button>
                <Button variant="ghost">বাতিল</Button>
                <Button variant="destructive">রিপোর্ট</Button>
                <Button variant="link">সব দেখুন</Button>
                <Button variant="outline" size="icon" aria-label="শেয়ার">
                  <ShareIcon />
                </Button>
                <Button disabled>জমা দিন</Button>
              </div>
              <Button size="lg">জমা দিন</Button>
              <label className="relative block">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="খাবার, জেলা বা দোকানের নাম" className="pl-12" />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="success">
                <CheckIcon /> কমিউনিটি নিশ্চিত
              </Badge>
              <Badge variant="warning">মতভেদ আছে</Badge>
              <Badge variant="danger">ভুল</Badge>
              <Badge variant="stale">শেষ নিশ্চিত ৪০ দিন আগে</Badge>
              <Badge variant="reward">+১০</Badge>
              <Badge variant="reward-soft">আবিষ্কারক</Badge>
              <Badge variant="soft">ঐতিহ্যবাহী</Badge>
              <Badge>#১</Badge>
              <Badge variant="muted">নতুন</Badge>
              <Badge variant="outline">দোকান</Badge>
            </div>

            <Tabs defaultValue="food">
              <TabsList>
                <TabsTrigger value="food">খাবার</TabsTrigger>
                <TabsTrigger value="place">দোকান</TabsTrigger>
                <TabsTrigger value="district">জেলা</TabsTrigger>
              </TabsList>
              {["food", "place", "district"].map((tab) => (
                <TabsContent key={tab} value={tab} className="text-meta text-muted-foreground">
                  {tab}
                </TabsContent>
              ))}
            </Tabs>

            <ToggleGroup type="multiple" defaultValue={["cheap"]}>
              <ToggleGroupItem value="cheap">৳ সাশ্রয়ী</ToggleGroupItem>
              <ToggleGroupItem value="street">রাস্তার খাবার</ToggleGroupItem>
              <ToggleGroupItem value="restaurant">রেস্টুরেন্ট</ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup type="single" variant="segmented" defaultValue="ok">
              <ToggleGroupItem value="ok">ঠিক</ToggleGroupItem>
              <ToggleGroupItem value="partly">আংশিক</ToggleGroupItem>
              <ToggleGroupItem value="wrong">ভুল</ToggleGroupItem>
            </ToggleGroup>

            <div className="rounded-card border border-border bg-card">
              {LIST_SAMPLE.map((name, index) => (
                <div key={name}>
                  {index > 0 && <Separator className="ml-16 w-auto" />}
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="size-11 rounded-thumb">
                      <AvatarFallback className="rounded-thumb">{name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="text-card-title">{name}</span>
                  </div>
                </div>
              ))}
            </div>

            <Section
              title="বগুড়ায় আরও যা জনপ্রিয়"
              action={
                <Button variant="link" size="sm">
                  সব দেখুন
                </Button>
              }
              className="px-0 pt-0"
            >
              <EmptyState
                message="কোথায় ভালো পাওয়া যায়, এখনও কেউ জানায়নি।"
                action={{ label: "প্রথম জানান", href: routes.add() }}
                rewardPoints={20}
              />
            </Section>

            <ErrorState
              title="তথ্য আনা যায়নি।"
              description="ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।"
              action={
                <Button variant="outline" size="sm">
                  আবার চেষ্টা করুন
                </Button>
              }
            />

            <div className="flex flex-col gap-2" aria-busy>
              <div className="skeleton-shimmer h-5 w-2/3 rounded-lg" />
              <div className="skeleton-shimmer h-14 rounded-card" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

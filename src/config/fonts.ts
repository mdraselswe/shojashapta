import { Anek_Bangla, Noto_Sans_Bengali } from "next/font/google";

// The ONLY place fonts are defined (docs/06-design-system.md §3).
//
// Neither font is preloaded: the Bengali files are large (Anek 156 KB, Noto 108 KB) and preloading put
// them on the critical path of every page (Lighthouse mobile LCP 2.7–3.9 s vs the 2.5 s budget). With
// `display: swap` text paints at once in the fallback and the web font swaps in when it arrives.
// Only the Bengali subsets are listed; Latin glyphs still load on demand via unicode-range.

/** Headings, numbers, badges. */
export const fontDisplay = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-anek",
});

/** Body text, UI labels, inputs. */
export const fontBody = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  variable: "--font-noto",
});

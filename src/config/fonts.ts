import { Anek_Bangla, Noto_Sans_Bengali } from "next/font/google";

// The ONLY place fonts are defined (docs/06-design-system.md §3). Wired into the layout in Phase 0.5.

/** Headings, numbers, badges. */
export const fontDisplay = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

/** Body text, UI labels, inputs. */
export const fontBody = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-body",
});

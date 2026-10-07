import { themeInitScript } from "@/lib/theme";

/** Runs before first paint so a saved theme never flashes. Render inside <head>. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />;
}

"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  SYSTEM_THEME_LABEL,
  THEME_PREFERENCES,
  themes,
  type ThemePreference,
} from "@/config/themes";
import { useTheme } from "@/hooks/use-theme";

const labelFor = (preference: ThemePreference) =>
  preference === "system" ? SYSTEM_THEME_LABEL : themes[preference].label;

/** System / light / dark segmented control; options come from the theme registry. */
export function ThemePreferenceControl({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();
  return (
    <ToggleGroup
      type="single"
      variant="segmented"
      value={preference}
      onValueChange={(value) => {
        const next = THEME_PREFERENCES.find((option) => option === value);
        if (next) setPreference(next);
      }}
      {...(className ? { className } : {})}
    >
      {THEME_PREFERENCES.map((option) => (
        <ToggleGroupItem key={option} value={option}>
          {labelFor(option)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

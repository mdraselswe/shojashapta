"use client";

import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { themes } from "@/config/themes";
import { useTheme } from "@/hooks/use-theme";

// Toasts (§7.3): dark --toast surface in every theme, slide up from the bottom, 3s, above the bottom nav.
// Uses our own useTheme (decision D10: no next-themes).
function Toaster(props: ToasterProps) {
  const { resolved } = useTheme();
  return (
    <Sonner
      theme={themes[resolved].scheme}
      position="bottom-center"
      duration={3000}
      offset={{ bottom: 96 }}
      mobileOffset={{ bottom: 96 }}
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
      }}
      style={
        {
          "--normal-bg": "var(--toast)",
          "--normal-text": "var(--toast-fg)",
          "--normal-border": "transparent",
          "--border-radius": "var(--radius-card)",
        } as CSSProperties
      }
      toastOptions={{ classNames: { toast: "font-sans text-[15px] shadow-toast" } }}
      {...props}
    />
  );
}

export { Toaster };

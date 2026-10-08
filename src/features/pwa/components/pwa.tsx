"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/client";

// Installable app (docs/08-seo-performance-pwa.md §3): a tiny service worker so browsers offer
// installing, and a card that appears from the second visit. No offline caching in the MVP.

const VISITS_KEY = "ss_visits";
const DISMISSED_KEY = "ss_install_dismissed";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // private mode: the card simply shows again next time
  }
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari() {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/** Runs once on the client (this component never renders on the server): reads storage and counts the visit. */
function startState() {
  if (isStandalone() || read(DISMISSED_KEY)) return { eligible: false, iosHint: false };
  // Count one visit per browser session.
  let visits = Number(read(VISITS_KEY) ?? "0");
  try {
    if (!window.sessionStorage.getItem("ss_counted")) {
      visits += 1;
      write(VISITS_KEY, String(visits));
      window.sessionStorage.setItem("ss_counted", "1");
    }
  } catch {
    return { eligible: false, iosHint: false };
  }
  const eligible = visits >= 2;
  return { eligible, iosHint: eligible && isIosSafari() };
}

export function Pwa() {
  const t = useT();
  const [start] = useState(startState);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const visible = start.eligible && !dismissed;

  useEffect(() => {
    if (window.location.protocol === "https:" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!visible || (!prompt && !start.iosHint)) return null;

  function dismiss() {
    write(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    dismiss();
  }

  return (
    <aside
      aria-label={t("pwa.installTitle")}
      className="fixed inset-x-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+78px)] z-30 mx-auto flex max-w-md items-center gap-3 rounded-card border border-border bg-card p-3.5 shadow-floating lg:bottom-6 lg:left-auto lg:mr-6"
    >
      <span className="min-w-0 flex-1 text-meta leading-snug">
        <b className="block text-body">{t("pwa.installTitle")}</b>
        {prompt ? t("pwa.installBody") : t("pwa.iosBody")}
      </span>
      {prompt ? (
        <Button size="sm" onClick={install}>
          {t("pwa.install")}
        </Button>
      ) : null}
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("pwa.dismiss")}
        className="flex size-9 shrink-0 press items-center justify-center rounded-full text-muted-foreground"
      >
        <XIcon className="size-4" aria-hidden />
      </button>
    </aside>
  );
}

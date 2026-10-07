import type { Page } from "@playwright/test";

/** Chrome DevTools "Slow 4G"-like profile, so skeletons are actually on screen while data streams. */
export async function throttleNetwork(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
}

/**
 * Cumulative layout shift of a full page load (docs/05 §9: skeleton → content must not move).
 * Registers a buffered PerformanceObserver before navigation and sums shifts not caused by input.
 */
export async function measureCls(page: Page, path: string, settleMs = 1500): Promise<number> {
  await page.addInitScript(() => {
    const store = window as unknown as { __cls: number };
    store.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as {
        value: number;
        hadRecentInput: boolean;
      }[]) {
        if (!entry.hadRecentInput) store.__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(path, { waitUntil: "load" });
  await page.waitForTimeout(settleMs);
  return page.evaluate(() => (window as unknown as { __cls: number }).__cls);
}

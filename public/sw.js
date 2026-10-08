// Minimal service worker: it only makes the app installable. No caching in the MVP, so nobody can
// be stuck on stale content (offline support comes with V1.5).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

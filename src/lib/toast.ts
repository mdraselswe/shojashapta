// Toasts without paying for them on first load: the sonner library (~36 KB) is fetched the first
// time a toast is shown, after hydration, instead of being part of every page's first scripts.
// The <Toaster /> itself is mounted lazily from the root layout (components/ui/lazy-toaster).

type Sonner = typeof import("sonner");
type ToastApi = Sonner["toast"];

const load = () => import("sonner").then((mod) => mod.toast);

export const toast = {
  success: (...args: Parameters<ToastApi["success"]>) =>
    void load().then((t) => t.success(...args)),
  error: (...args: Parameters<ToastApi["error"]>) => void load().then((t) => t.error(...args)),
  custom: (...args: Parameters<ToastApi["custom"]>) => void load().then((t) => t.custom(...args)),
};

import bn from "./messages/bn.json";
import en from "./messages/en.json";

// Bangla-first translations (AGENTS.md §5). bn.json is the reference; en.json must have the same
// keys (checked by t.test.ts). Keys are type-checked: t("nav.home").

export type Messages = typeof bn;
export type Locale = "bn" | "en";

type Leaves<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<Messages>;

export const messages: Record<Locale, Messages> = { bn, en };

type Params = Record<string, string | number>;

function lookup(tree: unknown, key: string): string | undefined {
  let node = tree;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

/** A translator for one locale. Missing keys fall back to Bangla, then to the key itself. */
export function createT(locale: Locale) {
  return function t(key: MessageKey, params?: Params): string {
    const template = lookup(messages[locale], key) ?? lookup(messages.bn, key) ?? key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
  };
}

export type T = ReturnType<typeof createT>;

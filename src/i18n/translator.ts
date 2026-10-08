import type bn from "./messages/bn.json";

// The lookup itself, without importing any message file, so Client Components can bring just the
// Bangla messages (en.json stays on the server). bn.json is the reference shape (AGENTS.md §5).

export type Messages = typeof bn;

type Leaves<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<Messages>;
export type Params = Record<string, string | number>;

function lookup(tree: unknown, key: string): string | undefined {
  let node = tree;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

export function createTranslator(primary: Messages, fallback: Messages) {
  return function t(key: MessageKey, params?: Params): string {
    const template = lookup(primary, key) ?? lookup(fallback, key) ?? key;
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
  };
}

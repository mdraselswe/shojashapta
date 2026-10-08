/** Control characters and backslashes are never part of a path we would redirect to. */
function hasUnsafeCharacter(value: string): boolean {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code < 0x20 || code === 0x7f || character === "\\") return true;
  }
  return false;
}

/**
 * Where to go after login: only a path on this site. Anything else ("//evil.com", "https://…",
 * "/\evil.com", control characters) falls back to the home page, so the login flow cannot be used
 * as an open redirect.
 */
export function safeNext(value: string | null | undefined, fallback = "/"): string {
  if (!value || value.length > 300) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (hasUnsafeCharacter(value)) return fallback;
  return value;
}

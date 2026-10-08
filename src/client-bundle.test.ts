import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

// Guards the first-load budget: zod (about 100 KB in the browser) must never be reachable from a
// "use client" file. It once slipped in through a client error boundary that imported a server
// component, and cost every page about 0.5 s of LCP. Server actions ("use server") are stubs in
// the browser, so their imports do not count.

const ROOT = "src";
const FORBIDDEN = ["zod", "@/config/env"];

function resolveImport(spec: string, from: string): string | null {
  const base = spec.startsWith("@/")
    ? join(ROOT, spec.slice(2))
    : spec.startsWith(".")
      ? join(dirname(from), spec)
      : null;
  if (!base) return null;
  for (const suffix of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    const candidate = base + suffix;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function importsOf(file: string): { isServerAction: boolean; specs: string[] } {
  const source = readFileSync(file, "utf8");
  if (/^\s*["']use server["']/.test(source.slice(0, 200)))
    return { isServerAction: true, specs: [] };
  const specs: string[] = [];
  for (const match of source.matchAll(/^import\s+(?!type\b)[^;]*?from\s+["']([^"']+)["']/gms)) {
    if (match[1]) specs.push(match[1]);
  }
  for (const match of source.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)) {
    if (match[1]) specs.push(match[1]);
  }
  return { isServerAction: false, specs };
}

function clientFiles(dir: string, found: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) clientFiles(path, found);
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) {
      if (/^\s*["']use client["']/.test(readFileSync(path, "utf8").slice(0, 120))) found.push(path);
    }
  }
  return found;
}

describe("client bundle", () => {
  it("never reaches zod or the env module from a client component", () => {
    const offenders: string[] = [];
    for (const entry of clientFiles(ROOT)) {
      const seen = new Set<string>();
      const visit = (file: string) => {
        if (seen.has(file)) return;
        seen.add(file);
        const { isServerAction, specs } = importsOf(file);
        if (isServerAction) return;
        for (const spec of specs) {
          if (FORBIDDEN.includes(spec) || spec.endsWith("config/env")) {
            offenders.push(`${entry} -> ${file} imports ${spec}`);
            continue;
          }
          const target = resolveImport(spec, file);
          if (target) visit(target);
        }
      };
      visit(entry);
    }
    expect(offenders).toEqual([]);
  });
});

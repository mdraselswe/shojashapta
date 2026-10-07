import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Architecture boundaries — docs/03-architecture.md §6.
const vendorSdks = {
  group: ["@supabase/*", "cloudinary", "cloudinary/*", "imagekit*", "@vercel/analytics*"],
  message: "Vendor SDKs only in src/infrastructure. Use a port via getServices().",
};
const infrastructureInternals = {
  group: ["@/infrastructure/*", "!@/infrastructure/container", "!@/infrastructure/client"],
  message: "Import the container (server) or infrastructure/client (browser-safe), not adapters.",
};
const frameworkCode = {
  group: [
    "react",
    "react/*",
    "react-dom",
    "react-dom/*",
    "next",
    "next/*",
    "@/features/*",
    "@/app/*",
  ],
  message:
    "services/, core/ and lib/ stay framework-free: no React, Next.js, features or app imports.",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // `!` only with an eslint-disable comment explaining why (AGENTS.md §4).
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/infrastructure/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [vendorSdks, infrastructureInternals] }],
    },
  },
  {
    // Repeats the patterns above: a later block replaces the whole rule for matching files.
    files: ["src/services/**", "src/core/**", "src/lib/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [vendorSdks, infrastructureInternals, frameworkCode] },
      ],
    },
  },
  {
    // All env access goes through the zod-validated src/config/env.ts (docs/02-tech-stack.md §7).
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/config/env.ts"],
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Use clientEnv / serverEnv() from @/config/env.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Brand source assets; copied into src/ in Phase 0.5.
    "brand/**",
    // Test and tooling output.
    "playwright-report/**",
    "test-results/**",
    ".lighthouseci/**",
  ]),
]);

export default eslintConfig;

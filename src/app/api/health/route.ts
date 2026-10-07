import { serverEnv } from "@/config/env";

// Deploy smoke test target (docs/03-architecture.md §5). Prerendered at build, so `version` is the
// commit that was built.

export function GET() {
  const env = serverEnv();
  const version = env.VERCEL_GIT_COMMIT_SHA ?? env.GITHUB_SHA ?? "development";
  return Response.json({ ok: true, version });
}

// Deploy smoke test target (docs/03-architecture.md §5). Built once per deploy, so `version` is the
// commit that was built.
export const dynamic = "force-static";

export function GET() {
  const version = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "development";
  return Response.json({ ok: true, version });
}

# 11 — Delivery Workflow: phase → test → commit → auto-deploy

Goal: the app is built phase by phase (`10-roadmap.md`). Every task is tested and committed; every
merged change to `main` is tested again, database migrations run, and the site deploys to
**https://shojashapta.com** automatically. Nothing reaches production without passing tests.

## 1. Environments

| Env | URL | Branch | Database | Purpose |
|---|---|---|---|---|
| Local | `http://localhost:3000` | any | Supabase **dev** project (or local Docker) | Build & try |
| Preview | `https://shojashapta-git-<branch>-<team>.vercel.app` | every PR | Supabase **dev** project | Review a phase before merge |
| Production | `https://shojashapta.com` | `main` | Supabase **prod** project | Real users |

Two Supabase free projects (dev + prod) are allowed on the free plan. Cloudinary: one account, folders
`shojashapta-dev/` and `shojashapta/`.

## 2. Git model (simple trunk-based)

- `main` = production. Protected: no direct pushes, PR + green CI required.
- One branch per roadmap task: `phase-<N>/<task>-<slug>` — e.g. `phase-2/2.3-food-page`.
- Commits: Conventional Commits, small and focused — `feat(food): community favorites section`,
  `test(search): banglish normalization cases`, `fix(skeleton): match card height`.
- A PR = one roadmap task (or a few tiny ones). PR title = the task, body = "Done when" checklist.
- Merge with **squash**. After the **last task of a phase** is merged, tag `main`: `git tag phase-2 && git push --tags`
  (and create a GitHub Release with the phase summary). Tags make rollback to any phase one command.

## 3. Pipeline (GitHub Actions, free)

Templates are in `docs/ci/` and are installed in Phase 0.3 (they need `package.json` to exist first):

```
docs/ci/ci.yml        → .github/workflows/ci.yml       (every PR + push to main)
docs/ci/deploy.yml    → .github/workflows/deploy.yml   (push to main → production)
docs/ci/preview.yml   → .github/workflows/preview.yml  (every PR → preview URL)
docs/ci/lighthouserc.json → lighthouserc.json
docs/ci/vercel.json   → vercel.json                    (turns off Vercel's own git deploys)
```

```
PR opened/updated ─► CI: install → typecheck → lint → unit tests → test:themes → build → e2e (Playwright) → Lighthouse budgets
                 └─► Preview: migrate dev DB → vercel deploy (preview) → URL in the job summary
merge to main    ─► CI again ─► Deploy: supabase db push (prod) → vercel build --prod → vercel deploy --prebuilt --prod
                                └─► smoke test https://shojashapta.com (home, a food page, /api/health) → fail = alert
```

Why deploy from Actions instead of Vercel's automatic git deploy: tests and **database migrations run
before** the new code goes live, in that order, every time — and the same pipeline works if we later
move off Vercel (only the last step changes).

### Required GitHub secrets (Settings → Secrets and variables → Actions)
| Secret | From |
|---|---|
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Vercel account settings → Tokens; `.vercel/project.json` after `vercel link` |
| `SUPABASE_ACCESS_TOKEN` | Supabase account → Access tokens |
| `SUPABASE_DEV_PROJECT_REF`, `SUPABASE_DEV_DB_PASSWORD` | dev project settings |
| `SUPABASE_PROD_PROJECT_REF`, `SUPABASE_PROD_DB_PASSWORD` | prod project settings |
App env vars (Supabase URL/keys, Cloudinary, `NEXT_PUBLIC_SITE_URL`) live in **Vercel project settings**
per environment (Preview / Production) and are pulled by `vercel pull` during the build.

## 4. Domain: shojashapta.com

> The domain registration is the **one paid item** in the project (yearly fee at the registrar).
> Everything else stays free / no card. Buy from any registrar; keep auto-renew on.

1. Vercel → Project → Settings → Domains → add `shojashapta.com` and `www.shojashapta.com`.
   Set `www` → redirect (308) to `shojashapta.com` (apex is canonical).
2. At the registrar, add exactly the DNS records Vercel shows (an `A` record for the apex and a
   `CNAME` for `www`), or point the nameservers to Vercel. Wait for "Valid configuration"; HTTPS is automatic.
3. Vercel env `NEXT_PUBLIC_SITE_URL`: Production = `https://shojashapta.com`, Preview = the preview URL
   (`https://$VERCEL_BRANCH_URL`), Local = `http://localhost:3000`. All canonical/OG/sitemap URLs use it.
4. Supabase **prod** → Authentication → URL configuration: Site URL `https://shojashapta.com`;
   Redirect URLs `https://shojashapta.com/auth/callback`. Supabase **dev**: `http://localhost:3000/auth/callback`
   and `https://*-<your-vercel-team>.vercel.app/auth/callback`.
5. Google Cloud → OAuth client: Authorized JavaScript origins `https://shojashapta.com`, `http://localhost:3000`;
   Authorized redirect URIs = the callback URL shown in each Supabase project's Google provider settings.
6. Email for the domain (optional, later): free forwarding at the registrar/Cloudflare, e.g. `hello@shojashapta.com`.

### Before public launch (Phase 0–8)
Production is live from Phase 0 but shows a **"শিগগিরই আসছে"** page and is `noindex`, controlled by
`NEXT_PUBLIC_LAUNCHED=false`. Founding contributors get access via `/?preview=<secret>` (sets a cookie).
Phase 9 flips `NEXT_PUBLIC_LAUNCHED=true` → full site, indexing on, sitemap submitted to Google Search Console.

## 5. The per-task loop (what you and Claude Code do every time)

```
1. git switch main && git pull && git switch -c phase-2/2.3-food-page
2. Claude Code: "Read AGENTS.md. Do Phase 2, task 2.3 only. Use the ship-task skill."
3. Implement → write/adjust tests → pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e
4. Check in the browser: 360px, every theme, Slow 4G skeleton swap
5. Commit (conventional), push, open PR → CI + preview URL
6. Review the preview → squash-merge → production deploys automatically
7. Last task of the phase? Tag phase-N + GitHub Release; tick the phase in 10-roadmap.md
```

## 6. Database changes in the pipeline
- Migrations live in `supabase/migrations/` and are applied by CI: dev on PR (preview), prod on merge.
- Migrations must be **backward compatible** (expand → deploy code → contract later), because the old
  code serves traffic for a minute while the new deploy rolls out. Never rename/drop a column in the same
  PR that stops using it.
- Seed data never runs in production automatically; `pnpm db:seed --env prod` is a manual, reviewed step.

## 7. Rollback
- Code: Vercel → Deployments → previous production deployment → "Promote" (instant), or
  `git revert` the merge → pipeline redeploys.
- Database: write a new forward migration that undoes the change (never edit applied migrations).
- Whole phase: `git checkout phase-<N-1>` to inspect; revert the phase's merges on a branch and PR it.

## 8. Monitoring after each deploy
- Smoke test in `deploy.yml` (fails the run if home, `/food/doi` or `/api/health` don't return 200).
- Vercel logs for errors; weekly quota check (`09-security-and-limits.md` §6).
- Lighthouse budgets on every PR keep performance from sliding.

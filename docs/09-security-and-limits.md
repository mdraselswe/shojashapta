# 09 — Security, Abuse Control & Free-Tier Protection

## 1. Threats we design for
| Threat | Defense |
|---|---|
| Owner boosts own place with fake accounts | One experience per user per dish; Google login; account-age and activity signals stored for V1.5 trust weighting; admin can hide/ban; suspicious-pattern query in admin |
| Competitor floods "❌ ভুল" votes | One vote per user per claim; minVotes before status changes; status "মতভেদ" before "বিতর্কিত"; admin review queue for disputed claims |
| Spam uploads burning image credits | Signed upload tickets only for logged-in users, per-day limit, max bytes, WebP only, admin delete, no anonymous upload |
| Script hitting write endpoints | Server actions require session + `check_rate_limit`; Vercel/host firewall basic rules |
| Data leaks | RLS on every table; service role key server-only; no PII in URLs or analytics |
| XSS via comments | React escaping, no `dangerouslySetInnerHTML` for user content, strip control chars, length limits |
| Defamation/abuse | Report button everywhere, profanity word list (bn + banglish) → auto-hide pending review, clear content policy page |

## 2. Rate limits (all in `appConfig.limits`, enforced by `defineAction`)
| Action key | Default / day / user |
|---|---|
| `experience` | 30 |
| `place_create` | 10 |
| `food_create` | 10 |
| `claim_vote` | 50 |
| `edit_suggestion` | 20 |
| `report` | 20 |
| `upload` | 10 |
| `save` | 200 |
Exceeding returns `Result.err('rate_limited')` → toast "আজকের সীমা শেষ, আগামীকাল আবার চেষ্টা করুন।"
Old `rate_limit_events` rows (> 7 days) are deleted by an admin "maintenance" button (no cron in MVP).

## 3. Upload pipeline
1. Client: accept `image/*`, reject > `maxUploadBytes` before processing.
2. Client: decode → resize → WebP (thumb 400px q0.72, large 1080px q0.78) → dominant color. Originals are discarded.
3. Server action `createUploadTicket`: auth, rate limit, returns signed params (Cloudinary signature with
   folder, allowed formats `webp`, max bytes, unique public id). Secret never leaves server.
4. Client uploads both variants directly to the provider.
5. Server action `confirmUpload`: verifies the object exists and belongs to the ticket, creates `media` row.
6. Unconfirmed uploads are cleaned via admin maintenance action.
Only the two stored variants are ever delivered — no on-the-fly transformations (saves credits).

## 4. Auth & sessions
- Google OAuth only. Supabase SSR cookies refreshed in `proxy.ts`.
- `profiles` row created on first login; `role` set to admin for `ADMIN_EMAILS`.
- Banned users: can browse, all writes return `Result.err('banned')` (also enforced by RLS).

## 5. Secrets
- `.env.local` only on your machine; production values in hosting env settings.
- Server-only: `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`. Import only in `infrastructure/**` files marked `server-only`.

## 6. Free-tier protection checklist
| Service | Quota | Our guard | Check |
|---|---|---|---|
| Supabase DB | 500 MB | compact rows, no images in DB, clean `rate_limit_events` | weekly dashboard |
| Supabase egress | 5 GB/mo | cached pages (DB hit once per tag change), select columns, pagination | weekly |
| Supabase pause | 7 days idle | real traffic after launch; during dev restore manually | when idle |
| Cloudinary | 25 credits/mo | pre-compressed variants, upload limits, no transformations | weekly; alert yourself at 70% |
| Vercel Hobby | fair use | no Vercel image optimizer, cached routes, small JS | monthly |
No card on any service → hitting a quota pauses/degrades the service, never bills.
Graceful degradation: if image URLs fail, `AppImage` shows dominant color + food emoji; pages still work.

## 7. Content policy (publish at `/policy`)
Be truthful, describe your own experience, no personal attacks, no fake reviews, no promotion by owners
without disclosure. Violations are hidden and repeat offenders banned.

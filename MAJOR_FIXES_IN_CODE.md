# Major Fixes In Code — Security & Quality Remediation Plan

> Status: **✅ ALL CRITICAL + HIGH IMPLEMENTED & VERIFIED (2026-06-12).**
> Decisions used (user-approved): lazy password migration (no user breakage),
> CORS env-driven with safe defaults, `/uploadResume` = rate-limit + file-validation
> (not hard auth, so signup keeps working).
>
> Scope: pre-existing vulnerabilities in `EduwizerBackend` (predate the new frontend)
> plus a few frontend hardening items. The new `frontend/` app code itself audited clean.
> Last updated: 2026-06-12

---

## ✅ Implementation Log (Critical + High — DONE)

| # | Fix | Status | Verified |
|---|---|---|---|
| C1 | bcrypt hashing + lazy migration | ✅ Done | Legacy plaintext user logged in → auto-rehashed to `$2b$` → re-login works; wrong pw rejected |
| C2 | Password removed from login response | ✅ Done | API response `password leaked: False`; UI login still works |
| C3 | `npm audit fix` (safe) | ✅ Done | Backend vulns 36 → 6 (remaining 6 = deferred aws-sdk v2) |
| H4 | Auth-gate `getAllProfiles` | ✅ Done | No-token request → HTTP 403 |
| H5 | `/uploadResume` hardening | ✅ Done | `.exe` rejected (clean 400); PDF passes filter; rate-limited |
| H6 | Rate limiting + crypto OTP | ✅ Done | `express-rate-limit` on 5 auth routes; OTP `crypto.randomInt(100000,1000000)` |
| H7 | CORS allowlist | ✅ Done | `evil.com` blocked, `localhost:5173` allowed; env-driven via `CORS_ORIGINS` |
| H8 | JWT secret consolidation | ✅ Done | All paths use `process.env.secret`; tokens verify |
| H9 | Stop logging bearer tokens | ✅ Done | 0 token-log lines in backend output |

**Bonus bug found & fixed during the work:** frontend `verifyOtp` was sending `otp`
but the backend expects `code:<number>` — OTP verification would always have failed.
Fixed in `frontend/src/services/api.ts`.

### Files changed
- `EduwizerBackend/helper/password.js` (new) — bcrypt hash/verify + lazy-migration detection
- `EduwizerBackend/middleware/rateLimiters.js` (new) — authLimiter, uploadLimiter
- `EduwizerBackend/controller/authentication.js` — signup hash, login lazy-verify + rehash + safe response, crypto OTP, reset hash
- `EduwizerBackend/controller/profile.js` — hash password on profile update (skip if empty)
- `EduwizerBackend/config/jwt.config.js` — `JWT_SECERT`→`secret`, removed token logging
- `EduwizerBackend/routes/route.js` — gate getAllProfiles, hardened resume upload, authLimiter on 5 routes
- `EduwizerBackend/index.js` — CORS allowlist
- `EduwizerBackend/package.json` — added `bcryptjs`, `express-rate-limit`; safe audit fix
- `frontend/src/services/api.ts` — verifyOtp field fix

### Verification summary
- Lazy migration proven end-to-end (curl + real browser UI login with a seeded legacy
  plaintext user → migrated to bcrypt → re-login OK).
- Full frontend QA crawl: all pages/redirects/detail pages pass; `tsc`+`eslint`+`vite build` clean.
- Profile loads + saves for the authenticated user; header shows My Profile/Logout.

### Notes / caveats
- CORS rejection currently surfaces as a 500 (the cors error throws) — functionally
  blocks the request; could be tidied to a 403 later (cosmetic).
- Local PDF upload returns 500 at the S3 step because local AWS creds are placeholders —
  validation/filter works; real S3 needs real keys.
- Remaining 6 backend npm vulns require the aws-sdk v2→v3 migration (deferred, see C3).

---
## Original Plan (for reference)


---

## Priority Order
Fix **Critical** then **High** ASAP. Defer the larger `aws-sdk` v3 migration and the
"Betterment" list to a later pass.

---

## 🔴 CRITICAL

### C1 — Hash passwords (bcrypt) with lazy migration
- **Problem:** Passwords stored & compared in plaintext.
  `controller/authentication.js:149` → `data.password == req.body.password`.
  No bcrypt anywhere; password reset writes plaintext too. A DB leak exposes every
  real password.
- **Fix:** Hash on signup + reset (`bcrypt.hash`). Login uses `bcrypt.compare()`.
- **Migration (the safe part):** **Lazy migration** — existing production rows are
  plaintext, so a hard cutover would lock out every existing user. Instead, on login:
  detect whether the stored value is a bcrypt hash; if yes `compare()`, if no (legacy
  plaintext) fall back to the old `==` check and on success silently re-save it hashed.
  Each user auto-migrates on their next login; new users hashed from day one. Optional
  background script converts stragglers later.
- **Behaviour change for users:** **None** (with lazy migration). Without it = mass lockout.
- **Files:** `controller/authentication.js` (login, signUp, setNewPassword), add `bcrypt` dep.

### C2 — Remove password from the login API response
- **Problem:** Login selects `password: 1` and returns `data: data`, so the password
  travels back to the browser on every login.
- **Fix:** Drop `password` from the response `select` after the compare.
- **Behaviour change:** **None** — the new frontend only reads `session`, `data._id`,
  `data.userType`; it never reads `data.password` (verified by grep).
- **Files:** `controller/authentication.js` (login).

### C3 — Dependency vulnerabilities (2 critical, 13 high in backend)
- **Problem:** `npm audit` → 36 vulns; criticals in `fast-xml-parser`, `form-data`;
  highs in `lodash` (prototype pollution), `jws` (HMAC bypass), multiple ReDoS. Most
  arrive transitively via the ancient **aws-sdk v2**.
- **Fix now:** `npm audit fix` (non-`--force`) for the safe, in-range patches.
- **Defer:** Real resolution = migrate `aws-sdk` v2 → `@aws-sdk/client-s3` v3. That
  rewrites the S3 upload internals → **regression risk → separate task with upload tests.**
- **Behaviour change:** `npm audit fix` = **none**. aws-sdk v3 migration = deferred.
- **Files:** `package.json` / lockfile now; `helper/upload.js`, `helper/aws-sdk.js` later.

---

## 🟠 HIGH

### H4 — Auth-gate `/eduwizer/getAllProfiles`
- **Problem:** Unauthenticated — anyone can dump all user profiles (name, email, phone, city).
- **Fix:** Add `checkAuthorizationKey.checkToken` middleware to the route.
- **Behaviour change:** **None** for the new app — it never calls `getAllProfiles`
  (verified). Will confirm no other live consumer depends on it being public before flipping.
- **Files:** `routes/route.js`.

### H5 — `/uploadResume` abuse protection (rate-limit + file validation, NOT hard auth)
- **Problem:** Upload route has no auth → anyone can upload to S3 (cost/storage/malware abuse).
- **Fix:** **Do NOT add a login-token requirement** — signup uploads photo/resume
  *before* the account exists, so there's no token yet; hard auth would break signup.
  Instead: add rate-limiting + strict file-type allowlist + size cap on the route.
- **Behaviour change:** **None** for real signups; blocks bulk/abusive uploads.
- **Files:** `routes/route.js`, `helper/upload.js`.

### H6 — Rate limiting + fix OTP generation
- **Problem:** No rate limiting on login / OTP / forgot-password → brute force.
  OTP uses `Math.floor(100000 + Math.random()*9000)` — **not crypto-random AND a buggy
  range** (only 100000–108999), so it's small and predictable.
- **Fix:** Add `express-rate-limit` (e.g. ~10/min) on auth endpoints. Generate OTP with
  crypto-strong randomness across the full 6-digit range (100000–999999).
- **Behaviour change:** **None for normal users** (a person logs in a few times). OTP is
  still a 6-digit code typed by the user; only generation improves. Attackers doing
  hundreds of attempts get blocked — the point. Verify-OTP path does a plain string
  compare, so wider range is fine.
- **Files:** `index.js` (rate-limit middleware), `controller/authentication.js` (sendOtp),
  add `express-rate-limit` dep.

### H7 — Lock down CORS
- **Problem:** `app.use(cors())` is fully open; an allowlist config exists but is unused.
- **Fix:** Replace with an origin allowlist (production domain(s) + localhost dev ports).
- **Behaviour change:** **None IF the allowlist is correct.** Highest "suddenly broke"
  risk of the set — a forgotten origin gets blocked. **Needs the production domain(s)
  confirmed** before implementing.
- **Files:** `index.js`, `config/origin-whiteList.js`.

### H8 — Consolidate JWT secret env var
- **Problem:** Code reads `process.env.secret` in some paths and the typo'd
  `process.env.JWT_SECERT` in others; only works locally because `.env` sets both.
- **Fix:** Use one consistent var (`secret`) everywhere.
- **Behaviour change:** **None.** Existing tokens stay valid (secret *value* unchanged).
- **Files:** `config/jwt.config.js`.

### H9 — Stop logging bearer tokens
- **Problem:** `checkToken` `console.log`s raw bearer tokens → credentials in log files.
- **Fix:** Remove the token `console.log` lines.
- **Behaviour change:** **None.** Log hygiene only.
- **Files:** `config/jwt.config.js`.

---

## Behaviour-Change Risk Summary

| # | Fix | User-facing change? | Risk |
|---|---|---|---|
| C1 | Password hashing (lazy migration) | No | Safe *if* lazy path used (else mass lockout) |
| C2 | Remove password from login response | No | Safe — frontend never reads it |
| C3 | `npm audit fix` (safe only) | No | Safe; defer aws-sdk v3 |
| H4 | Gate getAllProfiles | No | Safe (unused by new app) — confirm first |
| H5 | uploadResume rate-limit + validate | No | Safe (NOT hard auth — would break signup) |
| H6 | Rate limit + OTP fix | No (for real users) | Safe |
| H7 | CORS allowlist | No *if origins correct* | **Needs prod domain** |
| H8 | JWT env consolidation | No | Safe |
| H9 | Stop token logging | No | Safe |

**Net:** done correctly, none of these change behaviour for legitimate users.
The two that bite if rushed: **C1** (must use lazy migration, not a hard cutover) and
**H7** (must enumerate the correct origins).

---

## 🟡 MEDIUM
- ✅ **DONE** — `dangerouslySetInnerHTML` in `DetailPage.tsx` now sanitized with **DOMPurify**
  (verified: inline `<script>` stripped, blog body still renders). Stored-XSS closed.
- ✅ **DONE** — `/createPayment` upload now image-only (PNG/JPG/WEBP) + 5MB cap via
  `screenshotUploadSafe` (verified: PDF rejected with clean 400).
- ✅ **DONE** — Search endpoint (`serachProfile`) NoSQL/ReDoS hardening: `safeRegex()` coerces
  inputs to string + escapes regex metacharacters (verified: `(a+)+$` pattern returns in
  ~15ms instead of hanging; `{$gt:""}` object coerced harmlessly → HTTP 200, no injection).
- ⏳ Frontend token in `localStorage` (XSS-stealable) → httpOnly cookie. **Deferred —
  see note below:** breaks the current cross-port localhost dev setup; needs the deployment
  architecture (reverse proxy / same-origin) decided first.

### DB indexes (betterment)
- ✅ `users.email` already indexed (schema `unique: true`) — the login/signup/forgot hot path
  is covered. `userotps`/`payments` lookups by `userId` can be indexed in a later pass.

### ⚠️ Why httpOnly cookies are deferred (not a quick fix)
Local dev runs frontend `:5173` and backend `:8081` — **different origins**. An httpOnly
auth cookie across them requires `SameSite=None; Secure`, and browsers refuse `Secure`
cookies over plain `http://localhost` → the cookie would never be sent and **local login
would break**. Doing it right means serving both behind one origin (reverse proxy) or a
Vite dev proxy, which is a deployment-architecture decision. So it's correctly a scheduled
task, not a drop-in patch.

## 🟢 BETTERMENT (non-security)
- **Frontend:**
  - ✅ **DONE** — fetch timeout via AbortController in `services/api.ts` (30s JSON / 60s uploads);
    a hung backend now surfaces a clean "Request timed out" instead of spinning forever.
  - ✅ **DONE** — React **ErrorBoundary** wraps the app (`components/ErrorBoundary.tsx`, mounted
    in `main.tsx`); a render error shows a friendly Reload card instead of a blank page.
  - ⏳ signup country/state/city are static 5-item lists (live site pulls real data).
- **Backend:** `shortid` deprecated → `nanoid`; strip ~100 `console.log` debug lines;
  add MongoDB indexes on `email`/lookup fields.
- **Repo:** legacy `EduwizerFrontend/` (CRA) is dead weight now; no tests anywhere.

### Files changed (this batch)
- `frontend/src/pages/DetailPage.tsx` — DOMPurify.sanitize on blog HTML
- `frontend/src/services/api.ts` — AbortController timeout wrapper
- `frontend/src/components/ErrorBoundary.tsx` (new) + `main.tsx` + `App.css` fallback styles
- `frontend/package.json` — added `dompurify`

---

## Blockers / Inputs Needed Before Implementation
1. **Production frontend origin(s)** for the CORS allowlist (H7) — e.g.
   `https://eduwizer.com` + any admin-panel domain. (localhost dev ports auto-included.)
2. **Confirm H5 approach:** treat `/uploadResume` as **rate-limit + file-validation**
   (keeps signup working) rather than hard auth. Need a yes.

Once both are answered: implement C1–C3 and H4–H9 with the safe approaches above, then
re-run the full QA pass (build + lint + browser crawl + functional tests).

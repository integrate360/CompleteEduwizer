# Thinkaerial Dev Team — Live Status

## Project: Eduwizer — new frontend adoption (eduwiser → CompleteEduwizer/frontend)
## Active Task: Done — live-site (eduwizer.com) functionality parity pass complete
## Last Updated: 18:20

| Agent | Name | Status | Current Work |
|---|---|---|---|
| Manager | Arjun | 🟢 Active | Monitoring |
| Analyst | Priya | ✅ Done | Mapped eduwiser pages to backend API contract |
| Architect | Vikram | ✅ Done | Integration design: fetch-based api.ts + AuthContext, VITE_API_URL env |
| Developer 1 | Rahul | ✅ Done | API layer (services/api.ts) — contract from legacy Services/api.js + backend Joi validators |
| Developer 2 | Ananya | ✅ Done | All 7 pages wired to live APIs; auth-aware header; OTP step added |
| QA Engineer | Kavya | 🟡 Partial | tsc + eslint + build clean; live-data verification on home/events/login/contact; signup+profile need a test account run |
| DevOps | Rohan | 😴 Sleeping | Deployment not requested yet |

## What Changed
- **`CompleteEduwizer/frontend/` is the new main frontend** — the `eduwiser` Vite + React 19 + TypeScript app, copied in clean (no node_modules/.git/dist) and integrated with EduwizerBackend.
- `EduwizerFrontend/` (legacy CRA) left untouched as reference — delete when ready.

## Integration Details (frontend/)
- `src/services/api.ts` — fetch-based client; Bearer token injection; endpoints: login, signup, send/verify OTP, getProfile/updateProfile, uploadResume, subscribe, contact-us, getFeaturedLists, getAboutChancellors, getAwardsAndRecognitions, getEvents, getBlogs. Base URL via `VITE_API_URL` (default https://eduwizer.com/api); `.env.example` added.
- `src/auth/AuthContext.tsx` — token+userId in localStorage, login/logout, RequireAuth guard on /dashboard.
- Header — auth-aware (My Profile / Logout when logged in); Setup Of School → ngeduwizer.com.
- Home — featured listings (image/video/youtube), leaders, awards from API with Figma static content as fallback.
- Events & Blogs — featured event/blog = latest from API; grids live; fallback to Figma content when API empty.
- Contact — POSTs to /eduwizer/contact-us; real BKC office address + Maps links.
- Newsletter — both variants POST /eduwizer/susbcribe (backend's spelling).
- Login — /eduwizer/login, stores session token, error display, redirects to /dashboard (or original target).
- Sign Up — maps design fields to backend Joi contract (numeric age/experience via labelled selects, userName derived from email, phone digits-only); photo+resume upload via /uploadResume before submit; signup → sendOtp → **new in-page OTP verification step** → login.
- Profile — loads /eduwizer/getProfile into all sections (General/Contact/About Me/Experience/Education/Skills/Languages/Awards), computed completeness ring, optional password change, photo/resume re-upload, saves via /eduwizer/updateProfile; logs out on expired token.

## QA (Kavya)
- `tsc -b && vite build` ✅ (89.99 kB gzip JS) · `eslint .` ✅ clean
- Live-data verification at 1440px: home ✅ (real listings/leaders/awards), events ✅ (real featured event + grid), login ✅, contact ✅
- Pending: end-to-end signup→OTP→login→profile-save with a real test account

## Known Follow-ups
- Event/blog detail pages don't exist in the new app — "Get Details / Read Full Article" links to /contact-us (as designed)
- Forgot Password links to /contact-us — backend has /eduwizer/forgotPassword + setNewPassword if a page is wanted
- Package selection / payment flow (vendor/institute/counsellor/candidate) not in the new app — login goes straight to /dashboard
- Signup country/state/city are static lists (design); legacy app used countrystatecity.in API
- Mobile nav: new app's header has no hamburger menu (design didn't include one)


## Parity Pass vs Live eduwizer.com (latest)
- Header: Infrastructure (7 services) + Counsellors (3 types) + Sign Up (Candidate/Counseller/Vendor/Recruiter) dropdown menus, styled to the new design
- Sign Up: per-usertype forms matching live rules (vendor/recruiter: Board + Sector/Industry, no Age/Experience; candidate/counseller: Age + Experience + Board; per-type preference options)
- New pages: /forgot-password, /setNewPassword/:token, /terms-conditions (full legal text ported), /events-details/:id, /blogs-details/:id (renders admin rich-text), /infrastructure-search/:preference, /career-counselling/:preference, /candidate (generic SearchPage — searchProfile API, city filter, Contact/Email/Call actions, login-gated like live)
- Footer: real social URLs, legal links → terms, CIN number, Eduwizer spelling + dynamic year
- Home stats: candidate counter dynamic (500/day since 2023-06-23, live-site logic)
- Verified in browser: dropdowns, vendor signup variant, forgot-password, search→login redirect, event detail with real data; tsc/eslint/build clean

## Still not in the new app (needs product decision)
- Package selection + payment (QR) flow after signup/login
- Candidate detail view (/CandidateView) and recruiter job search page variants beyond the generic search
- Mobile hamburger nav (design has no mobile menu)

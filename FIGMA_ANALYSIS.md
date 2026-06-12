# EduwizerFigma — Design Analysis & Build Requirements

Source: `EduwizerFigma/` — 9 PNG exports, desktop only (1920px wide). No Figma file/link, so all
tokens (colors, fonts, spacing) must be extracted from the PNGs by eye/measurement.

---

## 1. What each PNG contains

### Header.png (1920×128) — shared component
- White bar: NG Eduwizer logo + "India - Dubai - Canada - Singapore - Europe" tagline
- Nav: Home (active = navy + yellow underline), Infrastructure, Counsellors, Events & Blogs, Contact Us, About Us
- CTAs: **Setup Of School** (dark brown/black pill, yellow text), **Sign Up** (yellow pill), **Login** (yellow outline pill)

### Footer.png (1920×995) — shared component, two stacked parts
1. **Newsletter band** — dark plum/purple gradient rounded card: "Subscribe To Our Newsletter",
   email input + yellow "Subscribe Now" button
2. **Footer** — white: logo + blurb ("Complete end-to-end solutions for educational excellence"),
   columns: Quick Links (Infrastructure, Career Counselling, Counsellors), Our Company (Events & Blogs,
   Contact Us), Legal (Privacy Policy, Terms of Service), Follow Us (Instagram, Facebook, LinkedIn)
3. Copyright: "© 2026 Eduwizor. All rights reserved. Design and developed by Integrate360."
   (⚠️ "Eduwizor" spelling — confirm intended)

### home.png (1920×6786) — 8 sections
1. **Hero** — dark navy→plum gradient, "EDUWIZER IS AN ECOSYSTEM" pill badge,
   H1 "The First Comprehensive **Educator's Database Portal**" (white + yellow),
   CTAs "Sign Up as Candidate" (yellow) / "Sign Up as Recruiter" (outline), avatar stack + "20,000+ People Get Their Dream Jobs",
   3D male character illustration with neon ring
2. **About Us** — CEO photo left, text right, "Know More →" yellow button, Dr. Nikkie Grover attribution
3. **Why Choose Us** — cream bg, 5 columns w/ 3D icons: First comprehensive database, Specially designed
   for educators, Be Spoke approach, Exclusively designed for Education Sector, User friendly interface
4. **Featured Listings** — card carousel (school photos w/ play buttons + maroon poster cards)
5. **Want to get involved?** CTA band — dark gradient strip, "Contact Us →" yellow button
6. **Stats strip** — 540000+ Candidates, 350+ Colleges, 300+ Institutes, 250+ Vendors (icon + number + label)
7. **Academic & Institutional Leaders** — carousel of profile cards (photo, name, role, school, LinkedIn icon), arrow buttons
8. **Awards and Recognitions** — carousel of award cards + 3D character on left
9. Newsletter + Footer

### About.png (1920×5303)
1. Hero — cream, video/photo card left (brand ambassador Mrs Ramneet Saini), "In 2018, We Rethought
   **Recruitment.**" headline right
2. About Us — company text + Mr Prashant Poojari photo card
3. About CEO — CEO photo left, long bio right
4. **Yellow stats band** — same 4 stats, each with a "Register" outline button
5. Want to get involved? — "Look For Candidates" yellow button, "Want to Work With Us?" sub-section
6. Newsletter + Footer

### Event.png (1920×6732) — Events & Blogs combined page
1. Hero — dark gradient, "✦ KNOWLEDGE HUB" badge, "Events & Blogs" H1, CTAs "Explore Events →" / "Read Insights", same 3D character
2. **Featured Event** — large horizontal card: date badge (24 AUG), event poster, "CONFERENCE" tag,
   "Future of Education Summit 2026", venue/time meta rows, "Get Details" yellow button, carousel arrows
3. **Upcoming Events** — 4-card grid: image, date badge, type tag (WORKSHOP/SEMINAR/EXPO/WEBINAR), title, location, "Get Details →"
4. **Featured Blog** — large split card: tag, title, author avatar + read time + date, excerpt, "Read Full Article" yellow button, photo right
5. **Latest Insights** — 4-card blog grid: image, category tag, title, read time + date
6. Newsletter + Footer

### ContactUs.png (1920×3564) — ⚠️ DIFFERENT BRAND
This design is for **"Al Sadat Marketing"** (Pakistani real-estate co, "developed by Ideogramers") —
it is a layout reference, NOT an Eduwizer design. All branding/copy/nav must be replaced with Eduwizer's.
Layout to replicate:
1. **Send Us a Message** form card (Full Name, Email, Phone, Message, "Send Message" navy button)
   beside **Our Office** cream card (Head Office address, Phone, Email, Business Hours w/ icons)
2. **Find Us Here** card floating over an embedded Google Map with a location pin popup
3. Newsletter (light variant in this design — use Eduwizer's dark variant for consistency) + Footer

### Login.png (1920×1440)
- Soft lavender/cloud bg with dotted-line paper-plane doodles
- Centered white card: lock icon, "Welcome Back!", Email, Password (w/ eye toggle), Remember me,
  Forgot Password?, navy "Login →" button, "Don't have an account? Create Account"
- 3D student-on-chair illustration right
- ⚠️ Footer here is a DIFFERENT variant: Quick Links / Other Menus (Terms, Privacy, Refund Policy) /
  More (Contact, About, Sitemap) + navy "© 2024 NG Eduwizer" bar — conflicts with Footer.png (2026/Integrate360)

### SignUp.png (1920×1592)
- Same bg style, 3D boy-on-rocket-pencil illustration
- "Create Your Account" card: First/Last Name, Email, Password, Phone (+91 country-code select), Age (select),
  Experience (select), Preferred Category (select), Country/State/City (selects),
  **Profile Photo upload** (JPG/PNG max 2MB) + **Resume upload** (drag & drop, PDF/DOC/DOCX max 3MB),
  T&C + Privacy checkbox, navy "Create My Account →", "Already have an account? Login"

### Profile.png (1976×2968 effective) — Edit Profile
- Left: avatar card (photo w/ camera badge, name "Frank Francis", role "Counsellor")
- Right header: "Edit Profile", **Profile Completeness ring (60%)**, Cancel (yellow outline) + Save Changes (navy)
- Sections with icon headers:
  - **GENERAL**: First/Last name, Username/Email, Mobile (+91, "WhatsApp will be sent to this number" note),
    Alternate Number, DOB, Country/State/City, Password + Re-type (eye toggles), Profile Photo + Resume upload
  - **CONTACT**: Phone, WhatsApp, Email, Address, Country/State/City
  - **ABOUT ME / EXPERIENCE / EDUCATION / SKILLS / LANGUAGES / AWARDS AND RECOGNITIONS**: textareas
- Bottom: Cancel + Save Changes again, Newsletter + same alternate footer as Login

---

## 2. Design tokens (sampled from PNGs — refine during build)

| Token | Value (approx) | Used for |
|---|---|---|
| Navy | `#15223d` / `#1b2a4a` | Headings, primary buttons, footer bar |
| Deep purple/plum | `#482c46` → navy gradient | Hero bgs, newsletter band, CTA strips |
| Yellow | `#eed165` / `#f3c93f` | All CTA buttons, accents, stats band |
| Dark brown/near-black | `#2c1801` | "Setup Of School" header button |
| Cream | `#faf6ec`-ish | Section backgrounds (Why Choose Us, About hero) |
| Lavender wash | `#f1effc` | Login/SignUp/Profile page bg |
| Headings purple-navy | `#2b2367`-ish | Section titles (FEATURED LISTINGS etc.) |
| Font | Poppins (or similar geometric sans) | everywhere — confirm with designer |
| Radius | ~8px inputs, ~12–16px cards, pill buttons | |

---

## 3. Required assets we do NOT have (request from designer / extract from PNG)

- Logo SVG (new lockup w/ ™ + country tagline)
- 3D character illustrations: hero male (home + events), student-on-chair (login), boy-on-rocket (signup)
- 5 "Why Choose Us" 3D icons
- Section doodles (paper plane, dotted paths, sparkles), pill-badge icons
- Social icons, stat icons, section header icons (Profile page)
- All photography is content (comes from APIs/admin), not assets

---

## 4. Design ↔ existing code/API mapping

| Design | Existing route | Existing APIs that power it | Gap |
|---|---|---|---|
| Header/Footer | `Header/`, `Footer/` components | `/eduwizer/subscribe` (subscribe.model exists) | rebuild UI |
| home | `/home` → `Dashboard.js` | getFeaturedLists, getTestimonials, getChancellors, getAwards | leaders carousel ≈ chancellors data; stats are static/derived |
| About | `/about-us` | aboutChancellorsData, static content | mostly static copy |
| Events & Blogs | `/events-blogs` | `admin/eduwizer/getEvents`, `getBlogs` | "Featured" flag may need backend field |
| Contact Us | `/contact-us` | `/eduwizer/contact-messages` (POST exists in dashboard controller) | rebrand Al Sadat layout |
| Login | `/login` | `/eduwizer/login`, loginGoogle, loginFacebook | design has no social buttons — confirm |
| Sign Up | `/register/:type` | `/eduwizer/signup`, `/uploadResume`, send/verify OTP | design merges photo+resume upload into signup; age/experience/category fields must match profile model |
| Profile | (dashboard) | `/eduwizer/getProfile`, `/eduwizer/updateProfile` | Profile-completeness % is new (frontend calc) |

### Existing pages with NO new design (decision needed)
Forgot/Set password, Verify OTP, Package selection ×4 (candidate/vendor/counsellor/institute),
Search pages (recruiter-job-search, career-counselling, infrastructure-search, candidates),
CandidateView detail, Event/Blog detail pages, Terms & Conditions, Upload CV.
→ Either designer supplies them, or we restyle them in the new design language ourselves.

---

## 5. Open questions / conflicts to resolve (blockers before pixel-exact build)

1. **Stack**: reskin existing CRA + Bootstrap + MUI app, or fresh React + Vite + Tailwind app (like EduwizerAdmin)
   and port the API/auth logic? ← Checkpoint 1 decision
2. **Footer variant**: Footer.png (2026/Integrate360) vs Login/Profile footer (2024/NG Eduwizer, different columns) — which is final?
3. **ContactUs**: confirm we adapt the Al Sadat layout with Eduwizer branding/copy
4. **Missing pages** (section 4) — designer to provide, or we extend the design language?
5. **Mobile/tablet**: PNGs are desktop-only — we define responsive behavior ourselves (no designs to be "exact" against)
6. Social login buttons absent from Login design — drop the feature or add buttons?
7. "Setup Of School" vs "Setup a School" copy varies between pages; "Eduwizor" spelling in footer
8. Exact font family + any brand guideline (request from designer; fallback: Poppins)

# Tasks — Eduwizer Frontend Redesign (PNG → pixel-exact code)

> Checkpoint 1 resolved: user confirmed **reskin existing CRA app in place**.
> Contact Us = Eduwizer-branded; Footer.png variant everywhere; responsive required; no social login.

## Phase 0 — Foundations
- [x] Extract/collect assets: cropped from PNGs into public/assets/images/figma/ (designer originals still preferable)
- [x] Define design tokens: src/theme.css (CSS vars + ew-* primitives), Poppins via Google Fonts
- [x] Resolve open questions (footer variant, contact-us branding, social login, responsive)

## Dev 2 — Ananya (Frontend)
### Shared
- [x] Header component (active nav state, Setup Of School / Sign Up / Login CTAs, sticky, hamburger)
- [x] Footer component (Footer.png variant, single footer everywhere, CIN + gtag retained)
- [x] Newsletter band component (wired to subscribe API)
- [x] Shared UI kit: pill buttons, inputs/selects/textarea, upload dropzones, section headings, carousels, cards, date badges, tags
- [x] Responsive pass (390 / 768 / 1920 verified via emulated screenshots)

### Pages
- [x] Home: hero swiper (incl. legacy setup-school slide), about-us, why-choose-us, featured listings, CTA band, stats strip, leaders carousel, awards carousel
- [x] About: hero, about-us, about-CEO, yellow stats band w/ Register buttons, get-involved section
- [x] Events & Blogs: hero, featured event, upcoming events grid, featured blog, latest insights grid
- [x] Contact Us: message form + office card + map w/ floating card (Eduwizer-branded)
- [x] Login: design card, validation, remember-me, forgot-password (no social buttons)
- [x] Sign Up: full form, +91 phone, dependent country/state/city, photo + resume dropzones, T&C gate
- [x] Edit Profile: CSS reskin + page title (full 8-section JSX restructure + completeness ring → follow-up)
- [x] API integration preserved on all pages (login/payment redirects, signup OTP flow, contact, subscribe, listings/leaders/awards, events/blogs)
- [ ] Restyle undesigned pages in new language: forgot/reset password, OTP, package selection ×4, search pages, candidate view, event/blog details, T&C
- [ ] Profile page: full Figma section regrouping (General/Contact/About Me/…) + profile-completeness ring
- [ ] Decide placement for BlogsAds (removed from Events page per design)

## Dev 1 — Rahul (Backend, only if needed)
- [ ] `featured` flag on events/blogs (Featured Event / Featured Blog sections)
- [ ] Confirm profile model covers signup fields (age, experience, preferred category, state/city)
- [ ] Contact form POST + newsletter subscribe endpoints verified/CORS-ready

## Testing — Kavya
- [ ] Pixel-compare each page vs PNG at 1920px (overlay diff)
- [ ] Functional tests: auth flows, forms, uploads, carousels, API error/loading states
- [ ] Responsiveness pass at 375 / 768 / 1440

## Deployment — Rohan
- [ ] Production build + deploy config (after QA sign-off)

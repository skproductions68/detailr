# DETAILR — Project Handoff v1.1 (continue in new chat)

Upload this file at the start of a new conversation to resume.

## WHAT THIS IS
Detailr: single-tenant-per-shop SaaS for car detailing / PPF studios.
Booking flow + live job-tracking + per-stage photos + studio admin panel.
Stack: React 19 + Vite 8 + Tailwind 3.4 + three.js (lazy) + Supabase.
Deploys: GitHub repo skproductions68/detailr (public) -> Vercel auto-deploy.

- Live demo: https://detailr-gamma.vercel.app/
- Staff login (demo): emp1@gmail.com / emp1 (VERIFY before sharing)
- Supabase project id: gxarqolizftthhaxekka
- GitHub connector still not registered, BUT the repo is public — Claude can
  `git clone https://github.com/skproductions68/detailr.git` in bash and find
  the repo via Vercel get_deployment meta. Pushing isn't possible; user uploads
  changed files via GitHub web UI ("Add files via upload").

## v1.1 — WHAT SHIPPED THIS ROUND
**Visual overhaul**
- Real typography: Archivo variable (wide "display" class for headings) +
  JetBrains Mono, loaded in index.html via Google Fonts.
- Signature animated background (src/fx.jsx <Backdrop/>): inspection-bay
  light beams sweeping over dark paint + drifting grid + flake noise +
  red under-glow + vignette. Mounted globally, CSS-only, reduced-motion safe.
- Glass panels (.glass), custom scrollbar, selection color, focus rings,
  CTA sheen, animated check ring on confirmation.
- Toast system (fx.jsx toast()/<Toaster/>) — ALL alert() calls replaced.

**Features**
- Booking confirmation screen (replaces alert): reference, summary,
  "Track My Car", and printable receipt (print CSS shows #print-receipt only).
- PER-STAGE PHOTOS (flagship): staff upload photos in Admin → Calendar →
  open booking → Stage Photos (phone camera supported via capture attr).
  Customer tracking page shows photos under each stage, live via realtime,
  with a lightbox. DB: booking_photos table + stage-photos public storage
  bucket (migration add_booking_photos applied: public read, auth write).

## STILL-PLACEHOLDER / GUARDRAILS (unchanged)
- XPEL package prices (AED 8,500/9,500/10,500) are illustrative, NOT quotes.
- Demo is Apex-branded for everyone; frame accordingly for other leads.
- Honest about Pakistan base; setup fee before custom build; no fake stats.
- Confirm demo login before sharing the link, every time.

## NEXT BACKLOG
- PII lockdown: customer names/phones still readable via anon key
  (tracking + capacity should move behind SECURITY DEFINER RPCs). Highest
  priority technical debt — do before any real customer data goes in.
- WhatsApp/SMS notifications on stage change (Apex has verified Meta; or Twilio).
- Neutral white-label demo instance for non-Apex leads.
- Per-shop onboarding flow.

## SALES PIPELINE (unchanged from prior handoff)
- Apex Detail Studio (Dubai) — HOTTEST. AED 1,000 setup + 250/mo quoted.
  apexdetailstudio@gmail.com · +971 58 549 2739 · IG @apexdetailstudiodxb.
  Deposit via Payoneer BEFORE building the real instance.
- Regal PPF (UK) GBP 400 + 50/mo · PPF Centre Ipswich (Joe) · Unique Detail MK
  (Andy) · Carz Crew Karachi (engaged) · Karachi +923009568812 PKR 60k + 6.5k/mo.
- US list: phones only, need IG/websites before outreach.

# Style86 Parrucchieri & Estetica

Website for Style86, a hair and beauty salon at Via Luigi Ornato 59, 20162 Milano.
Italian-language, single-page site with a working booking-request flow.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, GSAP + ScrollTrigger for
the scroll-driven story (via `@gsap/react`), native CSS for small reveals, Phosphor icons,
self-hosted Cormorant Garamond and Manrope via `next/font`. No analytics.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (also type-checks)
npm start            # serve the production build
npm run lint
npm run typecheck
npm test             # booking validation, message formatting, rate limiter
```

Node 20.9 or newer is required (Node 22 recommended; `npm test` uses Node's built-in
TypeScript stripping).

## Where to edit content

| What | File |
| --- | --- |
| Name, address, phone, WhatsApp, email, opening hours, social links, Treatwell link | `src/config/site.ts` |
| Google and Treatwell review figures, verified review quotes | `src/config/site.ts` (`reviews`) |
| Booking channel, time preferences, closed weekdays, max days ahead | `src/config/site.ts` (`booking`) |
| Privacy controller details | `src/config/site.ts` (`privacy`) and `src/app/privacy/page.tsx` |
| Services (names, descriptions, duration, price) | `src/content/services.ts` |
| Images, alt text, crop focal points, credits | `src/content/images.ts`, `src/assets/images/` |
| Navigation labels | `src/config/navigation.ts` |
| SEO title and description | `src/lib/seo.ts` |

Fields that are unknown stay `null` and are hidden on the page. Nothing unverified is
rendered as fact: no prices, durations, opening hours or testimonials were invented.

## Booking requests

The form validates in the browser (Italian messages, error summary, inline errors) and
then delivers the request through one of two channels, chosen with
`NEXT_PUBLIC_BOOKING_DELIVERY`.

Times are **preferences**, not live availability. Every success message states that the
appointment still has to be confirmed by the salon.

### Option A: WhatsApp (default, no server needed)

On submit the site opens the official click-to-chat link
`https://wa.me/<number>?text=<message>` with a readable Italian message (service, date,
time slot, name, phone, notes). The customer must press **Invia** in WhatsApp; the page
says so and never claims the salon has received anything.

- Number: `site.contact.whatsapp` in `src/config/site.ts`, international format, digits
  only, no `+` (currently `393663057307`).
- **Verify that this number is WhatsApp-enabled**, then set `whatsappVerified: true`.
  Set `whatsapp: null` to hide all WhatsApp references; the form then shows phone and
  Treatwell instead.

### Option B: Telegram bot (automatic delivery)

`POST /api/booking` (`src/app/api/booking/route.ts`) validates and sanitizes the request
again on the server and forwards it to the owner's private Telegram chat.

Protections: same-origin check, 4 KB body limit, honeypot field, minimum fill time,
per-IP rate limit (5 requests per 10 minutes), plain-text message (no HTML injection),
8-second timeout. Customer data is not stored and is never written to logs; only HTTP
status codes are logged.

Setup:

1. In Telegram, talk to **@BotFather**, send `/newbot`, and copy the bot token.
2. From the owner's account, open the new bot and send it any message.
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and copy
   `message.chat.id` from the response.
4. Set the environment variables below on the hosting platform, then redeploy.
5. Send a test request from the live site and confirm it arrives in Telegram.

Until both server variables are set, the endpoint answers `503 not_configured` and the
form shows phone, WhatsApp and Treatwell alternatives.

The rate limiter lives in memory, so on serverless hosting it applies per instance. For a
global limit, back it with a shared store such as Redis.

## Environment variables

Copy `.env.example` to `.env.local` for local development.

| Variable | Where | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | Recommended | Production URL without trailing slash. Enables canonical URL, sitemap entries and absolute Open Graph URLs. |
| `NEXT_PUBLIC_BOOKING_DELIVERY` | build | No | `whatsapp` (default) or `telegram`. |
| `TELEGRAM_BOT_TOKEN` | server only | Telegram mode | Bot token from @BotFather. Never prefix with `NEXT_PUBLIC_`. |
| `TELEGRAM_CHAT_ID` | server only | Telegram mode | Chat that receives the requests. |

`NEXT_PUBLIC_*` values are inlined at build time: rebuild after changing them.

## Images

All 15 photos are **illustrative stock images** (Unsplash, Pexels and Pixabay licenses).
They do not show the Style86 salon, its staff or its clients, and the page labels them
"Immagini a scopo illustrativo". Each received the same warm grade for consistency.
Authors, licenses and provenance are in `src/assets/images/CREDITS.md`.

To use real salon photos:

1. Overwrite the file in `src/assets/images/` (same name, any size), or change the import
   in `src/content/images.ts`.
2. Update its `alt` text and, if needed, the `position` focal point.
3. Set `illustrative: false` only for photos that genuinely show Style86 (with consent of
   anyone pictured). When no illustrative image remains in a section, its notice
   disappears.

`npm run images:placeholders` regenerates neutral placeholder plates for missing files
only. It never overwrites existing photos unless you pass `-- --force`.

## Privacy and cookies

- No analytics, no tracking, no profiling cookies.
- Fonts are self-hosted, so visits do not contact Google Fonts.
- The Google Maps embed loads only on request. The choice is remembered in
  `localStorage` only if the visitor ticks "Ricorda la mia scelta", and can be revoked from
  **Preferenze cookie** in the footer.
- The booking form requires explicit consent and links to `/privacy`. That page
  describes the channel actually in use (WhatsApp or Telegram). Update it if the
  implementation changes.

## Before publishing: owner checklist

- [ ] **Services:** confirm the list in `src/content/services.ts`. The four entries
      (Taglio, Piega e styling, Barba, Trattamenti estetici) are placeholders from the
      brief. Add durations and prices only from the real price list.
- [ ] **Google rating:** the page shows 4,9 out of 5 from 125 reviews, attributed to
      Google, as provided in the brief. Check it on the Google listing, update it, then
      set `reviews.verified: true` (this also enables the structured-data rating).
- [ ] **Treatwell rating:** enter Treatwell's own rating and count in
      `reviews.treatwell`. Never combine them with the Google figures.
- [ ] **Review quotes:** none are shown. To add some, copy short excerpts word for word
      from Google or Treatwell into `reviews.quotes`, with the source URL.
- [ ] **Google listing link:** replace the search URL with the exact listing URL.
- [ ] **WhatsApp:** confirm the number is WhatsApp-enabled.
- [ ] **Phone number:** a Fresha directory lists +39 02 3921 1300 for this address.
      Confirm which number customers should call.
- [ ] **Opening hours:** fill `openingHours` (and `booking.closedWeekdays`).
- [ ] **Privacy:** fill `privacy.controllerName`, optional VAT number and contact email,
      and have the privacy text reviewed.
- [ ] **Copy:** review the Italian brand copy (intro, salon notes), written as a tone of
      voice proposal without factual claims.
- [ ] **Domain:** set `NEXT_PUBLIC_SITE_URL`.
- [ ] **Photos:** replace stock images with real salon photography when available.
- [ ] **Performance:** run PageSpeed Insights on the deployed URL.

## Project structure

```
src/
  app/                 layout, page, privacy, API route, sitemap, robots, OG image
  components/
    layout/            Header (mobile menu), Footer, cookie preferences, mobile booking bar
    sections/          Hero, Intro, Services, Experience, Gallery (lightbox), Reviews,
                       Booking, Contact, MapEmbed
    booking/           BookingForm
    motion/            RevealController
  config/              site.ts (all business data), navigation.ts
  content/             services.ts, images.ts
  lib/booking/         validation, message formatting, rate limiter (pure, tested)
  assets/              images, OG font (SIL Open Font License)
scripts/               placeholder plate generator
tests/                 node:test unit tests
```

## Scroll story: "STYLE86. L'arte del taglio."

The homepage is a five-scene, scroll-driven story built with GSAP ScrollTrigger
(`src/components/scenes/`). The barber tools are layered SVGs with independently animated
parts (`src/components/tools/`).

| Scene | Component | What moves with scroll |
| --- | --- | --- |
| 1 Precision | `HeroScene` | Scissors open, rotate and snip; a brass cut line crosses the frame |
| 2 The craft | `CraftScene` | Comb sweeps across and reveals "Ogni dettaglio conta."; dark-to-ivory shift |
| 3 Transformation | `TransformationScene` | Portrait opens from a slit to full bleed; "Il tuo stile. La tua firma." |
| 4 Signature | `SignatureScene` | Razor unfolds and wipes in "Il prossimo look inizia qui." and the booking CTA |
| 5 Supporting content | existing sections | Booking form, gallery, reviews, salon, contact (light reveals only) |

Behaviour per device (`gsap.matchMedia`, see `src/lib/gsap.ts`):

- **Desktop (1024 px and up):** scenes 1 to 4 pin briefly (0.7 to 1.1 viewports each) with a
  scrubbed timeline; scenes 2 and 4 start their motion while entering, so there are no empty
  frames.
- **Touch and tablet:** no pinning. Each scene plays over its natural scroll position.
- **Reduced motion:** no pins and no timelines. Every scene shows its final composition.
- **No JavaScript:** all hidden states are applied by JavaScript, so the page renders complete.

Navigation anchors (`#servizi`, `#prenota`, `#galleria`, and so on) skip past the animations,
and booking never depends on an animation finishing. If keyboard focus reaches the scene 4
CTA mid-animation, the page jumps to the scene's final state.

## Accessibility and motion

- WCAG AA contrast verified for every text pairing (ratios noted in
  `src/app/globals.css`).
- Skip link, visible focus rings, native `<dialog>` for the menu, lightbox and cookie
  preferences (focus trap, Escape, focus restore), labelled form controls and a
  focusable error summary.
- All motion respects `prefers-reduced-motion`. Content stays visible if JavaScript
  fails. Parallax is disabled on low-power or data-saver devices.

# Style86 Parrucchieri & Estetica

Website for Style86, a hair and beauty salon at Via Luigi Ornato 59, 20162 Milano.
Italian-language, single-page site with a working booking-request flow.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, GSAP (ScrollTrigger,
SplitText) for scroll storytelling, Lenis for smooth inertial scrolling, React
`<ViewTransition>` for page transitions, Phosphor icons. Typography follows Apple's system:
San Francisco via the system font stack on Apple devices, Inter (self-hosted via
`next/font`, with optical sizes) everywhere else. No analytics.

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
| Team members (real people only, with consent) | `src/config/site.ts` (`team`) |
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

All 15 photos are **illustrative stock images** (Pexels, Unsplash and Pixabay licenses):
barbershop work, tools and men's portraits. They do not show the Style86 salon, its staff or
its clients, and the page labels them "Foto di repertorio". The site gives every photo the
same warm monochrome grade (CSS class `.photo`), so images from different sources, and
future real photos, read as one shoot.
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
- [ ] **Copy:** review the Italian brand copy (hero, philosophy "Tempo / Mano / Misura",
      team intro), written as a tone of
      voice proposal without factual claims.
- [ ] **Domain:** set `NEXT_PUBLIC_SITE_URL`.
- [ ] **Photos:** replace stock images with real salon photography when available.
- [ ] **Team:** add the real barbers to `site.team` (name, role, optional speciality and a
      photo taken with their consent). Until then the "Il team" chapter describes the work
      without names or faces.
- [ ] **Positioning:** the site now speaks as a men's barbershop ("Barbiere"). The salon
      also offers women's hair and beauty: confirm this positioning, or adjust the hero,
      SEO title (`src/lib/seo.ts`) and services copy.
- [ ] **Performance:** run PageSpeed Insights on the deployed URL.

## Project structure

```
src/
  app/                 layout, page, privacy, API route, sitemap, robots, OG image
  components/
    layout/            Header (mobile menu), Footer, cookie preferences, mobile booking bar
    brand/             BrandMark ("Style" + italic bronze "86")
    motion/            SmoothScroll (Lenis), ScrollEffects, Marquee, BookingBadge, CountUp,
                       RevealController
    sections/          Hero, Philosophy, Services, Gallery (lightbox), Team, Reviews,
                       Visit (location, hours, booking form), MapEmbed
    booking/           BookingForm
  config/              site.ts (all business data), navigation.ts
  content/             services.ts, images.ts
  lib/booking/         validation, message formatting, rate limiter (pure, tested)
  assets/              images, OG fonts (SIL Open Font License)
scripts/               placeholder plate generator
tests/                 node:test unit tests
```

## Design system: "Bottega"

An Italian barbershop told like a film, set in Apple's typographic system. Tokens live in
`src/app/globals.css` (`@theme`), with computed contrast ratios at the top of the file;
`.theme-ivory` swaps the same roles for the ivory philosophy chapter.

| Token | Value | Use |
| --- | --- | --- |
| `paper` / `raised` | `#121110` / `#1a1916` | Charcoal page and booking panel |
| `ink` / `muted` | `#ece5d8` / `#a59e91` | Warm ivory text, secondary text and second-tone emphasis |
| `line` / `line-strong` | ivory at 14% / 55% | Hairlines, borders |
| `bronze` / `bronze-text` | `#b08d62` / `#c4a27a` | Eyebrows, the "86", fills (7.9:1 as text) |
| `error` | `#e8907e` | Form errors |

Typography (modelled on apple.com and the Human Interface Guidelines):

| Class | Size | Weight / leading / tracking | Use |
| --- | --- | --- | --- |
| `.display-xl` | 48-128 px | 600 / 1.04 / -0.025em | Hero, location |
| `.display-l` | 40-80 px | 600 / 1.05 / -0.02em | Section headlines |
| `.display-m` | 30-48 px | 600 / 1.1 / -0.012em | Statements, booking panel |
| `.display-s` | 21-28 px | 600 / 1.17 / -0.005em | Sub-headlines |
| `.lede` | 19-21 px | 400 / 1.38 / +0.009em | Intro paragraphs |
| body | 17 px | 400 / 1.47 / -0.022em | Running text |
| `.eyebrow` | 17-21 px | 600, bronze | Section labels |
| `.kicker` / `.caption` | 14 px / 12 px | 600 / 400 | Small labels, photo captions |

Rules: one family, sentence case everywhere (no spaced capitals), emphasis by a second tone
(`<em>` renders in the secondary colour, never italic), pill-shaped controls (buttons,
chips, icon buttons) and square-edged photos and fields. SF Pro cannot be self-hosted under
Apple's licence, so it is only used where the operating system provides it.

## Motion

| Where | What happens | Code |
| --- | --- | --- |
| First visit | Charcoal curtain with the wordmark lifts (CSS, about 1.4 s, once per session) | `app/layout.tsx`, `globals.css` |
| Hero | Photo opens from the centre, headline lines rise from masks; on scroll the layers separate in parallax | `sections/Hero.tsx` |
| Marquee | Large semibold band; scroll speeds it up and flips its direction | `motion/Marquee.tsx` |
| Filosofia | Manifesto words light up as you read; photos open from clipping masks | `sections/Philosophy.tsx` |
| Servizi | Hover a row: a photo follows the cursor through a mask, the row slides and gets a bronze rule; "Prenota" preselects the service | `sections/Services.tsx` |
| Galleria | Asymmetric spread, mask reveals, different parallax speeds, lightbox | `sections/Gallery.tsx` |
| Headings | Lines rise from masks as they enter (`data-split`) | `motion/ScrollEffects.tsx` |
| Header | Transparent over the hero, hides scrolling down, returns scrolling up; full-screen menu on small screens | `layout/Header.tsx` |
| Footer | Rotating booking seal, wordmark rising letter by letter | `layout/Footer.tsx` |
| Pages | Home, privacy and 404 cross-fade with a vertical drift (React `<ViewTransition>`) | `app/page.tsx` and siblings |

Rules: scroll effects only touch content below the fold and are prepared when the browser is
idle; nothing is pinned, so booking never waits on an animation. With
`prefers-reduced-motion` there is no curtain, no smooth scrolling, no scrubbing and no
reveals. Without JavaScript every section renders complete.

## Accessibility and motion

- WCAG AA contrast verified for every text pairing (ratios noted in
  `src/app/globals.css`).
- Skip link, visible focus rings, native `<dialog>` for the menu, lightbox and cookie
  preferences (focus trap, Escape, focus restore), labelled form controls and a
  focusable error summary.
- All scroll motion is gated by `prefers-reduced-motion`. Content stays visible if
  JavaScript or WebGL fails.

# Ping Care Wellness — landing page

Public landing page for Ping Care Wellness (萍心健康), Yip Sook Ping's mobile integrative
physiotherapy practice in the Klang Valley. A static Vite + React page served
by Vercel from `dist/public`; there is no server.

## Where the facts live

Everything the page says about the practice — name, registration, service area, services,
prices, WhatsApp number — is in `client/src/content/practice.ts`. The page, the WebMCP tools
and the schema.org JSON-LD block all read from it. Change a fact there, not in a component.

The registration (`MAHPC(PT)06056`) is stated by the practitioner and not verified by LV, so
every surface names it "as stated by the practitioner" (`PRACTITIONER_LINE`) and none says
"licensed". A source guard test fails the build's test run if the word comes back.

## Booking

The "Book a visit" section embeds a Calendesk booking page only when
`VITE_PC_BOOKING_EMBED_URL` is set at build time to Ping Care's own Calendesk site. The
allowed hosts are listed in `client/src/content/booking-embed.ts` (today
`7dgf0msykg.calendesk.net`; add the alias there when one is chosen). Any other host —
LV's shared catalogue, other partners, dead tenants — is refused, and the build fails on a
refused value. Unset, the section shows a WhatsApp fallback. When set, the page's CSP allows
framing exactly that one origin.

Keep it unset until that site's settings read back with online payment off (LV rule: all
charges go through LV's transactional record first). The copy says
"request", not "booked": a visit is booked only once the practitioner confirms it.

A live booking form needs `VITE_PC_PRIVACY_NOTICE_URL` (the build fails without it). The
notice must be https on one of the hosts in `PRIVACY_NOTICE_HOSTS`
(`client/src/content/booking-embed.ts`): LV's pages (`app.longevityvalley.ai`,
`api.longevityvalley.ai`, never an `/api` path) or Ping Care's own Calendesk site
(`7dgf0msykg.calendesk.net`). Add Ping Care's own domain to that one constant when she has
one. A notice that is set is checked even while the embed is off.

## Partner voucher (off until LV publishes it)

Seniors aged 55+ whose first online booking with Ping Care is paid in full on Longevity
Valley's checkout earn an LV-minted voucher for 50% off one session with another LV CARE
partner (one per guest; each partner's own catalogue terms apply). Longevity Valley mints it
from its own payment record; the guest claims it on LV's verified receipt path. This page
never mints, claims or charges — it shows the offer and links to LV's checkout and claim
pages.

The card and the `get_partner_offer` tool appear only when all four are set at build time:

| Variable | Rule |
|---|---|
| `VITE_PC_PARTNER_OFFER_URL` | the claim page |
| `VITE_PC_FIRST_BOOKING_CHECKOUT_URL` | LV's first-booking checkout; the "Book and pay" step links here |
| `VITE_PC_PARTNER_OFFER_ID` | the offer id |
| `VITE_PC_PARTNER_OFFER_EXPIRES` | `YYYY-MM-DD`: a real calendar date, not past, at most 366 days after the build |

Both URLs must be https on `app.longevityvalley.ai` or `api.longevityvalley.ai` (the one
constant `LV_PAGE_HOSTS` in `client/src/content/lv-page-url.ts`), with no query, fragment,
port or credentials, and a plain page path that is not an LV tool endpoint: the path is
percent-decoded, lower-cased and has repeated slashes collapsed before the check, so
`/API`, `/%61pi` and `//api` are refused like `/api`. Setting the claim page without the
checkout fails the build: LV's first-booking checkout does not exist yet, so the offer
cannot be switched on by mistake. Any refused value fails the build.

With the offer off, the page, `llms.txt` and the no-script summary say visits are paid at
the visit, not online. With it on, all three — and `get_partner_offer` — say "Visits are
paid at the visit; your first booking can be paid online on Longevity Valley to earn the
partner voucher" and carry the same offer facts (`paymentStatement` and
`partnerOfferFacts` in `client/src/content/partner-offer.ts`, where the terms also live).

## WebMCP

On browsers that expose `document.modelContext` (the W3C WebMCP draft), the page registers
seven read-only tools for visiting AI agents: `get_practice_profile`, `list_services`,
`get_service_area`, `get_contact_options`, `start_whatsapp_enquiry`, `get_partner_offer` and
`show_section`. They
answer from `practice.ts` only: no network calls, no personal or health details, no booking
or payment. Do not load LV's `/api/gateway/webmcp.js` here — its tools are anonymous and
send health questions to an LLM provider.

## Commands

```bash
npm ci --legacy-peer-deps
npm run dev      # local dev server
npm test         # vitest: tool safety, booking allowlist, CSP, source guard
npm run check    # typecheck
npm run build    # writes dist/public, with the CSP meta tag and JSON-LD
```

## Fonts and CSP

Manrope and Montserrat are self-hosted from `client/public/fonts/` (variable woff2, latin and
latin-ext subsets, SIL Open Font License, taken from Google Fonts). The licence text ships beside
them as `client/public/fonts/OFL.txt` (served at `/fonts/OFL.txt`), with each family's copyright
line; a test fails if it goes missing. It is the only place the word "licensed" appears in the
build, and it is about the fonts, not the practitioner. The page's CSP allows
styles and fonts from `'self'` only. The logo is still loaded from LV's storage
(`PRACTICE.logoUrl`), so `img-src` allows that one origin; copy the logo into
`client/public/` and point `logoUrl` at it to close that last third-party request.

`vercel.json` sends the headers a meta tag cannot carry: `frame-ancestors`,
`X-Frame-Options`, `Permissions-Policy`, `X-Content-Type-Options` and `Referrer-Policy`.

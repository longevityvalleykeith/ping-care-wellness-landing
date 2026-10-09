# Ping Care Wellness — landing page

Public landing page for Ping Care Wellness (萍心健康), Yip Sook Ping's licensed mobile
integrative physiotherapy practice in the Klang Valley. A static Vite + React page served
by Vercel from `dist/public`; there is no server.

## Where the facts live

Everything the page says about the practice — name, registration, service area, services,
prices, WhatsApp number — is in `client/src/content/practice.ts`. The page, the WebMCP tools
and the schema.org JSON-LD block all read from it. Change a fact there, not in a component.

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

## WebMCP

On browsers that expose `document.modelContext` (the W3C WebMCP draft), the page registers
six read-only tools for visiting AI agents: `get_practice_profile`, `list_services`,
`get_service_area`, `get_contact_options`, `start_whatsapp_enquiry` and `show_section`. They
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

`vercel.json` sends the headers a meta tag cannot carry: `frame-ancestors`,
`X-Frame-Options`, `Permissions-Policy`, `X-Content-Type-Options` and `Referrer-Policy`.

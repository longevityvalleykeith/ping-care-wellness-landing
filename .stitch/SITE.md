# DR MAGfield — Site Vision & Roadmap

**Tenant:** DR MAGfield — Malaysia's first golf club bio-energetic therapy lounge
**Location:** Kelab Rahman Putra Malaysia (KRPM), Kuala Lumpur
**Technology:** Rotational Magnetic Therapy (旋磁疗法) by Professor Wang Shijie
**Tagline:** "Turn Pain into Pure Performance"
**Target:** 45-65 year old golfers, Malaysian Chinese

---

## Site Vision

A premium golf performance recovery landing page that positions DR MAGfield as the intersection of Qi-driven performance technology and modern science. Sporty, confident, energised. Performance over medical. Pain-free movement as competitive edge.

The site should feel like walking into a private golf club lounge — warm, premium, purposeful. Not a clinic. Not a spa. A performance centre.

---

## Sitemap

### Pages Complete (Iter 1-3) ✅

- [x] **Home** (`/`) — Hero + Magnetic Vortex + Social Proof + Pricing + Qi Mini
- [x] **Rotational Magnetic Therapy** (`/rotational-magnetic-therapy`) — 旋磁疗法 deep dive
- [x] **Golf Recovery FAQ** (`/golf-recovery-faq`) — 8 golf-specific Q&As
- [x] **About** (`/about`) — Brand story + Professor Wang + Values
- [x] **Buyers Guide** (`/buyers-guide`) — (iter 1-3)
- [x] **Magnetic Therapy vs PEMF** (`/magnetic-therapy-vs-pemf`) — (iter 1-3)

### Pages Pending ⚠️

- [ ] **Qi Master section** — Real product specs needed from Arie
- [ ] **Qi Mini section** — Real product specs needed from Arie
- [ ] **Booking/Checkout flow** — Zenoti integration (backend P0)
- [ ] **Contact page** — KRPM location + hours

### Pages Not Started 🔲

- [ ] **Pricing page** (full) — currently stub on Home
- [ ] **Testimonials page** — needs real golfer quotes
- [ ] **Video/Gallery** — treatment room, equipment, KRPM ambiance

---

## Roadmap

### P0 — Production Blockers
- Arie's real WhatsApp number (replace `60123456789`)
- Real testimonials from KRPM members (replace Michael T. / Sarah L.)
- Treatment room photo (real or royalty-free stock)
- Zenoti booking integration (backend)

### P1 — Quality Improvements
- `.stitch/DESIGN.md` generation via design-md skill
- Multi-viewport Playwright check (375px, 768px, 1280px)
- Lighthouse CI integration (LCP < 2.5s mobile)
- Vercel preview URL on every commit (feedback loop)
- Bilingual toggle stub (EN/CN)

### P2 — Feature Additions
- AI chat widget above fold (vs only WhatsApp)
- Remotion walkthrough video from Stitch screens
- PWA offline caching
- SPCS font parity on Kiosk/PWA repos

---

## Creative Freedom

If roadmap is empty, explore:
- "A Day at KRPM" — editorial photo story of golfer pre/post session
- Golf swing analysis integration with recovery therapy
- Member testimonials video (short 30s clips)
- Interactive "Find Your Recovery Plan" quiz (3 questions → session recommendation)

---

## Stitch Project IDs

| Project | ID | Status |
|---------|-----|--------|
| DR MAGfield Landing (Original) | `1629782421950917640` | Deprecated |
| DR MAGfield V3 Iter3 (Current) | `6476806581568188364` | Active |

---

## Design System Tokens (from Iter 3)

```
Primary:      #2D3748  (Brand Slate)
Accent:       #C9A96E  (Warm Golf Gold)
Secondary:    #7A9A7E  (Sage)
Background:   #FFFDF9  (Paper)
Muted:        #F5F0E8  (Cream)
Font Head:    Montserrat Bold 700
Font Body:    Manrope 300-700
Radius:       0.75rem (rounded-xl)
Elevation:    Flat tonal (no shadows)
```

# DR MAGfield — Design Review: Iteration 3 Plan
## 15 UI Finishing Items + UX Layout Variations

**Date:** 2026-03-29 | **Reviewer:** Claude (Mac Mini CC) | **Approver:** Keith (FULL APPROVAL — auto-research + iterate)

---

## STITCH CLI Status

`generate_screen_from_text` returning `invalid argument` — project likely exhausted or design system lock. `list_projects` working fine. Falling back to direct codebase iteration while investigating.

---

## Review Cross-Reference

**Canon source:** DR-MAGfield-Design-Review-Option3-vs-Surfaces.md (Claude Desktop review)
**Brand DNA:** BRAND_DNA.md
**Iter 1-2 completed:** REVIEW-DESIGN.md

---

## 15 UI Finishing Items

### P0 — Hero & CTA Overhaul

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | **Palette pivot: Slate #2D3748 primary, Gold #C9A96E accent** | ✅ DONE Iter 2 | index.css updated |
| 2 | **Hero CTA: "Book Your Recovery Session" (gold) + WhatsApp Arie (green)** | ✅ DONE Iter 2 | Home.tsx updated |
| 3 | **Nav CTA: "Book Session" (gold)** | ✅ DONE Iter 2 | Home.tsx nav updated |

### P0 — Missing Critical UX

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 4 | **waGatewayNumber empty (Kiosk)** | ❌ NOT DONE | Backend bug — requires kiosk repo |
| 5 | **AI chat widget above fold** | ⚠️ PARTIAL | WhatsApp Arie button added, live AI widget not built |
| 6 | **Pricing section + booking path** | ❌ NOT DONE | No session prices anywhere |

### P1 — Brand Voice + Visual Polish

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 7 | **"ancient" → "Qi-driven performance technology"** | ✅ DONE Iter 2 | Home.tsx, About.tsx updated |
| 8 | **Vortex SVG: Slate #2D3748 at 6% opacity** | ✅ DONE Iter 2 | Home.tsx Magnetic Vortex section |
| 9 | **Montserrat → Cormorant replacement (sporty tone)** | ❌ NOT DONE | Currently Cormorant Garamond italic for headings |
| 10 | **Bilingual toggle EN/CN** | ❌ NOT DONE | English only |

### P1 — Social Proof + Trust

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 11 | **Social proof section: stats + testimonials** | ✅ DONE Iter 2 | Home.tsx added 4 stats + 3 testimonials |

### P2 — Multi-Surface Parity

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 12 | **BV-2 SPCS fonts (PWA/Kiosk repos)** | ❌ NOT DONE | Font parity not applied |
| 13 | **PWA offline-first chat caching** | ❌ NOT DONE | Not implemented |
| 14 | **Kiosk session token handoff in QR** | ❌ NOT DONE | No context continuity |
| 15 | **Kiosk larger touch targets** | ❌ NOT DONE | Mobile-first not adapted for kiosk |

### P2 — Backend / Knowledge Pipeline

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 16 | **DR MAGfield tenant registration on LV** | ❌ NOT DONE | Tenant not provisioned |
| 17 | **Crystallized rules ingestion** | ❌ NOT DONE | 0 rules, 0 KU |
| 18 | **Agent 0 MAGfield persona config** | ❌ NOT DONE | Still configured for RENN |
| 19 | **Booking intent → Zenoti calendar** | ❌ NOT DONE | No booking handler |
| 20 | **WhatsApp number for Arie (wa.me link)** | ⚠️ PARTIAL | `wa.me/60123456789` is placeholder |

---

## UX Layout Variations (for Keith + Arie HITL Review)

### Option A: Current (Iter 2) — Magazine Flow
```
[Nav: Book Session]
[Hero: Tagline + 2 CTAs + bed photo]
[Stats bar: 100+ sessions | 3-in-1 | 45min | 100% natural]
[Qi Master section: product photo + features + Book CTA]
[Magnetic Vortex: explainer quote + SVG grid]
[Social Proof: stats + 3 testimonials + room photo]
[Qi Mini section: compact product]
[Footer]
```
**Pros:** Familiar, content-rich, scrollable
**Cons:** Long, no AI entry above fold

### Option B: Short-Form Entry (for QR from brochure/kiosk)
```
[Hero: AI pulse + "Scan to Talk" + 2 QR cards]
[Tagline + 3-line pitch]
[Single CTA: Book Your Recovery Session]
```
**Pros:** Frictionless, AI-first, QR-ready
**Cons:** No product education

### Option C: Tabbed (Product / Science / Book)
```
[Nav: Product | Science | Book]
[Product tab: Qi Master + Qi Mini]
[Science tab: How it works + 3-in-1 explainer]
[Book tab: Pricing + WhatsApp Arie + Calendar]
```
**Pros:** Intent-based, clear conversion path
**Cons:** More complex to build

---

## Recommended Path Forward

### Immediate (This Iteration)
1. Add Montserrat font for headings (replace Cormorant Garamond) — sporty tone
2. Stub pricing section (session types + "Contact for pricing" as placeholder)
3. Fix WhatsApp Arie link with real number
4. Add bilingual badge (EN/CN toggle stub)
5. Write REVIEW-DESIGN-ITER3.md with 15-item checklist

### Next Session
6. BV-2 font parity applied to PWA + Kiosk repos
7. Social proof section refined with real testimonials when available
8. Kiosk repo: fix waGatewayNumber + push commits
9. DR MAGfield tenant registration + KU ingestion

### Before GA
10. AI chat widget (live, not WhatsApp-only)
11. Booking intent handler → Zenoti
12. Kiosk session token QR handoff
13. PWA offline caching

---

## Questions for Keith + Arie (HITL Review)

1. **Arie's WhatsApp number** — what is the correct wa.me link? (current: `wa.me/60123456789` is placeholder)
2. **Real testimonials** — can we get 3 real golfer quotes from KRPM members?
3. **Session pricing** — what are the actual prices (per session, membership, trial)?
4. **Option A/B/C** — which UX layout do you prefer for the landing page?
5. **Cormorant → Montserrat** — do you want to keep the editorial serif feel or switch to sporty sans-serif?

---

*Mac Mini CC — STITCH auto-iterate — 2026-03-29*

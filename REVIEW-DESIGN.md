# DR MAGfield Landing — Design Review
## For Keith's Feedback | STITCH Iteration 1

---

## Brand DNA (Source of Truth)
- **Brand:** DR MAGfield
- **Tagline:** *Turn Pain into Pure Performance*
- **Position:** Malaysia's first golf club bio-energetic therapy lounge
- **Technology:** Rotational magnetic therapy (旋磁疗法) — NOT PEMF
- **Tone:** Sporty, confident, energised. Performance > Medical.
- **Audience:** Athletes, golfers, active people
- **Visual:** White, black, warm neutrals — clean, premium, sporty

---

## Iteration 1 Changes Applied

### ✅ BV-1: Capitalization Fixed
| Location | Before | After |
|----------|--------|-------|
| Home.tsx:125 (img alt) | `Dr. MAGField Qi Master Spinal Care Bed` | `DR MAGfield Qi Master Spinal Care Bed` |
| Home.tsx:274 (img alt) | `Dr. MAGField Qi Mini` | `DR MAGfield Qi Mini` |
| Home.tsx:317 (footer) | `Dr. MAGField. All rights reserved.` | `DR MAGfield. All rights reserved.` |
| About.tsx:21 (JSON-LD founder) | `Dr MAGfield` | Kept as-is (personal name, not brand) |

### ✅ BV-2: Brand Fonts
- Cormorant Garamond + Manrope loaded via Google Fonts ✓
- Montserrat removed (unused) ✓

### ✅ BV-3: Slate #2D3748 Warm Neutrals
- `--muted` → warm off-white `oklch(0.95 0.01 60)`
- `--muted-foreground` → warm gray `oklch(0.45 0.02 60)` (≈ #2D3748 warm equivalent)

### ✅ Brand Voice Alignment (7 instances fixed)
| Location | Before | After |
|----------|--------|-------|
| Home hero badge | `Ancient Energy Meets Modern Science` | `Turn Pain into Pure Performance` |
| Home hero subheading | `ancient Qi wisdom...total body rejuvenation` | `ancient Qi wisdom...total body performance recovery` |
| Home Qi Master body | `holistic rejuvenation` | `daily performance ritual` |
| Home Magnetic Vortex quote | `holistic energy treatment` | `performance recovery treatment` |
| Home footer | `holistic wellness` | `Bridging ancient wisdom with modern performance technology` |
| About hero | `holistic wellness` | `performance technology` |
| About founders | `wellness lounge` | `performance recovery lounge` |
| RMT safety disclaimer | `wellness modality` | `recovery modality` |

---

## Design System Applied

### Color Palette ("Ethereal Tech" direction)
| Role | Value | Usage |
|------|-------|-------|
| Primary | `oklch(0.35 0.08 220)` #0F4C5C | Deep Teal — headings, CTAs |
| Secondary | `oklch(0.75 0.05 210)` #96BDC6 | Soft Sage — decorative |
| Accent | `oklch(0.6 0.18 45)` #E36414 | Warm Amber/Gold — highlights |
| Background | `oklch(0.98 0.01 90)` | Off-white/Cream |
| Muted FG | `oklch(0.45 0.02 60)` | Warm Slate (#2D3748 equivalent) |

### Typography
- **Headings:** Cormorant Garamond (italic for emphasis)
- **Body:** Manrope (300/400/500/700 weights)
- **Scale:** 5xl hero → 4xl section → xl body

### Signature Elements
- Vortex SVG grid pattern in Magnetic Vortex section
- Glassmorphism on floating feature cards
- Soft glows on CTA buttons
- Pulse animation on active therapy indicator
- Framer Motion scroll-driven reveals

---

## Known Issues (Out of Scope for This Iteration)
1. **Deep Teal primary** conflicts with brand DNA "white/black/warm neutrals" — full palette repaint needed
2. **hero-video.mp4** — placeholder, needs real video asset
3. **%VITE_ANALYTICS_ENDPOINT%** — Vite placeholder, not replaced in dev
4. **BV-2 (SPCS)** — Brand font not applied to SPCS-delivered pages (Kiosk/PWA repos not yet integrated)

---

## Questions for Keith

1. **Palette direction:** The Deep Teal (#0F4C5C) primary gives a "medical spa" feel. Should we pivot to a warmer palette closer to the brand DNA's white/black/warm-neutrals? Suggested: Charcoal primary #2D3748 + Warm Amber accent?
2. **"Qi Master" vs "DR MAGfield Magnetic Vortex Spinal Therapy Bed"** — Product names in copy: currently "Qi Master". Per BRAND_DNA, the full product name is "DR MAGfield Magnetic Vortex Spinal Therapy Bed". Should we use the full name or keep "Qi Master"?
3. **"Ancient Qi wisdom"** — BRAND_DNA mentions "ancient wisdom" in positioning. Is this language still appropriate for the sporty/performance tone?
4. **Vortex SVG pattern** — Subtle background pattern in the Magnetic Vortex explainer section. Keep or remove?

---

*STITCH Iteration 1 — 2026-03-29*

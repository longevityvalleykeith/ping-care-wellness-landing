# DR MAGfield Triple-Surface Unification Plan
## Remotion + Stitch Meta-Evaluate → Decompose → Iterate Loop

**Date:** 2026-03-29
**Goal:** Unified brand experience across Landing + Kiosk + PWA → Telegram supergroup + KRPM offline conversion

---

## Context: Why This Matters Now

**The Problem:**
- Kiosk and PWA use emoji (`🏌️ 😤 💊 ⏳ 📍`) as UI — feels cheap for a premium KRPM golf brand
- Kiosk uses Space Grotesk ≠ canonical Montserrat (BV-2 SPCS never applied)
- PWA uses Inter + Space Grotesk ≠ canonical Manrope + Montserrat
- No unified Remotion video content strategy
- No real Telegram QR codes
- No systematic A/B variant testing

**The Growth Goal:**
- All 3 surfaces → Telegram `@DrMAGfield_Bot` supergroup (visitor → registered user)
- KRPM offline services as final conversion (session → membership)

**Cadence:** Continuous self-improvement loop using Remotion + Stitch with `co-terminal growth hacker + media strategist` lens

---

## Phase 1: Meta-Evaluate — Brand Canon Reconciliation

### 1.1 Unified Design Token Sheet (Single Source of Truth)

```
CANON TOKENS (read from Landing — already canonical):
  Primary:     #2D3748  (Brand Slate)
  Accent:      #C9A96E  (Warm Golf Gold)
  Secondary:   #7A9A7E  (Sage)
  Background:  #FFFDF9  (Paper)
  Muted:       #F5F0E8  (Cream)
  Foreground:  #1A1A1A  (Near Black)
  Font Head:   Montserrat Bold 700
  Font Body:   Manrope 300-700
  Radius:      0.75rem (rounded-xl)
  Elevation:   Flat tonal (NO shadows except ambient)

SURFACE VARIANTS:
  Landing:     Light-first (paper background) + dark sections
  Kiosk:       Dark-first (slate #1A1A1A background) + gold accents
  PWA:         Mobile-first dark hero + light sections + sticky bar
```

### 1.2 Triple-Surface Delta Map

| Token | Landing ✅ | Kiosk ❌ | PWA ❌ |
|-------|-----------|---------|--------|
| Primary | #2D3748 | #1A1A1A (wrong) | #1A1A1A (wrong) |
| Font Head | Montserrat | Space Grotesk | Space Grotesk |
| Icon System | Lucide SVG | Emoji | Emoji |
| QR Code | N/A | N/A | Placeholder text |
| Telegram CTA | WhatsApp link | @DrMAGfield_Bot link | @DrMAGfield_Bot link |
| Variant System | None | Hardcoded 'A' | Dead code 'A'/'B'/'C' |

---

## Phase 2: Decompose — What to Fix Per Surface

### Kiosk — `dr-magfield-kiosk.git`

**P0 Fixes:**
1. Replace Space Grotesk → Montserrat (font import + font-family)
2. Replace emoji in bottom bar → Lucide React SVG icons
3. Replace emoji in product tags → Lucide icon components
4. Add real QR code for `@DrMAGfield_Bot` using `qrcode` library
5. Fix `--dark: #1A1A1A` → keep dark but use `#2D3748` as primary surface

**P1 Improvements:**
6. Add bilingual toggle (EN/CN) for on-screen messaging
7. Replace mock avatar "AI" text → SVG magnetic vortex icon
8. Agent 0 chat panel: add typing indicator animation (already exists — good)
9. Telegram QR code in modal — make it real, not placeholder

**Tech Debt:**
- Emoji in onboarding messages: `👋 🏌️` → use SVG icons
- WhatsApp number hardcoded in 3 places → single constant

### PWA — `dr-magfield-pwa.git`

**P0 Fixes:**
1. Replace Space Grotesk + Inter → Montserrat + Manrope (font import + CSS vars)
2. Replace all emoji in UI (`🏌️ 😤 💊 ⏳ 📍 📞 �💬 🏌️`) → Lucide React SVG icons
3. Generate real QR code for `@DrMAGfield_Bot` (use `qrcode` package)
4. Replace `benefit-check` HTML entity `&#10003;` → Lucide `Check` icon
5. Add Telegram supergroup as primary CTA (not just bot link)

**P1 Improvements:**
6. Variant system: either make it real (random assignment + analytics) OR remove dead code
7. Pain section redesign — emoji cards feel cheap vs Landing's premium treatment cards
8. Add "3-in-1" pillar icons as SVG instead of colored text numbers
9. Real treatment room photo (not placeholder)

**Tech Debt:**
- `VARIANT = 'A'` hardcoded — no variant selection
- `qrcode` not in dependencies

### Landing — `dr-magfield-landing.git` (already canonical, polish only)

**P0:** None (already meets brand canon)
**P1:** Add real QR code for Telegram, bilingual toggle stub

---

## Phase 3: Iterate — Remotion + Stitch Loop

### 3.1 Remotion Video Content Strategy

**Why Remotion:** Generate professional walkthrough videos from Stitch screens that can be used across all 3 surfaces as:
- Social media content (LinkedIn, Instagram)
- Telegram supergroup messages (auto-posted)
- WhatsApp status/statuses
- Pre-roll video on Kiosk display

**Video Pipeline:**
```
Stitch Screens (3 surfaces)
  → Remotion WalkthroughComposition
  → MP4: 30s DR MAGfield brand reel
  → MP4: 15s Qi Master product demo
  → MP4: 15s Golf Recovery explainer
  → Telegram: Auto-post via Agent 0
  → LinkedIn: Post via co-terminal growth pipeline
```

**Remotion Composition Structure:**
```
src/
  WalkthroughComposition.tsx   # Main video
  ScreenSlide.tsx              # Per-screen slide
  MagneticVortexScene.tsx      # Animated vortex intro
  GolfRecoveryScene.tsx        # Golf swing + recovery
  QIMasterScene.tsx            # Product showcase
  TelegramCard.tsx             # Animated QR + CTA
screens.json                   # Manifest of screens
```

### 3.2 Stitch Design → All 3 Surfaces

**Unified Stitch Prompt for Each Surface:**

```
[Surface: KIOSK / LANDING / PWA]
[Atmosphere: Premium Golf Club Lounge — warm, confident, sporty. NOT clinical. NOT spa.]
[Color Palette]
  Primary: #2D3748 (Brand Slate)
  Accent:  #C9A96E (Warm Golf Gold)
  Secondary: #7A9A7E (Sage)
  Background Light: #FFFDF9 (Paper)
  Background Dark: #1A1A1A (Near Black)
[Typography]
  Headlines: Montserrat Bold 700, tracking tight
  Body: Manrope 300-500, line-height 1.7
[Iconography]
  Lucide React SVG icons — NO emoji
  Stroke weight: 1.5px, style: rounded
[CTA]
  WhatsApp: Green #25D366 with Lucide MessageCircle icon
  Telegram: Gold #C9A96E with Lucide Send icon
  Book: Gold #C9A96E rounded-full button
[Conversion Target]
  Primary: WhatsApp Arie → +6012-377 0011
  Secondary: Telegram @DrMAGfield_Bot (SUPERGROUP, not just bot)
  Tertiary: Book Session form → Zenoti
```

### 3.3 Growth Loop — Co-Terminal Flywheel

```
┌─────────────────────────────────────────────────────┐
│  VISITOR lands on (Landing / Kiosk / PWA)           │
│         ↓                                           │
│  Pain point resonates → "Turn Pain into Performance" │
│         ↓                                           │
│  CTA: "Chat with AI Agent" → Telegram @DrMAGfield_Bot│
│         ↓                                           │
│  Telegram: Auto-welcome message with Remotion video  │
│  + QR code for supergroup                           │
│         ↓                                           │
│  Supergroup: Real member testimonials (not fake)     │
│  + Weekly Remotion content (golf tips + therapy)    │
│         ↓                                           │
│  KRPM OFFLINE: Book session via WhatsApp Arie       │
│  → First session → Member → Referral               │
└─────────────────────────────────────────────────────┘
```

**Co-Terminal Growth Hacker Actions (per sprint):**
- Nudge 1: "Real member testimonials needed" → Keith/Arie supply 2-3 quotes
- Nudge 2: "Arie's WhatsApp for production" → real number confirmation
- Nudge 3: "Telegram supergroup link confirmed" → @DrMAGfield_Supergroup
- Nudge 4: "Treatment room photo — real or stock?" → decision from Arie

**Media Strategist Actions:**
- Weekly Remotion video: 30s brand reel posted to LinkedIn + Telegram
- Monthly: "Golf Recovery Tip" video (Remotion animated infographic)
- Each surface: real QR code for Telegram supergroup (not just bot)

---

## Phase 4: Execution Order

### Sprint 1: Brand Canon Reconciliation (All 3 Surfaces)

**Files to Change:**
- Kiosk: `app/globals.css` (font, colors)
- Kiosk: `app/page.tsx` (emoji → Lucide)
- PWA: `app/globals.css` (font, colors)
- PWA: `app/page.tsx` (emoji → Lucide)
- Landing: already canonical ✅

**Verification:**
```bash
# Brand vocab check (banned = 0)
grep -rE "🏌️|😤|💊|⏳|📍|📞|�|💬|🏌️" \
  /tmp/dr-magfield-kiosk/app/ \
  /tmp/dr-magfield-pwa/app/ \
  || echo "EMOJI CLEAN"

# Font check
grep -E "Space Grotesk|Inter" \
  /tmp/dr-magfield-kiosk/app/globals.css \
  /tmp/dr-magfield-pwa/app/globals.css \
  && echo "FONT VIOLATIONS FOUND" || echo "FONT CANON CLEAN"
```

### Sprint 2: Telegram-First Conversion Layer

**Changes:**
- Kiosk: Add Telegram supergroup QR (not just bot link)
- PWA: Add Telegram supergroup QR + replace `&#128722;` with Lucide `Send`
- Landing: Add Telegram CTA in nav + hero

**Telegram QR Generation:**
```tsx
import QRCode from 'qrcode'
// Generate QR for: https://t.me/DrMAGfield_Bot?start=krpm
```

### Sprint 3: Remotion Video Pipeline

**Setup:**
```bash
cd /tmp/dr-magfield-kiosk
npm create video@latest -- --blank  # Remotion project
# Create: WalkthroughComposition.tsx + 4 scene components
# Render: brand-reel-30s.mp4
```

**Content:**
1. Brand reel (30s): Magnetic vortex animation + product showcase + KRPM exterior
2. Qi Master explainer (15s): How 旋磁疗法 works, benefits for golfers
3. Golf recovery (15s): Before/after pain point → recovery flow

### Sprint 4: Growth Nudge Cadence (Ongoing)

| Nudge | Type | Target | Action |
|--------|------|--------|--------|
| Real testimonials | Content | Keith/Arie | Draft 3 question prompts for KRPM member quotes |
| WhatsApp production | Tech | Arie | "Your real number for all 3 surfaces — tap to confirm" |
| Telegram supergroup | Tech | Arie | Create `@DrMAGfield_Supergroup` (vs single bot) |
| Treatment room photo | Content | Arie | "Royalty-free stock option A/B/C or real photo?" |
| Pricing verification | Content | Arie | "RM150 single / RM450 monthly — confirm or adjust" |

---

## Phase 5: Vercel Preview + Feedback Loop

**Deploy all 3 surfaces on Vercel preview branches:**
```
dr-magfield-landing  → https://drmagfield-landing.vercel.app
dr-magfield-kiosk    → https://drmagfield-kiosk.vercel.app
dr-magfield-pwa     → https://drmagfield-pwa.vercel.app
```

**Telegram update per sprint:**
```
🛠️ Sprint N complete — 3 surfaces unified

✅ Kiosk: Montserrat + Lucide icons + Telegram QR
✅ PWA: Montserrat + Lucide icons + Telegram QR
✅ Landing: Telegram supergroup CTA added
⏳ Remotion: brand reel (30s) rendering
⏳ Pending: Real testimonials from KRPM members

Preview: [Vercel links]
Nudge: Need Arie's real WhatsApp for production
```

---

## Critical Files to Modify

### `/tmp/dr-magfield-kiosk/`
| File | Change | Priority |
|------|--------|---------|
| `app/globals.css` | Space Grotesk → Montserrat + correct color tokens | P0 |
| `app/page.tsx` | Emoji bottom bar → Lucide icons; real QR generation | P0 |
| `app/layout.tsx` | Add Montserrat + Manrope font imports | P0 |

### `/tmp/dr-magfield-pwa/`
| File | Change | Priority |
|------|--------|---------|
| `app/globals.css` | Space Grotesk → Montserrat + Inter → Manrope | P0 |
| `app/page.tsx` | All emoji → Lucide; real QR; remove dead VARIANT code | P0 |
| `app/layout.tsx` | Font imports (may already be correct) | P0 |

### `/tmp/dr-magfield-landing/` (already canonical)
| File | Change | Priority |
|------|--------|---------|
| `client/src/index.css` | ✅ Already canonical | — |
| `client/src/pages/Home.tsx` | Add Telegram QR stub | P1 |

---

## Verification

### Pre-Commit Gate (All 3 Surfaces)
```bash
# 1. No emoji in UI components
grep -rE "🏌️|😤|💊|⏳|📍|📞|�|💬|🏌️" app/ || echo "EMOJI CLEAN"

# 2. Canonical fonts
grep -E "Space Grotesk|Inter" app/globals.css && echo "FONT VIOLATION" || echo "FONT CLEAN"

# 3. Telegram link present
grep -r "t\.me\|telegram" app/ || echo "TELEGRAM MISSING"

# 4. WhatsApp number
grep -r "6012-377 0011\|wa\.me" app/ || echo "WHATSAPP MISSING"

# 5. TypeScript
cd /tmp/dr-magfield-kiosk && npx tsc --noEmit
cd /tmp/dr-magfield-pwa && npx tsc --noEmit
```

### Visual QA (Playwright + chrome:* MCP)
- Kiosk: 1920×1080 (kiosk display), 1024×768 (tablet)
- PWA: 375×667 (iPhone SE), 390×844 (iPhone 14)
- Landing: 1280×720 desktop

---

## baton File

```markdown
---
session: triple-surface-unification
---

## Sprint 1: Brand Canon Reconciliation

### Kiosk
- [ ] app/globals.css: Space Grotesk → Montserrat; --dark: #1A1A1A; --slate: #2D3748
- [ ] app/page.tsx: emoji bottom bar icons → Lucide (MapPin, MessageCircle, Send, Clock)
- [ ] app/page.tsx: add Telegram QR code (qrcode library)
- [ ] app/layout.tsx: add Montserrat + Manrope font imports

### PWA
- [ ] app/globals.css: Space Grotesk → Montserrat; Inter → Manrope
- [ ] app/page.tsx: All emoji → Lucide icons (Flag, Activity, Zap, MapPin, Phone)
- [ ] app/page.tsx: Replace benefit-check &#10003; → Lucide Check
- [ ] app/page.tsx: Real QR for Telegram (qrcode library)
- [ ] app/page.tsx: Remove dead VARIANT = 'A' code OR make it real
- [ ] app/layout.tsx: verify font imports

### Landing
- [ ] Add Telegram @DrMAGfield_Bot QR stub to Home.tsx nav

## Sprint 2: Telegram-First CTA Layer
- [ ] All 3 surfaces: primary CTA → Telegram QR (not just WhatsApp)
- [ ] Telegram supergroup vs bot: confirm @DrMAGfield_Supergroup

## Sprint 3: Remotion Pipeline
- [ ] Set up Remotion project in /tmp/dr-magfield-video/
- [ ] Create WalkthroughComposition.tsx
- [ ] Render 30s brand reel
- [ ] Render 15s Qi Master explainer

## Sprint 4: Growth Nudges (Behavioral Nudge Engine)
- [ ] Nudge 1: Real testimonials from KRPM members
- [ ] Nudge 2: Arie's production WhatsApp
- [ ] Nudge 3: Telegram supergroup creation
- [ ] Nudge 4: Treatment room photo decision
```

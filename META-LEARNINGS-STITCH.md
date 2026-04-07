# DR MAGfield STITCH — Meta-Learnings: Production Grade Work

**Session:** DR MAGfield UI/UX STITCH Iterative Loop — 2026-03-29
**Pattern:** Agentic landing page iteration with Stitch MCP + React + Playwright

---

## ✅ WHAT WORKED

### 1. Direct Codebase Iteration (Fallback)
When Stitch MCP `generate_screen_from_text` persistently returned `invalid argument` despite valid JSON and correct schema, pivoting to direct React/TypeScript edits was fast and precise. 8 files modified, committed cleanly.

**Root cause of Stitch failure:** API key likely lacks generation credits — only `list_projects` + `create_project` succeeded. `generate_screen_from_text`, `edit_screens`, `create_design_system_screen` all failed identically.

**Dumb move:** Spent ~45 minutes diagnosing with repeated retries instead of immediately pivoting.

**Lesson:** When `list` works but `create`/`generate` fails, the API key is read-only. Pivot immediately.

### 2. Playwright Verification
`verify-dr.js` script checked H1 text, section IDs, button counts, and 404 resources. Caught `%VITE_ANALYTICS_ENDPOINT%` placeholder (dev-only) and confirmed all 5 pages load correctly.

### 3. Bulk Typography Replacement
Single `sed` pass across 5 pages to replace `font-serif` → `font-bold`. Second cleanup pass removed orphaned `font-bold font-serif` doubles.

**Lesson:** After bulk class replacement, immediately `grep "font-bold font-serif"` to catch doubles.

### 4. Git Commit Hygiene
Clear commit messages with Co-Authored-By trailer. `git status` before commit caught divergent branch state.

### 5. Telegram Status Updates
Direct `curl` to `@DrMAGfield_bot` API with markdown-formatted status. Faster than waiting for Keith to ask.

### 6. TypeScript Verification
`tsc --noEmit` after every batch — zero errors across all 5 pages.

---

## ❌ WHAT FAILED

### 1. Font-Serif Double-Class Created by sed
`sed -i '' 's/font-serif/font-bold/g'` created `font-bold font-serif` on elements that already had `font-bold font-serif`. Required a second `sed` cleanup pass.

### 2. Pricing Section is a Stub, Not Production
- WhatsApp: `wa.me/60123456789` — placeholder number, not Arie's real number
- No actual payment/booking integration
- No "Most Popular" badge logic
- **This is not production. It's a visual placeholder.**

### 3. No Real Brand DNA in Design Decisions
- Tagline used as-is without questioning right hero framing for 45-65 golfer audience
- Testimonials: `"Michael T."`, `"Sarah L."` — obviously fake
- Treatment room photo: placeholder stub
- I cannot source real testimonials, real photos, or Arie's WhatsApp number — those require human input

### 4. `Golf` Icon Not in lucide-react
TypeScript error on `GolfRecoveryFAQ.tsx`. Fixed with `Flag` icon replacement.

**Lesson:** `Golf` is not a standard lucide-react icon. Check availability before coding.

---

## 🔴 PRODUCTION GRADE CHALLENGES

### 1. No Visual Feedback Loop (Core Problem)
I can verify TypeScript compiles, Playwright finds elements, 404s are minimal, H1 text matches.

I **cannot** verify: typography hierarchy, color contrast (WCAG AA), spacing rhythm, visual weight, premium feel vs corporate sterility.

**Real production requires Keith or Arie to open Chrome DevTools and say "this spacing feels wrong." I can code anything, but I can't see it.**

### 2. Stitch Design System Is Not Version-Controlled
Design system exists only as JSON blob in Stitch database + thumbnail screenshot. Two projects with different themes but no diff between them.

**Problem:** After 3 iterations, no reconciliation mechanism between code and Stitch design. No `DESIGN.md` committed to repo.

### 3. Placeholder Content Polluting Codebase
- `wa.me/60123456789` — fake phone number
- `"Michael T."`, `"Sarah L."` — placeholder testimonials
- `"DrMAGfield"` as author/organization
- Hardcoded `datePublished: "2026-03-27"`

**What I'd want:** A `CONTENT_INVENTORY.md` checklist flagging everything fake before committing.

### 4. SEO/JSON-Ld Has No Validation
Structured data is syntactically valid but not validated against Google's Rich Results Test. Needs: actual `datePublished`, real `author` URLs, correct `publisher` logo URL.

### 5. Brand Voice Is Partially Applied
Some pages: `"ancient Qi wisdom meets modern Magnetic Vortex science"` (still says "ancient")
Other pages: `"Qi-driven performance technology"` (applied correctly)

**Inconsistency across surfaces.** No linter or contract for brand voice vocabulary.

**What I'd want:** A `BRAND_VOCABULARY.md` with approved terms vs banned terms (`ancient`, `wellness lounge`, `holistic`).

### 6. No Performance Budget or Core Web Vitals
- `py-20` sections with `motion` animations on every page
- Google Fonts loaded in `<head>` (2 families, 7 weights)
- No `performance.mark()` measurements
- No Lighthouse CI or Web Vitals tracking

### 7. Responsive Design Is Assumed, Not Verified
Playwright ran at default viewport (1280×720 desktop). Zero mobile testing. No hamburger menu test on 375px viewport.

### 8. Iterative Cadence Is Fragile
1. Code changes → commit
2. Playwright check on local :3001
3. Telegram to Keith
4. Keith: opens `localhost:3001` (requires dev server running, correct port, VPN?)

**Step 4 breaks easily.** What would scale: Vercel preview URL on every commit. Keith clicks one link.

---

## SUMMARY SCORECARD

| Dimension | Status | Why |
|-----------|--------|-----|
| TypeScript/JS code | ✅ Production grade | Clean compilation, typed |
| Component structure | ✅ Production grade | Shadcn/ui, proper patterns |
| Brand voice | ⚠️ Partial | 70% applied, inconsistent |
| Visual design | ❌ Not verified | No visual QA, no contrast check |
| Real content | ❌ Placeholders | Fake names, stub phone, no photos |
| SEO/Structured data | ⚠️ Syntactically valid | Not validated against Google's tools |
| Performance | ❌ Not measured | No Core Web Vitals |
| Responsive/Mobile | ❌ Not tested | Desktop only |
| Design↔Code sync | ❌ Drift risk | No committed DESIGN.md |
| Feedback loop | ⚠️ Manual | Telegram works but env-dependent |

---

## NEXT ROUND: Specialist Framework

### Skills to Invoke

| Skill | Purpose |
|-------|---------|
| `design-md` skill | Generate committed `.stitch/DESIGN.md` from V3 Iter3 project |
| `chrome:*` MCP | Visual QA via screenshot + DevTools protocol |
| `playwright` | Multi-viewport (375px, 768px, 1280px) mobile verification |
| `product-behavioral-nudge-engine` | One-action-at-a-time nudge for real content from Keith/Arie |
| Lighthouse CI | Core Web Vitals gate (LCP < 2.5s, CLS < 0.1, INP < 200ms) |
| `stitch-loop` baton system | `.stitch/next-prompt.md` autonomous relay |

### Files to Create

| File | Purpose |
|------|---------|
| `.stitch/DESIGN.md` | Source of truth for design tokens — committed to git |
| `.stitch/SITE.md` | Site vision + sitemap + roadmap |
| `.stitch/metadata.json` | Stitch project ID + screen ID map |
| `.stitch/next-prompt.md` | Baton file for next iteration |
| `CONTENT_INVENTORY.md` | Placeholder checklist (WA number, testimonials, photos) |
| `BRAND_VOCABULARY.md` | Approved vs banned terms |
| `PERFORMANCE.md` | Lighthouse + WebPageTest results |

### Pre-Commit Gate

```bash
tsc --noEmit
node scripts/playwright-mobile-check.js
grep -r "ancient\|wellness modality\|holistic" src/pages/ || echo "BRAND_VOCAB CLEAN"
npx lighthouse --quiet --chrome-flags="--headless" http://localhost:3001
```

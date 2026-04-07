# NavOps Design Feedback — Stitch Iteration 2 Directives

## Palette Pivot (Q1 answer)
- PRIMARY: `#2D3748` (Brand Slate) — headings, nav, wordmark, footer
- ACCENT: `#C9A96E` (Warm Gold) — CTAs, highlights, dividers
- HEALTH: `#7A9A7E` (Sage) — status indicators, tags, badges
- BACKGROUND: `#FFFDF9` (Paper) — page surface
- SECONDARY BG: `#F5F0E8` (Cream) — section alternation
- REMOVE: Deep Teal `#0F4C5C` as primary — demote to section accent only

CSS update needed:
```css
--primary: #2D3748;
--accent: #C9A96E;
--background: #FFFDF9;
--muted: #F5F0E8;
--muted-foreground: #2D3748;
```

## Product Names (Q2 answer)
- UI copy: "Qi Master" / "Qi Mini" (short names)
- JSON-LD/SEO: full product names
- Never abbreviate to "QM" or "the bed"

## Brand Voice (Q3 answer)
- Replace ALL "ancient Qi wisdom" → "Qi-driven performance technology"
- Keep "Qi" — it's in the product names
- Drop "ancient" — conflicts with sporty/modern tone

## Vortex SVG (Q4 answer)
- KEEP the spiral vortex pattern
- Use Brand Slate #2D3748 at 5-8% opacity on Paper backgrounds
- This IS the brand signature — reinforce it

## CTA Improvement (NavOps recommendation)
Current hero CTA: "Discover the Qi Master" (exploratory)
Better: "Book Your Recovery Session →" (action-oriented)
Add secondary: "WhatsApp Arie" with green WhatsApp CTA

## Missing Section: Social Proof
Add between Technology explainer and AI Consultant:
- 2-3 testimonial quotes from golfers
- "100+ sessions delivered at KRPM" stat
- Photos of real treatment room (use brand-guideline-product.png)

## Priority for Iteration 2
1. Palette pivot (Slate primary, Gold accent)
2. CTA improvement (Book Session + WhatsApp)
3. "ancient" → "Qi-driven" language sweep
4. Social proof section stub

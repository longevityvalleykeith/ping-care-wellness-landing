# BMW Wellness Landing Page

## 美康养身 Beauty Meridian Wellness

A premium landing page for BMW Wellness social health center in Cheras, Malaysia.

## Deployment Instructions

### Option 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New Project"
3. Import the GitHub repository: `longevityvalleykeith/bmw-wellness-landing`
4. Vercel will auto-detect the framework (Vite)
5. Override settings if needed:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm i -g vercel@latest
vercel login
cd bmw-wellness-landing
vercel --prod
```

## Tech Stack

- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI + shadcn/ui
- **Animation**: Framer Motion
- **Routing**: Wouter

## BMW Wellness Brand Assets

The landing page uses the following brand assets from Supabase:

- `brand-assets/bmw-wellness/bmw-experience-1.jpg` - Hero image
- `brand-assets/bmw-wellness/bmw-experience-2.jpg` - Capsule feature
- `brand-assets/bmw-wellness/bmw-experience-3.jpg` - Services
- `brand-assets/bmw-wellness/logo.png` - BMW logo

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | #0F1B2E | Primary backgrounds, text |
| Teal | #2E8B7A | Accent, CTAs |
| Gold | #C9A96E | Secondary accents |
| Cream | #F5F0E8 | Background |

## Key Features

- Hero section showcasing 12-in-1 Bio-Physics Energy Capsule Chamber
- Two service cards: 12-in-1 Capsule + Bio-resonance Scan
- About section with 美康养身 branding
- Contact section with WhatsApp and Telegram CTAs
- BMW AI assistant identity

## Contact

- **WhatsApp**: 011 703 21128
- **Telegram**: @BMW_Wellness_Bot
- **Address**: 11, Jalan 4/92B, Taman Kobena, Cheras, Malaysia

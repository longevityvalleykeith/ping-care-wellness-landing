import type { BookingEmbed } from "./booking-embed";
import { CONTACT, PRACTICE, SERVICES } from "./practice";

// Built into index.html at build time, so crawlers and agents that do not run
// JavaScript still read the practice facts. States only what the page states:
// no ratings, no "verified" claims.
export function practiceJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: PRACTICE.name,
    alternateName: PRACTICE.nameZh,
    url: PRACTICE.url,
    logo: PRACTICE.logoUrl,
    telephone: CONTACT.phoneE164,
    areaServed: PRACTICE.serviceArea.map((name) => ({ "@type": "AdministrativeArea", name })),
    founder: {
      "@type": "Person",
      name: PRACTICE.practitioner,
      jobTitle: "Licensed Integrative Physiotherapist",
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional registration",
        name: PRACTICE.registration,
      },
    },
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      name: s.name,
      description: s.summary,
    })),
  };
}

// The page's own Content-Security-Policy. frame-src opens to exactly one
// Calendesk origin, and only when the booking embed is switched on.
// frame-ancestors cannot be set from a meta tag; vercel.json sends it.
export function contentSecurityPolicy(embed: BookingEmbed): string {
  const logoOrigin = new URL(PRACTICE.logoUrl).origin;
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    `img-src 'self' data: ${logoOrigin}`,
    "connect-src 'self'",
    `frame-src ${embed.kind === "on" ? embed.origin : "'none'"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

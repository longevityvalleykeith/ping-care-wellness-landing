import type { BookingEmbed } from "./booking-embed";
import { CONTACT, PRACTICE, SERVICES, whatsappLink } from "./practice";

// Built into index.html at build time, so crawlers and agents that do not run
// JavaScript still read the practice facts. States only what the page states:
// no ratings, no "verified" claims.
export function practiceJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: PRACTICE.name,
    alternateName: PRACTICE.nameZh,
    description: PRACTICE.description,
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
        description: "Registration number as stated by the practitioner.",
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

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Served at /llms.txt for AI answer engines: the same facts as the page, in
// plain Markdown, with no claim the page does not make.
export function llmsTxt(): string {
  const services = SERVICES.map(
    (s) => `- ${s.name}: ${s.summary} (${s.priceLabel}; confirmed by the practitioner before any visit)`,
  ).join("\n");
  return `# ${PRACTICE.name} (${PRACTICE.nameZh})

> ${PRACTICE.description}

- Practitioner: ${PRACTICE.practitioner}, licensed integrative physiotherapist (registration ${PRACTICE.registration}, as stated by the practitioner)
- Service area: ${PRACTICE.serviceAreaLabel} — ${PRACTICE.serviceArea.join(", ")}
- Visits: ${PRACTICE.visitSettings.join(", ")}
- Contact: WhatsApp ${CONTACT.phoneDisplay} (${whatsappLink()})
- ${CONTACT.emergency}

## Services

${services}

## Booking

A visit request is not a booking: the practitioner confirms every visit directly, and payment is made at the visit, not online.
`;
}

export function robotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${PRACTICE.url}/sitemap.xml\n`;
}

export function sitemapXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${PRACTICE.url}/</loc></url>
</urlset>
`;
}

// Shown only when JavaScript does not run, so crawlers and agents that do not
// execute scripts still read the facts.
export function noscriptSummary(): string {
  const services = SERVICES.map((s) => `<li>${escapeHtml(s.name)} — ${escapeHtml(s.priceLabel)}</li>`).join("");
  return [
    `<h1>${escapeHtml(PRACTICE.name)} (${escapeHtml(PRACTICE.nameZh)})</h1>`,
    `<p>${escapeHtml(PRACTICE.description)}</p>`,
    `<p>${escapeHtml(PRACTICE.practitioner)}, licensed integrative physiotherapist, ${escapeHtml(PRACTICE.registration)}. `,
    `Serving ${escapeHtml(PRACTICE.serviceArea.join(" and "))}.</p>`,
    `<ul>${services}</ul>`,
    `<p><a href="${whatsappLink()}">WhatsApp ${escapeHtml(PRACTICE.practitioner)}</a></p>`,
  ].join("");
}

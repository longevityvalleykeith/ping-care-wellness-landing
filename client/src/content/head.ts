import type { BookingEmbed } from "./booking-embed";
import { slugify } from "./areas";
import { paymentStatement, partnerOfferFacts, type PartnerOffer } from "./partner-offer";
import {
  CONTACT,
  GETTING_THERE,
  PRACTICE,
  PRACTITIONER_LINE,
  SERVICES,
  whatsappLink,
} from "./practice";

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
      jobTitle: "Integrative Physiotherapist",
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

// The page's own Content-Security-Policy. Fonts and styles are self-hosted, so
// no third-party style or font origin is allowed. frame-src opens to exactly one
// Calendesk origin, and only when the booking embed is switched on.
// frame-ancestors cannot be set from a meta tag; vercel.json sends it.
export function contentSecurityPolicy(embed: BookingEmbed): string {
  const logo = new URL(PRACTICE.logoUrl, PRACTICE.url);
  const imgSrc = logo.origin === new URL(PRACTICE.url).origin ? "'self' data:" : `'self' data: ${logo.origin}`;
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    `img-src ${imgSrc}`,
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
export function llmsTxt(offer: PartnerOffer = { kind: "off" }): string {
  const services = SERVICES.map(
    (s) => `- ${s.name}: ${s.summary} (${s.priceLabel}; confirmed by the practitioner before any visit)`,
  ).join("\n");
  return `# ${PRACTICE.name} (${PRACTICE.nameZh})

> ${PRACTICE.description}

- Practitioner: ${PRACTITIONER_LINE}
- Service area: ${PRACTICE.serviceAreaLabel} — ${PRACTICE.serviceArea.join(", ")}
- Visits: ${PRACTICE.visitSettings.join(", ")}
- Contact: WhatsApp ${CONTACT.phoneDisplay} (${whatsappLink()})
- ${CONTACT.emergency}

## Services

${services}

## Getting there

${GETTING_THERE.map((line) => `- ${line}`).join("\n")}

## Booking

A visit request is not a booking: the practitioner confirms every visit directly. ${paymentStatement(offer)}
${offerSection(offer)}`;
}

function offerSection(offer: PartnerOffer): string {
  const facts = partnerOfferFacts(offer);
  if (facts.length === 0) return "";
  return `\n## Partner voucher\n\n${facts.map((line) => `- ${line}`).join("\n")}\n`;
}

export function robotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${PRACTICE.url}/sitemap.xml\n`;
}

export function sitemapXml(): string {
  const areas = PRACTICE.districts.map((d) => `\n  <url><loc>${PRACTICE.url}/areas/${slugify(d)}.html</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${PRACTICE.url}/</loc></url>${areas}
</urlset>
`;
}

// Shown only when JavaScript does not run, so crawlers and agents that do not
// execute scripts still read the facts.
export function noscriptSummary(offer: PartnerOffer = { kind: "off" }): string {
  const services = SERVICES.map((s) => `<li>${escapeHtml(s.name)} — ${escapeHtml(s.priceLabel)}</li>`).join("");
  const facts = partnerOfferFacts(offer);
  return [
    `<h1>${escapeHtml(PRACTICE.name)} (${escapeHtml(PRACTICE.nameZh)})</h1>`,
    `<p>${escapeHtml(PRACTICE.description)}</p>`,
    `<p>${escapeHtml(PRACTITIONER_LINE)}. `,
    `Serving ${escapeHtml(PRACTICE.serviceArea.join(" and "))}.</p>`,
    `<ul>${services}</ul>`,
    `<p>${escapeHtml(paymentStatement(offer))}</p>`,
    facts.length ? `<ul>${facts.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` : "",
    `<p><a href="${whatsappLink()}">WhatsApp ${escapeHtml(PRACTICE.practitioner)}</a></p>`,
    // Ping Care is not an emergency service: the no-JavaScript reader gets the
    // same 999 line the page, llms.txt and get_contact_options carry (GRADE-R4).
    `<p>${escapeHtml(CONTACT.emergency)}</p>`,
  ].join("");
}

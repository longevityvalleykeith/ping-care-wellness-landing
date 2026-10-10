import { describe, expect, it } from "vitest";
import { llmsTxt, noscriptSummary, practiceJsonLd, robotsTxt, sitemapXml } from "@/content/head";
import { PRACTICE, SERVICES } from "@/content/practice";
import { PARTNER_OFFER_TERMS, resolvePartnerOffer } from "@/content/partner-offer";
import { areaPages } from "@/content/areas";

// The machine-readable surface (crawlers, answer engines, agents without
// JavaScript) must carry the practice facts and nothing the page does not state.
const surfaces = {
  llms: llmsTxt(),
  noscript: noscriptSummary(),
  jsonld: JSON.stringify(practiceJsonLd()),
};

describe("machine-readable surface", () => {
  it.each(Object.entries(surfaces))("%s names the practice, practitioner, registration and area", (_name, text) => {
    for (const fact of [PRACTICE.name, PRACTICE.practitioner, PRACTICE.registration, ...PRACTICE.serviceArea]) {
      expect(text).toContain(fact);
    }
  });

  it.each(Object.entries(surfaces))("%s lists every service", (_name, text) => {
    for (const s of SERVICES) expect(text).toContain(s.name.replace("&", text === surfaces.noscript ? "&amp;" : "&"));
  });

  it.each(Object.entries(surfaces))("%s makes no outcome, rating, verification or availability claim", (_name, text) => {
    expect(text).not.toMatch(/aggregateRating|review|verified|guarantee|cure|24\/7|results/i);
  });

  it.each(Object.entries(surfaces))("%s carries no Telegram or LV backend link", (_name, text) => {
    expect(text).not.toMatch(/telegram|t\.me\/|longevityvalley/i);
  });

  it("JSON-LD has a description and the canonical url", () => {
    const ld = practiceJsonLd();
    expect(typeof ld.description).toBe("string");
    expect(ld.url).toBe(PRACTICE.url);
  });

  it("robots.txt allows crawling and points at the sitemap", () => {
    expect(robotsTxt()).toMatch(/^User-agent: \*\nAllow: \/\n/);
    expect(robotsTxt()).toContain(`Sitemap: ${PRACTICE.url}/sitemap.xml`);
  });

  it("sitemap.xml lists the canonical home page", () => {
    expect(sitemapXml()).toContain(`<loc>${PRACTICE.url}/</loc>`);
  });

  it("the noscript summary is escaped HTML with a WhatsApp link", () => {
    expect(surfaces.noscript).not.toMatch(/<script/i);
    expect(surfaces.noscript).toContain("https://wa.me/60182905768");
  });
});

// GRADE-R2 P2-C: llms.txt, the no-script summary and the page carry the same
// payment and offer facts, and the two payment statements never meet.
describe("payment and partner offer on the machine surface", () => {
  const live = resolvePartnerOffer(
    {
      url: "https://app.longevityvalley.ai/offers/pc-50",
      id: "pc-50",
      expires: "2026-12-31",
      checkout: "https://app.longevityvalley.ai/book/ping-care/first-visit",
    },
    new Date("2026-10-10T00:00:00Z"),
  );

  it("offer off: pay at the visit, not online, and no voucher anywhere", () => {
    for (const text of [llmsTxt(), noscriptSummary()]) {
      expect(text).toContain("Visits are paid at the visit, not online.");
      expect(text).not.toMatch(/voucher|longevityvalley/i);
    }
  });

  it("offer on: the conditional statement and the same offer facts, never 'not online'", () => {
    for (const text of [llmsTxt(live), noscriptSummary(live)]) {
      expect(text).not.toMatch(/not online/);
      expect(text).toContain("your first booking can be paid online on Longevity Valley to earn the partner voucher");
      expect(text).toContain("https://app.longevityvalley.ai/book/ping-care/first-visit");
      expect(text).toContain("https://app.longevityvalley.ai/offers/pc-50");
      expect(text).toContain(PARTNER_OFFER_TERMS.headline);
      expect(text).toContain(PARTNER_OFFER_TERMS.eligibility);
      expect(text).toContain("31 December 2026");
    }
    expect(llmsTxt(live)).toContain("## Partner voucher");
  });
});

// GRADE-R2 P3: the registration is as stated by the practitioner, never "licensed".
describe("credential hedge on every machine surface", () => {
  const areas = areaPages(["Petaling Jaya"]).map((p) => p.html).join("\n");
  it.each(Object.entries({ ...surfaces, areas }))("%s says 'as stated by the practitioner' and never 'licensed'", (_name, text) => {
    expect(text).not.toMatch(/licen[cs]ed/i);
    if (_name !== "jsonld") expect(text).toContain("as stated by the practitioner");
  });
});

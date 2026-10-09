import { describe, expect, it } from "vitest";
import { llmsTxt, noscriptSummary, practiceJsonLd, robotsTxt, sitemapXml } from "@/content/head";
import { PRACTICE, SERVICES } from "@/content/practice";

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

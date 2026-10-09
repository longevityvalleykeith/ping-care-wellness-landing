import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { resolveBookingEmbed, resolvePrivacyNotice } from "./client/src/content/booking-embed";
import {
  contentSecurityPolicy,
  llmsTxt,
  noscriptSummary,
  practiceJsonLd,
  robotsTxt,
  sitemapXml,
} from "./client/src/content/head";
import { areaPages } from "./client/src/content/areas";
import { resolvePartnerOffer } from "./client/src/content/partner-offer";
import { PRACTICE } from "./client/src/content/practice";

// Writes the CSP meta tag, canonical link, JSON-LD block and a no-JavaScript
// summary into the built index.html, and emits robots.txt, sitemap.xml and
// llms.txt — all from the content module.
// Build only: the dev server needs inline scripts for hot reload.
function practiceHead(env: Record<string, string>): Plugin {
  const embed = resolveBookingEmbed(env.VITE_PC_BOOKING_EMBED_URL);
  if (embed.kind === "refused") {
    throw new Error(`VITE_PC_BOOKING_EMBED_URL refused: ${embed.reason}`);
  }
  const notice = resolvePrivacyNotice(embed, env.VITE_PC_PRIVACY_NOTICE_URL);
  if (!notice.ok) throw new Error(`VITE_PC_PRIVACY_NOTICE_URL refused: ${notice.reason}`);
  const offer = resolvePartnerOffer({
    url: env.VITE_PC_PARTNER_OFFER_URL,
    id: env.VITE_PC_PARTNER_OFFER_ID,
    expires: env.VITE_PC_PARTNER_OFFER_EXPIRES,
  });
  if (offer.kind === "refused") throw new Error(`VITE_PC_PARTNER_OFFER refused: ${offer.reason}`);
  return {
    name: "practice-head",
    apply: "build",
    generateBundle() {
      for (const [fileName, source] of [
        ["robots.txt", robotsTxt()],
        ["sitemap.xml", sitemapXml()],
        ["llms.txt", llmsTxt()],
      ]) {
        this.emitFile({ type: "asset", fileName, source });
      }
      for (const page of areaPages(PRACTICE.districts)) {
        this.emitFile({ type: "asset", fileName: page.fileName, source: page.html });
      }
    },
    transformIndexHtml() {
      return [
        {
          tag: "link",
          attrs: { rel: "canonical", href: `${PRACTICE.url}/` },
          injectTo: "head",
        },
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: contentSecurityPolicy(embed) },
          injectTo: "head-prepend",
        },
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: JSON.stringify(practiceJsonLd()).replace(/</g, "\\u003c"),
          injectTo: "head",
        },
        {
          tag: "noscript",
          children: noscriptSummary(),
          injectTo: "body-prepend",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const root = import.meta.dirname;
  const env = loadEnv(mode, root, "VITE_");
  return {
    plugins: [react(), tailwindcss(), practiceHead(env)],
    resolve: {
      alias: {
        "@": path.resolve(root, "client", "src"),
      },
    },
    envDir: root,
    root: path.resolve(root, "client"),
    build: {
      outDir: path.resolve(root, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});

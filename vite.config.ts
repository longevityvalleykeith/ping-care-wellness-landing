import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { resolveBookingEmbed } from "./client/src/content/booking-embed";
import { contentSecurityPolicy, practiceJsonLd } from "./client/src/content/head";

// Writes the JSON-LD block and the CSP meta tag into the built index.html.
// Build only: the dev server needs inline scripts for hot reload.
function practiceHead(env: Record<string, string>): Plugin {
  const embed = resolveBookingEmbed(env.VITE_PC_BOOKING_EMBED_URL);
  if (embed.kind === "refused") {
    throw new Error(`VITE_PC_BOOKING_EMBED_URL refused: ${embed.reason}`);
  }
  return {
    name: "practice-head",
    apply: "build",
    transformIndexHtml() {
      return [
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

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Source guard over everything the page ships: client/src (minus tests and the
// unused shadcn kit), client/index.html, vite.config.ts and vercel.json.
const repo = resolve(__dirname, "../../..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return entry === "__tests__" || entry === "ui" ? [] : sourceFiles(path);
    }
    return /\.(tsx?|css|html)$/.test(entry) ? [path] : [];
  });
}

const shipped = [
  ...sourceFiles(join(repo, "client/src")),
  join(repo, "client/index.html"),
  join(repo, "vite.config.ts"),
  join(repo, "vercel.json"),
].map((path) => ({ path: path.slice(repo.length + 1), text: readFileSync(path, "utf8") }));

const banned: Array<[string, RegExp]> = [
  ["Telegram chatbot", /telegram|t\.me\/|Ping_Care_Bot/i],
  ["AI-generated visual graphics", /hero-physio|ai-assistant-247|medical-escort\.png|emmett-technique\.png|telegram-qr/],
  ["Manus editor runtime", /manus/i],
  ["LV's backend WebMCP script (anonymous health-data tools)", /webmcp\.js|app\.longevityvalley\.ai/],
  ["unbacked PDPA claim", /PDPA Compliant/i],
  ["round-the-clock availability claim", /24\/7|day or night/i],
  ["placeholder analytics script", /%VITE_ANALYTICS/],
];

describe("shipped source", () => {
  it.each(banned)("contains no %s", (_label, pattern) => {
    const hits = shipped.filter((f) => pattern.test(f.text)).map((f) => f.path);
    expect(hits).toEqual([]);
  });

  it("lets visitors zoom", () => {
    const html = shipped.find((f) => f.path === "client/index.html")!.text;
    expect(html).not.toMatch(/maximum-scale|user-scalable=no/);
  });
});

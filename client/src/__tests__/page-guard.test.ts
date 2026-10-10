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
  ["LV's backend WebMCP script or tool endpoints (anonymous health-data tools)", /webmcp\.js|\/api\/(gateway|mcp)\b/],
  ["unbacked PDPA claim", /PDPA Compliant/i],
  ["round-the-clock availability claim", /24\/7|day or night/i],
  ["placeholder analytics script", /%VITE_ANALYTICS/],
  // GRADE-R2 P3: the registration is as stated by the practitioner, never "licensed".
  ["unhedged licence claim", /licen[cs]ed/i],
  // GRADE-R2 P3: fonts and styles are self-hosted.
  ["third-party font or style origin", /fonts\.googleapis\.com|fonts\.gstatic\.com/],
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

// GRADE-R3 P3: the self-hosted fonts ship with their licence text beside them.
describe("self-hosted fonts", () => {
  const fontsDir = join(repo, "client/public/fonts");
  const woff2 = readdirSync(fontsDir).filter((f) => f.endsWith(".woff2"));

  it("are only Manrope and Montserrat", () => {
    expect(woff2.length).toBeGreaterThan(0);
    expect(woff2.filter((f) => !/^(manrope|montserrat)-/.test(f))).toEqual([]);
  });

  it("ship the SIL Open Font License text, with each family's copyright line, next to the woff2 files", () => {
    const ofl = readFileSync(join(fontsDir, "OFL.txt"), "utf8");
    expect(ofl).toMatch(/SIL Open Font License, Version 1\.1/);
    expect(ofl).toMatch(/Copyright .* The Manrope Project Authors/);
    expect(ofl).toMatch(/Copyright .* The Montserrat\.Git Project Authors/);
    expect(ofl).toMatch(/PERMISSION & CONDITIONS/);
  });
});

// The guard for every link this page sends a guest to on Longevity Valley: the
// partner voucher's claim page and the first-booking checkout. A guest confirms
// on a page a person reads, never on an LV API or tool endpoint.
// This module reads no environment itself, so the build config can use it too.

// LV's verified receipt path (Keith, 2026-10-10). Exact hostnames only: the
// WHATWG parser lower-cases the host and strips a default port, so look-alikes,
// a trailing dot or "www." never match.
export const LV_PAGE_HOSTS: ReadonlySet<string> = new Set([
  "app.longevityvalley.ai",
  "api.longevityvalley.ai",
]);

export type LvPageUrl = { ok: true; url: string } | { ok: false; reason: string };

// Decodes percent-escapes until the path stops changing, so "/%61pi" and
// "/%2561pi" read as "/api". Returns null when the escapes do not decode or
// keep nesting, which the guard refuses.
function decodedPath(pathname: string): string | null {
  let path = pathname;
  for (let round = 0; round < 4; round++) {
    let next: string;
    try {
      next = decodeURIComponent(path);
    } catch {
      return null;
    }
    if (next === path) return path;
    path = next;
  }
  return null;
}

// The path a server would most likely route: decoded, lower-cased, backslashes
// read as slashes, repeated slashes collapsed. "/API", "/%61pi" and "//api" all
// become "/api".
export function normalisedPath(pathname: string): string | null {
  const decoded = decodedPath(pathname);
  if (decoded === null) return null;
  return decoded.replace(/\\/g, "/").toLowerCase().replace(/\/{2,}/g, "/");
}

// Plain page paths only: letters, digits, "-", "_", "~" and single dots inside a
// segment. No dot segments, no encoded control characters, no spaces.
const PAGE_PATH = /^(\/[a-z0-9_~-]+(\.[a-z0-9_~-]+)*)*\/?$/;

export function resolveLvPageUrl(raw: string | undefined, label: string): LvPageUrl {
  const value = raw?.trim();
  if (!value) return { ok: false, reason: `${label} missing` };

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { ok: false, reason: `${label} is not a URL` };
  }
  if (url.protocol !== "https:") return { ok: false, reason: `${label} must be https` };
  if (!LV_PAGE_HOSTS.has(url.hostname)) {
    return { ok: false, reason: `${label} must be on LV's verified receipt path` };
  }
  if (url.search || url.hash || value.includes("?") || value.includes("#")) {
    return { ok: false, reason: `${label} must carry no query or fragment` };
  }
  if (url.port || url.username || url.password) {
    return { ok: false, reason: `${label} must carry no port or credentials` };
  }

  const path = normalisedPath(url.pathname);
  if (path === null || !PAGE_PATH.test(path)) {
    return { ok: false, reason: `${label} path must be a plain page path` };
  }
  const firstSegment = path.split("/").find(Boolean);
  if (firstSegment === "api") {
    return { ok: false, reason: `${label} cannot be an LV tool endpoint` };
  }
  return { ok: true, url: url.toString() };
}

// Ping Care's partner voucher, as Keith ruled it (2026-10-10): a guest aged 55+
// whose first online booking is paid in full online earns an LV-minted voucher
// for 50% off one session with another LV CARE partner. LV mints the voucher
// from its own payment receipt and the guest claims it on LV's verified receipt
// path. This page only shows the offer and links to that path: it never mints,
// claims or charges anything.

export const PARTNER_OFFER_TERMS = {
  headline: "50% off one session with another LV CARE partner",
  eligibility: "For seniors aged 55 and above.",
  earn: "Earned when your first online booking with Ping Care is paid in full online.",
  limit: "One voucher per guest. Each partner's own catalogue terms apply.",
  issuer: "Issued by Longevity Valley after your payment is recorded; you claim it on Longevity Valley's page.",
} as const;

// LV's verified receipt path (Keith, 2026-10-10).
const CLAIM_HOSTS = new Set(["app.longevityvalley.ai", "api.longevityvalley.ai"]);

export type PartnerOffer =
  | { kind: "off" }
  | { kind: "refused"; reason: string }
  | { kind: "live"; claimUrl: string; id: string; expires: string };

export function resolvePartnerOffer(
  raw: { url?: string; id?: string; expires?: string },
  today: Date = new Date(),
): PartnerOffer {
  const value = raw.url?.trim();
  if (!value) return { kind: "off" };

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { kind: "refused", reason: "claim page is not a URL" };
  }
  if (url.protocol !== "https:") return { kind: "refused", reason: "claim page must be https" };
  if (!CLAIM_HOSTS.has(url.hostname)) {
    return { kind: "refused", reason: "claim page must be on LV's verified receipt path" };
  }
  // The guest confirms on a page a person reads, never on an API or tool endpoint.
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    return { kind: "refused", reason: "claim page cannot be an LV tool endpoint" };
  }
  if (url.search || url.hash) return { kind: "refused", reason: "claim link must carry no query or fragment" };
  if (url.port || url.username || url.password) {
    return { kind: "refused", reason: "claim link must carry no port or credentials" };
  }

  const id = raw.id?.trim();
  if (!id) return { kind: "refused", reason: "offer id missing" };
  const expires = raw.expires?.trim();
  if (!expires) return { kind: "refused", reason: "expiry missing" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expires)) return { kind: "refused", reason: "expiry must be YYYY-MM-DD" };
  if (new Date(`${expires}T23:59:59+08:00`) < today) return { kind: "refused", reason: "offer has expired" };

  return { kind: "live", claimUrl: url.toString(), id, expires };
}

// Formats a YYYY-MM-DD date as written, independent of the viewer's time zone.
export function formatOfferDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Ping Care's partner voucher, as Keith ruled it (2026-10-10): a guest aged 55+
// whose first online booking is paid in full online earns an LV-minted voucher
// for 50% off one session with another LV CARE partner. LV mints the voucher
// from its own payment receipt and the guest claims it on LV's verified receipt
// path. This page only shows the offer and links to LV's checkout and claim
// pages: it never mints, claims or charges anything.
//
// The offer can only be switched on together with LV's first-booking checkout
// (VITE_PC_FIRST_BOOKING_CHECKOUT_URL). That checkout does not exist yet, so the
// build refuses the offer until it does: nobody can publish a voucher that
// cannot be earned.

import { resolveLvPageUrl } from "./lv-page-url";

export const PARTNER_OFFER_TERMS = {
  headline: "50% off one session with another LV CARE partner",
  eligibility: "For seniors aged 55 and above.",
  earn: "Earned when your first online booking with Ping Care is paid in full on Longevity Valley's checkout.",
  limit: "One voucher per guest. Each partner's own catalogue terms apply.",
  issuer: "Issued by Longevity Valley after your payment is recorded; you claim it on Longevity Valley's page.",
} as const;

// The furthest an offer may run from the day it is built.
export const MAX_OFFER_DAYS = 366;
const DAY_MS = 24 * 60 * 60 * 1000;

export type PartnerOffer =
  | { kind: "off" }
  | { kind: "refused"; reason: string }
  | { kind: "live"; claimUrl: string; checkoutUrl: string; id: string; expires: string };

// A YYYY-MM-DD string that names a real calendar day, or null.
function calendarDay(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const utc = Date.UTC(year, month - 1, day);
  return new Date(utc).toISOString().slice(0, 10) === value ? utc : null;
}

export function resolvePartnerOffer(
  raw: { url?: string; id?: string; expires?: string; checkout?: string },
  today: Date = new Date(),
): PartnerOffer {
  if (!raw.url?.trim()) return { kind: "off" };

  const claim = resolveLvPageUrl(raw.url, "claim page");
  if (!claim.ok) return { kind: "refused", reason: claim.reason };
  const checkout = resolveLvPageUrl(raw.checkout, "first-booking checkout");
  if (!checkout.ok) return { kind: "refused", reason: checkout.reason };

  const id = raw.id?.trim();
  if (!id) return { kind: "refused", reason: "offer id missing" };
  const expires = raw.expires?.trim();
  if (!expires) return { kind: "refused", reason: "expiry missing" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expires)) return { kind: "refused", reason: "expiry must be YYYY-MM-DD" };
  const expiryDay = calendarDay(expires);
  if (expiryDay === null) return { kind: "refused", reason: "expiry is not a real calendar date" };
  if (new Date(`${expires}T23:59:59+08:00`) < today) return { kind: "refused", reason: "offer has expired" };
  const buildDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (expiryDay - buildDay > MAX_OFFER_DAYS * DAY_MS) {
    return { kind: "refused", reason: `expiry must be within ${MAX_OFFER_DAYS} days of the build` };
  }

  return { kind: "live", claimUrl: claim.url, checkoutUrl: checkout.url, id, expires };
}

// What the page, llms.txt, the no-script summary and the agent tool say about
// payment. One sentence per mode, so the surfaces cannot contradict each other.
export function paymentStatement(offer: PartnerOffer): string {
  return offer.kind === "live"
    ? "Visits are paid at the visit; your first booking can be paid online on Longevity Valley to earn the partner voucher."
    : "Visits are paid at the visit, not online.";
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

// The offer's facts as plain lines, for llms.txt and the no-script summary, so
// agents and page readers get the same facts as the card. Empty when off.
export function partnerOfferFacts(offer: PartnerOffer): string[] {
  if (offer.kind !== "live") return [];
  return [
    `Partner voucher: ${PARTNER_OFFER_TERMS.headline}.`,
    PARTNER_OFFER_TERMS.eligibility,
    PARTNER_OFFER_TERMS.earn,
    PARTNER_OFFER_TERMS.limit,
    PARTNER_OFFER_TERMS.issuer,
    `Pay for your first booking on Longevity Valley: ${offer.checkoutUrl}`,
    `Claim the voucher on Longevity Valley: ${offer.claimUrl}`,
    `Offer ends ${formatOfferDate(offer.expires)}.`,
  ];
}

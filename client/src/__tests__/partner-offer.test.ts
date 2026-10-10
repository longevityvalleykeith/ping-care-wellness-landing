import { describe, expect, it, vi } from "vitest";
import { PARTNER_OFFER_TERMS, paymentStatement, resolvePartnerOffer } from "@/content/partner-offer";
import { createTools } from "@/webmcp/tools";

const TODAY = new Date("2026-10-10T00:00:00Z");
const CHECKOUT = "https://app.longevityvalley.ai/book/ping-care/first-visit";
const good = {
  url: "https://app.longevityvalley.ai/offers/pc-50",
  id: "pc-50",
  expires: "2026-12-31",
  checkout: CHECKOUT,
};

describe("resolvePartnerOffer", () => {
  it("is off until LV publishes an offer", () => {
    expect(resolvePartnerOffer({}, TODAY)).toEqual({ kind: "off" });
    expect(resolvePartnerOffer({ checkout: CHECKOUT }, TODAY)).toEqual({ kind: "off" });
  });

  it.each([
    [{ ...good, url: "http://app.longevityvalley.ai/offers/pc-50" }, "claim page must be https"],
    [{ ...good, url: "https://evil.example/offers/pc-50" }, "claim page must be on LV's verified receipt path"],
    [{ ...good, url: "https://book.longevityvalley.ai/offers/pc-50" }, "claim page must be on LV's verified receipt path"],
    [{ ...good, url: "https://app.longevityvalley.ai.evil.example/offers/pc-50" }, "claim page must be on LV's verified receipt path"],
    [{ ...good, url: "https://app.longevityvalley.ai/api/gateway/webmcp.js" }, "claim page cannot be an LV tool endpoint"],
    [{ ...good, url: "https://api.longevityvalley.ai/api/mcp" }, "claim page cannot be an LV tool endpoint"],
    [{ ...good, url: "https://app.longevityvalley.ai/offers/pc-50?phone=0123" }, "claim page must carry no query or fragment"],
    [{ ...good, url: "https://app.longevityvalley.ai:8443/offers/pc-50" }, "claim page must carry no port or credentials"],
    [{ ...good, id: "" }, "offer id missing"],
    [{ ...good, expires: "" }, "expiry missing"],
    [{ ...good, expires: "31/12/2026" }, "expiry must be YYYY-MM-DD"],
    [{ ...good, expires: "2026-10-01" }, "offer has expired"],
  ])("refuses %o", (input, reason) => {
    expect(resolvePartnerOffer(input, TODAY)).toEqual({ kind: "refused", reason });
  });

  // GRADE-R2 P3: the "/api" rule cannot be dodged by case, escapes or extra slashes.
  it.each([
    "https://app.longevityvalley.ai/API/gateway/x",
    "https://app.longevityvalley.ai/Api",
    "https://app.longevityvalley.ai/%61pi/gateway/x",
    "https://app.longevityvalley.ai/%2561pi/gateway/x",
    "https://app.longevityvalley.ai//api/gateway/x",
    "https://app.longevityvalley.ai///API//mcp",
    "https://app.longevityvalley.ai/%2Fapi/mcp",
    "https://app.longevityvalley.ai/%5Capi/mcp",
  ])("refuses the tool endpoint in disguise %s", (url) => {
    expect(resolvePartnerOffer({ ...good, url }, TODAY)).toEqual({
      kind: "refused",
      reason: "claim page cannot be an LV tool endpoint",
    });
  });

  it.each([
    "https://app.longevityvalley.ai/offers/%252e%252e/x",
    "https://app.longevityvalley.ai/offers/%E0%A4%A",
    "https://app.longevityvalley.ai/offers/a%20b",
    "https://app.longevityvalley.ai/offers/%00",
  ])("refuses a path that is not a plain page path: %s", (url) => {
    expect(resolvePartnerOffer({ ...good, url }, TODAY)).toEqual({
      kind: "refused",
      reason: "claim page path must be a plain page path",
    });
  });

  it("refuses an empty query too", () => {
    expect(resolvePartnerOffer({ ...good, url: "https://app.longevityvalley.ai/offers/pc-50?" }, TODAY)).toEqual({
      kind: "refused",
      reason: "claim page must carry no query or fragment",
    });
  });

  // GRADE-R2 P3: a real calendar date, at most a year ahead.
  it.each([
    ["2026-13-45", "expiry is not a real calendar date"],
    ["2026-02-30", "expiry is not a real calendar date"],
    ["2027-02-29", "expiry is not a real calendar date"],
    ["2026-00-10", "expiry is not a real calendar date"],
    ["9999-12-31", "expiry must be within 366 days of the build"],
    ["2027-10-12", "expiry must be within 366 days of the build"],
  ])("refuses expiry %s", (expires, reason) => {
    expect(resolvePartnerOffer({ ...good, expires }, TODAY)).toEqual({ kind: "refused", reason });
  });

  it("accepts an expiry exactly 366 days after the build day, and a leap day", () => {
    expect(resolvePartnerOffer({ ...good, expires: "2027-10-11" }, TODAY).kind).toBe("live");
    expect(resolvePartnerOffer({ ...good, expires: "2027-02-28" }, TODAY).kind).toBe("live");
    expect(resolvePartnerOffer({ ...good, expires: "2028-02-29" }, new Date("2027-06-01T00:00:00Z")).kind).toBe("live");
  });

  // GRADE-R2 P2-C: the offer cannot be on without LV's first-booking checkout.
  it.each([
    [undefined, "first-booking checkout missing"],
    ["", "first-booking checkout missing"],
    ["http://app.longevityvalley.ai/book", "first-booking checkout must be https"],
    ["https://pay.example/checkout", "first-booking checkout must be on LV's verified receipt path"],
    ["https://app.longevityvalley.ai/api/checkout", "first-booking checkout cannot be an LV tool endpoint"],
    ["https://app.longevityvalley.ai/%41PI/checkout", "first-booking checkout cannot be an LV tool endpoint"],
    ["https://app.longevityvalley.ai/book?offer=pc-50", "first-booking checkout must carry no query or fragment"],
    ["https://app.longevityvalley.ai/book#pay", "first-booking checkout must carry no query or fragment"],
    ["https://app.longevityvalley.ai:444/book", "first-booking checkout must carry no port or credentials"],
    ["https://u:p@app.longevityvalley.ai/book", "first-booking checkout must carry no port or credentials"],
  ])("refuses checkout %s", (checkout, reason) => {
    expect(resolvePartnerOffer({ ...good, checkout }, TODAY)).toEqual({ kind: "refused", reason });
  });

  it.each(["app", "api"])("is live on %s.longevityvalley.ai with a clean claim link, the checkout, the id and the expiry", (sub) => {
    expect(resolvePartnerOffer({ ...good, url: `https://${sub}.longevityvalley.ai/offers/pc-50` }, TODAY)).toEqual({
      kind: "live",
      claimUrl: `https://${sub}.longevityvalley.ai/offers/pc-50`,
      checkoutUrl: CHECKOUT,
      id: "pc-50",
      expires: "2026-12-31",
    });
  });
});

describe("paymentStatement", () => {
  it("says pay at the visit, not online, while the offer is off", () => {
    expect(paymentStatement({ kind: "off" })).toBe("Visits are paid at the visit, not online.");
  });

  it("names the online first-booking payment on LV only when the offer is live", () => {
    const text = paymentStatement(resolvePartnerOffer(good, TODAY));
    expect(text).toMatch(/paid at the visit/);
    expect(text).toMatch(/first booking can be paid online on Longevity Valley/);
    expect(text).not.toMatch(/not online/);
  });
});

describe("offer terms", () => {
  it("state eligibility, how it is earned, the limit and who issues it", () => {
    const text = Object.values(PARTNER_OFFER_TERMS).join(" ");
    expect(text).toMatch(/55/);
    expect(text).toMatch(/50%/);
    expect(text).toMatch(/first online booking/i);
    expect(text).toMatch(/paid in full/i);
    expect(text).toMatch(/one voucher per guest/i);
    expect(text).toMatch(/Longevity Valley/);
    expect(text).not.toMatch(/free|guarantee|cure|results|verified/i);
  });
});

describe("get_partner_offer tool", () => {
  it("is read-only, closed, and never mints, claims or pays", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const tool = createTools(() => true, { kind: "off" }).find((t) => t.name === "get_partner_offer")!;
    expect(tool.annotations.readOnlyHint).toBe(true);
    expect(tool.inputSchema.additionalProperties).toBe(false);
    expect(tool.description).toMatch(/does not mint, claim or pay/i);
    expect(await tool.execute({})).toEqual({ available: false, reason: "Not available yet." });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("returns the terms and the claim page when live", async () => {
    const live = resolvePartnerOffer(good, TODAY);
    const tool = createTools(() => true, live).find((t) => t.name === "get_partner_offer")!;
    const result = (await tool.execute({})) as {
      available: boolean;
      claimPage: string;
      checkoutPage: string;
      payment: string;
      expires: string;
    };
    expect(result.available).toBe(true);
    expect(result.claimPage).toBe(good.url);
    expect(result.checkoutPage).toBe(CHECKOUT);
    expect(result.payment).toBe(paymentStatement(live));
    expect(result.expires).toBe("2026-12-31");
  });
});

describe("formatOfferDate", () => {
  it("shows the stated day, whatever the viewer's time zone", async () => {
    const { formatOfferDate } = await import("@/content/partner-offer");
    expect(formatOfferDate("2026-12-31")).toBe("31 December 2026");
    expect(formatOfferDate("2027-01-01")).toBe("1 January 2027");
  });
});

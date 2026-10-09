import { describe, expect, it, vi } from "vitest";
import { PARTNER_OFFER_TERMS, resolvePartnerOffer } from "@/content/partner-offer";
import { createTools } from "@/webmcp/tools";

const TODAY = new Date("2026-10-10T00:00:00Z");
const good = { url: "https://app.longevityvalley.ai/offers/pc-50", id: "pc-50", expires: "2026-12-31" };

describe("resolvePartnerOffer", () => {
  it("is off until LV publishes an offer", () => {
    expect(resolvePartnerOffer({}, TODAY)).toEqual({ kind: "off" });
  });

  it.each([
    [{ ...good, url: "http://app.longevityvalley.ai/offers/pc-50" }, "claim page must be https"],
    [{ ...good, url: "https://evil.example/offers/pc-50" }, "claim page must be on LV's verified receipt path"],
    [{ ...good, url: "https://book.longevityvalley.ai/offers/pc-50" }, "claim page must be on LV's verified receipt path"],
    [{ ...good, url: "https://app.longevityvalley.ai.evil.example/offers/pc-50" }, "claim page must be on LV's verified receipt path"],
    [{ ...good, url: "https://app.longevityvalley.ai/api/gateway/webmcp.js" }, "claim page cannot be an LV tool endpoint"],
    [{ ...good, url: "https://api.longevityvalley.ai/api/mcp" }, "claim page cannot be an LV tool endpoint"],
    [{ ...good, url: "https://app.longevityvalley.ai/offers/pc-50?phone=0123" }, "claim link must carry no query or fragment"],
    [{ ...good, url: "https://app.longevityvalley.ai:8443/offers/pc-50" }, "claim link must carry no port or credentials"],
    [{ ...good, id: "" }, "offer id missing"],
    [{ ...good, expires: "" }, "expiry missing"],
    [{ ...good, expires: "31/12/2026" }, "expiry must be YYYY-MM-DD"],
    [{ ...good, expires: "2026-10-01" }, "offer has expired"],
  ])("refuses %o", (input, reason) => {
    expect(resolvePartnerOffer(input, TODAY)).toEqual({ kind: "refused", reason });
  });

  it.each(["app", "api"])("is live on %s.longevityvalley.ai with a clean claim link, the id and the expiry", (sub) => {
    expect(resolvePartnerOffer({ ...good, url: `https://${sub}.longevityvalley.ai/offers/pc-50` }, TODAY)).toEqual({
      kind: "live",
      claimUrl: `https://${sub}.longevityvalley.ai/offers/pc-50`,
      id: "pc-50",
      expires: "2026-12-31",
    });
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
    const result = (await tool.execute({})) as { available: boolean; claimPage: string; expires: string };
    expect(result.available).toBe(true);
    expect(result.claimPage).toBe(good.url);
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

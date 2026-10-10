import { describe, expect, it } from "vitest";
import { resolveBookingEmbed } from "@/content/booking-embed";
import { contentSecurityPolicy, practiceJsonLd } from "@/content/head";
import { BOOKING_IFRAME_SANDBOX, PRIVACY_NOTICE_HOSTS, resolvePrivacyNotice } from "@/content/booking-embed";

describe("resolveBookingEmbed", () => {
  it("is off when unset or blank", () => {
    expect(resolveBookingEmbed(undefined)).toEqual({ kind: "off" });
    expect(resolveBookingEmbed("  ")).toEqual({ kind: "off" });
  });

  it.each([
    ["not a url", "not a URL"],
    ["http://7dgf0msykg.calendesk.net", "not https"],
    ["https://calendesk.net.evil.example", "not a calendesk.net host"],
    ["https://evil.example/?x=.calendesk.net", "not a calendesk.net host"],
    ["https://vedowellness.calendesk.net", "shared LV catalogue, not a Ping Care page"],
    ["https://lv-wellness-passport.calendesk.net", "shared LV catalogue, not a Ping Care page"],
    ["https://zqlc6ablyz.calendesk.net", "not Ping Care's Calendesk site"],
    ["https://fiqjnereae.calendesk.net", "not Ping Care's Calendesk site"],
    ["https://anyone-else.calendesk.net", "not Ping Care's Calendesk site"],
    ["https://user:pw@7dgf0msykg.calendesk.net", "credentials or fragment in URL"],
    ["https://7dgf0msykg.calendesk.net:8443", "non-default port"],
  ])("refuses %s", (raw, reason) => {
    expect(resolveBookingEmbed(raw)).toEqual({ kind: "refused", reason });
  });

  it("keeps only cdWidget=1 and drops any other query", () => {
    expect(resolveBookingEmbed("https://7dgf0msykg.calendesk.net/?email=a@b.c&cdWidget=0")).toEqual({
      kind: "on",
      src: "https://7dgf0msykg.calendesk.net/?cdWidget=1",
      origin: "https://7dgf0msykg.calendesk.net",
    });
  });
});

describe("contentSecurityPolicy", () => {
  it("allows no frames while booking is off", () => {
    expect(contentSecurityPolicy({ kind: "off" })).toContain("frame-src 'none'");
  });

  it("allows exactly the booking origin when on", () => {
    const csp = contentSecurityPolicy(resolveBookingEmbed("https://7dgf0msykg.calendesk.net"));
    expect(csp).toContain("frame-src https://7dgf0msykg.calendesk.net;");
    expect(csp).not.toMatch(/\*/);
  });

  it("allows no third-party scripts", () => {
    expect(contentSecurityPolicy({ kind: "off" })).toContain("script-src 'self';");
  });
});

describe("practiceJsonLd", () => {
  it("states no ratings or verification claims", () => {
    const json = JSON.stringify(practiceJsonLd());
    expect(json).not.toMatch(/aggregateRating|review|verified/i);
    expect(practiceJsonLd()["@type"]).toBe("Physiotherapy");
  });
});

describe("booking iframe sandbox", () => {
  it("lets the widget run its form but never navigate this page or open un-sandboxed windows", () => {
    const tokens = BOOKING_IFRAME_SANDBOX.split(" ");
    expect(tokens).toEqual(expect.arrayContaining(["allow-scripts", "allow-forms", "allow-same-origin"]));
    expect(tokens).not.toContain("allow-top-navigation");
    expect(tokens).not.toContain("allow-top-navigation-by-user-activation");
    expect(tokens).not.toContain("allow-popups-to-escape-sandbox");
  });
});

describe("resolvePrivacyNotice", () => {
  it("is required whenever the booking embed is on", () => {
    const on = resolveBookingEmbed("https://7dgf0msykg.calendesk.net");
    expect(resolvePrivacyNotice(on, undefined)).toEqual({ ok: false, reason: "booking embed needs a privacy notice URL" });
    expect(resolvePrivacyNotice(on, "http://example.com/privacy")).toEqual({ ok: false, reason: "privacy notice must be https" });
    expect(resolvePrivacyNotice(on, "https://app.longevityvalley.ai/privacy/ping-care")).toEqual({
      ok: true,
      url: "https://app.longevityvalley.ai/privacy/ping-care",
    });
    expect(resolvePrivacyNotice(on, "https://7dgf0msykg.calendesk.net/privacy-policy")).toEqual({
      ok: true,
      url: "https://7dgf0msykg.calendesk.net/privacy-policy",
    });
  });

  // GRADE-R2 P3: the notice lives on an allow-listed host only.
  it.each([
    ["https://evil.example/n?x=1", "privacy notice must be on LV's or Ping Care's own site"],
    ["https://pingcare.example/privacy", "privacy notice must be on LV's or Ping Care's own site"],
    ["https://vedowellness.calendesk.net/privacy", "privacy notice must be on LV's or Ping Care's own site"],
    ["https://app.longevityvalley.ai.evil.example/privacy", "privacy notice must be on LV's or Ping Care's own site"],
    ["https://app.longevityvalley.ai:8443/privacy", "privacy notice must carry no port or credentials"],
    ["https://u:p@app.longevityvalley.ai/privacy", "privacy notice must carry no port or credentials"],
    ["https://app.longevityvalley.ai/API/mcp", "privacy notice cannot be an LV tool endpoint"],
    ["https://app.longevityvalley.ai/%61pi/gateway/x", "privacy notice cannot be an LV tool endpoint"],
    ["https://app.longevityvalley.ai//api/x", "privacy notice cannot be an LV tool endpoint"],
  ])("refuses notice %s", (raw, reason) => {
    const on = resolveBookingEmbed("https://7dgf0msykg.calendesk.net");
    expect(resolvePrivacyNotice(on, raw)).toEqual({ ok: false, reason });
  });

  it("checks a notice that is set even while the embed is off", () => {
    expect(resolvePrivacyNotice({ kind: "off" }, "https://evil.example/n")).toEqual({
      ok: false,
      reason: "privacy notice must be on LV's or Ping Care's own site",
    });
  });

  it("keeps the allow-list in one constant: LV's pages plus Ping Care's Calendesk site", () => {
    expect(Array.from(PRIVACY_NOTICE_HOSTS).sort()).toEqual(
      ["7dgf0msykg.calendesk.net", "api.longevityvalley.ai", "app.longevityvalley.ai"],
    );
  });

  it("is optional while the embed is off", () => {
    expect(resolvePrivacyNotice({ kind: "off" }, undefined)).toEqual({ ok: true, url: null });
  });
});

describe("credential wording", () => {
  it("states the registration as given by the practitioner, not as verified", () => {
    const founder = practiceJsonLd().founder as { hasCredential: { description: string } };
    expect(founder.hasCredential.description).toMatch(/as stated by the practitioner/i);
  });
});

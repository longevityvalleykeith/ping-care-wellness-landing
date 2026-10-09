import { describe, expect, it } from "vitest";
import { resolveBookingEmbed } from "@/content/booking-embed";
import { contentSecurityPolicy, practiceJsonLd } from "@/content/head";
import { BOOKING_IFRAME_SANDBOX, resolvePrivacyNotice } from "@/content/booking-embed";

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
    expect(resolvePrivacyNotice(on, "https://pingcare.example/privacy")).toEqual({ ok: true, url: "https://pingcare.example/privacy" });
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

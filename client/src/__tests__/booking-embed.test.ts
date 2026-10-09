import { describe, expect, it } from "vitest";
import { resolveBookingEmbed } from "@/content/booking-embed";
import { contentSecurityPolicy, practiceJsonLd } from "@/content/head";

describe("resolveBookingEmbed", () => {
  it("is off when unset or blank", () => {
    expect(resolveBookingEmbed(undefined)).toEqual({ kind: "off" });
    expect(resolveBookingEmbed("  ")).toEqual({ kind: "off" });
  });

  it.each([
    ["not a url", "not a URL"],
    ["http://pingcare.calendesk.net", "not https"],
    ["https://calendesk.net.evil.example", "not a calendesk.net host"],
    ["https://evil.example/?x=.calendesk.net", "not a calendesk.net host"],
    ["https://vedowellness.calendesk.net", "shared LV catalogue, not a Ping Care page"],
    ["https://lv-wellness-passport.calendesk.net", "shared LV catalogue, not a Ping Care page"],
    ["https://user:pw@pingcare.calendesk.net", "credentials or fragment in URL"],
  ])("refuses %s", (raw, reason) => {
    expect(resolveBookingEmbed(raw)).toEqual({ kind: "refused", reason });
  });

  it("keeps only cdWidget=1 and drops any other query", () => {
    expect(resolveBookingEmbed("https://pingcare.calendesk.net/?email=a@b.c&cdWidget=0")).toEqual({
      kind: "on",
      src: "https://pingcare.calendesk.net/?cdWidget=1",
      origin: "https://pingcare.calendesk.net",
    });
  });
});

describe("contentSecurityPolicy", () => {
  it("allows no frames while booking is off", () => {
    expect(contentSecurityPolicy({ kind: "off" })).toContain("frame-src 'none'");
  });

  it("allows exactly the booking origin when on", () => {
    const csp = contentSecurityPolicy(resolveBookingEmbed("https://pingcare.calendesk.net"));
    expect(csp).toContain("frame-src https://pingcare.calendesk.net;");
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

import { describe, expect, it } from "vitest";
import { areaPages, slugify } from "@/content/areas";
import { GETTING_THERE, PRACTICE } from "@/content/practice";

describe("area pages", () => {
  it("emit nothing until the practitioner names her districts", () => {
    expect(PRACTICE.districts).toEqual([]);
    expect(areaPages(PRACTICE.districts)).toEqual([]);
  });

  it("emit one page per named district with only stated facts", () => {
    const pages = areaPages(["Cheras", "Petaling Jaya"]);
    expect(pages.map((p) => p.fileName)).toEqual(["areas/cheras.html", "areas/petaling-jaya.html"]);
    for (const page of pages) {
      expect(page.html).toContain(PRACTICE.practitioner);
      expect(page.html).toContain(PRACTICE.registration);
      expect(page.html).toMatch(/<link rel="canonical" href="https:\/\//);
      expect(page.html).not.toMatch(/cure|results|guarantee|24\/7|verified|review|telegram/i);
    }
  });

  it("slugify is stable and URL-safe", () => {
    expect(slugify("Petaling Jaya")).toBe("petaling-jaya");
    expect(slugify("Bandar Sri Damansara")).toBe("bandar-sri-damansara");
  });
});

describe("getting there", () => {
  it("offers the escort service and says rides are the family's own booking", () => {
    expect(GETTING_THERE.join(" ")).toMatch(/Medical Escort/);
    expect(GETTING_THERE.join(" ")).toMatch(/does not book or charge for rides/);
    expect(GETTING_THERE.join(" ")).not.toMatch(/Grab|guarantee|free/i);
  });
});

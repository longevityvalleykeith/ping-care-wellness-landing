import { afterEach, describe, expect, it, vi } from "vitest";
import { SERVICE_IDS } from "@/content/practice";
import { createTools } from "@/webmcp/tools";

const tools = createTools(() => true);

afterEach(() => vi.restoreAllMocks());

describe("WebMCP tools", () => {
  it("are all read-only with closed input schemas", () => {
    for (const tool of tools) {
      expect(tool.annotations.readOnlyHint, tool.name).toBe(true);
      expect(tool.inputSchema.additionalProperties, tool.name).toBe(false);
    }
  });

  it("never ask for personal or health details", () => {
    const forbidden = /name|phone|email|address|condition|medication|symptom|patient|tenant|message|text/i;
    for (const tool of tools) {
      for (const key of Object.keys(tool.inputSchema.properties)) {
        expect(key, `${tool.name}.${key}`).not.toMatch(forbidden);
      }
    }
  });

  it("never call the network", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    for (const tool of tools) {
      await tool.execute({ service: SERVICE_IDS[0], section: "booking" });
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("start_whatsapp_enquiry ignores anything but a known service id", async () => {
    const tool = tools.find((t) => t.name === "start_whatsapp_enquiry")!;
    const { url } = (await tool.execute({ service: "I have chest pain, call me on 0123" })) as { url: string };
    expect(url).toMatch(/^https:\/\/wa\.me\/60182905768\?text=/);
    expect(decodeURIComponent(url)).not.toContain("chest pain");
  });

  it("show_section only scrolls to known sections", async () => {
    const scroll = vi.fn(() => true);
    const tool = createTools(scroll).find((t) => t.name === "show_section")!;
    expect(await tool.execute({ section: "javascript:alert(1)" })).toEqual({ shown: false, reason: "unknown section" });
    expect(scroll).not.toHaveBeenCalled();
    expect(await tool.execute({ section: "booking" })).toEqual({ shown: true, section: "booking" });
  });

  it("does not describe any tool as booking or paying", () => {
    for (const tool of tools) {
      expect(tool.name).not.toMatch(/book|pay|order|redeem|checkout/);
    }
  });
});

describe("emergency guidance", () => {
  it("get_contact_options tells an agent to call Malaysia's 999 first, never 911", async () => {
    const tool = tools.find((t) => t.name === "get_contact_options")!;
    const result = (await tool.execute({})) as { emergency: string };
    expect(result.emergency).toMatch(/999/);
    expect(JSON.stringify(result)).not.toMatch(/911/);
  });
});

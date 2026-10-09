import {
  CONTACT,
  PHONE_LINK,
  PRACTICE,
  SERVICES,
  SERVICE_IDS,
  whatsappLink,
  type ServiceId,
} from "@/content/practice";

// WebMCP tools for AI agents visiting the page. Every tool answers from the
// static content module: none calls a server, collects personal or health
// details, books, or takes payment.

export type ToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
};

export type JsonSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties: false;
};

export type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
  annotations: ToolAnnotations;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

export const SECTION_IDS = ["services", "about", "booking", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const NO_INPUT: JsonSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export function createTools(
  scrollToSection: (id: SectionId) => boolean,
): WebMcpTool[] {
  return [
    {
      name: "get_practice_profile",
      title: "Practice profile",
      description:
        "Who Ping Care Wellness is: the practitioner, her stated professional registration and where she works. Registration details are as stated by the practitioner, not independently verified.",
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () => ({
        name: PRACTICE.name,
        nameZh: PRACTICE.nameZh,
        practitioner: PRACTICE.practitioner,
        statedRegistration: PRACTICE.registration,
        registrationNote: "As stated by the practitioner.",
        serviceArea: [...PRACTICE.serviceArea],
        visitSettings: [...PRACTICE.visitSettings],
      }),
    },
    {
      name: "list_services",
      title: "List services",
      description:
        "Ping Care's services with indicative prices. Prices are indicative and confirmed by the practitioner. This tool does not book anything.",
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () => ({
        services: SERVICES.map((s) => ({
          id: s.id,
          name: s.name,
          summary: s.summary,
          price: s.priceLabel,
          includes: [...s.includes],
        })),
        note: "Indicative prices. The practitioner confirms the price before any visit.",
      }),
    },
    {
      name: "get_service_area",
      title: "Service area",
      description:
        "Where Ping Care makes home visits. Returns the area only; it does not check an address.",
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () => ({
        region: PRACTICE.serviceAreaLabel,
        areas: [...PRACTICE.serviceArea],
        visitSettings: [...PRACTICE.visitSettings],
      }),
    },
    {
      name: "get_contact_options",
      title: "Contact options",
      description: "How to reach Ping Care: WhatsApp and phone. Ping Care is not an emergency service.",
      inputSchema: NO_INPUT,
      annotations: { readOnlyHint: true },
      execute: async () => ({
        whatsapp: whatsappLink(),
        phone: CONTACT.phoneDisplay,
        phoneLink: PHONE_LINK,
        emergency: CONTACT.emergency,
      }),
    },
    {
      name: "start_whatsapp_enquiry",
      title: "WhatsApp enquiry link",
      description:
        "Returns a WhatsApp link with a fixed greeting for the chosen service, for the visitor to open themselves. It sends nothing and books nothing. Do not add health details to the message.",
      inputSchema: {
        type: "object",
        properties: {
          service: {
            type: "string",
            enum: SERVICE_IDS,
            description: "Optional service the visitor is asking about.",
          },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const service = SERVICE_IDS.includes(input.service as ServiceId)
          ? (input.service as ServiceId)
          : undefined;
        return { url: whatsappLink(service) };
      },
    },
    {
      name: "show_section",
      title: "Show a section of the page",
      description:
        "Scrolls the page to a section so the visitor can see it. 'booking' shows how to request a visit; it does not book.",
      inputSchema: {
        type: "object",
        properties: {
          section: { type: "string", enum: [...SECTION_IDS] },
        },
        required: ["section"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const section = SECTION_IDS.find((id) => id === input.section);
        if (!section) return { shown: false, reason: "unknown section" };
        return { shown: scrollToSection(section), section };
      },
    },
  ];
}

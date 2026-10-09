// Single source of truth for everything the page states about the practice.
// The UI, the WebMCP tools and the JSON-LD block all read from here, so they
// cannot drift apart. Change a fact here, never in a component.

export const PRACTICE = {
  name: "Ping Care Wellness",
  nameZh: "萍心健康",
  practitioner: "Yip Sook Ping",
  registration: "MAHPC(PT)06056",
  url: "https://ping-care-wellness-landing.vercel.app",
  logoUrl:
    "https://wlwzfjlvwaosonorsvyf.supabase.co/storage/v1/object/public/brand-assets/ping-care-wellness/logo.jpg",
  serviceArea: ["Kuala Lumpur", "Selangor"],
  serviceAreaLabel: "Klang Valley",
  visitSettings: ["Home", "Care facilities", "Hospitals"],
} as const;

export const CONTACT = {
  whatsappNumber: "60182905768",
  phoneDisplay: "+6018-290 5768",
  phoneE164: "+60182905768",
} as const;

export const SERVICES = [
  {
    id: "integrative-physiotherapy",
    name: "Integrative Physiotherapy",
    summary:
      "Licensed integrative physiotherapy at your home: hands-on manual therapy, Emmett Technique and functional fitness assessment for elder rehabilitation.",
    priceLabel: "From RM 150 per session",
    includes: [
      "Licensed integrative physio assessment",
      "Emmett Technique",
      "Functional fitness and mobility testing",
      "3-week progress review cycle",
    ],
  },
  {
    id: "medical-escort",
    name: "Medical Escort & Caregiver Training",
    summary:
      "Accompaniment to hospital appointments with note-taking, plus training for family caregivers to give safe daily assistance.",
    priceLabel: "Price on enquiry",
    includes: [
      "Hospital appointment accompaniment",
      "Medical documentation and follow-up",
      "Caregiver technique training",
      "Care coordination with specialists",
    ],
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

export const SERVICE_IDS = SERVICES.map((s) => s.id) as ServiceId[];

// The pre-filled WhatsApp text is fixed per service. Callers can choose a
// service, never supply free text, so no visitor's health details ever ride in
// a URL that someone else built.
export function whatsappLink(serviceId?: ServiceId): string {
  const service = SERVICES.find((s) => s.id === serviceId);
  const text = service
    ? `Hi Sook Ping, I would like to ask about ${service.name}.`
    : "Hi Sook Ping, I am interested in Ping Care Wellness services.";
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const PHONE_LINK = `tel:${CONTACT.phoneE164}`;

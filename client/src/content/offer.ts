import { resolvePartnerOffer } from "./partner-offer";

export const partnerOffer = resolvePartnerOffer({
  url: import.meta.env.VITE_PC_PARTNER_OFFER_URL as string | undefined,
  id: import.meta.env.VITE_PC_PARTNER_OFFER_ID as string | undefined,
  expires: import.meta.env.VITE_PC_PARTNER_OFFER_EXPIRES as string | undefined,
});

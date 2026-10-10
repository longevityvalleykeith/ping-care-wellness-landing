import { resolvePartnerOffer } from "./partner-offer";

// The build (vite.config.ts) refuses any offer value this resolver refuses, so
// "refused" never reaches a built page; it reads as off here.
export const partnerOffer = resolvePartnerOffer({
  url: import.meta.env.VITE_PC_PARTNER_OFFER_URL as string | undefined,
  id: import.meta.env.VITE_PC_PARTNER_OFFER_ID as string | undefined,
  expires: import.meta.env.VITE_PC_PARTNER_OFFER_EXPIRES as string | undefined,
  checkout: import.meta.env.VITE_PC_FIRST_BOOKING_CHECKOUT_URL as string | undefined,
});

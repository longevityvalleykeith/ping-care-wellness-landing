import { resolveBookingEmbed } from "./booking-embed";

export const bookingEmbed = resolveBookingEmbed(
  import.meta.env.VITE_PC_BOOKING_EMBED_URL as string | undefined,
);

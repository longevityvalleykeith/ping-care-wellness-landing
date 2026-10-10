import { resolveBookingEmbed, resolvePrivacyNotice } from "./booking-embed";

export const bookingEmbed = resolveBookingEmbed(
  import.meta.env.VITE_PC_BOOKING_EMBED_URL as string | undefined,
);

const notice = resolvePrivacyNotice(
  bookingEmbed,
  import.meta.env.VITE_PC_PRIVACY_NOTICE_URL as string | undefined,
);

// The build already refuses an embed without a notice; null here means "off".
export const privacyNoticeUrl = notice.ok ? notice.url : null;

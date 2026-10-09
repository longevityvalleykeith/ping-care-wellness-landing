// The Calendesk booking page is embedded only when VITE_PC_BOOKING_EMBED_URL is
// set to an allowed host. Until Ping Care has its own Calendesk page with online
// payment switched off, the variable stays unset and the page shows a WhatsApp
// fallback instead of a widget. This module reads no environment itself, so the
// build config can use it too.

// Hosts that serve LV's shared Calendesk catalogue (other partners' services,
// some with online payment). Embedding them here would sell services that are
// not Ping Care's, so they are refused even though they are calendesk.net.
const SHARED_CATALOGUE_HOSTS = new Set([
  "vedowellness.calendesk.net",
  "lv-wellness-passport.calendesk.net",
]);

export type BookingEmbed =
  | { kind: "off" }
  | { kind: "refused"; reason: string }
  | { kind: "on"; src: string; origin: string };

export function resolveBookingEmbed(raw: string | undefined): BookingEmbed {
  const value = raw?.trim();
  if (!value) return { kind: "off" };

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { kind: "refused", reason: "not a URL" };
  }
  if (url.protocol !== "https:") return { kind: "refused", reason: "not https" };
  if (!url.hostname.endsWith(".calendesk.net")) {
    return { kind: "refused", reason: "not a calendesk.net host" };
  }
  if (SHARED_CATALOGUE_HOSTS.has(url.hostname)) {
    return { kind: "refused", reason: "shared LV catalogue, not a Ping Care page" };
  }
  if (url.username || url.password || url.hash) {
    return { kind: "refused", reason: "credentials or fragment in URL" };
  }

  // The widget accepts only cdWidget=1; any other query could carry guest data.
  return { kind: "on", src: `${url.origin}${url.pathname}?cdWidget=1`, origin: url.origin };
}

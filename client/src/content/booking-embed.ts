// The Calendesk booking page is embedded only when VITE_PC_BOOKING_EMBED_URL is
// set to Ping Care's own Calendesk site. Keep it unset until that site's settings
// read back with online payment off; meanwhile the page shows a WhatsApp fallback.
// This module reads no environment itself, so the build config can use it too.

// Ping Care's own Calendesk site(s). Add the alias here when one is chosen.
// Any other calendesk.net host — LV's shared catalogue, other partners, dead
// tenants — is refused: embedding it would show services that are not hers.
const PING_CARE_BOOKING_HOSTS = new Set(["7dgf0msykg.calendesk.net"]);

// Named separately so the refusal says why: these serve LV's shared catalogue
// (other partners' services, some with online payment).
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
  if (!PING_CARE_BOOKING_HOSTS.has(url.hostname)) {
    return { kind: "refused", reason: "not Ping Care's Calendesk site" };
  }
  if (url.username || url.password || url.hash) {
    return { kind: "refused", reason: "credentials or fragment in URL" };
  }

  // The widget accepts only cdWidget=1; any other query could carry guest data.
  return { kind: "on", src: `${url.origin}${url.pathname}?cdWidget=1`, origin: url.origin };
}

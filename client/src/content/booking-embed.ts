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
  if (url.port) return { kind: "refused", reason: "non-default port" };

  // The widget accepts only cdWidget=1; any other query could carry guest data.
  return { kind: "on", src: `${url.origin}${url.pathname}?cdWidget=1`, origin: url.origin };
}

// The widget may run scripts and submit its own form inside its own origin. It
// may not navigate this page, and any window it opens stays sandboxed.
export const BOOKING_IFRAME_SANDBOX = "allow-scripts allow-forms allow-same-origin";

export type PrivacyNotice = { ok: true; url: string | null } | { ok: false; reason: string };

// A live booking form collects a guest's name and contact details, so the page
// must link a privacy notice (naming Calendesk as processor) beside it.
export function resolvePrivacyNotice(embed: BookingEmbed, raw: string | undefined): PrivacyNotice {
  const value = raw?.trim();
  if (embed.kind !== "on") return { ok: true, url: value || null };
  if (!value) return { ok: false, reason: "booking embed needs a privacy notice URL" };
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { ok: false, reason: "privacy notice is not a URL" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "privacy notice must be https" };
  return { ok: true, url: url.toString() };
}

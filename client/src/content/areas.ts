import { CONTACT, PRACTICE, SERVICES, whatsappLink } from "./practice";

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Static, JavaScript-free page per district the practitioner visits, so
// "elderly physiotherapy in <district>" finds the same facts as the home page.
// No outcome, rating or availability claim; nothing the home page does not say.
export function areaPages(districts: readonly string[]): { fileName: string; html: string }[] {
  return districts.map((district) => {
    const slug = slugify(district);
    const url = `${PRACTICE.url}/areas/${slug}.html`;
    const title = `${PRACTICE.name} — home physiotherapy visits in ${district}`;
    const services = SERVICES.map((s) => `<li>${escapeHtml(s.name)} — ${escapeHtml(s.priceLabel)}</li>`).join("");
    const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(`${PRACTICE.description} Home visits in ${district}.`)}">
<link rel="canonical" href="${url}">
</head><body>
<main>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(PRACTICE.practitioner)}, licensed integrative physiotherapist (${escapeHtml(PRACTICE.registration)}, as stated by the practitioner), visits homes in ${escapeHtml(district)}.</p>
<ul>${services}</ul>
<p>${escapeHtml(CONTACT.emergency)}</p>
<p><a href="${whatsappLink()}">WhatsApp ${escapeHtml(PRACTICE.practitioner)}</a> · <a href="${PRACTICE.url}/">${escapeHtml(PRACTICE.name)}</a></p>
</main>
</body></html>
`;
    return { fileName: `areas/${slug}.html`, html };
  });
}

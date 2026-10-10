import { Button } from "@/components/ui/button";
import {
  PARTNER_OFFER_TERMS,
  formatOfferDate,
  paymentStatement,
  type PartnerOffer,
} from "@/content/partner-offer";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

type LiveOffer = Extract<PartnerOffer, { kind: "live" }>;

function Ticket({
  label,
  value,
  tone,
  href,
  linkHint,
}: {
  label: string;
  value: string;
  tone: "primary" | "soft";
  // When set, the whole ticket is a link to that LV page.
  href?: string;
  linkHint?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-secondary/25 text-primary border border-secondary/50";
  const className = `relative flex-1 rounded-2xl px-6 py-8 text-center ${toneClass}`;
  const body = (
    <>
      {/* the ticket notches */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card"
      />
      <span
        aria-hidden="true"
        className="absolute right-0 top-1/2 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full bg-card"
      />
      <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold leading-tight">{value}</p>
      {linkHint && (
        <p className="mt-3 text-sm font-semibold underline underline-offset-4">
          {linkHint}
        </p>
      )}
    </>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} block hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function PartnerOfferCard({ offer }: { offer: LiveOffer }) {
  const [copied, setCopied] = useState(false);
  const expires = formatOfferDate(offer.expires);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(offer.claimUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      aria-labelledby="partner-offer-title"
      className="mt-12 rounded-3xl border border-border/60 bg-card p-6 md:p-10"
    >
      <h3
        id="partner-offer-title"
        className="text-2xl md:text-3xl font-bold text-primary text-center mb-8"
      >
        Your first visit earns a partner voucher
      </h3>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Ticket
          tone="primary"
          label="Book and pay"
          value="Your first visit, online"
          href={offer.checkoutUrl}
          linkHint="Pay on Longevity Valley"
        />
        <Ticket tone="soft" label="Get" value={PARTNER_OFFER_TERMS.headline} />
      </div>
      <ul className="space-y-2 text-muted-foreground mb-6">
        <li>{paymentStatement(offer)}</li>
        <li>{PARTNER_OFFER_TERMS.eligibility}</li>
        <li>{PARTNER_OFFER_TERMS.earn}</li>
        <li>{PARTNER_OFFER_TERMS.limit}</li>
        <li>{PARTNER_OFFER_TERMS.issuer}</li>
        <li>Offer ends {expires}.</li>
      </ul>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="rounded-full px-8 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          asChild
        >
          <a href={offer.claimUrl} target="_blank" rel="noopener noreferrer">
            Claim on Longevity Valley{" "}
            <ExternalLink className="ml-2 w-4 h-4" aria-hidden="true" />
          </a>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full px-8 font-semibold"
          onClick={copyLink}
        >
          <Copy className="mr-2 w-4 h-4" aria-hidden="true" />
          {copied ? "Link copied" : "Copy link"}
        </Button>
      </div>
    </section>
  );
}

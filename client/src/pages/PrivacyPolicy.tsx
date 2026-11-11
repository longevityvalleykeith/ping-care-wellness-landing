import { CONTACT, PRACTICE } from "@/content/practice";
import { Link } from "wouter";

// DRAFT. The meta robots tag below is hoisted into the document head by React 19
// and removed when this page unmounts, so only this route is noindex. Remove the
// banner and the tag together, once the practitioner and legal review are done.
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <meta name="robots" content="noindex" />

      <div className="bg-amber-100 text-amber-950 border-b border-amber-300 px-6 py-3 text-center text-sm font-semibold">
        DRAFT — pending practitioner and legal review before publication.
      </div>

      <header className="border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src={PRACTICE.logoUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span>
              <span className="block text-xl font-bold text-primary tracking-wide">
                {PRACTICE.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {PRACTICE.nameZh}
              </span>
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Privacy policy
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            This page explains what this website collects, what we never publish
            here, and how to reach us about your details. This policy covers
            Ping Care Wellness, operated by{" "}
            <mark className="bg-amber-100 text-amber-950 px-1 rounded">
              [TO CONFIRM BY PRACTITIONER: legal name of the business that holds
              the personal data]
            </mark>
            .
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated:{" "}
            <mark className="bg-amber-100 text-amber-950 px-1 rounded">
              [TO CONFIRM BY PRACTITIONER: date of last review]
            </mark>
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            What we collect on this site
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
            <li>
              The website has no sign-in, no accounts and no analytics script.
              Its code sets no cookies and writes nothing to your browser's
              storage.
            </li>
            <li>
              The site has no contact form. To ask about a visit, WhatsApp Sook
              Ping or call the number on the home page. Your messages are
              handled by Ping Care and by WhatsApp, under WhatsApp's own terms.
              Visit requests are kept for{" "}
              <mark className="bg-amber-100 text-amber-950 px-1 rounded">
                [TO CONFIRM BY PRACTITIONER: retention period for enquiries and
                visit requests]
              </mark>
              .
            </li>
            <li>
              The online visit request form is not switched on yet. When it is,
              the details you type into it go to Calendesk, the booking provider
              that runs the form. The privacy notice linked beside the form
              applies to those details.
            </li>
            <li>
              The site files are served by Vercel, the hosting provider. This
              website has no server of its own. Vercel may keep standard request
              logs.{" "}
              <mark className="bg-amber-100 text-amber-950 px-1 rounded">
                [TO CONFIRM BY PRACTITIONER: whether hosting request logs are
                kept, for how long, and who can access them]
              </mark>
            </li>
            <li>
              The logo is loaded from a storage host outside this site. Your
              browser asks that host for the image, as it would for any image.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            What we do not do
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
            <li>
              We keep no patient records on this site. It has no database, no
              client area and no record of visits.
            </li>
            <li>
              We do not publish personal or health information. Nothing
              identifiable about a patient or client is published on this site.
            </li>
            <li>
              We do not publish content from private client care. No visit
              notes, case details or session content appear on this site or in
              its files.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Machine-readable pages
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The site publishes files for search engines and AI tools:
            robots.txt, sitemap.xml, llms.txt, the structured data in the page
            code, and a text summary for visitors without JavaScript. The tools
            that AI visitors can use on the home page are included too.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            All of them are built from the same public practice facts the page
            shows: the practice name, the practitioner's name and registration
            (as stated by the practitioner), the service area, the services with
            their indicative prices, and the public WhatsApp and phone line. The
            tools read those facts and make no network calls. Nothing
            identifiable is distributed through these pages beyond those public
            practice facts, and none carries patient, client or case details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            In an emergency
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Ping Care Wellness is not an emergency service. {CONTACT.emergency}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Questions about your details
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
            <li>
              Privacy contact:{" "}
              <mark className="bg-amber-100 text-amber-950 px-1 rounded">
                [TO CONFIRM BY PRACTITIONER: privacy contact name, and email or
                WhatsApp number]
              </mark>
            </li>
            <li>
              Data protection officer:{" "}
              <mark className="bg-amber-100 text-amber-950 px-1 rounded">
                [TO CONFIRM BY PRACTITIONER: name and contact of the data
                protection officer, or confirm that none is appointed]
              </mark>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Governing law
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            This policy refers to the Personal Data Protection Act 2010 of
            Malaysia, as amended, as the governing law. Citing the Act here is
            not a certificate, and it is not a claim that Ping Care Wellness
            complies with it.
          </p>
        </section>

        <p className="pt-8 border-t border-border/60">
          <Link href="/" className="inline-block py-2 text-accent underline">
            Back to Ping Care Wellness
          </Link>
        </p>
      </main>
    </div>
  );
}

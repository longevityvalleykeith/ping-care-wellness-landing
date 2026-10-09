import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BOOKING_IFRAME_SANDBOX } from "@/content/booking-embed";
import { bookingEmbed, privacyNoticeUrl } from "@/content/booking";
import {
  CONTACT,
  GETTING_THERE,
  PHONE_LINK,
  PRACTICE,
  SERVICES,
  whatsappLink,
} from "@/content/practice";
import { registerWebMcpTools } from "@/webmcp/register";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect } from "react";

// White text on WhatsApp's brand green (#25D366) is about 2:1. This darker
// WhatsApp green keeps the brand cue at a readable contrast.
const WHATSAPP_BUTTON = "bg-[#075E54] hover:bg-[#075E54]/90 text-white";

const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const fadeInRight = { ...fadeInLeft, initial: { opacity: 0, x: 40 } };

export default function Home() {
  useEffect(() => {
    const controller = registerWebMcpTools();
    return () => controller?.abort();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Navigation */}
        <header>
        <nav aria-label="Main" className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center gap-4">
            <a href="#top" className="flex items-center gap-3">
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
                <span className="block text-xs text-muted-foreground">{PRACTICE.nameZh}</span>
              </span>
            </a>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-muted-foreground">
              <a href="#services" className="inline-block py-2 hover:text-accent transition-colors">
                Services
              </a>
              <a href="#about" className="inline-block py-2 hover:text-accent transition-colors">
                About
              </a>
              <a href="#booking" className="inline-block py-2 hover:text-accent transition-colors">
                Book a visit
              </a>
              <a href="#contact" className="inline-block py-2 hover:text-accent transition-colors">
                Contact
              </a>
            </div>
            <Button
              className="rounded-full px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              asChild
            >
              <a href="#booking">Request a visit</a>
            </Button>
          </div>
        </nav>
        </header>

        <main>
        {/* Hero */}
        <section
          id="top"
          className="relative min-h-[85vh] flex items-center bg-primary text-primary-foreground pt-28 pb-20"
        >
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <p className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/25">
                <Heart className="w-4 h-4" aria-hidden="true" />
                Licensed Integrative Physiotherapy · {PRACTICE.registration}
              </p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
                Care That Comes
                <br />
                <span className="text-secondary">to You.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-lg">
                {PRACTICE.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-full text-lg px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  asChild
                >
                  <a href="#booking">
                    Request a visit <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button size="lg" className={`rounded-full text-lg px-8 font-semibold ${WHATSAPP_BUTTON}`} asChild>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                    WhatsApp Sook Ping
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Approach */}
        <section id="services" className="py-24 md:py-32 bg-muted">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeInLeft}>
                <Card className="border-2 border-accent/30">
                  <CardContent className="p-8 space-y-4">
                    <Shield className="w-10 h-10 text-accent" aria-hidden="true" />
                    <p className="font-bold text-2xl text-primary">Emmett Technique Specialist</p>
                    <p className="text-muted-foreground">
                      Certified{" "}
                      <a
                        href="https://www.emmett-technique-hq.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1 text-accent underline"
                      >
                        Emmett Technique
                      </a>{" "}
                      practitioner — gentle muscle release for elder care.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...fadeInRight}>
                <p className="text-accent font-bold tracking-widest uppercase text-sm mb-2">Integrative Approach</p>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                  Integrative Physio,
                  <br />
                  <span className="italic text-muted-foreground">Right at Your Home</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Led by {PRACTICE.practitioner}, a licensed integrative physiotherapist ({PRACTICE.registration})
                  specializing in elder care. She combines evidence-based physiotherapy with Emmett Technique,
                  functional fitness assessment, and holistic rehabilitation — bridging clinical rigour with
                  compassionate, person-centred care.
                </p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Heart, name: "Integrative Physio" },
                    { icon: Shield, name: "Emmett Technique" },
                    { icon: Users, name: "Caregiver Training" },
                    { icon: Clock, name: "Medical Escort" },
                    { icon: Sparkles, name: "Functional Fitness" },
                    { icon: MapPin, name: "Home-Based Care" },
                  ].map((service) => (
                    <li
                      key={service.name}
                      className="flex flex-col items-center text-center p-3 bg-card rounded-xl border border-border/50"
                    >
                      <service.icon className="w-6 h-6 text-accent mb-2" aria-hidden="true" />
                      <span className="text-xs font-medium text-foreground/80">{service.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Who We Care For */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Care For</h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Personalized care for seniors and individuals recovering from illness, injury, or managing chronic
                conditions.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Users, title: "Elderly at Home", desc: "Physiotherapy for seniors with complex medical needs" },
                { icon: Heart, title: "Post-Surgery Recovery", desc: "Rehabilitation and mobility after surgery" },
                {
                  icon: Shield,
                  title: "Chronic Conditions",
                  desc: "Ongoing support for arthritis, nerve pain, and mobility challenges",
                },
                { icon: Clock, title: "Assisted Living", desc: "Regular visits to care facilities and retirement homes" },
              ].map((item) => (
                <div key={item.title} className="space-y-4 p-6">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                    <item.icon className="w-8 h-8 text-secondary" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p className="text-primary-foreground/75 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Cards */}
        <section className="py-24 bg-background">
          <div className="container px-6">
            <div className="text-center mb-16">
              <p className="text-accent font-bold tracking-widest uppercase text-sm mb-3">Our Services</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Comprehensive Wellness Care</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                From physiotherapy to medical escorts — professional care tailored to your needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {SERVICES.map((service) => (
                <Card key={service.id} className="border-2 border-accent/30">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-primary mb-2">{service.name}</h3>
                    <p className="text-muted-foreground mb-6">{service.summary}</p>
                    <p className="text-2xl font-bold text-primary mb-6">{service.priceLabel}</p>
                    <ul className="space-y-2 mb-6">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full rounded-full font-semibold ${WHATSAPP_BUTTON}`} asChild>
                      <a href={whatsappLink(service.id)} target="_blank" rel="noopener noreferrer">
                        Ask on WhatsApp <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-24 bg-muted">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeInLeft}>
                <p className="text-accent font-bold tracking-widest uppercase text-sm mb-2">About Us</p>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                  {PRACTICE.nameZh}
                  <br />
                  <span className="text-muted-foreground">{PRACTICE.name}</span>
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Founded by {PRACTICE.practitioner}, a licensed integrative physiotherapist registered with MAHPC (
                    {PRACTICE.registration}), {PRACTICE.name} provides compassionate mobile healthcare for seniors and
                    those with complex medical needs across the {PRACTICE.serviceAreaLabel}.
                  </p>
                  <p>
                    Sook Ping is a certified Emmett Technique practitioner — a gentle, non-invasive muscle release
                    method. Combined with functional fitness assessment and holistic rehabilitation, this integrative
                    approach supports comfort, mobility, and dignity.
                  </p>
                </div>
              </motion.div>

              <motion.div {...fadeInRight}>
                <Card>
                  <CardContent className="p-8">
                    <dl className="space-y-5">
                      <div>
                        <dt className="text-sm font-semibold uppercase tracking-wide text-accent">Registration</dt>
                        <dd className="text-lg text-primary font-bold">{PRACTICE.registration}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-semibold uppercase tracking-wide text-accent">Service area</dt>
                        <dd className="text-lg text-primary font-bold">{PRACTICE.serviceArea.join(" · ")}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-semibold uppercase tracking-wide text-accent">We visit</dt>
                        <dd className="text-lg text-primary font-bold">{PRACTICE.visitSettings.join(" · ")}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="booking" className="py-24 bg-background">
          <div className="container px-6 max-w-4xl">
            <div className="text-center mb-10">
              <p className="text-accent font-bold tracking-widest uppercase text-sm mb-2">Book a visit</p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Request a Home Visit</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                A request is not yet a booking. Sook Ping confirms every visit with you directly, and you pay at the
                visit, not online.
              </p>
            </div>

            <div className="mb-10 rounded-2xl border border-border/60 bg-muted p-6">
              <h3 className="font-bold text-primary text-lg mb-3">Getting there</h3>
              <ul className="space-y-2 text-muted-foreground">
                {GETTING_THERE.map((line) => (
                  <li key={line} className="flex gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-1" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {bookingEmbed.kind === "on" ? (
              <div className="rounded-3xl overflow-hidden border border-border/50 shadow-xl bg-card">
                <iframe
                  src={bookingEmbed.src}
                  title="Request a visit with Ping Care Wellness"
                  loading="lazy"
                  referrerPolicy="strict-origin"
                  sandbox={BOOKING_IFRAME_SANDBOX}
                  className="w-full h-[720px] border-0"
                />
              </div>
            ) : (
              <Card className="border-2 border-accent/30">
                <CardContent className="p-8 text-center space-y-4">
                  <CalendarCheck className="w-12 h-12 text-accent mx-auto" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-primary">Online visit requests are opening soon</h3>
                  <p className="text-muted-foreground">
                    Until then, message Sook Ping on WhatsApp to arrange a visit.
                  </p>
                  <Button size="lg" className={`rounded-full px-8 font-semibold ${WHATSAPP_BUTTON}`} asChild>
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 w-4 h-4" aria-hidden="true" />
                      WhatsApp Sook Ping
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {bookingEmbed.kind === "on" && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Form not loading?{" "}
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                  WhatsApp Sook Ping
                </a>{" "}
                instead.
                {privacyNoticeUrl && (
                  <>
                    {" "}
                    How your details are handled:{" "}
                    <a href={privacyNoticeUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                      privacy notice
                    </a>
                    .
                  </>
                )}
              </p>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24 bg-primary text-primary-foreground">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div {...fadeInLeft}>
                <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
                <p className="text-primary-foreground/80 text-lg mb-4">
                  Contact Sook Ping to discuss your needs or arrange a home visit.
                </p>
                <p className="font-semibold mb-8">{CONTACT.emergency}</p>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-bold">WhatsApp</span>
                      <a
                        href={whatsappLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1 text-primary-foreground/80 hover:underline"
                      >
                        {CONTACT.phoneDisplay}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Phone className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-bold">Call / SMS</span>
                      <a href={PHONE_LINK} className="inline-block py-1 text-primary-foreground/80 hover:underline">
                        {CONTACT.phoneDisplay}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-bold">Service Area</span>
                      <span className="text-primary-foreground/80">
                        {PRACTICE.serviceAreaLabel}: {PRACTICE.serviceArea.join(", ")} — mobile home visits
                      </span>
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div {...fadeInRight}>
                <div className="bg-card text-card-foreground rounded-3xl p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                    <MapPin className="w-10 h-10 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-primary text-xl mb-2">We Come to You</h3>
                  <p className="text-muted-foreground mb-6">
                    Serving the {PRACTICE.serviceAreaLabel}
                    <br />
                    {PRACTICE.serviceArea.join(" · ")}
                    <br />
                    {PRACTICE.visitSettings.join(" · ")}
                  </p>
                  <Button size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                    <a href="#booking">Request a visit</a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        </main>

        {/* Footer */}
        <footer className="bg-primary-foreground text-primary py-12 border-t border-border/10">
          <div className="container px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <img
                  src={PRACTICE.logoUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md object-cover"
                />
                <span className="text-lg font-bold">{PRACTICE.name}</span>
              </div>
              <p className="text-primary/80 text-sm text-center">
                {PRACTICE.nameZh} — Licensed Integrative Physiotherapy · Emmett Technique · {PRACTICE.serviceAreaLabel}
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Ping Care Wellness"
                className="inline-flex p-2 text-primary/80 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
            <p className="pt-8 mt-8 border-t border-primary/10 text-center text-primary/80 text-sm">
              &copy; {new Date().getFullYear()} {PRACTICE.name}. All rights reserved. {PRACTICE.registration}
            </p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}

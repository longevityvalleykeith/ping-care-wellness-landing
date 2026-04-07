import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, MessageCircle, Sparkles, Heart, Shield, Send, Phone, MapPin, Clock, Users, Instagram } from "lucide-react";
import { useRef } from "react";

// Ping Care Wellness Supabase asset URLs
const PC_ASSETS = {
  heroImage: "https://wlwzfjlvwaosonorsvyf.supabase.co/storage/v1/object/public/brand-assets/ping-care-wellness/hero-physio.png",
  aiAssistant: "https://wlwzfjlvwaosonorsvyf.supabase.co/storage/v1/object/public/brand-assets/ping-care-wellness/ai-assistant-247.png",
  medicalEscort: "https://wlwzfjlvwaosonorsvyf.supabase.co/storage/v1/object/public/brand-assets/ping-care-wellness/medical-escort.png",
  logo: "https://wlwzfjlvwaosonorsvyf.supabase.co/storage/v1/object/public/brand-assets/ping-care-wellness/logo.jpg",
  telegramQR: "https://wlwzfjlvwaosonorsvyf.supabase.co/storage/v1/object/public/brand-assets/ping-care-wellness/telegram-qr.jpg",
};

// Contact links
const WHATSAPP_LINK = "https://wa.me/60126595319?text=Hi%20Sook%20Ping,%20I%20am%20interested%20in%20Ping%20Care%20Wellness%20services.";
const TELEGRAM_LINK = "https://t.me/Ping_Care_Bot";
const PHONE_NUMBER = "+6012-659 5319";

// Social media stubs (future extension)
const INSTAGRAM_LINK = "#"; // TODO: Add @pingcarewellness Instagram
const TIKTOK_LINK = "#"; // TODO: Add @pingcarewellness TikTok

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={PC_ASSETS.logo} alt="Ping Care Wellness" className="h-10 w-auto rounded-lg" />
            <div>
              <div className="text-xl font-bold text-primary tracking-wide">
                Ping Care Wellness
              </div>
              <div className="text-xs text-muted-foreground">萍心健康</div>
            </div>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-accent transition-colors">
              Services
            </a>
            <a href="#about" className="hover:text-accent transition-colors">
              About
            </a>
            <a href="#ai-assistant" className="hover:text-accent transition-colors">
              AI Assistant
            </a>
            <a href="#contact" className="hover:text-accent transition-colors">
              Contact
            </a>
          </div>
          <Button
            variant="default"
            className="rounded-full px-6 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            asChild
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              Book Session
            </a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={targetRef} className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 z-10" />
          <img
            src={PC_ASSETS.heroImage}
            alt="Ping Care Wellness — Professional Integrative Physiotherapy"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-primary/40 z-5" />
        </motion.div>

        <div className="container relative z-20 px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6 border border-white/25">
              <Heart className="w-4 h-4" />
              <span>Licensed Integrative Physiotherapy — MAHPC(PT)06056</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white tracking-tight">
              Care That Comes<br />
              <span className="text-secondary">to You.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
              Integrative physiotherapy, elder wellness, and medical escort services — hands-on care delivered to your home across the Klang Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-full text-lg px-8 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 text-accent-foreground font-semibold"
                asChild
              >
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  Book a Home Visit <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-lg px-8 border-white/40 text-white hover:bg-white/10 font-medium bg-transparent"
                asChild
              >
                <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4 mr-2" />
                  Chat with Ping Care AI
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/50"
        >
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-24 md:py-32 relative overflow-hidden bg-muted">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/4 z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container relative z-10 px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[4/5] md:aspect-square">
                <img
                  src={PC_ASSETS.medicalEscort}
                  alt="Ping Care Wellness — Medical Escort & Note Taking"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-medium uppercase tracking-wider">Hands-On Therapeutic Care</span>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs"
              >
                <h4 className="font-bold text-xl text-primary mb-2">Emmett Technique Specialist</h4>
                <p className="text-sm text-muted-foreground">
                  Certified <a href="https://www.emmett-technique-hq.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Emmett Technique</a> practitioner — gentle muscle release for elder care.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">Integrative Approach</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Integrative Physio,<br />
                <span className="italic text-muted-foreground">Right at Your Home</span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground mb-8">
                <p>
                  Led by Yip Sook Ping, a licensed integrative physiotherapist (MAHPC(PT)06056) specializing in elder care. She combines evidence-based physiotherapy with Emmett Technique, functional fitness assessment, and holistic rehabilitation — bridging clinical rigour with compassionate, person-centred care.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Heart, name: "Integrative Physio" },
                  { icon: Shield, name: "Emmett Technique" },
                  { icon: Users, name: "Caregiver Training" },
                  { icon: Clock, name: "Medical Escort" },
                  { icon: Sparkles, name: "Functional Fitness" },
                  { icon: MapPin, name: "Home-Based Care" },
                ].map((service, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-3 bg-card rounded-xl border border-border/50">
                    <service.icon className="w-6 h-6 text-accent mb-2" />
                    <span className="text-xs font-medium text-foreground/80">{service.name}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="rounded-full px-8 bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  Schedule a Visit <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0" style={{ opacity: 0.05 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container relative z-10 px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Care For</h2>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
              Personalized care for seniors and individuals recovering from illness, injury, or managing chronic conditions.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, title: "Elderly at Home", desc: "Specialized physiotherapy for seniors with complex medical needs" },
              { icon: Heart, title: "Post-Surgery Recovery", desc: "Rehabilitation and mobility restoration after surgical procedures" },
              { icon: Shield, title: "Chronic Conditions", desc: "Ongoing management of arthritis, nerve pain, and mobility challenges" },
              { icon: Clock, title: "Assisted Living", desc: "Regular visits to care facilities and retirement homes" },
            ].map((benefit, i) => (
              <div key={i} className="space-y-4 p-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <benefit.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-bold text-xl">{benefit.title}</h3>
                <p className="text-primary-foreground/60 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container px-6">
          <div className="text-center mb-16">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Comprehensive Wellness Care</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From physiotherapy to medical escorts — professional care tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Service 1: Mobile Physiotherapy */}
            <Card className="overflow-hidden border-2 border-accent/30 hover:border-accent/50 transition-colors">
              <div className="aspect-video overflow-hidden">
                <img
                  src={PC_ASSETS.heroImage}
                  alt="Integrative Physiotherapy — Hands-on Elder Care"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-semibold text-accent uppercase tracking-wide">Flagship</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Integrative Physiotherapy</h3>
                <p className="text-muted-foreground mb-6">
                  Licensed integrative physio delivered at your home — combining hands-on manual therapy, Emmett Technique, and functional fitness assessment for holistic elder rehabilitation.
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-primary">From RM 150</span>
                  <span className="text-muted-foreground">per session</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {[
                    "Licensed integrative physio assessment",
                    "Emmett Technique specialist",
                    "Functional fitness & mobility testing",
                    "3-week progress review cycle"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" asChild>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    Book Home Visit <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Service 2: Medical Escort & Coordination */}
            <Card className="overflow-hidden border-2 border-secondary/30 hover:border-secondary/50 transition-colors">
              <div className="aspect-video overflow-hidden">
                <img
                  src={PC_ASSETS.medicalEscort}
                  alt="Medical Escort & Note Taking"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                  <span className="text-sm font-semibold text-secondary uppercase tracking-wide">Support Service</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Medical Escort & Caregiver Training</h3>
                <p className="text-muted-foreground mb-6">
                  Professional accompaniment to hospital appointments with medical note-taking. Plus training for family caregivers to provide safe daily assistance.
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-primary">Enquire</span>
                  <span className="text-muted-foreground">customized to needs</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {[
                    "Hospital appointment accompaniment",
                    "Medical documentation & follow-up",
                    "Caregiver technique training",
                    "Care coordination with specialists"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-secondary shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-secondary/30 text-secondary hover:bg-secondary/10 font-semibold"
                  asChild
                >
                  <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                    Enquire via Telegram <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-muted relative overflow-hidden">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">About Us</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                萍心健康<br />
                <span className="text-muted-foreground">Ping Care Wellness</span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground mb-8">
                <p>
                  Founded by Yip Sook Ping, a licensed integrative physiotherapist registered with MAHPC (PT06056), Ping Care Wellness provides compassionate mobile healthcare for seniors and those with complex medical needs across the Klang Valley.
                </p>
                <p>
                  Sook Ping is a certified <a href="https://www.emmett-technique-hq.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">Emmett Technique</a> practitioner — a gentle, non-invasive muscle release method that produces immediate, lasting results for pain, mobility, and wellbeing. Combined with functional fitness assessment and holistic rehabilitation, this integrative approach delivers measurable outcomes in comfort and dignity.
                </p>
              </div>

              <div className="flex items-center gap-4 p-6 bg-card rounded-2xl border border-border/50">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Ping Care AI Assistant</h4>
                  <p className="text-sm text-muted-foreground">
                    Powered by Longevity Valley Healthcare AI Platform — available 24/7 on Telegram to answer questions and schedule visits.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src={PC_ASSETS.heroImage}
                  alt="Yip Sook Ping — Integrative Physiotherapy Session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-sm font-medium uppercase tracking-wider mb-1">Licensed Mobile Physiotherapy</div>
                  <div className="text-lg font-bold">Klang Valley &middot; Home-Based Care &middot; PDPA Compliant</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Assistant + Telegram QR Section */}
      <section id="ai-assistant" className="py-24 bg-background relative overflow-hidden">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">24/7 AI Assistant</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Meet Your<br />
                <span className="text-muted-foreground">Ping Care AI</span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground mb-8">
                <p>
                  Scan the QR code to chat with our Telegram AI assistant. Ask about our services, check availability, or schedule a home visit — any time, day or night.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-semibold"
                  asChild
                >
                  <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 w-4 h-4" />
                    Open @Ping_Care_Bot
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-accent/30 text-accent hover:bg-accent/10 font-semibold ml-0 sm:ml-4"
                  asChild
                >
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 w-4 h-4" />
                    WhatsApp Sook Ping
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/50 max-w-md">
                <img
                  src={PC_ASSETS.aiAssistant}
                  alt="Ping Care Wellness 24/7 AI Assistant"
                  className="w-full object-cover"
                />
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-xl border border-border/50 max-w-xs">
                <div className="text-center mb-3">
                  <h4 className="font-bold text-primary text-base">Scan to Chat</h4>
                  <p className="text-muted-foreground text-xs">@Ping_Care_Bot on Telegram</p>
                </div>
                <img
                  src={PC_ASSETS.telegramQR}
                  alt="Ping Care Wellness Telegram QR Code"
                  className="w-full aspect-square object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-primary text-primary-foreground">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-primary-foreground/70 text-lg mb-8">
                Ready to experience professional care at home? Contact Sook Ping today to discuss your needs or schedule a home visit.
              </p>

              <div className="space-y-6">
                {/* WhatsApp */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h4 className="font-bold">WhatsApp</h4>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-foreground/70 hover:text-[#25D366] transition-colors"
                    >
                      {PHONE_NUMBER}
                    </a>
                  </div>
                </div>

                {/* Telegram */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0088cc]/20 flex items-center justify-center">
                    <Send className="w-6 h-6 text-[#0088cc]" />
                  </div>
                  <div>
                    <h4 className="font-bold">Telegram</h4>
                    <a
                      href={TELEGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-foreground/70 hover:text-[#0088cc] transition-colors"
                    >
                      @Ping_Care_Bot
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Call / SMS</h4>
                    <a
                      href={`tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`}
                      className="text-primary-foreground/70 hover:text-secondary transition-colors"
                    >
                      {PHONE_NUMBER}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold">Service Area</h4>
                    <p className="text-primary-foreground/70">
                      Klang Valley, Selangor<br />
                      Mobile home visits
                    </p>
                  </div>
                </div>

                {/* Social Media Stubs */}
                <div className="flex items-center gap-4 pt-4 border-t border-primary-foreground/10">
                  <a
                    href={INSTAGRAM_LINK}
                    className="w-12 h-12 rounded-full bg-[#E4405F]/20 flex items-center justify-center hover:bg-[#E4405F]/30 transition-colors"
                    title="Coming Soon — Instagram"
                  >
                    <Instagram className="w-6 h-6 text-[#E4405F]" />
                  </a>
                  <a
                    href={TIKTOK_LINK}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    title="Coming Soon — TikTok"
                  >
                    <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.85a4.83 4.83 0 0 1-1-.16z"/>
                    </svg>
                  </a>
                  <span className="text-primary-foreground/40 text-sm ml-2">Social media coming soon</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Button
                  size="lg"
                  className="rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold"
                  asChild
                >
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 w-4 h-4" />
                    WhatsApp Sook Ping
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold bg-transparent"
                  asChild
                >
                  <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 w-4 h-4" />
                    Chat on Telegram
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Map / Visit Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-card rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-accent" />
                  </div>
                  <h4 className="font-bold text-primary text-xl mb-2">We Come to You</h4>
                  <p className="text-muted-foreground mb-4">
                    Serving the entire Klang Valley<br />
                    Kuala Lumpur &middot; Selangor &middot; Malacca<br />
                    Home &middot; Care Facilities &middot; Hospitals
                  </p>
                  <a
                    href="https://maps.google.com/?q=Klang+Valley+Selangor+Malaysia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm"
                  >
                    View Service Area on Map
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-foreground text-primary py-12 border-t border-border/10">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={PC_ASSETS.logo} alt="Ping Care Wellness" className="h-8 w-auto rounded-md" />
              <div className="text-lg font-bold">Ping Care Wellness</div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-primary/60 text-sm">
                萍心健康 — Licensed Integrative Physiotherapy &middot; Emmett Technique &middot; Klang Valley
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-primary/60 hover:text-[#25D366] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="text-primary/60 hover:text-[#0088cc] transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href={INSTAGRAM_LINK} className="text-primary/60 hover:text-[#E4405F] transition-colors" title="Coming Soon">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={TIKTOK_LINK} className="text-primary/60 hover:text-primary transition-colors" title="Coming Soon">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.85a4.83 4.83 0 0 1-1-.16z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-primary/10 text-center text-primary/40 text-sm">
            &copy; {new Date().getFullYear()} Ping Care Wellness. All rights reserved. MAHPC(PT)06056
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import MemberHome from "@/pages/MemberHome";
import { Sparkles, Users, MessageSquare, HeartPulse, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/lib/AuthContext";
import { MASCOT_URL } from "@/lib/constants";
import Seo from "@/components/Seo";
import AdUnit from "@/components/AdUnit";

const FEATURES = [
  {
    icon: Sparkles,
    title: "The PCOS Oracle",
    desc: "Chat with Dr. Tinc Anne, an AI devoted entirely to PCOS — symptoms, nutrition, fertility, mental health and more. Warm, expert, and always on-topic.",
  },
  {
    icon: Users,
    title: "A caring community",
    desc: "Connect with women who get it. Share in live chat, ask and answer questions, and make friends who understand your journey.",
  },
  {
    icon: BookOpen,
    title: "Clear, trustworthy info",
    desc: "Plain-language guidance you can trust, with honest reminders to lean on your clinician for diagnosis and treatment.",
  },
];

export default function Landing() {
  const { isAuthenticated, authChecked } = useAuth();
  const navigate = useNavigate();

  if (authChecked && isAuthenticated) return <MemberHome />;

  return (
    <div className="overflow-hidden">
      <Seo
        title="MyPCOS - PCOS Symptoms, Diet & Fertility Support | Ask Dr. Tinc Anne"
        description="Get clear, trustworthy answers about PCOS from Dr. Tinc Anne - an AI expert devoted entirely to Polycystic Ovary Syndrome. Free to join."
      />
      <AdUnit />
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent/40 via-background to-background" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <HeartPulse className="h-3.5 w-3.5" /> Comprehensive PCOS support
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl md:text-6xl">
              Your guide to life with <span className="text-primary">PCOS</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground md:mx-0">
              Meet Dr. Tinc Anne, the PCOS Oracle — a warm, knowledgeable companion who knows all
              things PCOS. Ask anything, find your community, and feel supported on your journey.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/register")}>
                <Sparkles className="mr-2 h-4 w-4" /> Ask the Oracle — it's free
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/faq")}>
                Browse the FAQ
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already a member?{" "}
              <button onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
                Sign in
              </button>
            </p>
          </div>

          <div className="relative mx-auto max-w-sm md:max-w-none">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/10 via-accent/40 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-primary/5">
              <Image
                src={MASCOT_URL}
                alt="Dr. Tinc Anne, the PCOS Oracle"
                className="aspect-[4/5] w-full object-cover"
                fittingType="fill"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
              <p className="font-display text-sm font-semibold">Dr. Tinc Anne</p>
              <p className="text-xs text-muted-foreground">PCOS expert · here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is PCOS */}
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
          <h2 className="font-display text-2xl font-semibold">What is PCOS?</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Polycystic Ovary Syndrome (PCOS) is a common hormonal condition that affects how a
            woman's ovaries work. It can involve irregular periods, excess androgens, and
            polycystic ovaries — and it often comes alongside insulin resistance, fertility
            challenges, and changes to skin, hair, and mood. PCOS looks different for everyone,
            and there's no one-size-fits-all approach — which is exactly why good information and
            supportive community matter.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The PCOS Oracle brings both together: an AI guide focused exclusively on PCOS, and a
            community of women supporting each other through it.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-card p-6 transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <h2 className="font-display text-3xl font-semibold">You're not alone in this</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/85">
            Create a free account to chat with Dr. Tinc Anne and join a community that understands.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-7 w-full sm:w-auto"
            onClick={() => navigate("/register")}
          >
            Get started — it's free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
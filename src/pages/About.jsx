import { HeartPulse, Sparkles, Shield, Users } from "lucide-react";
import { Image } from "@/components/ui/image";
import { SITE_LOGO_URL } from "@/lib/constants";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Seo from "@/components/Seo";
import AdUnit from "@/components/AdUnit";

const VALUES = [
  {
    icon: Sparkles,
    title: "Knowledge you can trust",
    desc: "Clear, plain-language information about PCOS — and an AI guide who stays on topic and points you to your clinician when it matters.",
  },
  {
    icon: Users,
    title: "Community, not isolation",
    desc: "PCOS can feel lonely. Here you'll find women who understand — to ask, answer, befriend, and walk alongside you.",
  },
  {
    icon: Shield,
    title: "Safe and moderated",
    desc: "A supportive, kind space. Harmful content is reported and reviewed so the community stays a soft place to land.",
  },
];

export default function About() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <Seo
        title="About the PCOS Oracle & Dr. Tinc Anne | MyPCOS"
        description="Learn about MyPCOS, Dr. Tinc Anne, and the mission to give every woman navigating PCOS clear information and a kind community."
      />
      {/* Intro */}
      <section className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            About the <span className="text-primary">PCOS Oracle</span>
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The PCOS Oracle exists for one reason: to give women navigating Polycystic Ovary
            Syndrome a place that's both deeply informative and genuinely kind. PCOS is
            complicated, under-discussed, and different for everyone — so we brought together an
            AI expert devoted entirely to PCOS and a community of women who understand what it's
            like.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Whether you're newly diagnosed, years into your journey, or supporting someone you
            love, you're welcome here.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The PCOS Oracle is built and maintained by a small, independent team who care about
            women's health and compassionate, accessible information. We're not a clinic or a
            pharmaceutical company — just people who believe everyone navigating PCOS deserves
            clear answers and a kind community.
          </p>
        </div>
        <div className="mx-auto w-44 shrink-0 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-md md:w-52">
          <Image src={SITE_LOGO_URL} alt="MyPCOS logo" className="aspect-square w-full object-cover" fittingType="fit" />
        </div>
      </section>

      {/* Dr. Tinc Anne */}
      <section className="mt-14 rounded-3xl border border-border bg-card p-7 sm:p-9">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-semibold">Meet Dr. Tinc Anne</h2>
        </div>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Dr. Tinc Anne is the heart of the PCOS Oracle — an anthropomorphic tin-can doctor with a
          warm, doctorly voice and a passion for all things PCOS. Ask her anything about symptoms,
          nutrition, fertility, mental health, and life with PCOS, and she'll answer with clarity
          and care. Ask her about something else, and she'll gently bring you back to PCOS — that's
          her one focus.
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          She's an educational companion, not a licensed physician. Whenever a question touches
          on diagnosis or treatment, she'll remind you to lean on a real clinician — because the
          best guidance pairs good information with real medical care.
        </p>
      </section>

      {/* Values */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">What we stand for</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <AdUnit />

      <div className="mt-12">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
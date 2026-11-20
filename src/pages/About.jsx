import { HeartPulse, Sparkles, Shield, Users } from "lucide-react";
import { Image } from "@/components/ui/image";
import { SITE_LOGO_URL } from "@/lib/constants";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Seo from "@/components/Seo";

const OFFERINGS = [
  {
    title: "Dr. Tinc Anne, your PCOS Oracle",
    desc: "An AI expert devoted entirely to Polycystic Ovary Syndrome. Ask about symptoms, types, nutrition, fertility, or mental health — by text or by voice, any time.",
  },
  {
    title: "A community that gets it",
    desc: "A searchable Q&A forum for the questions you'd rather not sit with alone, plus a live chat room to talk things through in real time.",
  },
  {
    title: "Friends and private messages",
    desc: "Find women on a similar path, send a friend request, and keep the conversation going one-on-one.",
  },
  {
    title: "Badges for showing up",
    desc: "Earn badges as you ask, answer, and support others — small milestones that make participation feel good.",
  },
];

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
        title="About MyPCOS - PCOS Answers, Community & Support"
        description="What MyPCOS offers: Dr. Tinc Anne, an AI expert devoted to PCOS, a moderated community with Q&A and live chat, friendships, and private messages."
      />
      {/* Intro */}
      <section className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            About <span className="text-primary">MyPCOS</span>
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            MyPCOS is a supportive home for women navigating Polycystic Ovary Syndrome — part
            expert guide, part community. PCOS is complicated, under-discussed, and different for
            everyone, so we built one place that covers both the information you need and the
            people who understand what it's like.
          </p>
          <p className="mt-4 font-medium text-foreground">Here's what you'll find inside:</p>
          <ul className="mt-4 space-y-3">
            {OFFERINGS.map((o) => (
              <li key={o.title} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{o.title}</span> — {o.desc}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Whether you're newly diagnosed, years into your journey, or supporting someone you
            love, you're welcome here.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            MyPCOS is built and maintained by a small, independent team who care about women's
            health and compassionate, accessible information. We're not a clinic or a
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
          Dr. Tinc Anne is the heart of MyPCOS — an anthropomorphic tin-can doctor with a
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

      <div className="mt-12">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
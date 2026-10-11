import { Link } from "react-router-dom";
import { Sparkles, Users, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/lib/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { MASCOT_URL, SITE_LOGO_URL } from "@/lib/constants";
import DisclaimerBanner from "@/components/DisclaimerBanner";

const CARDS = [
  {
    to: "/oracle",
    icon: Sparkles,
    title: "The PCOS Oracle",
    desc: "Ask Dr. Tinc Anne anything about PCOS — by text or out loud with voice mode.",
    cta: "Start chatting",
  },
  {
    to: "/community",
    icon: Users,
    title: "Community",
    desc: "Connect with women who get it. Share in live chat, ask questions, and make friends.",
    cta: "Join the conversation",
  },
  {
    to: "/messages",
    icon: MessageSquare,
    title: "Messages",
    desc: "Your private conversations with friends you've made in the community.",
    cta: "Open messages",
  },
];

export default function MemberHome() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const firstName = (profile?.display_name || user?.full_name || "there").split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/40 via-card to-card p-6 sm:p-10">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-4 ring-primary/15">
            <Image src={SITE_LOGO_URL} alt="MyPCOS logo" className="h-full w-full object-cover" fittingType="fit" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              Hi, {firstName}
            </h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              This is your PCOS home. Ask Dr. Tinc Anne a question, connect with your community, or
              pick up where you left off.
            </p>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to}>
            <div className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {c.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Dr. Tinc Anne highlight */}
      <section className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/15">
            <Image src={MASCOT_URL} alt="Dr. Tinc Anne" className="h-full w-full object-cover" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-display text-xl font-semibold">A word from Dr. Tinc Anne</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              "Remember, every question is a good question. Whether you're navigating a new
              diagnosis or just need someone to talk to, I'm here. Come chat with me anytime."
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link to="/oracle">
                <Sparkles className="mr-2 h-4 w-4" /> Ask me anything
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
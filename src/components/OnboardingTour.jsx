import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, MessageSquare, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { SITE_LOGO_URL } from "@/lib/constants";

const TOUR_KEY = "mypcos_onboarding_v1";

// Each step jumps to a different screen position so the user has to
// visually locate the card (and its Next button) each time — preventing
// mindless "next spamming." On mobile the card stays centered.
const steps = [
  {
    logo: true,
    iconBg: "bg-primary/10",
    title: "Welcome to MyPCOS! \u{1F49B}",
    description:
      "We're so glad you're here. Let's take a quick tour to show you around — it only takes a minute.",
    position: "items-center justify-center",
    buttonLabel: "Let's start",
  },
  {
    icon: Sparkles,
    iconBg: "bg-primary/15 text-primary",
    title: "Meet Dr. Tinc Anne",
    description:
      "Your personal PCOS expert, available 24/7. Tap 'Oracle' in the navigation bar to ask about symptoms, diet, fertility, or anything PCOS-related.",
    position: "items-center justify-center sm:items-start sm:justify-end sm:pt-24 sm:pr-8",
    buttonLabel: "Next",
  },
  {
    icon: Users,
    iconBg: "bg-emerald-100 text-emerald-600",
    title: "You're not alone",
    description:
      "Tap 'Community' in the nav to join real-time chats with other women who get it. Ask questions, share your journey, and find support in a safe, welcoming space.",
    position: "items-center justify-center sm:items-end sm:justify-start sm:pb-24 sm:pl-8",
    buttonLabel: "Next",
  },
  {
    icon: MessageSquare,
    iconBg: "bg-blue-100 text-blue-600",
    title: "Connect with others",
    description:
      "Send friend requests and private messages to build your support network. Tap 'Messages' in the nav to check your conversations.",
    position: "items-center justify-center sm:items-end sm:justify-end sm:pb-24 sm:pr-8",
    buttonLabel: "Next",
  },
  {
    icon: Award,
    iconBg: "bg-amber-100 text-amber-600",
    title: "Earn titles by showing up",
    description:
      "Visit regularly to build login streaks and unlock titles like 'First Steps', 'Finding Rhythm', and 'PCOS Warrior'. Answer questions to earn more — from 'Helpful Voice' all the way to 'Sage of the Oracle'.",
    position: "items-center justify-center sm:items-start sm:justify-start sm:pt-24 sm:pl-8",
    buttonLabel: "Next",
  },
  {
    logo: true,
    iconBg: "bg-primary/10",
    title: "You're all set! \u{1F389}",
    description:
      "Your journey with MyPCOS starts now. Dr. Tinc Anne is ready to chat whenever you are.",
    position: "items-center justify-center",
    buttonLabel: "Let's go!",
  },
];

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY)) return;
    setVisible(true);
  }, []);

  // Brief cooldown after each step so the user has a moment to read
  // before the button becomes clickable — secondary anti-spam measure.
  useEffect(() => {
    setButtonEnabled(false);
    const timer = setTimeout(() => setButtonEnabled(true), 700);
    return () => clearTimeout(timer);
  }, [step]);

  const finish = () => {
    localStorage.setItem(TOUR_KEY, "true");
    setVisible(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finish();
  };

  if (!visible) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[101] overflow-y-auto p-4 sm:p-6">
        <div className={cn("flex min-h-full", current.position)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
          >
            <div className="flex flex-col items-center text-center">
              {current.logo ? (
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl ring-2 ring-primary/15">
                  <Image src={SITE_LOGO_URL} alt="MyPCOS" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl",
                    current.iconBg
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>
              )}
              <h2 className="mt-5 font-display text-xl font-semibold sm:text-2xl">
                {current.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {current.description}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={finish}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Skip tour
              </button>
              <button
                onClick={handleNext}
                disabled={!buttonEnabled}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-semibold transition",
                  buttonEnabled
                    ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                )}
              >
                {current.buttonLabel}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </>
  );
}
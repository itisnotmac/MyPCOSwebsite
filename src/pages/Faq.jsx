import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DisclaimerBanner from "@/components/DisclaimerBanner";

const FAQS = [
  {
    q: "What is PCOS?",
    a: "Polycystic Ovary Syndrome (PCOS) is a common hormonal condition affecting people with ovaries, often involving irregular periods, elevated androgens, and polycystic ovaries. It frequently comes with insulin resistance and can affect fertility, skin, hair, weight, and mood. It's a spectrum — it looks different for everyone.",
  },
  {
    q: "How is PCOS diagnosed?",
    a: "PCOS is usually diagnosed using the Rotterdam criteria, which looks at three factors: irregular or absent periods, signs of high androgens (like excess hair, acne, or blood-test levels), and polycystic ovaries on ultrasound. You need two of the three, with other conditions ruled out. A clinician — often an endocrinologist or gynecologist — makes the diagnosis.",
  },
  {
    q: "What are the common types of PCOS?",
    a: "PCOS is often grouped into types based on the main driver: insulin-resistant (the most common), post-pill (appearing after stopping hormonal birth control), adrenal (stress-driven, with elevated DHEA-S), and inflammatory. Many people have overlapping features. Dr. Tinc Anne can explain each in more detail.",
  },
  {
    q: "Can PCOS be 'cured'?",
    a: "There's no cure that eliminates PCOS entirely, but it can be managed very effectively. Many people see major improvements in symptoms through a combination of nutrition, movement, stress management, and — when appropriate — medication. Management is personal, and what works best depends on your type and goals.",
  },
  {
    q: "Can I get pregnant with PCOS?",
    a: "Yes — many people with PCOS conceive, sometimes naturally and sometimes with support. PCOS is one of the most common — and treatable — causes of infertility. Options range from lifestyle changes to medications that support ovulation. If you're trying to conceive, a fertility specialist can guide you.",
  },
  {
    q: "What should I eat with PCOS?",
    a: "There's no single PCOS diet, but many benefit from stabilizing blood sugar: balanced meals with protein, healthy fats, and fiber; fewer refined carbs and added sugars; and regular meal timing. Since insulin resistance is common, a clinician or dietitian can tailor guidance to you. Dr. Tinc Anne can share general principles too.",
  },
  {
    q: "Is the PCOS Oracle a replacement for my doctor?",
    a: "No. Dr. Tinc Anne offers education and support, not medical advice, diagnosis, or treatment. For anything involving diagnosis, medications, or personal health decisions, please consult a qualified healthcare clinician. The Oracle is a companion alongside your care team — not a substitute for it.",
  },
  {
    q: "What can Dr. Tinc Anne help with?",
    a: "Anything related to PCOS: symptoms, types, diagnosis, nutrition, supplements, medications, fertility, pregnancy, insulin resistance, weight, skin and hair, cycles, and mental health — plus emotional support. She politely declines questions unrelated to PCOS so the conversation stays focused and useful.",
  },
  {
    q: "Is the community moderated?",
    a: "Yes. Our community is moderated to keep it supportive and safe. You can report any message, question, or answer that feels harmful or off-topic, and our moderators review reports. Please be kind, share evidence-informed experiences, and remember that personal stories aren't medical advice.",
  },
  {
    q: "Is my account and information private?",
    a: "Your Oracle conversations are private to you. Your profile and community contributions are visible to other members. You control what you share in your profile and posts. Be mindful not to share sensitive personal or medical details publicly.",
  },
];

export default function Faq() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Everything you might want to know about PCOS and the PCOS Oracle.
        </p>
      </div>

      <div className="mt-10">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-5 data-[state=open]:shadow-sm [&:not(:first-child)]:mt-3"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-10">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
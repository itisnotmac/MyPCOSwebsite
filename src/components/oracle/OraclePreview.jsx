import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, MessageCircle, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { MASCOT_URL, PCOS_TOPICS } from "@/lib/constants";
import DisclaimerBanner from "@/components/DisclaimerBanner";

// Sample Q&A — rich, crawlable PCOS content that Google can index and rank.
// These are real, helpful answers covering the top-searched PCOS questions.
const SAMPLE_QA = [
  {
    q: "What are the most common PCOS symptoms?",
    a: "PCOS symptoms vary widely but commonly include irregular or absent periods, excess facial or body hair (hirsutism), acne, thinning hair or hair loss, weight gain or difficulty losing weight, darkened skin patches (acanthosis nigricans), and polycystic ovaries visible on ultrasound. Many women also experience fatigue, mood changes, and fertility challenges. Because PCOS affects everyone differently, you may have some symptoms and not others — a diagnosis doesn't require all of them.",
  },
  {
    q: "Which foods help with insulin resistance in PCOS?",
    a: "Insulin resistance is common in PCOS, and diet plays a key role. Focus on whole foods that stabilize blood sugar: non-starchy vegetables, lean proteins, healthy fats (avocados, nuts, olive oil), and high-fiber carbohydrates like beans, lentils, and whole grains. Foods with a low glycemic index help reduce insulin spikes. Limit refined sugars, processed carbs, and sugary drinks. Eating protein and fiber together with carbs slows sugar absorption and keeps blood sugar more stable throughout the day.",
  },
  {
    q: "How is PCOS diagnosed?",
    a: "PCOS is typically diagnosed using the Rotterdam criteria, which require at least two of three: irregular or absent periods, signs of excess androgens (high testosterone, hirsutism, acne), and polycystic ovaries on ultrasound. Your doctor will also rule out other conditions like thyroid disorders. Diagnosis often involves blood tests, an ultrasound, and a review of your symptoms and cycle history. There's no single test — it's a clinical diagnosis based on the overall picture.",
  },
  {
    q: "Can PCOS cause hair loss?",
    a: "Yes, hair loss is a common but distressing PCOS symptom. Elevated androgens can cause thinning hair at the crown and temples (androgenetic alopecia), similar to male pattern baldness. The good news: it's treatable. Options include anti-androgen medications like spironolactone, topical minoxidil, and addressing insulin resistance through diet and supplements like inositol. Reducing inflammation and balancing hormones can slow or reverse the hair loss over time. Talk to a dermatologist or endocrinologist for a tailored plan.",
  },
  {
    q: "How does PCOS affect fertility?",
    a: "PCOS is one of the most common causes of infertility, but it's also one of the most treatable. Irregular ovulation means fewer opportunities to conceive, but many women with PCOS get pregnant naturally or with help. Lifestyle changes (diet, exercise, weight management) can restore regular ovulation. If needed, medications like letrozole or clomiphene can stimulate ovulation, and IVF is an option for more complex cases. Inositol supplements have also shown promise for improving ovulation in PCOS.",
  },
  {
    q: "What supplements help with PCOS?",
    a: "Several supplements have evidence for PCOS: inositol (myo-inositol and D-chiro-inositol, typically in a 40:1 ratio) for insulin sensitivity and ovulation, vitamin D (commonly low in PCOS), omega-3 fatty acids for inflammation, berberine for insulin resistance, and zinc for androgen levels. Always talk to your doctor before starting supplements, as dosages and interactions matter — but these are among the most researched and promising options for managing PCOS symptoms naturally.",
  },
  {
    q: "Can you get pregnant with PCOS?",
    a: "Yes — absolutely. PCOS doesn't mean you can't get pregnant; it means ovulation may be irregular, making conception harder to time. Many women with PCOS conceive naturally, and for those who need help, treatments are very effective. Lifestyle changes alone restore ovulation in many cases. If not, ovulation induction medications, IUI, or IVF have high success rates for PCOS patients. The key is working with a fertility specialist who understands PCOS.",
  },
  {
    q: "What's the best diet for PCOS?",
    a: "There's no single best PCOS diet, but the most effective approach focuses on managing insulin resistance and inflammation. A low-glycemic, anti-inflammatory diet rich in whole foods works well: plenty of vegetables, lean proteins, healthy fats, and fiber; limited refined carbs and added sugars. Some women benefit from a lower-carb or Mediterranean-style approach. The most important factor is sustainability — a diet you can maintain long-term that keeps blood sugar stable and supports hormone balance.",
  },
];

function SampleQA() {
  return (
    <div className="space-y-4">
      {SAMPLE_QA.map((item, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OraclePreview() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent/40 via-background to-background" />
        <div className="grid items-center gap-8 py-8 md:grid-cols-[1fr_auto] md:py-12">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI PCOS Expert
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Ask Dr. Tinc Anne — Your PCOS Oracle
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground md:mx-0">
              Get expert, compassionate answers to any PCOS question — symptoms, nutrition, fertility,
              insulin resistance, mental health, and more. Dr. Tinc Anne is a warm, knowledgeable companion
              devoted entirely to PCOS. Free to use, always available.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/register")}>
                <Sparkles className="mr-2 h-4 w-4" /> Ask your question — free
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </div>
          </div>
          <div className="relative mx-auto max-w-[220px] md:max-w-none">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/10 via-accent/40 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-xl shadow-primary/5">
              <Image
                src={MASCOT_URL}
                alt="Dr. Tinc Anne, the PCOS Oracle AI expert"
                className="aspect-square w-full object-cover"
                fittingType="fill"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">What Dr. Tinc Anne can help with</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          She's trained exclusively on PCOS — every topic below is fair game.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {PCOS_TOPICS.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-sm font-medium text-foreground/80"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* Sample Q&A — the crawlable content */}
      <section className="py-8">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-semibold">Sample questions & answers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Curious what Dr. Tinc Anne sounds like? Here are real answers to the PCOS questions women
            ask most. Log in to ask your own.
          </p>
        </div>
        <SampleQA />
      </section>

      {/* Disclaimer */}
      <div className="py-4">
        <DisclaimerBanner />
      </div>

      {/* CTA */}
      <section className="py-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-10 text-center text-primary-foreground sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <HeartPulse className="mx-auto h-8 w-8 text-primary-foreground/90" />
          <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
            Have a PCOS question of your own?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/85">
            Create a free account and chat with Dr. Tinc Anne — she's warm, on-topic, and always available.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-6 w-full sm:w-auto"
            onClick={() => navigate("/register")}
          >
            Get started — it's free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
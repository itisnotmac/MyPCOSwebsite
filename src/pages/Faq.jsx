import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Seo from "@/components/Seo";

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
  {
    q: "Can PCOS cause hair loss?",
    a: "Yes. Androgenic alopecia is a common PCOS symptom — elevated androgens can thin hair on the scalp, often at the crown or temples. It's different from general shedding and is usually gradual. Treatments may include medications that lower androgens, topical treatments like minoxidil, or lifestyle changes. A dermatologist or endocrinologist can help identify the best approach for you.",
  },
  {
    q: "What is insulin resistance and how is it linked to PCOS?",
    a: "Insulin resistance means your body's cells don't respond well to insulin, so your pancreas produces more of it. High insulin can trigger the ovaries to make more androgens, which worsens PCOS symptoms like irregular cycles, weight gain, and excess hair. Up to 70% of people with PCOS have insulin resistance. Management often includes nutrition changes, regular movement, and sometimes medications like metformin.",
  },
  {
    q: "What supplements help with PCOS?",
    a: "Some supplements show promise for PCOS, though evidence varies. Inositol (especially myo-inositol) is the most studied and may help with insulin sensitivity and ovulation. Vitamin D deficiency is common in PCOS and supplementation may help. Omega-3s may support heart health and reduce inflammation. Always talk to your clinician before starting supplements — they can interact with medications and aren't a substitute for medical care.",
  },
  {
    q: "Can teenagers have PCOS?",
    a: "Yes. PCOS can develop in adolescence, often becoming noticeable after puberty. In teens, it may show up as irregular periods, severe acne, excess facial or body hair, or weight changes. Diagnosis can be trickier in teens because some symptoms overlap with normal puberty. A pediatric endocrinologist or adolescent gynecologist can evaluate and help manage symptoms early.",
  },
  {
    q: "Does PCOS cause weight gain?",
    a: "PCOS is associated with weight gain and difficulty losing weight, largely due to insulin resistance, which affects how your body stores and uses energy. Not everyone with PCOS gains weight — about half of people with PCOS are at a typical weight. For those who do struggle, focusing on insulin-sensitizing habits like balanced meals, regular movement, and stress and sleep management can be more effective than restrictive dieting.",
  },
  {
    q: "What are the best exercises for PCOS?",
    a: "Regular movement helps PCOS by improving insulin sensitivity, supporting weight management, and reducing stress. A mix of cardiovascular exercise and strength training is ideal — even 30 minutes a day, five days a week, makes a difference. If you're starting out, walking and yoga are gentle entry points. The best exercise is one you enjoy and can stick with consistently.",
  },
  {
    q: "Can PCOS go away after pregnancy?",
    a: "PCOS doesn't go away after pregnancy, but symptoms can shift. Some people find their cycles become more regular, while others notice no change. PCOS is a lifelong condition, but its expression changes over time — especially with age, lifestyle changes, and hormonal shifts. Ongoing management and regular check-ins with your care team remain important.",
  },
  {
    q: "How does PCOS affect mental health?",
    a: "PCOS is linked to higher rates of anxiety, depression, and disordered eating, partly due to hormonal imbalances and partly to the emotional toll of chronic symptoms. The physical changes — weight, hair, skin, fertility struggles — can affect self-esteem and body image. If you're struggling, you're not alone, and support helps: therapy, community, stress management, and treating the underlying PCOS can all make a difference.",
  },
  {
    q: "Is PCOS hereditary or genetic?",
    a: "PCOS has a strong genetic component — it tends to run in families. If your mother, sister, or aunt has PCOS, your risk is higher. Research suggests multiple genes are involved, though no single gene causes it. Genetics interact with lifestyle and environment, so having the genes doesn't guarantee you'll develop PCOS, and management can still significantly improve symptoms.",
  },
  {
    q: "What's the difference between PCOS and PCO?",
    a: "PCO (polycystic ovaries) means ovaries with many small follicles seen on ultrasound — it's a finding, not a diagnosis. PCOS (Polycystic Ovary Syndrome) is a hormonal condition that may include PCO but also involves symptoms like irregular periods and high androgens. You can have PCO without having PCOS, and some people with PCOS don't have polycystic ovaries. The diagnosis depends on the full clinical picture, not just the ultrasound.",
  },
];

export default function Faq() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Seo
        title="PCOS FAQ — Symptoms, Diagnosis, Diet & More | MyPCOS"
        description="Answers to the most common PCOS questions: symptoms, diagnosis, types, fertility, diet, supplements, hair loss, insulin resistance, and more."
      />
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
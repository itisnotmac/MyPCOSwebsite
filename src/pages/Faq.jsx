import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Seo from "@/components/Seo";
import AdUnit from "@/components/AdUnit";

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
  {
    q: "Can I have PCOS without any symptoms?",
    a: "Yes, it's possible. Some people have PCOS and don't realize it until they struggle to get pregnant or gain weight for unclear reasons. You can also have a mild form where symptoms aren't severe enough to notice. PCOS is a syndrome, so it looks different for everyone — and the absence of obvious symptoms doesn't mean your ovaries and hormones aren't affected. If you suspect PCOS, a clinician can evaluate your hormone levels, cycle history, and ultrasound to check.",
  },
  {
    q: "Why do different doctors disagree about my PCOS diagnosis?",
    a: "It's a common and frustrating experience. PCOS has no single test — it's diagnosed using criteria (most commonly the Rotterdam criteria) that require two of three features: irregular periods, signs of high androgens, and polycystic ovaries on ultrasound. Different clinicians may weigh these factors differently, and some require all three while others need only two. About 25-30% of women have polycystic ovaries on ultrasound without having PCOS, which adds to the confusion. If you're getting conflicting answers, an endocrinologist or reproductive specialist who sees PCOS regularly can often give a clearer assessment.",
  },
  {
    q: "What is Metformin and should I be taking it for PCOS?",
    a: "Metformin is a medication originally developed for type 2 diabetes that helps your body use insulin more effectively. Since up to 70% of people with PCOS have insulin resistance, doctors sometimes prescribe it off-label to help with blood sugar, irregular cycles, and ovulation. It's not right for everyone — your clinician may check your insulin and glucose levels (sometimes with an oral glucose tolerance test) before recommending it. Metformin can also cause digestive side effects, so it's usually started at a low dose. Never start it without medical guidance, and talk to your doctor about whether it fits your situation.",
  },
  {
    q: "Can PCOS cause miscarriage or pregnancy complications?",
    a: "PCOS is associated with a somewhat higher risk of certain pregnancy complications, including gestational diabetes, preeclampsia, and preterm birth. However, most people with PCOS carry healthy pregnancies to term. The increased risk is partly linked to insulin resistance and weight, both of which can be managed. If you're trying to conceive or already pregnant, working with your care team to manage blood sugar, weight, and nutrition can lower these risks. Early and regular prenatal care makes a real difference.",
  },
  {
    q: "Does PCOS go away with age or after menopause?",
    a: "PCOS doesn't disappear after menopause, but it does change. Your ovaries produce fewer androgens as you age, so symptoms like excess hair and acne may ease. However, the metabolic aspects — insulin resistance, weight management challenges, and risks for diabetes and heart disease — often persist or even increase with age. Many people find their menstrual irregularity resolves naturally as they approach menopause, but the long-term health risks remain. Ongoing management and regular health screenings continue to matter well beyond your reproductive years.",
  },
  {
    q: "What are the long-term health risks of PCOS?",
    a: "PCOS is linked to several long-term health risks, especially when not managed. These include type 2 diabetes (affecting roughly 20-30% of people with PCOS), high blood pressure, high cholesterol, heart disease, and endometrial (uterine) cancer — the last because irregular periods can cause the uterine lining to build up. Sleep apnea, fatty liver disease, and mood disorders are also more common. The good news: these risks can be significantly reduced through nutrition, regular movement, weight management, and routine screening. Regular check-ups with your care team help catch issues early when they're most treatable.",
  },
  {
    q: "Can birth control pills treat PCOS?",
    a: "Yes, combined hormonal birth control (pills, patches, or rings) is one of the most common first-line treatments for PCOS, especially for those not trying to conceive. It helps regulate periods, lowers androgens (which can reduce acne and excess hair), and protects the uterine lining from overgrowth. It doesn't treat the underlying insulin resistance, so it's often combined with lifestyle changes. Birth control isn't right for everyone — those with certain risk factors like a history of blood clots may need alternatives. Your clinician can help you weigh the benefits and find the right option.",
  },
  {
    q: "How do I know if I'm ovulating with PCOS?",
    a: "With PCOS, ovulation can be irregular or absent, so tracking it takes some effort. Common methods include ovulation predictor kits (urine tests that detect the LH surge before ovulation), basal body temperature tracking (your temperature rises slightly after ovulation), and monitoring cervical mucus changes. An app can help, but PCOS can cause false LH surges, so predictor kits aren't always reliable on their own. If you're trying to conceive, your doctor can confirm ovulation with blood tests (checking progesterone about a week before your period) or ultrasound. Dr. Tinc Anne can explain these methods in more detail.",
  },
  {
    q: "Can PCOS cause acne and excess facial hair?",
    a: "Yes — these are among the most visible and distressing symptoms of PCOS, affecting up to 70% of people with the condition. Elevated androgens (like testosterone) stimulate oil glands and hair follicles, causing persistent acne (often on the jawline, chest, and back) and hirsutism (dark, coarse hair on the face, chest, or abdomen). The same hormonal imbalance can also thin scalp hair. Treatments include hormonal birth control to lower androgens, anti-androgen medications like spironolactone, topical treatments, and laser hair removal. A dermatologist or endocrinologist can tailor a plan to your symptoms.",
  },
  {
    q: "Can I manage PCOS without medication?",
    a: "Yes, many people manage PCOS effectively with lifestyle changes alone, especially if they're not trying to conceive and their symptoms are mild to moderate. The most impactful changes focus on insulin sensitivity: eating balanced meals with protein, healthy fats, and fiber; limiting refined carbs and added sugars; moving regularly (a mix of cardio and strength training is ideal); managing stress; and prioritizing sleep. Even a 5-10% weight loss can restore regular ovulation and improve symptoms significantly. That said, some people benefit from medication alongside lifestyle changes — it's not a failure to need both. Your clinician can help you find the right balance.",
  },
];

export default function Faq() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Seo
        title="PCOS FAQ - Common Questions About Symptoms, Diet & Fertility | MyPCOS"
        description="Answers to the most common PCOS questions: diagnosis, nutrition, fertility, hair loss, insulin resistance, and more."
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

      <AdUnit />

      <div className="mt-10">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
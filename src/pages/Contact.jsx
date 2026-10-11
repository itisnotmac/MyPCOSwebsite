import { useState } from "react";
import { Send, Loader2, CheckCircle2, HeartPulse } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { SITE_LOGO_URL } from "@/lib/constants";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Seo from "@/components/Seo";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setError("");
    setSending(true);
    try {
      const res = await base44.functions.invoke("submitContact", form);
      if (res.status >= 400) {
        throw new Error(res.data?.error || "Something went wrong.");
      }
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <Seo
        title="Contact MyPCOS — Questions & Feedback"
        description="Get in touch with the MyPCOS team for questions, feedback, or ideas to make our PCOS community better."
      />
      <section className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Contact <span className="text-primary">us</span>
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Questions, feedback, or ideas to make the PCOS Oracle better? We'd love to hear from
            you. Send us a note and our team will get back to you as soon as we can.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            For medical concerns, please contact your healthcare provider — this form is for
            general inquiries about the app.
          </p>
        </div>
        <div className="mx-auto w-40 shrink-0 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-md md:w-48">
          <Image src={SITE_LOGO_URL} alt="MyPCOS logo" className="aspect-square w-full object-cover" fittingType="fit" />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-border bg-card p-7 sm:p-9">
        {sent ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold">Message sent</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Thank you for reaching out. We'll reply to the email you provided as soon as we can.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-semibold">Send a message</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" value={form.name} onChange={update("name")} placeholder="Jane Doe" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="jane@example.com" required maxLength={150} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={form.message} onChange={update("message")} placeholder="How can we help?" required maxLength={5000} rows={6} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={sending} className="w-full sm:w-auto">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending..." : "Send message"}
            </Button>
          </form>
        )}
      </section>

      <div className="mt-12">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DisclaimerBanner({ className, compact = false }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-accent/60 bg-accent/40 px-4 py-3 text-sm text-accent-foreground",
        className
      )}
    >
      <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="leading-relaxed">
        <span className="font-semibold">A gentle reminder from Dr. Tinc Anne:</span> this is
        educational support, not medical advice. For diagnosis or treatment decisions, please
        consult a qualified healthcare clinician.
      </p>
    </div>
  );
}
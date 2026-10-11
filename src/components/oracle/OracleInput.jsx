import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Module 3 of 3: typed question box with a Send button on the far right.
export default function OracleInput({ value, onChange, onSend, sending, error }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-3 shadow-sm sm:p-4">
      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Ask Dr. Tinc Anne about PCOS…"
          className="max-h-32 min-h-11 flex-1 resize-none"
          disabled={sending}
        />
        <Button
          onClick={onSend}
          disabled={sending || !value.trim()}
          className="h-11 shrink-0 gap-2 rounded-xl px-5"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span>Send</span>
        </Button>
      </div>
      <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
        Dr. Tinc Anne only answers PCOS questions · Not medical advice
      </p>
    </section>
  );
}
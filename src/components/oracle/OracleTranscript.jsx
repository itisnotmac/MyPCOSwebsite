import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import AssistantAvatar from "@/components/oracle/AssistantAvatar";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What are the most common PCOS symptoms?",
  "Which foods help with insulin resistance?",
  "How is PCOS diagnosed?",
  "Tips for managing PCOS mentally?",
];

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
      {isUser ? <UserAvatar name="you" src={null} className="h-9 w-9" /> : <AssistantAvatar />}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-card-foreground border border-border"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {!isUser && (
          <p className="mt-2 border-t border-border/60 pt-1.5 text-[11px] text-muted-foreground">
            Dr. Tinc Anne · educational support, not medical advice
          </p>
        )}
      </div>
    </div>
  );
}

// Module 2 of 3: the scrollable conversation history. Own fixed-height box, scrolls internally.
export default function OracleTranscript({ messages, loading, sending, onSuggestion }) {
  const scrollRef = useRef(null);
  const empty = !loading && messages.length === 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  return (
    <section
      ref={scrollRef}
      className="scrollbar-thin h-[55vh] min-h-[320px] max-h-[640px] space-y-4 overflow-y-auto rounded-3xl border border-border bg-card px-4 py-5 shadow-sm sm:px-5"
    >
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : empty ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <AssistantAvatar />
          <h3 className="mt-4 font-display text-xl font-semibold">Hi, I'm Dr. Tinc Anne</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your PCOS Oracle. I know all things PCOS — symptoms, nutrition, fertility, mental
            health and more. Ask me anything about PCOS. I'm here to help you feel informed and
            supported.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onSuggestion(s)}
                className="rounded-full border border-border bg-secondary/50 px-3.5 py-2 text-xs font-medium text-foreground/80 transition hover:border-primary/40 hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        messages.map((m) => <Bubble key={m.id || m.created_date} role={m.role} content={m.content} />)
      )}
      {sending && (
        <div className="flex items-end gap-2.5">
          <AssistantAvatar />
          <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
            <span className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
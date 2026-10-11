import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, Trash2, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { MASCOT_URL } from "@/lib/constants";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What are the most common PCOS symptoms?",
  "Which foods help with insulin resistance?",
  "How is PCOS diagnosed?",
  "Tips for managing PCOS mentally?",
];

function AssistantAvatar() {
  return (
    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/15">
      <Image src={MASCOT_URL} alt="Dr. Tinc Anne" className="h-full w-full object-cover" />
    </div>
  );
}

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
      {isUser ? (
        <UserAvatar name="you" src={null} className="h-9 w-9" />
      ) : (
        <AssistantAvatar />
      )}
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

export default function OracleChat({ onActivateVoice }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.OracleMessage.filter(
          {},
          { sort: "created_date", limit: 100 }
        );
        setMessages(res.items || []);
      } catch {
        setError("Could not load your conversation history.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const send = async (text) => {
    text = (text ?? input).trim();
    if (!text || sending) return;
    if (messages.length === 0) {
      base44.analytics.track({ eventName: "oracle_session_started" });
    }
    setInput("");
    setSending(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text, id: "u" + Date.now() }]);
    try {
      const res = await base44.functions.invoke("oracleChat", { message: text });
      const reply = res?.data?.reply;
      if (!reply) throw new Error(res?.data?.error || "Dr. Tinc Anne couldn't respond.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, id: "a" + Date.now() },
      ]);
    } catch (e) {
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = async () => {
    setClearing(true);
    try {
      await base44.entities.OracleMessage.deleteMany({});
      await base44.entities.OracleSummary.deleteMany({});
      setMessages([]);
      setError("");
      toast({
        title: "Conversation cleared",
        description: "Dr. Tinc Anne has forgotten this chat.",
      });
    } catch (e) {
      toast({
        title: "Could not clear conversation",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setClearing(false);
    }
  };

  const empty = !loading && messages.length === 0;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <div className="mb-3 shrink-0">
        <DisclaimerBanner />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-3">
            <AssistantAvatar />
            <div>
              <p className="font-display text-lg font-semibold leading-none">Dr. Tinc Anne</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online · PCOS expert
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onActivateVoice}
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-primary/40 bg-primary/10 px-8 py-4 text-base font-bold text-primary shadow-lg shadow-primary/10 transition hover:border-primary hover:bg-primary/15 hover:shadow-xl hover:shadow-primary/20"
              title="Switch to voice mode"
            >
              <motion.span
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex origin-bottom"
              >
                <Mic className="h-10 w-10" />
              </motion.span>
              <span className="hidden sm:inline">Voice chat</span>
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                disabled={clearing || sending || loading || messages.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear chat</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear this conversation?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dr. Tinc Anne will permanently forget everything you've discussed in this chat,
                  including the long-term memory summary. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearChat}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear conversation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>
        </div>

        <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
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
                    onClick={() => send(s)}
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
        </div>

        {error && (
          <p className="px-5 pb-1 text-xs text-destructive">{error}</p>
        )}

        <div className="border-t border-border p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask Dr. Tinc Anne about PCOS…"
              className="max-h-32 min-h-11 resize-none"
              disabled={sending}
            />
            <Button onClick={() => send()} disabled={sending || !input.trim()} size="icon" className="h-11 w-11 shrink-0 rounded-xl">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
            Dr. Tinc Anne only answers PCOS questions · Not medical advice
          </p>
        </div>
      </div>
    </div>
  );
}
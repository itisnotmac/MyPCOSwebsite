import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import OracleHeader from "@/components/oracle/OracleHeader";
import OracleTranscript from "@/components/oracle/OracleTranscript";
import OracleInput from "@/components/oracle/OracleInput";

export default function OracleChat({ onActivateVoice }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.OracleMessage.filter(
          {},
          { sort: "-created_date", limit: 10 }
        );
        setMessages((res.items || []).reverse());
        setHasMore(res.has_more);
      } catch {
        setError("Could not load your conversation history.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const send = async (text) => {
    text = (typeof text === "string" ? text : input).trim();
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <DisclaimerBanner />
      <OracleHeader
        onActivateVoice={onActivateVoice}
        onClear={clearChat}
        clearDisabled={clearing || sending || loading || messages.length === 0}
      />
      {hasMore && (
        <div className="flex justify-center">
          <Link
            to="/oracle/history"
            className="text-sm text-muted-foreground transition hover:text-primary"
          >
            View all chat history →
          </Link>
        </div>
      )}
      <OracleTranscript
        messages={messages}
        loading={loading}
        sending={sending}
        onSuggestion={send}
      />
      <OracleInput
        value={input}
        onChange={setInput}
        onSend={send}
        sending={sending}
        error={error}
      />
    </div>
  );
}
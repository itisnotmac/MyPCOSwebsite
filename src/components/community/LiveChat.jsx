import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import UserAvatar from "@/components/UserAvatar";
import ReportButton from "@/components/ReportButton";
import { cn } from "@/lib/utils";

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const load = async () => {
    try {
      const res = await base44.entities.CommunityMessage.filter(
        {},
        { sort: "-created_date", limit: 60 }
      );
      setMessages((res.items || []).reverse());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const unsub = base44.entities.CommunityMessage.subscribe((event) => {
      if (event.type === "create") {
        setMessages((prev) => {
          if (prev.some((m) => m.id === event.data.id)) return prev;
          return [...prev, event.data];
        });
      }
      if (event.type === "delete") {
        setMessages((prev) => prev.filter((m) => m.id !== event.data.id));
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    try {
      const res = await base44.functions.invoke("createCommunityPost", {
        type: "community_message",
        content: text,
      });
      const created = res.data;
      setMessages((prev) =>
        prev.some((m) => m.id === created.id) ? prev : [...prev, created]
      );
      base44.analytics.track({ eventName: "community_post_created" });
    } catch (e) {
      setInput(text);
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

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">The room is quiet for now</p>
            <p className="mt-1">Be the first to say hello — this is a supportive space. 🌸</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="group flex items-start gap-3">
              <UserAvatar name={m.author_name} src={m.author_avatar_url} className="h-9 w-9" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{m.author_name}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(m.created_date)}</span>
                  <ReportButton
                    entityType="community_message"
                    entityId={m.id}
                    className="opacity-0 transition group-hover:opacity-100"
                  />
                </div>
                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-foreground/90">
                  {m.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-border p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Share something with the community…"
            className="max-h-32 min-h-11 resize-none"
            disabled={sending}
          />
          <Button onClick={send} disabled={sending || !input.trim()} size="icon" className="h-11 w-11 shrink-0 rounded-xl">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          Be kind and supportive · This is a moderated, PCOS-focused community
        </p>
      </div>
    </div>
  );
}
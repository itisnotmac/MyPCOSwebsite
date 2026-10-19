import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, User } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OracleHistory() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.OracleMessage.filter(
          {},
          { sort: "created_date", limit: 50 }
        );
        setMessages(res.items || []);
        setCursor(res.next_cursor);
        setHasMore(res.has_more);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await base44.entities.OracleMessage.filter(
        {},
        { sort: "created_date", limit: 50, cursor }
      );
      setMessages((prev) => [...prev, ...(res.items || [])]);
      setCursor(res.next_cursor);
      setHasMore(res.has_more);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Seo title="Chat History - MyPCOS" description="View your full conversation history with Dr. Tinc Anne." />
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Chat History</h1>
          <p className="text-sm text-muted-foreground">Your full conversation with Dr. Tinc Anne</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/oracle">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Oracle
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          You haven't chatted with Dr. Tinc Anne yet.{" "}
          <Link to="/oracle" className="text-primary hover:underline">
            Start a conversation →
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 rounded-2xl border border-border p-4",
                  msg.role === "user" ? "bg-primary/5" : "bg-card"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    msg.role === "assistant" ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    {msg.role === "assistant" ? "Dr. Tinc Anne" : "You"}
                    {msg.created_date && (
                      <span> · {format(new Date(msg.created_date), "MMM d, h:mm a")}</span>
                    )}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, Send, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import Seo from "@/components/Seo";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [threadLoading, setThreadLoading] = useState(false);
  const scrollRef = useRef(null);

  // Load accepted friends (either direction)
  useEffect(() => {
    (async () => {
      try {
        const [f1, f2] = await Promise.all([
          base44.entities.Friendship.filter({ from_user_id: user.id, status: "accepted" }),
          base44.entities.Friendship.filter({ to_user_id: user.id, status: "accepted" }),
        ]);
        const list = [
          ...(f1 || []).map((r) => ({ id: r.to_user_id, name: r.to_user_name })),
          ...(f2 || []).map((r) => ({ id: r.from_user_id, name: r.from_user_name })),
        ];
        setFriends(list);
        const queryU = params.get("u");
        if (queryU && list.some((f) => f.id === queryU)) setActiveId(queryU);
        else if (list.length) setActiveId(list[0].id);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const activeFriend = friends.find((f) => f.id === activeId);

  const loadThread = async (friendId) => {
    setThreadLoading(true);
    try {
      const [sent, received] = await Promise.all([
        base44.entities.DirectMessage.filter({ to_user_id: friendId }, { sort: "created_date", limit: 200 }),
        base44.entities.DirectMessage.filter({ to_user_id: user.id }, { sort: "created_date", limit: 200 }),
      ]);
      const sentItems = sent.items || sent || [];
      const receivedItems = (received.items || received || []).filter((m) => m.created_by_id === friendId);
      const merged = [...sentItems, ...receivedItems].sort(
        (a, b) => new Date(a.created_date) - new Date(b.created_date)
      );
      setThread(merged);
      // mark received as read
      const unread = receivedItems.filter((m) => !m.read);
      if (unread.length) {
        await base44.entities.DirectMessage.bulkUpdate(unread.map((m) => ({ id: m.id, read: true }))).catch(() => {});
      }
    } catch {
      /* ignore */
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    if (activeId) {
      loadThread(activeId);
      setParams({ u: activeId }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Live updates
  useEffect(() => {
    const unsub = base44.entities.DirectMessage.subscribe((event) => {
      if (!activeId) return;
      const d = event.data;
      const involves =
        d && ((d.to_user_id === user.id && d.created_by_id === activeId) ||
              (d.to_user_id === activeId && d.created_by_id === user.id));
      if (!involves) return;
      if (event.type === "create") {
        setThread((prev) => (prev.some((m) => m.id === d.id) ? prev : [...prev, d]));
        if (d.to_user_id === user.id) {
          base44.entities.DirectMessage.update(d.id, { read: true }).catch(() => {});
        }
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, user?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread, threadLoading]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending || !activeId) return;
    setSending(true);
    setInput("");
    try {
      const res = await base44.functions.invoke("sendDirectMessage", { to_user_id: activeId, content: text });
      if (res?.data?.error) throw new Error(res.data.error);
      setThread((prev) => [...prev, { id: res?.data?.id || "tmp" + Date.now(), to_user_id: activeId, content: text, created_by_id: user.id, created_date: new Date().toISOString() }]);
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

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <Seo
        title="Private Messages - Connect with PCOS Peers | MyPCOS"
        description="Send private messages to friends in the MyPCOS community and support each other through life with PCOS."
      />
      <h1 className="mb-4 font-display text-2xl font-semibold tracking-tight">Messages</h1>

      {friends.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">No conversations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Become friends with someone in the{" "}
            <Link to="/community" className="text-primary hover:underline">community</Link> to start messaging.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          {/* Conversation list */}
          <div
            className={cn(
              "rounded-3xl border border-border bg-card p-2",
              activeId && "hidden md:block"
            )}
          >
            <ul className="space-y-1">
              {friends.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => setActiveId(f.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition",
                      f.id === activeId ? "bg-primary/10" : "hover:bg-muted"
                    )}
                  >
                    <UserAvatar name={f.name} className="h-9 w-9" />
                    <span className="truncate text-sm font-medium">{f.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Thread */}
          <div className={cn("rounded-3xl border border-border bg-card", !activeId && "hidden md:flex")}>
            {activeFriend ? (
              <div className="flex h-[calc(100vh-13rem)] flex-col">
                <div className="flex items-center gap-3 border-b border-border p-4">
                  <button className="md:hidden" onClick={() => setActiveId(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <UserAvatar name={activeFriend.name} className="h-9 w-9" />
                  <div>
                    <Link to={`/member/${activeFriend.id}`} className="font-semibold hover:text-primary">
                      {activeFriend.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">Private conversation</p>
                  </div>
                </div>

                <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-5">
                  {threadLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : thread.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                      <p>Say hello to {activeFriend.name} 👋</p>
                    </div>
                  ) : (
                    thread.map((m) => {
                      const mine = m.created_by_id === user.id;
                      return (
                        <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                              mine
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border bg-secondary/40"
                            )}
                          >
                            <p className="whitespace-pre-wrap">{m.content}</p>
                            <p className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                              {new Date(m.created_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-border p-3">
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      rows={1}
                      placeholder={`Message ${activeFriend.name}…`}
                      className="max-h-32 min-h-11 resize-none"
                    />
                    <Button onClick={send} disabled={sending || !input.trim()} size="icon" className="h-11 w-11 shrink-0 rounded-xl">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-13rem)] items-center justify-center text-sm text-muted-foreground">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
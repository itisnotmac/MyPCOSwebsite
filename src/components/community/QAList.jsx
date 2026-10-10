import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MessageCircle, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useMyAuthorInfo } from "@/hooks/useMyProfile";
import { useAuth } from "@/lib/AuthContext";
import { PCOS_TOPICS } from "@/lib/constants";
import UserAvatar from "@/components/UserAvatar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function QAList() {
  const navigate = useNavigate();
  const { name, avatar } = useMyAuthorInfo();
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tags: [] });

  const loadCounts = useCallback(async (items) => {
    const ids = items.map((q) => q.id);
    if (!ids.length) return;
    try {
      const agg = await base44.entities.Answer.aggregate({
        query: { question_id: { $in: ids } },
        groupBy: "question_id",
      });
      const map = {};
      (agg.rows || []).forEach((r) => {
        map[r.question_id] = r.count;
      });
      setCounts((prev) => ({ ...prev, ...map }));
    } catch {
      /* ignore */
    }
  }, []);

  const fetchPage = useCallback(
    async (searchTerm, c) => {
      const query = searchTerm.trim()
        ? { $or: [
            { title: { $regex: searchTerm.trim(), $options: "i" } },
            { body: { $regex: searchTerm.trim(), $options: "i" } },
          ] }
        : {};
      const opts = { sort: "-created_date", limit: 20 };
      if (c) opts.cursor = c;
      const res = await base44.entities.Question.filter(query, opts);
      return res;
    },
    []
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPage(search, null);
        setQuestions(res.items || []);
        setHasMore(!!res.has_more);
        setCursor(res.next_cursor || null);
        loadCounts(res.items || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const loadMore = async () => {
    if (!hasMore) return;
    const res = await fetchPage(search, cursor);
    setQuestions((prev) => [...prev, ...(res.items || [])]);
    setHasMore(!!res.has_more);
    setCursor(res.next_cursor || null);
    loadCounts(res.items || []);
  };

  const toggleTag = (t) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t],
    }));

  const submit = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      const created = await base44.entities.Question.create({
        title: form.title.trim(),
        body: form.body.trim(),
        tags: form.tags,
        author_name: name,
        author_avatar_url: avatar,
        author_id: user.id,
      });
      setQuestions((prev) => [created, ...prev]);
      setForm({ title: "", body: "", tags: [] });
      setOpen(false);
      toast({ title: "Question posted", description: "Your question is now live in the community." });
      navigate(`/question/${created.id}`);
    } catch (e) {
      toast({ title: "Could not post question", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="mr-1.5 h-4 w-4" /> Ask a question
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <p className="font-medium text-foreground">No questions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? "Try a different search." : "Be the first to ask the community something."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => navigate(`/question/${q.id}`)}
              className="group flex w-full items-start gap-4 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-sm"
            >
              <UserAvatar name={q.author_name} src={q.author_avatar_url} className="h-10 w-10" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-snug text-foreground group-hover:text-primary">
                  {q.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{q.body}</p>
                {q.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {q.tags.slice(0, 4).map((t) => (
                      <Badge key={t} variant="secondary" className="font-normal">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{q.author_name}</span>
                  <span>·</span>
                  <span>{timeAgo(q.created_date)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {counts[q.id] || 0} answers
                  </span>
                </div>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-primary" />
            </button>
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={loadMore}>
                Load more
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ask the community</DialogTitle>
            <DialogDescription>
              Share a question about PCOS. Other members can answer and mark helpful replies.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="q-title">Question</Label>
              <Input
                id="q-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. What helped your irregular cycles?"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="q-body">Details</Label>
              <Textarea
                id="q-body"
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                rows={4}
                placeholder="Add more context so others can give helpful answers…"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Topics (optional)</Label>
              <div className="flex flex-wrap gap-1.5">
                {PCOS_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition",
                      form.tags.includes(t)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary/50 text-foreground/70 hover:border-primary/40"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving || !form.title.trim() || !form.body.trim()}>
              {saving ? "Posting…" : "Post question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
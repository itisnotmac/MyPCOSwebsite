import { useEffect, useState } from "react";
import { Shield, Loader2, Trash2, Check, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const ENTITY_LABEL = {
  community_message: "Chat message",
  question: "Question",
  answer: "Answer",
};

export default function ModerationPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await base44.entities.Report.filter(
        { status: "pending" },
        { sort: "-created_date", limit: 50 }
      );
      const items = res.items || [];
      // Fetch the reported content for each report
      const enriched = await Promise.all(
        items.map(async (r) => {
          let content = null;
          try {
            if (r.entity_type === "community_message")
              content = await base44.entities.CommunityMessage.get(r.entity_id);
            else if (r.entity_type === "question")
              content = await base44.entities.Question.get(r.entity_id);
            else if (r.entity_type === "answer")
              content = await base44.entities.Answer.get(r.entity_id);
          } catch {
            content = null;
          }
          return { ...r, content };
        })
      );
      setReports(enriched);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeContent = async (report) => {
    setBusy(report.id);
    try {
      if (report.entity_type === "community_message")
        await base44.entities.CommunityMessage.delete(report.entity_id);
      else if (report.entity_type === "question")
        await base44.entities.Question.delete(report.entity_id);
      else if (report.entity_type === "answer")
        await base44.entities.Answer.delete(report.entity_id);
      await base44.entities.Report.update(report.id, { status: "resolved" });
      toast({ title: "Content removed", description: "The reported content was deleted." });
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (e) {
      toast({ title: "Could not remove", description: e.message, variant: "destructive" });
    } finally {
      setBusy("");
    }
  };

  const resolve = async (report) => {
    setBusy(report.id);
    try {
      await base44.entities.Report.update(report.id, { status: "resolved" });
      toast({ title: "Report resolved" });
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (e) {
      toast({ title: "Could not resolve", description: e.message, variant: "destructive" });
    } finally {
      setBusy("");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Moderation</h2>
        <Badge variant="secondary" className="ml-1">
          {reports.length} pending
        </Badge>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <p className="font-medium text-foreground">All clear 🌸</p>
          <p className="mt-1 text-sm text-muted-foreground">No pending reports. The community is in good shape.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{ENTITY_LABEL[r.entity_type] || r.entity_type}</Badge>
                <span className="flex items-center gap-1">
                  <Flag className="h-3 w-3" /> {r.reason}
                </span>
                <span>·</span>
                <span>{new Date(r.created_date).toLocaleString()}</span>
              </div>
              <div className="mt-3 rounded-xl bg-secondary/50 p-3 text-sm">
                {r.content ? (
                  <p className="whitespace-pre-wrap text-foreground/90">
                    {r.content.content || r.content.title || r.content.body || "(no preview)"}
                    {r.content.title && r.content.body ? ` — ${r.content.body}` : ""}
                  </p>
                ) : (
                  <p className="italic text-muted-foreground">Content no longer exists.</p>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeContent(r)}
                  disabled={busy === r.id || !r.content}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove content
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolve(r)}
                  disabled={busy === r.id}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
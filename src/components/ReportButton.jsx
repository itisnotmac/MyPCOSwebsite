import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const REASONS = [
  "Misinformation about PCOS",
  "Spam or promotion",
  "Harassment or unkindness",
  "Off-topic content",
  "Something else",
];

export default function ReportButton({ entityType, entityId, className }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const submit = async () => {
    setSaving(true);
    try {
      const text = details.trim() ? `${reason} — ${details.trim()}` : reason;
      await base44.entities.Report.create({
        entity_type: entityType,
        entity_id: entityId,
        reason: text,
        status: "pending",
      });
      toast({
        title: "Report sent",
        description: "Thank you — our moderators will review this shortly.",
      });
      setOpen(false);
      setDetails("");
      setReason(REASONS[0]);
    } catch (e) {
      toast({ title: "Could not send report", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          aria-label="Report content"
        >
          <Flag className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report this content</DialogTitle>
          <DialogDescription>
            Help us keep the community safe and supportive. Our moderators will review your report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="report-reason">Reason</Label>
            <select
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="report-details">Additional details (optional)</Label>
            <Textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Add any context that may help our moderators…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? "Sending…" : "Send report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
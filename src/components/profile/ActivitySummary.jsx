import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MessageCircle, MessageSquareText, Heart, Users, UserPlus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xl font-semibold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function ActivitySummary({ user }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [follows, setFollows] = useState([]);
  const [friends, setFriends] = useState([]);
  const [helpfulCount, setHelpfulCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const [q, a, fFrom, fTo] = await Promise.all([
          base44.entities.Question.filter({ author_id: user.id }, { sort: "-created_date", limit: 20 }),
          base44.entities.Answer.filter({ author_id: user.id }, { sort: "-created_date", limit: 20 }),
          base44.entities.Friendship.filter({ from_user_id: user.id, status: { $in: ["following", "accepted"] } }, { sort: "-created_date", limit: 20 }),
          base44.entities.Friendship.filter({ to_user_id: user.id, status: "accepted" }, { sort: "-created_date", limit: 20 }),
        ]);
        if (cancelled) return;
        setQuestions(q.items || []);
        setAnswers(a.items || []);
        setFollows(fFrom.items || []);
        setFriends(fTo.items || []);
        setHelpfulCount((a.items || []).filter((x) => x.helpful).length);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const friendCount = friends.length;

  // Build a unified timeline of recent interactions
  const timeline = [
    ...questions.map((q) => ({
      kind: "question",
      id: q.id,
      title: q.title,
      date: q.created_date,
      link: `/question/${q.id}`,
    })),
    ...answers.map((a) => ({
      kind: "answer",
      id: a.id,
      title: a.body,
      date: a.created_date,
      link: `/question/${a.question_id}`,
      helpful: a.helpful,
    })),
    ...follows.map((f) => ({
      kind: "follow",
      id: f.id,
      date: f.created_date,
      name: f.to_user_name,
      userId: f.to_user_id,
      status: f.status,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 12);

  return (
    <div className="mt-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={MessageCircle} label="Questions" value={questions.length} tone="bg-primary/10 text-primary" />
        <StatCard icon={MessageSquareText} label="Answers" value={answers.length} tone="bg-accent text-accent-foreground" />
        <StatCard icon={Heart} label="Marked helpful" value={helpfulCount} tone="bg-rose-100 text-rose-600" />
        <StatCard icon={Users} label="Friends" value={friendCount} tone="bg-emerald-100 text-emerald-600" />
      </div>

      {/* Timeline */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Recent activity</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Your latest posts, answers, and connections.</p>

        <div className="mt-4 space-y-2.5">
          {timeline.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No activity yet. Ask a question, answer one, or connect with members to see your engagement here.
              </p>
            </div>
          ) : (
            timeline.map((item) => {
              if (item.kind === "question") {
                return (
                  <Link
                    key={`q-${item.id}`}
                    to={item.link}
                    className="flex items-start gap-3 rounded-xl border border-border p-3 hover:border-primary/40"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Asked a question · {timeAgo(item.date)}</p>
                    </div>
                  </Link>
                );
              }
              if (item.kind === "answer") {
                return (
                  <Link
                    key={`a-${item.id}`}
                    to={item.link}
                    className="flex items-start gap-3 rounded-xl border border-border p-3 hover:border-primary/40"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <MessageSquareText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Answered a question · {timeAgo(item.date)}
                        {item.helpful && (
                          <Badge className="ml-2 bg-rose-100 text-rose-600 hover:bg-rose-100">Helpful</Badge>
                        )}
                      </p>
                    </div>
                  </Link>
                );
              }
              // follow / friend interaction
              return (
                <Link
                  key={`f-${item.id}`}
                  to={`/member/${item.userId}`}
                  className="flex items-start gap-3 rounded-xl border border-border p-3 hover:border-primary/40"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {item.status === "accepted" ? "Became friends with " : "Started following "}
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(item.date)}</p>
                  </div>
                  <UserAvatar name={item.name} className="h-7 w-7" />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
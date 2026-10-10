import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import FriendActions from "@/components/FriendActions";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export default function MemberProfile() {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const [p, q, a] = await Promise.all([
          base44.entities.Profile.filter({ user_id: userId }),
          base44.entities.Question.filter({ author_id: userId }, { sort: "-created_date", limit: 10 }),
          base44.entities.Answer.filter({ author_id: userId }, { sort: "-created_date", limit: 10 }),
        ]);
        setProfile((p && p[0]) || null);
        setQuestions(q.items || []);
        setAnswers(a.items || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const name = profile?.display_name || "Member";
  const isMe = me?.id === userId;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      {/* Header card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <UserAvatar name={name} src={profile?.avatar_url} className="h-20 w-20 text-2xl" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{name}</h1>
            {profile?.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {profile.location}
              </p>
            )}
            {profile?.bio && <p className="mt-3 leading-relaxed text-foreground/90">{profile.bio}</p>}
            {profile?.interests?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.interests.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isMe && (
          <div className="mt-6 border-t border-border pt-5">
            <FriendActions targetUserId={userId} targetName={name} />
          </div>
        )}
        {isMe && (
          <div className="mt-6 border-t border-border pt-5">
            <Link to="/profile" className="text-sm font-medium text-primary hover:underline">
              Edit my profile →
            </Link>
          </div>
        )}
      </div>

      {/* Activity */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <MessageCircle className="h-4 w-4 text-primary" /> Questions
          </h2>
          <div className="mt-3 space-y-2">
            {questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No questions yet.</p>
            ) : (
              questions.map((q) => (
                <Link
                  key={q.id}
                  to={`/question/${q.id}`}
                  className="block rounded-xl border border-border p-3 text-sm hover:border-primary/40"
                >
                  <p className="font-medium">{q.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(q.created_date).toLocaleDateString()}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Answers</h2>
          <div className="mt-3 space-y-2">
            {answers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No answers yet.</p>
            ) : (
              answers.map((a) => (
                <Link
                  key={a.id}
                  to={`/question/${a.question_id}`}
                  className="block rounded-xl border border-border p-3 text-sm hover:border-primary/40"
                >
                  <p className="line-clamp-2">{a.body}</p>
                  {a.helpful && <Badge className="mt-1.5 bg-primary text-primary-foreground">Marked helpful</Badge>}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}
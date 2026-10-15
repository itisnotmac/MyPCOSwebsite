import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Send, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import ReportButton from "@/components/ReportButton";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import Seo from "@/components/Seo";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [marking, setMarking] = useState("");

  const load = async () => {
    try {
      const q = await base44.entities.Question.get(id);
      setQuestion(q);
      const ans = await base44.entities.Answer.filter(
        { question_id: id },
        { sort: "created_date", limit: 200 }
      );
      setAnswers(ans.items || ans || []);
    } catch {
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const unsub = base44.entities.Answer.subscribe((event) => {
      if (event.data?.question_id !== id) return;
      if (event.type === "create") {
        setAnswers((prev) => (prev.some((a) => a.id === event.data.id) ? prev : [...prev, event.data]));
      } else if (event.type === "update") {
        setAnswers((prev) => prev.map((a) => (a.id === event.data.id ? { ...a, ...event.data } : a)));
      } else if (event.type === "delete") {
        setAnswers((prev) => prev.filter((a) => a.id !== event.data.id));
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const postAnswer = async () => {
    const text = body.trim();
    if (!text || posting) return;
    setPosting(true);
    setBody("");
    try {
      const res = await base44.functions.invoke("createCommunityPost", {
        type: "answer",
        question_id: id,
        body: text,
      });
      const created = res.data;
      setAnswers((prev) => [...prev, created]);
      toast({ title: "Answer posted" });
      base44.analytics.track({ eventName: "community_post_created" });
    } catch (e) {
      setBody(text);
      toast({ title: "Could not post answer", description: e.message, variant: "destructive" });
    } finally {
      setPosting(false);
    }
  };

  const markHelpful = async (answerId) => {
    setMarking(answerId);
    try {
      const res = await base44.functions.invoke("markAnswerHelpful", { answer_id: answerId });
      const helpful = res?.data?.helpful;
      setAnswers((prev) => prev.map((a) => (a.id === answerId ? { ...a, helpful } : a)));
    } catch (e) {
      toast({ title: "Could not mark answer", description: e.message, variant: "destructive" });
    } finally {
      setMarking("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-display text-xl font-semibold">Question not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/community")}>
          Back to community
        </Button>
      </div>
    );
  }

  const isAuthor = question.author_id === user.id;
  const isAdmin = user.role === "admin";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <Seo
        title={`${question.title} | MyPCOS`}
        description={question.body?.slice(0, 155) || "Read and answer PCOS community questions on MyPCOS."}
      />
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/community")}>
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to questions
      </Button>

      {/* Question */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to={`/member/${question.author_id}`}>
              <UserAvatar name={question.author_name} src={question.author_avatar_url} className="h-11 w-11" />
            </Link>
            <div>
              <Link to={`/member/${question.author_id}`} className="text-sm font-semibold hover:text-primary">
                {question.author_name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {new Date(question.created_date).toLocaleString()}
              </p>
            </div>
          </div>
          <ReportButton entityType="question" entityId={question.id} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold leading-snug">{question.title}</h1>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground/90">{question.body}</p>
        {question.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {question.tags.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Answers */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <MessageCircle className="h-4 w-4 text-primary" />
          {answers.length} {answers.length === 1 ? "answer" : "answers"}
        </h2>

        <div className="mt-4 space-y-3">
          {answers
            .slice()
            .sort((a, b) => (b.helpful ? 1 : 0) - (a.helpful ? 1 : 0))
            .map((a) => (
              <div
                key={a.id}
                className={cn(
                  "rounded-2xl border bg-card p-5",
                  a.helpful ? "border-primary/40 bg-primary/5" : "border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Link to={`/member/${a.author_id}`}>
                      <UserAvatar name={a.author_name} src={a.author_avatar_url} className="h-9 w-9" />
                    </Link>
                    <div>
                      <Link to={`/member/${a.author_id}`} className="text-sm font-semibold hover:text-primary">
                        {a.author_name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.created_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {a.helpful && (
                      <Badge className="bg-primary text-primary-foreground">
                        <ThumbsUp className="mr-1 h-3 w-3" /> Helpful
                      </Badge>
                    )}
                    <ReportButton entityType="answer" entityId={a.id} />
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground/90">{a.body}</p>
                {(isAuthor || isAdmin) && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant={a.helpful ? "secondary" : "outline"}
                      onClick={() => markHelpful(a.id)}
                      disabled={marking === a.id}
                    >
                      <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
                      {a.helpful ? "Unmark helpful" : "Mark as helpful"}
                    </Button>
                  </div>
                )}
              </div>
            ))}

          {answers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No answers yet — be the first to help.
            </div>
          )}
        </div>

        {/* Reply */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold">Your answer</p>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Share a helpful, supportive answer…"
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={postAnswer} disabled={posting || !body.trim()}>
              {posting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
              Post answer
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DisclaimerBanner compact />
      </div>
    </div>
  );
}
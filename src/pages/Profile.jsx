import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Upload, Save, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { PCOS_TOPICS } from "@/lib/constants";
import UserAvatar from "@/components/UserAvatar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading, refetch } = useMyProfile();
  const { toast } = useToast();

  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    avatar_url: "",
    interests: [],
    location: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || user?.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        interests: profile.interests || [],
        location: profile.location || "",
      });
    } else if (!isLoading && user) {
      setForm((f) => ({ ...f, display_name: user.full_name || "" }));
    }
  }, [profile, isLoading, user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [q, a, f1, f2] = await Promise.all([
          base44.entities.Question.filter({ author_id: user.id }, { sort: "-created_date", limit: 10 }),
          base44.entities.Answer.filter({ author_id: user.id }, { sort: "-created_date", limit: 10 }),
          base44.entities.Friendship.filter({ from_user_id: user.id, status: "accepted" }),
          base44.entities.Friendship.filter({ to_user_id: user.id, status: "accepted" }),
        ]);
        setMyQuestions(q.items || []);
        setMyAnswers(a.items || []);
        const accepted = [
          ...(f1 || []).map((r) => ({ id: r.to_user_id, name: r.to_user_name })),
          ...(f2 || []).map((r) => ({ id: r.from_user_id, name: r.from_user_name })),
        ];
        setFriends(accepted);
      } catch {
        /* ignore */
      }
    })();
  }, [user?.id]);

  const onAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadPublicFile({ file });
      const url = res?.file_url;
      if (url) setForm((f) => ({ ...f, avatar_url: url }));
    } catch (err) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const toggleInterest = (t) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(t) ? f.interests.filter((x) => x !== t) : [...f.interests, t],
    }));

  const save = async () => {
    if (!form.display_name.trim()) {
      toast({ title: "Please add a display name", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (profile?.id) {
        await base44.entities.Profile.update(profile.id, {
          display_name: form.display_name.trim(),
          bio: form.bio.trim(),
          avatar_url: form.avatar_url,
          interests: form.interests,
          location: form.location.trim(),
        });
      } else {
        await base44.entities.Profile.create({
          user_id: user.id,
          display_name: form.display_name.trim(),
          bio: form.bio.trim(),
          avatar_url: form.avatar_url,
          interests: form.interests,
          location: form.location.trim(),
        });
      }
      toast({ title: "Profile saved" });
      refetch();
    } catch (e) {
      toast({ title: "Could not save profile", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight">My profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        This is how you appear to other members in the community.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <UserAvatar
            name={form.display_name || user?.full_name || "?"}
            src={form.avatar_url}
            className="h-20 w-20 text-2xl"
          />
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3.5 py-2 text-sm font-medium hover:border-primary/40">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Upload photo"}
              <input type="file" accept="image/*" className="hidden" onChange={onAvatar} disabled={uploading} />
            </label>
            <p className="mt-1.5 text-xs text-muted-foreground">JPG or PNG. Your photo is visible to members.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={form.display_name}
              onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="City, country (optional)"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            rows={3}
            placeholder="Share a little about your PCOS journey…"
          />
        </div>

        <div className="mt-4 grid gap-1.5">
          <Label>PCOS interests</Label>
          <div className="flex flex-wrap gap-1.5">
            {PCOS_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleInterest(t)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  form.interests.includes(t)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/50 text-foreground/70 hover:border-primary/40"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={saving || uploading}>
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            Save profile
          </Button>
        </div>
      </div>

      {/* Activity */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <MessageCircle className="h-4 w-4 text-primary" /> My questions
          </h2>
          <div className="mt-3 space-y-2">
            {myQuestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">You haven't asked any questions yet.</p>
            ) : (
              myQuestions.map((q) => (
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
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Users className="h-4 w-4 text-primary" /> My friends
          </h2>
          <div className="mt-3 space-y-2">
            {friends.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No friends yet. Find people in the community and send a request!
              </p>
            ) : (
              friends.map((f) => (
                <Link
                  key={f.id}
                  to={`/member/${f.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border p-2.5 hover:border-primary/40"
                >
                  <UserAvatar name={f.name} className="h-8 w-8" />
                  <span className="text-sm font-medium">{f.name}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {myAnswers.length > 0 && (
        <div className="mt-5 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">My answers</h2>
          <div className="mt-3 space-y-2">
            {myAnswers.map((a) => (
              <Link
                key={a.id}
                to={`/question/${a.question_id}`}
                className="block rounded-xl border border-border p-3 text-sm hover:border-primary/40"
              >
                <p className="line-clamp-2">{a.body}</p>
                {a.helpful && <Badge className="mt-1.5 bg-primary text-primary-foreground">Marked helpful</Badge>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
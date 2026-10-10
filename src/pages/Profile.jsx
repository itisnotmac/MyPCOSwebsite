import { useEffect, useState } from "react";
import { Loader2, Upload, Save, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { PCOS_TOPICS } from "@/lib/constants";
import UserAvatar from "@/components/UserAvatar";
import ActivitySummary from "@/components/profile/ActivitySummary";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import UserBadge from "@/components/UserBadge";
import { getEarnedBadges, resolveDisplayBadge } from "@/lib/badges";

export default function Profile() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: profile, isLoading, refetch } = useMyProfile();
  const { toast } = useToast();

  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    avatar_url: "",
    interests: [],
    location: "",
    selected_badge: null,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || user?.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        interests: profile.interests || [],
        location: profile.location || "",
        selected_badge: profile.selected_badge || null,
      });
    } else if (!isLoading && user) {
      setForm((f) => ({ ...f, display_name: user.full_name || "" }));
    }
  }, [profile, isLoading, user]);

  const earnedBadges = getEarnedBadges(profile?.login_streak, profile?.answer_count, isAdmin);
  const displayBadge = resolveDisplayBadge(form.selected_badge, profile?.login_streak, profile?.answer_count, isAdmin);

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
      await base44.functions.invoke("saveProfile", {
        profile_id: profile?.id || null,
        display_name: form.display_name.trim(),
        bio: form.bio.trim(),
        avatar_url: form.avatar_url,
        interests: form.interests,
        location: form.location.trim(),
        selected_badge: form.selected_badge || null,
      });
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
      <UserBadge
        loginStreak={profile?.login_streak}
        answerCount={profile?.answer_count}
        selectedBadge={profile?.selected_badge}
        isAdmin={isAdmin}
        className="mt-1 text-sm"
      />
      <p className="mt-1 text-sm text-muted-foreground">
        This is how you appear to other members in the community.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <UserAvatar
            name={form.display_name || user?.full_name || "?"}
            src={form.avatar_url}
            isAdmin={isAdmin}
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
            <p className="text-xs text-muted-foreground">Choose a unique display name — no two members can share one.</p>
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

        {/* Badge selection */}
        <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold">Badge</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose which earned badge appears under your name. {isAdmin && "As an admin, every badge is available to you."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, selected_badge: null }))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                !form.selected_badge
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/70 hover:border-primary/40"
              )}
            >
              Auto (best earned)
            </button>
            {earnedBadges.length === 0 ? (
              <span className="self-center text-xs text-muted-foreground">
                No badges earned yet — keep logging in and answering questions!
              </span>
            ) : (
              earnedBadges.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, selected_badge: b.id }))}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    form.selected_badge === b.id
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-border bg-card text-foreground/70 hover:border-amber-400/50"
                  )}
                >
                  {b.title}
                </button>
              ))
            )}
          </div>
          {displayBadge && (
            <p className="mt-3 text-xs text-muted-foreground">
              Currently showing: <span className="font-semibold text-amber-600 dark:text-amber-400">{displayBadge.title}</span>
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={saving || uploading}>
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            Save profile
          </Button>
        </div>
      </div>

      {/* Activity summary */}
      <ActivitySummary user={user} />
    </div>
  );
}
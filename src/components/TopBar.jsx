import { Link } from "react-router-dom";
import UserAvatar from "@/components/UserAvatar";
import UserBadge from "@/components/UserBadge";
import UserStats from "@/components/UserStats";
import { useUserStats } from "@/hooks/useUserStats";

// Slim bar above the main header showing the current user's avatar, name,
// badge title, and 4 colored community stats.
export default function TopBar({ profile, user }) {
  const isAdmin = user?.role === "admin";
  const { data: stats } = useUserStats();
  const name = profile?.display_name || user?.full_name || "Member";
  const firstName = name.split(" ")[0];

  return (
    <div className="border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-10 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link to="/profile" className="flex min-w-0 items-center gap-2" title="My profile">
          <UserAvatar
            name={name}
            src={profile?.avatar_url}
            isAdmin={isAdmin}
            className="h-7 w-7"
          />
          <span className="truncate text-sm font-medium text-foreground/80">{firstName}</span>
          <UserBadge
            loginStreak={profile?.login_streak}
            answerCount={profile?.answer_count}
            selectedBadge={profile?.selected_badge}
            isAdmin={isAdmin}
            className="text-xs"
          />
          <UserStats stats={stats} />
        </Link>
      </div>
    </div>
  );
}
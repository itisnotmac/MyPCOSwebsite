import { getBestBadge } from "@/lib/badges";
import { cn } from "@/lib/utils";

// Displays the user's highest-earned badge title in a warm accent color,
// designed to sit directly under a username.
export default function UserBadge({ loginStreak = 0, answerCount = 0, className }) {
  const badge = getBestBadge(loginStreak, answerCount);
  if (!badge) return null;
  return (
    <span
      className={cn(
        "text-xs font-semibold tracking-wide text-amber-600 dark:text-amber-400",
        className
      )}
    >
      {badge.title}
    </span>
  );
}
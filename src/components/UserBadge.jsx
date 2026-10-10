import { resolveDisplayBadge } from "@/lib/badges";
import { cn } from "@/lib/utils";

// Displays the user's chosen badge title (or their auto-assigned best badge)
// in a warm accent color, designed to sit directly under a username.
export default function UserBadge({
  loginStreak = 0,
  answerCount = 0,
  selectedBadge = null,
  isAdmin = false,
  className,
}) {
  const badge = resolveDisplayBadge(selectedBadge, loginStreak, answerCount, isAdmin);
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
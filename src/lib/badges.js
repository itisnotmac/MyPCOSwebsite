// Badge definitions for MyPCOS community participation.
// Each badge has a stable `id` (persisted on the profile as `selected_badge`),
// a `threshold` (the milestone that earns it), and a display `title`.
// To add or rename badges, edit the arrays below.

export const STREAK_BADGES = [
  { id: "streak_3", threshold: 3, title: "First Steps" },
  { id: "streak_10", threshold: 10, title: "Finding Rhythm" },
  { id: "streak_30", threshold: 30, title: "Monthly Milestone" },
  { id: "streak_60", threshold: 60, title: "Steady Companion" },
  { id: "streak_90", threshold: 90, title: "Quarterly Champion" },
  { id: "streak_180", threshold: 180, title: "Half-Year Hero" },
  { id: "streak_365", threshold: 365, title: "PCOS Warrior" },
];

export const ANSWER_BADGES = [
  { id: "answer_5", threshold: 5, title: "Helpful Voice" },
  { id: "answer_10", threshold: 10, title: "Community Guide" },
  { id: "answer_20", threshold: 20, title: "Trusted Advisor" },
  { id: "answer_50", threshold: 50, title: "PCOS Mentor" },
  { id: "answer_100", threshold: 100, title: "Century Scholar" },
  { id: "answer_300", threshold: 300, title: "Knowledge Keeper" },
  { id: "answer_500", threshold: 500, title: "Oracle Apprentice" },
  { id: "answer_1000", threshold: 1000, title: "Sage of the Oracle" },
];

export function getStreakBadge(streak) {
  let badge = null;
  for (const b of STREAK_BADGES) {
    if ((streak || 0) >= b.threshold) badge = b;
  }
  return badge;
}

export function getAnswerBadge(count) {
  let badge = null;
  for (const b of ANSWER_BADGES) {
    if ((count || 0) >= b.threshold) badge = b;
  }
  return badge;
}

// Returns the single most prestigious badge the user has earned across both
// categories, compared by normalized tier position. Ties go to the answer badge
// (active contribution outranks passive attendance).
export function getBestBadge(streak, answerCount) {
  const sBadge = getStreakBadge(streak);
  const aBadge = getAnswerBadge(answerCount);
  if (!sBadge && !aBadge) return null;
  if (!sBadge) return aBadge;
  if (!aBadge) return sBadge;
  const sNorm = STREAK_BADGES.indexOf(sBadge) / (STREAK_BADGES.length - 1);
  const aNorm = ANSWER_BADGES.indexOf(aBadge) / (ANSWER_BADGES.length - 1);
  return aNorm >= sNorm ? aBadge : sBadge;
}

// All badges the user has earned. Admins automatically earn every badge.
// Returns an array of { id, title, category } sorted most-prestigious last.
export function getEarnedBadges(streak, answerCount, isAdmin = false) {
  const earned = [];
  for (const b of STREAK_BADGES) {
    if (isAdmin || (streak || 0) >= b.threshold) {
      earned.push({ ...b, category: "Streak" });
    }
  }
  for (const b of ANSWER_BADGES) {
    if (isAdmin || (answerCount || 0) >= b.threshold) {
      earned.push({ ...b, category: "Answers" });
    }
  }
  return earned;
}

// Finds a badge definition by its id across both categories.
export function findBadgeById(id) {
  return (
    STREAK_BADGES.find((b) => b.id === id) ||
    ANSWER_BADGES.find((b) => b.id === id) ||
    null
  );
}

// Resolves which badge to display: the user's selected badge if they have
// earned it (admins can select any), otherwise the auto-assigned best badge.
export function resolveDisplayBadge(selectedId, streak, answerCount, isAdmin = false) {
  if (selectedId) {
    const badge = findBadgeById(selectedId);
    if (badge) {
      const earned = getEarnedBadges(streak, answerCount, isAdmin);
      if (isAdmin || earned.some((b) => b.id === selectedId)) {
        return badge;
      }
    }
  }
  return getBestBadge(streak, answerCount);
}
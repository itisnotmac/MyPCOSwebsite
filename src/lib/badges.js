// Badge definitions for MyPCOS community participation.
// To add or rename badges, edit the arrays below — each entry is a { threshold, title } pair.

export const STREAK_BADGES = [
  { threshold: 3, title: "First Steps" },
  { threshold: 10, title: "Finding Rhythm" },
  { threshold: 30, title: "Monthly Milestone" },
  { threshold: 60, title: "Steady Companion" },
  { threshold: 90, title: "Quarterly Champion" },
  { threshold: 180, title: "Half-Year Hero" },
  { threshold: 365, title: "PCOS Warrior" },
];

export const ANSWER_BADGES = [
  { threshold: 5, title: "Helpful Voice" },
  { threshold: 10, title: "Community Guide" },
  { threshold: 20, title: "Trusted Advisor" },
  { threshold: 50, title: "PCOS Mentor" },
  { threshold: 100, title: "Century Scholar" },
  { threshold: 300, title: "Knowledge Keeper" },
  { threshold: 500, title: "Oracle Apprentice" },
  { threshold: 1000, title: "Sage of the Oracle" },
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
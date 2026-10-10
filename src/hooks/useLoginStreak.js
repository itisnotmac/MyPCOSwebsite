import { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";

function localDateString(date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

// Runs once per page load when the user is authenticated. Compares today's
// local date to the stored last_login_date and updates the login streak on
// the user's Profile record. Non-fatal on error — streak is best-effort.
export function useLoginStreak() {
  const { user, authChecked, isAuthenticated } = useAuth();
  const { data: profile, refetch } = useMyProfile();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!authChecked || !isAuthenticated || !user || !profile || ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const todayStr = localDateString(new Date());
        const lastLogin = profile.last_login_date;
        const currentStreak = profile.login_streak || 0;

        if (lastLogin === todayStr) return; // already counted today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = localDateString(yesterday);

        const newStreak = lastLogin === yesterdayStr ? currentStreak + 1 : 1;

        await base44.entities.Profile.update(profile.id, {
          last_login_date: todayStr,
          login_streak: newStreak,
        });
        refetch();
      } catch {
        // non-fatal
      }
    })();
  }, [authChecked, isAuthenticated, user, profile, refetch]);
}
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

// Admin profiles show symbolic fixed values instead of real counts.
const ADMIN_STATS = { questions: "9k", answers: "21k", helpful: "25k", friends: "∞" };

// Fetches the 4 community stats (questions, answers, marked helpful, friends)
// for the current user. Admins get fixed symbolic values with no API calls.
export function useUserStats() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["userStats", user?.id, isAdmin],
    queryFn: async () => {
      if (isAdmin) return ADMIN_STATS;
      const [q, a, h, f] = await Promise.all([
        base44.entities.Question.count({ author_id: user.id }).catch(() => 0),
        base44.entities.Answer.count({ author_id: user.id }).catch(() => 0),
        base44.entities.Answer.count({ author_id: user.id, helpful: true }).catch(() => 0),
        base44.entities.Friendship.count({ to_user_id: user.id, status: "accepted" }).catch(() => 0),
      ]);
      return { questions: q, answers: a, helpful: h, friends: f };
    },
    initialData: isAdmin ? ADMIN_STATS : undefined,
    enabled: !!user?.id && isAuthenticated,
    staleTime: 60 * 1000,
  });
}
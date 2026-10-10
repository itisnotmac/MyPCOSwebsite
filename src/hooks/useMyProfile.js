import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

// Loads the current user's Profile record (creates nothing). Used across authed pages
// to show the member's name + avatar when posting, and to edit their profile.
export function useMyProfile() {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["myProfile", user?.id],
    queryFn: async () => {
      const items = await base44.entities.Profile.filter({ user_id: user.id });
      return (items && items[0]) || null;
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 30 * 1000,
  });
}

// Convenience: the display name + avatar to stamp on posts, with sensible fallbacks.
export function useMyAuthorInfo() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  return {
    name: profile?.display_name || user?.full_name || "Member",
    avatar: profile?.avatar_url || "",
  };
}
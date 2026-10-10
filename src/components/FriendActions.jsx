import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { UserPlus, UserCheck, UserMinus, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Loads the connection records between the current user and `targetUserId`
// (either direction) and renders Follow / Add Friend / Accept / Message actions.
export default function FriendActions({ targetUserId, targetName, className }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["connection", user?.id, targetUserId],
    queryFn: async () => {
      const res = await base44.entities.Friendship.filter({
        $or: [
          { from_user_id: user.id, to_user_id: targetUserId },
          { from_user_id: targetUserId, to_user_id: user.id },
        ],
      });
      return res || [];
    },
    enabled: !!user?.id && !!targetUserId,
  });

  const records = data || [];
  const accepted = records.find((r) => r.status === "accepted");
  const myPending = records.find((r) => r.status === "pending" && r.from_user_id === user.id);
  const theirPending = records.find((r) => r.status === "pending" && r.to_user_id === user.id);
  const myFollow = records.find((r) => r.status === "following" && r.from_user_id === user.id);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["connection", user?.id, targetUserId] });

  const follow = async () => {
    try {
      await base44.functions.invoke("manageFriendship", { action: "follow", to_user_id: targetUserId });
      toast({ title: `You're now following ${targetName || "this member"}` });
      invalidate();
    } catch (e) {
      toast({ title: "Could not follow", description: e.message, variant: "destructive" });
    }
  };

  const unfollow = async () => {
    if (!myFollow) return;
    try {
      await base44.entities.Friendship.delete(myFollow.id);
      toast({ title: `Unfollowed ${targetName || "this member"}` });
      invalidate();
    } catch (e) {
      toast({ title: "Could not unfollow", description: e.message, variant: "destructive" });
    }
  };

  const addFriend = async () => {
    try {
      await base44.functions.invoke("manageFriendship", { action: "request", to_user_id: targetUserId });
      toast({ title: "Friend request sent" });
      invalidate();
    } catch (e) {
      toast({ title: "Could not send request", description: e.message, variant: "destructive" });
    }
  };

  const cancelRequest = async () => {
    if (!myPending) return;
    try {
      await base44.entities.Friendship.delete(myPending.id);
      toast({ title: "Friend request cancelled" });
      invalidate();
    } catch (e) {
      toast({ title: "Could not cancel", description: e.message, variant: "destructive" });
    }
  };

  const acceptRequest = async () => {
    if (!theirPending) return;
    try {
      await base44.functions.invoke("manageFriendship", { action: "accept", to_user_id: targetUserId });
      toast({ title: `You and ${targetName || "this member"} are now friends` });
      invalidate();
    } catch (e) {
      toast({ title: "Could not accept", description: e.message, variant: "destructive" });
    }
  };

  const message = () => navigate(`/messages?u=${targetUserId}`);

  if (isLoading) {
    return <div className={cn("flex gap-2", className)}><div className="h-9 w-28 animate-pulse rounded-lg bg-muted" /></div>;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Follow toggle */}
      {accepted ? null : myFollow ? (
        <Button variant="secondary" size="sm" onClick={unfollow}>
          <UserCheck className="mr-1.5 h-4 w-4" /> Following
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={follow}>
          <UserPlus className="mr-1.5 h-4 w-4" /> Follow
        </Button>
      )}

      {/* Friend / accept / status */}
      {accepted ? (
        <Button variant="secondary" size="sm" disabled>
          <UserCheck className="mr-1.5 h-4 w-4" /> Friends
        </Button>
      ) : theirPending ? (
        <Button size="sm" onClick={acceptRequest}>
          <Check className="mr-1.5 h-4 w-4" /> Accept friend
        </Button>
      ) : myPending ? (
        <Button variant="outline" size="sm" onClick={cancelRequest}>
          <UserMinus className="mr-1.5 h-4 w-4" /> Request sent
        </Button>
      ) : (
        <Button size="sm" onClick={addFriend}>
          <UserPlus className="mr-1.5 h-4 w-4" /> Add friend
        </Button>
      )}

      {/* Message — only accepted friends */}
      {accepted && (
        <Button variant="outline" size="sm" onClick={message}>
          <MessageCircle className="mr-1.5 h-4 w-4" /> Message
        </Button>
      )}
    </div>
  );
}
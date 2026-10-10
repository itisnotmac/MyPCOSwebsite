import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// UserAvatar renders a member's avatar. When `isAdmin` is true, a warm
// animated flame glow wraps the avatar to distinguish administrators.
export default function UserAvatar({ name, src, className, isAdmin = false }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  const avatar = (
    <Avatar className={cn("h-10 w-10", className)}>
      {src ? <AvatarImage src={src} alt={name || "member"} /> : null}
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initial}</AvatarFallback>
    </Avatar>
  );

  if (!isAdmin) return avatar;

  return (
    <div className={cn("relative inline-flex", className && className)}>
      <div className="admin-flame" aria-hidden="true" />
      {avatar}
    </div>
  );
}
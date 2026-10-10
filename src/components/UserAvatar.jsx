import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function UserAvatar({ name, src, className }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <Avatar className={cn("h-10 w-10", className)}>
      {src ? <AvatarImage src={src} alt={name || "member"} /> : null}
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initial}</AvatarFallback>
    </Avatar>
  );
}
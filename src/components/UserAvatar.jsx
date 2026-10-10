import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Precompute two rings of flame positions around the circle.
// Outer ring: 10 larger, cooler flames. Inner ring: 6 smaller, hotter flames.
// Offset so the inner flames sit between the outer ones for depth.
const OUTER_FLAMES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * 360;
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    angle,
    x: 50 + 47 * Math.cos(rad),
    y: 50 + 47 * Math.sin(rad),
    delay: (i * 0.12) % 1,
    duration: 0.75 + (i % 3) * 0.12,
  };
});

const INNER_FLAMES = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * 360 + 30;
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    angle,
    x: 50 + 42 * Math.cos(rad),
    y: 50 + 42 * Math.sin(rad),
    delay: (i * 0.18 + 0.3) % 1,
    duration: 0.6 + (i % 2) * 0.1,
  };
});

// UserAvatar renders a member's avatar. When `isAdmin` is true, an animated
// fire effect wraps the avatar to distinguish administrators.
export default function UserAvatar({ name, src, className, isAdmin = false }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";

  if (!isAdmin) {
    return (
      <Avatar className={cn("h-10 w-10", className)}>
        {src ? <AvatarImage src={src} alt={name || "member"} /> : null}
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initial}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div className="fire-glow" aria-hidden="true" />
      <div className="fire-wrap" aria-hidden="true">
        {OUTER_FLAMES.map((f, i) => (
          <div
            key={`o${i}`}
            className="flame"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              "--flame-angle": `${f.angle}deg`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
            }}
          />
        ))}
        {INNER_FLAMES.map((f, i) => (
          <div
            key={`i${i}`}
            className="flame flame-inner"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              "--flame-angle": `${f.angle}deg`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
            }}
          />
        ))}
      </div>
      <Avatar className={cn("relative z-10 shrink-0", className)}>
        {src ? <AvatarImage src={src} alt={name || "member"} /> : null}
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
}
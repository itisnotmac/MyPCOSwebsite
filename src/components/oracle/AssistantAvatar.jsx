import { Image } from "@/components/ui/image";
import { MASCOT_URL } from "@/lib/constants";

export default function AssistantAvatar() {
  return (
    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/15">
      <Image src={MASCOT_URL} alt="Dr. Tinc Anne" className="h-full w-full object-cover" />
    </div>
  );
}
import { Sparkles } from "lucide-react";
import OracleChat from "@/components/oracle/OracleChat";

export default function Oracle() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="font-display text-2xl font-semibold tracking-tight">The PCOS Oracle</h1>
      </div>
      <OracleChat />
    </div>
  );
}
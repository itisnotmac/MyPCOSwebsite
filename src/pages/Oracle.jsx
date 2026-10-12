import { useState } from "react";
import { Sparkles } from "lucide-react";
import OracleChat from "@/components/oracle/OracleChat";
import VoiceChat from "@/components/oracle/VoiceChat";
import OraclePreview from "@/components/oracle/OraclePreview";
import Seo from "@/components/Seo";
import AdSense from "@/components/AdSense";
import { useAuth } from "@/lib/AuthContext";

export default function Oracle() {
  const [voiceMode, setVoiceMode] = useState(false);
  const { isAuthenticated, authChecked } = useAuth();

  // While auth is being determined, show nothing (brief flash avoidance)
  if (!authChecked) return null;

  // Public visitors see the crawlable, content-rich preview.
  // Authenticated members get the live interactive chat.
  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Seo
          title="Ask Dr. Tinc Anne - Your PCOS AI Expert | MyPCOS"
          description="Chat with Dr. Tinc Anne, an AI devoted entirely to PCOS. Ask about symptoms, nutrition, fertility, mental health, and life with PCOS."
        />
        <AdSense />
        <OraclePreview />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
      <Seo
        title="Ask Dr. Tinc Anne — PCOS AI Oracle | MyPCOS"
        description="Chat with Dr. Tinc Anne, an AI expert devoted entirely to PCOS. Ask about symptoms, nutrition, fertility, insulin resistance, supplements, and more — free and always available."
      />
      <AdSense />
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="font-display text-2xl font-semibold tracking-tight">The PCOS Oracle</h1>
      </div>
      {voiceMode ? (
        <VoiceChat onExit={() => setVoiceMode(false)} />
      ) : (
        <OracleChat onActivateVoice={() => setVoiceMode(true)} />
      )}
    </div>
  );
}
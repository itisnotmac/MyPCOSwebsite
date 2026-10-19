import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Mic, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { MASCOT_URL } from "@/lib/constants";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const SILENCE_MS = 1300;

function pickFemaleVoice(voices) {
  const priorities = [
    /samantha/i, /serena/i, /aria/i, /jenny/i,
    /google uk english female/i, /google.*female/i,
    /karen/i, /moira/i, /tessa/i, /fiona/i,
    /zira/i, /allison/i, /susan/i, /female/i,
  ];
  for (const re of priorities) {
    const v = voices.find((vc) => re.test(vc.name));
    if (v) return v;
  }
  return voices.find((v) => v.lang?.startsWith("en")) || voices[0];
}

function AssistantAvatar({ size = "h-9 w-9" }) {
  return (
    <div className={cn("shrink-0 overflow-hidden rounded-full ring-2 ring-primary/15", size)}>
      <Image src={MASCOT_URL} alt="Dr. Tinc Anne" className="h-full w-full object-cover" />
    </div>
  );
}

function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
      {isUser ? <UserAvatar name="you" src={null} className="h-9 w-9" /> : <AssistantAvatar />}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-card-foreground border border-border"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

export default function VoiceChat({ onExit }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("listening");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const [unsupported, setUnsupported] = useState(false);

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceRef = useRef(null);
  const bufferRef = useRef("");
  const silenceTimerRef = useRef(null);
  const shouldListenRef = useRef(true);
  const sendingRef = useRef(false);

  // Load existing conversation history (shared with text mode via oracleChat storage)
  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.OracleMessage.filter(
          {},
          { sort: "created_date", limit: 100 }
        );
        setMessages(res.items || []);
      } catch {
        setError("Could not load your conversation history.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load and select the best female voice available
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const loadVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) voiceRef.current = pickFemaleVoice(voices);
    };
    loadVoice();
    window.speechSynthesis.onvoiceschanged = loadVoice;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, interim, status]);

  // Core voice loop — set up once
  useEffect(() => {
    if (!SpeechRecognitionAPI) {
      setUnsupported(true);
      setLoading(false);
      return;
    }

    const speak = (rawText) =>
      new Promise((resolve) => {
        if (!("speechSynthesis" in window)) {
          resolve();
          return;
        }
        // Strip markdown symbols the TTS engine reads aloud (e.g. "*asterisk*")
        const text = rawText.replace(/[*_#`>]/g, "");
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        if (voiceRef.current) utter.voice = voiceRef.current;
        utter.rate = 1.0;
        utter.pitch = 1.05;
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
        window.speechSynthesis.speak(utter);
      });

    const startRecognition = () => {
      if (!SpeechRecognitionAPI) return;
      try {
        recognitionRef.current?.abort();
      } catch {}

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimText = "";
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText += transcript;
          else interimText += transcript;
        }
        setInterim(interimText);

        if (finalText.trim()) {
          bufferRef.current = (bufferRef.current + " " + finalText).trim();
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            const text = bufferRef.current.trim();
            if (text) processUtterance(text);
          }, SILENCE_MS);
        }
      };

      recognition.onend = () => {
        // Auto-restart — always-on listening
        if (shouldListenRef.current && !sendingRef.current) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setError("Microphone access was blocked. Allow mic access in your browser to use voice mode.");
          shouldListenRef.current = false;
        }
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {}
    };

    const processUtterance = async (text) => {
      if (sendingRef.current || !text.trim()) return;
      sendingRef.current = true;
      shouldListenRef.current = false;
      setStatus("thinking");
      setInterim("");
      bufferRef.current = "";

      try {
        recognitionRef.current?.stop();
      } catch {}

      setMessages((prev) => [...prev, { role: "user", content: text, id: "u" + Date.now() }]);

      try {
        const res = await base44.functions.invoke("oracleChat", { message: text });
        const reply = res?.data?.reply;
        if (!reply) throw new Error(res?.data?.error || "Dr. Tinc Anne couldn't respond.");

        setMessages((prev) => [...prev, { role: "assistant", content: reply, id: "a" + Date.now() }]);

        setStatus("speaking");
        await speak(reply);

        setStatus("listening");
        shouldListenRef.current = true;
        startRecognition();
      } catch (e) {
        setError(e.message || "Something went wrong.");
        setStatus("listening");
        shouldListenRef.current = true;
        startRecognition();
      } finally {
        sendingRef.current = false;
      }
    };

    shouldListenRef.current = true;
    startRecognition();

    return () => {
      shouldListenRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try {
        recognitionRef.current?.abort();
      } catch {}
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const handleExit = () => {
    shouldListenRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    try {
      recognitionRef.current?.abort();
    } catch {}
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    onExit?.();
  };

  const statusMap = {
    listening: { label: "Listening", dot: "bg-emerald-500" },
    thinking: { label: "Thinking", dot: "bg-amber-500" },
    speaking: { label: "Speaking", dot: "bg-primary" },
  };
  const cur = statusMap[status] || statusMap.listening;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <DisclaimerBanner />

      {/* Module 1: Header */}
      <section className="rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <AssistantAvatar />
            <div>
              <p className="font-display text-lg font-semibold leading-none">Dr. Tinc Anne</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2 w-2 rounded-full", cur.dot, status === "thinking" && "animate-pulse")} />
                Voice mode · {cur.label}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleExit} className="text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Exit voice</span>
          </Button>
        </div>
      </section>

      {/* Module 2: Transcript */}
      <section
        ref={scrollRef}
        className="scrollbar-thin h-[55vh] min-h-[320px] max-h-[640px] space-y-4 overflow-y-auto rounded-3xl border border-border bg-card px-4 py-5 shadow-sm sm:px-5"
      >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 && !interim ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <AssistantAvatar size="h-16 w-16" />
              <h3 className="mt-4 font-display text-xl font-semibold">Let's talk</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                I'm listening. Just start speaking naturally and I'll respond when you pause. No
                need to tap anything — I'm always here, like a friend on the phone.
              </p>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <Bubble key={m.id || m.created_date} role={m.role} content={m.content} />
              ))}
              {interim && (
                <div className="flex flex-row-reverse items-end gap-2.5">
                  <UserAvatar name="you" src={null} className="h-9 w-9" />
                  <div className="max-w-[78%] rounded-2xl rounded-br-md bg-primary/50 px-4 py-3 text-sm italic text-primary-foreground">
                    {interim}…
                  </div>
                </div>
              )}
            </>
          )}
      </section>

      {/* Module 3: Voice controls */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        {error && <p className="mb-3 text-center text-xs text-destructive">{error}</p>}
          {unsupported ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Voice mode needs Chrome or Edge. You can still chat with Dr. Tinc Anne by text —
                just exit voice mode.
              </p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleExit}>
                Back to text chat
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {/* Animated mic */}
              <div className="relative flex h-20 w-20 items-center justify-center">
                {status === "listening" && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-emerald-500/20"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-emerald-500/20"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
                    />
                  </>
                )}
                <div
                  className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition-colors",
                    status === "listening" && "bg-emerald-500",
                    status === "thinking" && "bg-amber-500",
                    status === "speaking" && "bg-primary"
                  )}
                >
                  {status === "thinking" ? (
                    <Loader2 className="h-7 w-7 animate-spin" />
                  ) : status === "speaking" ? (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <Volume2 className="h-7 w-7" />
                    </motion.div>
                  ) : (
                    <Mic className="h-7 w-7" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">
                  {status === "listening" && "I'm listening — just talk"}
                  {status === "thinking" && "Thinking…"}
                  {status === "speaking" && "Speaking…"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {status === "listening"
                    ? "Always on. Speak naturally and I'll respond when you pause."
                    : status === "speaking"
                    ? "I'll listen again when I finish."
                    : "One moment…"}
                </p>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}
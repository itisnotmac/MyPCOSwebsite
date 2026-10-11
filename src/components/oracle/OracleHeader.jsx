import { Mic, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AssistantAvatar from "@/components/oracle/AssistantAvatar";

// Module 1 of 3: the Oracle header (identity, voice chat button, clear chat).
export default function OracleHeader({ onActivateVoice, onClear, clearDisabled }) {
  return (
    <section className="rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <AssistantAvatar />
          <div>
            <p className="font-display text-lg font-semibold leading-none">Dr. Tinc Anne</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online · PCOS expert
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onActivateVoice}
            className="inline-flex items-center gap-2.5 rounded-full border-2 border-primary/40 bg-primary/10 px-8 py-4 text-base font-bold text-primary shadow-lg shadow-primary/10 transition hover:border-primary hover:bg-primary/15 hover:shadow-xl hover:shadow-primary/20"
            title="Switch to voice mode"
          >
            <motion.span
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex origin-bottom"
            >
              <Mic className="h-10 w-10" />
            </motion.span>
            <span className="hidden sm:inline">Voice chat</span>
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                disabled={clearDisabled}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear chat</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear this conversation?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dr. Tinc Anne will permanently forget everything you've discussed in this chat,
                  including the long-term memory summary. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClear}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear conversation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  );
}
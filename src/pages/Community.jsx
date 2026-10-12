import { Users, MessageSquare, Shield } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/AuthContext";
import Seo from "@/components/Seo";
import AdSense from "@/components/AdSense";
import LiveChat from "@/components/community/LiveChat";
import QAList from "@/components/community/QAList";
import ModerationPanel from "@/components/community/ModerationPanel";

export default function Community() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <Seo
        title="PCOS Community - Live Chat, Q&A & Peer Support | MyPCOS"
        description="Connect with women navigating PCOS in a moderated community — live chat, ask questions, share experiences, and support each other."
      />
      <AdSense />
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A supportive space for women with PCOS — chat live, ask questions, and support each other.
        </p>
      </div>

      <Tabs defaultValue="chat">
        <TabsList className={isAdmin ? "grid w-full max-w-lg grid-cols-3" : "grid w-full max-w-md grid-cols-2"}>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-1.5 h-4 w-4" /> Live chat
          </TabsTrigger>
          <TabsTrigger value="qa">
            <Users className="mr-1.5 h-4 w-4" /> Questions
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="mod">
              <Shield className="mr-1.5 h-4 w-4" /> Moderation
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="chat" className="mt-5">
          <LiveChat />
        </TabsContent>

        <TabsContent value="qa" className="mt-5">
          <QAList />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="mod" className="mt-5">
            <ModerationPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
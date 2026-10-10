import { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus, UserCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const ICONS = {
  friend_request: UserPlus,
  friend_accepted: UserCheck,
  new_answer: MessageCircle,
  new_dm: MessageCircle,
  new_follow: Heart,
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (!user) return;
    try {
      const res = await base44.entities.Notification.filter(
        { to_user_id: user.id },
        { sort: "-created_date", limit: 25 }
      );
      setItems(res.items || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
    if (!user) return;
    const unsub = base44.entities.Notification.subscribe((event) => {
      if (event?.data?.to_user_id === user.id) load();
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const unreadItems = items.filter((n) => !n.read);
    if (!unreadItems.length) return;
    try {
      await base44.entities.Notification.bulkUpdate(
        unreadItems.map((n) => ({ id: n.id, read: true }))
      );
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* ignore */
    }
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) markAllRead();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-3">
          <span>Notifications</span>
          {unread > 0 && (
            <span className="text-xs font-medium text-primary">{unread} new</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="max-h-80">
          {items.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              You're all caught up. 🌸
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <li
                    key={n.id}
                    className={cn(
                      "flex items-start gap-3 px-3 py-3 text-sm",
                      !n.read && "bg-accent/30"
                    )}
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-foreground">{n.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.created_date).toLocaleString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
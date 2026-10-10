import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  Sparkles,
  Users,
  MessageSquare,
  Info,
  HelpCircle,
  Mail,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { MASCOT_URL, BRAND_NAME } from "@/lib/constants";
import UserAvatar from "@/components/UserAvatar";
import NotificationBell from "@/components/NotificationBell";
import { cn } from "@/lib/utils";
import { useLoginStreak } from "@/hooks/useLoginStreak";
import UserBadge from "@/components/UserBadge";

function LogoMark({ size = 36 }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full ring-2 ring-primary/15"
      style={{ width: size, height: size }}
    >
      <Image src={MASCOT_URL} alt="Dr. Tinc Anne" className="h-full w-full object-cover" />
    </div>
  );
}

function Wordmark() {
  return (
    <span className="font-display text-xl font-semibold leading-none tracking-tight text-foreground">
      My<span className="text-primary">PCOS</span>
    </span>
  );
}

const publicLinks = [
  { to: "/", label: "Home", end: true },
];

const memberLinks = [
  { to: "/oracle", label: "Oracle", icon: Sparkles },
  { to: "/community", label: "Community", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare },
];

function NavItem({ to, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: profile } = useMyProfile();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  useLoginStreak();

  const handleLogout = () => {
    logout(false);
    navigate("/");
  };

  const links = isAuthenticated ? [...publicLinks, ...memberLinks] : publicLinks;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark />
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavItem key={l.to} {...l} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <button
                  onClick={() => navigate("/profile")}
                  className="ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-muted"
                  title="My profile"
                >
                  <UserAvatar
                    name={profile?.display_name || user?.full_name}
                    src={profile?.avatar_url}
                    className="h-9 w-9"
                  />
                  <div className="hidden flex-col items-start sm:flex">
                    <span className="text-sm font-medium leading-tight text-foreground/80">
                      {(profile?.display_name || user?.full_name || "Member").split(" ")[0]}
                    </span>
                    <UserBadge loginStreak={profile?.login_streak} answerCount={profile?.answer_count} />
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Sign in
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Create free account
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="flex flex-row items-center justify-between px-5 pt-5">
                  <SheetTitle asChild>
                    <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                      <LogoMark size={32} />
                      <Wordmark />
                    </Link>
                  </SheetTitle>
                  <SheetClose asChild>
                    <button aria-label="Close" className="rounded-full p-1 text-muted-foreground hover:bg-muted">
                      <X className="h-5 w-5" />
                    </button>
                  </SheetClose>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-3 py-4">
                  {links.map((l) => (
                    <NavItem
                      key={l.to}
                      {...l}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                  <div className="mt-3 border-t border-border pt-3">
                    {isAuthenticated ? (
                      <Button variant="outline" className="w-full" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                        <LogOut className="mr-2 h-4 w-4" /> Sign out
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button className="w-full" onClick={() => { navigate("/register"); setMobileOpen(false); }}>
                          Create free account
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                          Sign in
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/70 bg-secondary/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:px-6">
          <div className="flex items-center gap-2">
            <LogoMark size={28} />
            <span className="font-display text-lg font-semibold">My<span className="text-primary">PCOS</span></span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A warm, community-driven resource for women with PCOS. Educational support only —
            not a substitute for professional medical care.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/faq" className="hover:text-primary"><HelpCircle className="mr-1 inline h-3.5 w-3.5" />FAQ</Link>
            <Link to="/about" className="hover:text-primary"><Info className="mr-1 inline h-3.5 w-3.5" />About</Link>
            <Link to="/contact" className="hover:text-primary"><Mail className="mr-1 inline h-3.5 w-3.5" />Contact</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {BRAND_NAME}. Made with care.</p>
        </div>
      </footer>
    </div>
  );
}
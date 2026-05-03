import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { User, LogOut, Bookmark, Eye, Bell, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        to="/login"
        className="text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Conectare
      </Link>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
      >
        <div className="h-7 w-7 rounded-full bg-teal/15 text-teal flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 ms-card p-1.5 z-50 shadow-lg">
          <div className="px-3 py-2 border-b border-border mb-1">
            <div className="text-sm font-medium text-foreground truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>

          <MenuItem to="/saved" icon={<Bookmark className="h-4 w-4" />} label="Articole salvate" onClick={() => setOpen(false)} />
          <MenuItem to="/watchlist" icon={<Eye className="h-4 w-4" />} label="Watchlist" onClick={() => setOpen(false)} />
          <MenuItem to="/alerts" icon={<Bell className="h-4 w-4" />} label="Alerte" onClick={() => setOpen(false)} />

          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-sentiment-negative hover:bg-sentiment-negative/5 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" /> Deconectare
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
    >
      {icon} {label}
    </Link>
  );
}

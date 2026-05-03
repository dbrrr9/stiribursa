import { Link } from "@tanstack/react-router";
import { LiveClock } from "./clock";
import { TrendingUp } from "lucide-react";
import { UserMenu } from "./user-menu";

export function TerminalHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold tracking-tight text-foreground">
                Market
              </span>
              <span className="text-base font-bold tracking-tight text-teal">
                Scope
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/" label="Feed" exact />
            <NavItem to="/themes" label="Teme" />
            <NavItem to="/saved" label="Salvate" />
            <NavItem to="/watchlist" label="Watchlist" />
            <NavItem to="/alerts" label="Alerte" />
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-sentiment-positive/10">
              <span className="h-1.5 w-1.5 rounded-full bg-sentiment-positive animate-pulse" />
              <span className="text-[11px] font-medium text-sentiment-positive">
                Live
              </span>
            </div>
            <LiveClock />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, label, exact }: { to: string; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="text-sm font-medium px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      activeProps={{ className: "!text-foreground !bg-muted" }}
    >
      {label}
    </Link>
  );
}

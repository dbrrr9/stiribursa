import { Link } from "@tanstack/react-router";
import { LiveClock } from "./clock";
import logoUrl from "/favicon-source.png?url";

export function TerminalHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-terminal-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-sm border border-phosphor/40 bg-phosphor/10 group-hover:bg-phosphor/20 transition-colors overflow-hidden">
              <img src={logoUrl} alt="MarketScope" width={32} height={32} className="h-full w-full object-contain" />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-phosphor pulse-dot" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold tracking-tight text-foreground glow-text-phosphor">
                MARKET
              </span>
              <span className="font-mono text-base font-bold tracking-tight text-phosphor glow-text-phosphor">
                ::SCOPE
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/" label="MARKET FEED" exact />
            <NavItem to="/about" label="DESPRE" />
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-sm border border-border bg-terminal-surface">
              <span className="h-1.5 w-1.5 rounded-full bg-sentiment-positive pulse-dot" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                LIVE
              </span>
            </div>
            <LiveClock />
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
      className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm text-muted-foreground hover:text-phosphor hover:bg-phosphor/5 transition-colors"
      activeProps={{ className: "!text-phosphor bg-phosphor/10" }}
    >
      {label}
    </Link>
  );
}

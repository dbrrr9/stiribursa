import { useEffect, useState, type FormEvent } from "react";
import { TrendingUp, Lock } from "lucide-react";

const STORAGE_KEY = "ms_gate_expiry";
const PASSWORD = "dbrnews";
const TTL_MS = 14 * 24 * 60 * 60 * 1000;

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const expiry = parseInt(raw, 10);
          if (Number.isFinite(expiry) && expiry > Date.now()) {
            setUnlocked(true);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch { /* empty */ }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try { localStorage.setItem(STORAGE_KEY, String(Date.now() + TTL_MS)); } catch { /* empty */ }
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="ms-card w-full max-w-sm p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          MarketScope
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Introdu parola pentru a accesa platforma
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10 text-sm text-foreground placeholder:text-muted-foreground/40"
            />
          </div>
          {error && (
            <div className="text-xs text-sentiment-negative font-medium">
              Parolă incorectă
            </div>
          )}
          <button
            type="submit"
            className="w-full text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Accesează
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-border text-[10px] uppercase tracking-wider text-muted-foreground">
          Market Intelligence Platform
        </div>
      </div>
    </div>
  );
}

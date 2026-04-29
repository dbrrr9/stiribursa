import { useEffect, useState, type FormEvent } from "react";

const STORAGE_KEY = "ms_gate_expiry";
const PASSWORD = "dbrnews";
const TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 zile

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
    } catch {}
    setReady(true);
  }, []);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try { localStorage.setItem(STORAGE_KEY, String(Date.now() + TTL_MS)); } catch {}
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="terminal-root min-h-screen flex items-center justify-center px-4">
      <div className="terminal-card w-full max-w-md p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-phosphor mb-4">
          ▸ secure_access.required
        </div>
        <h1 className="font-mono text-2xl font-bold text-foreground glow-text-phosphor mb-2">
          MARKETSCOPE<span className="blink-cursor" />
        </h1>
        <p className="text-sm text-muted-foreground mb-6 font-mono">
          // introdu parola pentru a accesa terminalul
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-sm bg-terminal-surface border border-border focus:border-phosphor focus:outline-none focus:ring-1 focus:ring-phosphor/40 font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
          />
          {error && (
            <div className="font-mono text-xs text-sentiment-negative">
              ✗ access_denied: parolă incorectă
            </div>
          )}
          <button
            type="submit"
            className="w-full font-mono text-xs uppercase tracking-[0.15em] px-4 py-2.5 rounded-sm border border-phosphor/60 text-phosphor hover:bg-phosphor/10 transition-colors font-semibold"
          >
            ▸ autentifică
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-border font-mono text-[10px] uppercase tracking-wider text-muted-foreground text-center">
          MARKETSCOPE TERMINAL v1.0
        </div>
      </div>
    </div>
  );
}

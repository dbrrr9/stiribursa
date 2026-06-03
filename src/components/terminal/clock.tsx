import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!now) {
    return (
      <span className="text-xs text-muted-foreground tabular-nums">
        --:--:-- UTC
      </span>
    );
  }

  const hh = pad(now.getUTCHours());
  const mm = pad(now.getUTCMinutes());
  const ss = pad(now.getUTCSeconds());

  return (
    <span className="text-xs tabular-nums text-muted-foreground">
      {hh}:{mm}:<span className="text-foreground font-medium">{ss}</span> <span className="text-muted-foreground/60">UTC</span>
    </span>
  );
}

function safeDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  const t = d.getTime();
  // Reject invalid dates and bogus epoch/1970 values (e.g. new Date(null) -> 0)
  if (isNaN(t) || t < 946684800000) return null; // before 2000-01-01 = invalid for live news
  return d;
}

export function timeAgo(iso?: string | null): string {
  const d = safeDate(iso);
  if (!d) return "recent";
  let diff = Date.now() - d.getTime();
  if (diff < 0) diff = 0; // future timestamps -> treat as now
  const m = Math.floor(diff / 60000);
  if (m < 1) return "acum";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d2 = Math.floor(h / 24);
  if (d2 < 30) return `${d2}z`;
  return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
}

export function formatTimestamp(iso?: string | null): string {
  const d = safeDate(iso);
  if (!d) return "Dată indisponibilă";
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC · ${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}`;
}

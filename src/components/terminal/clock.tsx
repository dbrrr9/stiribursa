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
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        --:--:-- UTC
      </span>
    );
  }

  const hh = pad(now.getUTCHours());
  const mm = pad(now.getUTCMinutes());
  const ss = pad(now.getUTCSeconds());

  return (
    <span className="font-mono text-xs tabular-nums text-phosphor-dim">
      {hh}:{mm}:<span className="text-phosphor">{ss}</span> UTC
    </span>
  );
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "acum";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}z`;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC · ${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}`;
}

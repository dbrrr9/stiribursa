import { useMemo } from "react";
import type { NewsItem } from "@/lib/news-types";

export function TickerBar({ items }: { items: NewsItem[] }) {
  const ticks = useMemo(() => {
    const themes = new Map<string, number>();
    items.forEach((i) => {
      i.themes.forEach((t) => themes.set(t, (themes.get(t) ?? 0) + 1));
    });
    const arr = Array.from(themes.entries()).map(([t, c]) => ({
      label: t.replace(/-/g, " ").toUpperCase(),
      count: c,
      delta: Math.random() > 0.5 ? "+" : "-",
      pct: (Math.random() * 2.5).toFixed(2),
    }));
    return arr.length ? arr : [{ label: "MARKETS", count: 0, delta: "+", pct: "0.00" }];
  }, [items]);

  const doubled = [...ticks, ...ticks];

  return (
    <div className="relative overflow-hidden border-y border-border bg-terminal-surface/60 backdrop-blur">
      <div className="ticker-track py-2">
        {doubled.map((t, idx) => {
          const up = t.delta === "+";
          return (
            <div
              key={idx}
              className="flex items-center gap-2 px-6 font-mono text-xs"
            >
              <span className="text-muted-foreground">{t.label}</span>
              <span className="text-phosphor-dim tabular-nums">{t.count}</span>
              <span
                className={
                  up ? "text-sentiment-positive tabular-nums" : "text-sentiment-negative tabular-nums"
                }
              >
                {t.delta}
                {t.pct}%
              </span>
              <span className="text-border">│</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

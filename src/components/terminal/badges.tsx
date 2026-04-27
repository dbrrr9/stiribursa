import { cn } from "@/lib/utils";
import type { ImpactLevel, Sentiment, NewsSource } from "@/lib/news-types";

export function ImpactBadge({ impact, className }: { impact: ImpactLevel; className?: string }) {
  const map = {
    high: { label: "HIGH IMPACT", color: "text-impact-high border-impact-high/40 bg-impact-high/10" },
    medium: { label: "MED IMPACT", color: "text-impact-medium border-impact-medium/40 bg-impact-medium/10" },
    low: { label: "LOW IMPACT", color: "text-impact-low border-impact-low/40 bg-impact-low/10" },
  } as const;
  const m = map[impact];
  return (
    <span
      className={cn(
        "terminal-chip !border-current",
        m.color,
        className,
      )}
    >
      <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const map = {
    positive: { label: "POZITIV", cls: "text-sentiment-positive border-sentiment-positive/40", arrow: "▲" },
    negative: { label: "NEGATIV", cls: "text-sentiment-negative border-sentiment-negative/40", arrow: "▼" },
    mixed: { label: "MIXT", cls: "text-sentiment-mixed border-sentiment-mixed/40", arrow: "◆" },
    uncertain: { label: "INCERT", cls: "text-muted-foreground border-border", arrow: "?" },
  } as const;
  const m = map[sentiment];
  return (
    <span className={cn("terminal-chip !border-current", m.cls)}>
      <span>{m.arrow}</span>
      {m.label}
    </span>
  );
}

export function SourceBadge({ source }: { source: NewsSource }) {
  const code = source === "Reuters" ? "RTRS" : source === "Bloomberg" ? "BBG" : "YHOO";
  return (
    <span className="terminal-chip !text-cyan !border-cyan/40">
      <span className="font-bold">{code}</span>
    </span>
  );
}

export function RelevanceBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 80 ? "bg-phosphor" : pct >= 60 ? "bg-amber" : "bg-muted-foreground";
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
      <span className="tabular-nums">REL</span>
      <div className="relative h-1 w-16 overflow-hidden rounded-sm bg-muted">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-sm", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular-nums text-foreground">{pct}</span>
    </div>
  );
}

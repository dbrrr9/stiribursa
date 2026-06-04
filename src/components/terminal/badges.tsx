import { cn } from "@/lib/utils";
import type { ImpactLevel, Sentiment, NewsSource, NewsStatus } from "@/lib/news-types";

export function ImpactBadge({ impact, className }: { impact: ImpactLevel; className?: string }) {
  const map = {
    high: { label: "High Impact", color: "text-impact-high bg-impact-high/8 border border-impact-high/20" },
    medium: { label: "Medium", color: "text-impact-medium bg-impact-medium/8 border border-impact-medium/20" },
    low: { label: "Low", color: "text-impact-low bg-impact-low/8 border border-impact-low/20" },
  } as const;
  const m = map[impact];
  return (
    <span className={cn("ms-chip", m.color, className)}>
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", impact === "high" ? "bg-impact-high" : impact === "medium" ? "bg-impact-medium" : "bg-impact-low")} />
      {m.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: NewsStatus }) {
  const map = {
    breaking: { label: "Breaking", cls: "text-white bg-impact-high border-impact-high" },
    developing: { label: "Developing", cls: "text-impact-medium bg-impact-medium/10 border-impact-medium/30" },
    confirmed: { label: "Confirmed", cls: "text-sentiment-positive bg-sentiment-positive/10 border-sentiment-positive/30" },
    "low-relevance": { label: "Low Relevance", cls: "text-muted-foreground bg-muted border-border" },
  } as const;
  const m = map[status];
  return (
    <span className={cn("ms-chip border", m.cls)}>
      {m.label}
    </span>
  );
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const map = {
    positive: { label: "Pozitiv", cls: "text-sentiment-positive bg-sentiment-positive/8", arrow: "↑" },
    negative: { label: "Negativ", cls: "text-sentiment-negative bg-sentiment-negative/8", arrow: "↓" },
    mixed: { label: "Mixt", cls: "text-sentiment-mixed bg-sentiment-mixed/8", arrow: "↕" },
    uncertain: { label: "Incert", cls: "text-muted-foreground bg-muted", arrow: "?" },
  } as const;
  const m = map[sentiment];
  return (
    <span className={cn("ms-chip", m.cls)}>
      <span className="font-medium">{m.arrow}</span>
      {m.label}
    </span>
  );
}

const SOURCE_COLORS: Record<NewsSource, string> = {
  Reuters: "text-orange-600 bg-orange-50",
  Bloomberg: "text-purple-700 bg-purple-50",
  "Yahoo Finance": "text-indigo-600 bg-indigo-50",
  CNBC: "text-blue-700 bg-blue-50",
  MarketWatch: "text-emerald-700 bg-emerald-50",
  "Investing.com": "text-sentiment-positive bg-sentiment-positive/8",
};

export function SourceBadge({ source }: { source: NewsSource }) {
  return (
    <span className={cn("ms-chip font-medium", SOURCE_COLORS[source] ?? "")}>
      {source}
    </span>
  );
}

export function RelevanceBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const color =
    pct >= 80 ? "bg-teal" : pct >= 60 ? "bg-impact-medium" : "bg-muted-foreground/40";
  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="font-medium">Relevanță</span>
      <div className="relative h-1.5 w-14 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular-nums font-medium text-foreground">{pct}</span>
    </div>
  );
}

export function ScoreBadge({ label, score, color }: { label: string; score: number; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold tabular-nums", color ?? "text-foreground")}>{score}</span>
    </div>
  );
}

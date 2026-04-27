import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/news-types";
import { THEME_LABELS } from "@/lib/news-types";
import { ImpactBadge, SentimentBadge, SourceBadge, RelevanceBar } from "./badges";
import { timeAgo, formatTimestamp } from "./clock";

export function NewsCard({ item, index = 0 }: { item: NewsItem; index?: number }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: item.id }}
      className="group terminal-card fade-up block p-4 sm:p-5"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <SourceBadge source={item.source} />
          <ImpactBadge impact={item.impact} />
          <SentimentBadge sentiment={item.sentiment} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-phosphor group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <h3 className="font-sans text-base sm:text-lg font-semibold leading-snug text-foreground group-hover:text-phosphor transition-colors mb-2 [text-wrap:balance]">
        {item.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {item.summary}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.themes.slice(0, 4).map((t) => (
          <span
            key={t}
            className="terminal-chip !text-phosphor-dim !border-phosphor-dim/30"
          >
            {THEME_LABELS[t]}
          </span>
        ))}
        {item.regions.slice(0, 3).map((r) => (
          <span key={r} className="terminal-chip">
            {r}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
          <span className="text-phosphor-dim tabular-nums">⟢ {timeAgo(item.publishedAt)}</span>
          <span className="hidden sm:inline">{formatTimestamp(item.publishedAt)}</span>
        </div>
        <RelevanceBar score={item.relevanceScore} />
      </div>
    </Link>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="terminal-card p-5 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-4 w-12 rounded-sm bg-muted" />
        <div className="h-4 w-20 rounded-sm bg-muted" />
        <div className="h-4 w-16 rounded-sm bg-muted" />
      </div>
      <div className="h-5 w-3/4 rounded bg-muted mb-2" />
      <div className="h-5 w-1/2 rounded bg-muted mb-4" />
      <div className="h-3 w-full rounded bg-muted mb-1" />
      <div className="h-3 w-2/3 rounded bg-muted" />
    </div>
  );
}

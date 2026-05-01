import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/news-types";
import { THEME_LABELS } from "@/lib/news-types";
import { ImpactBadge, SentimentBadge, SourceBadge, StatusBadge } from "./badges";
import { timeAgo } from "./clock";

export function NewsCard({ item, index = 0, featured = false }: { item: NewsItem; index?: number; featured?: boolean }) {
  return (
    <Link
      to="/article/$id"
      params={{ id: item.id }}
      className={cn(
        "group ms-card fade-up block p-5",
        featured && "md:col-span-2 lg:col-span-2",
        item.status === "breaking" && "border-impact-high/30 bg-impact-high/[0.02]"
      )}
      style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
    >
      {/* Top row: source + badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <SourceBadge source={item.source} />
          {item.status === "breaking" && <StatusBadge status="breaking" />}
          <ImpactBadge impact={item.impact} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-teal group-hover:-translate-y-0.5 group-hover:translate-x-0.5 flex-shrink-0" />
      </div>

      {/* Title */}
      <h3 className={cn(
        "font-semibold leading-snug text-foreground group-hover:text-teal transition-colors mb-2 [text-wrap:balance]",
        featured ? "text-lg sm:text-xl" : "text-base"
      )}>
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
        {item.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.markets.slice(0, 3).map((m) => (
          <span key={m} className="ms-chip text-teal bg-teal/8">{m}</span>
        ))}
        {item.themes.slice(0, 3).map((t) => (
          <span key={t} className="ms-chip">{THEME_LABELS[t]}</span>
        ))}
        {item.regions.slice(0, 2).map((r) => (
          <span key={r} className="ms-chip text-navy/70 bg-navy/5">{r}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="tabular-nums">{timeAgo(item.publishedAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          <SentimentBadge sentiment={item.sentiment} />
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-muted-foreground">Rel</span>
            <span className="font-semibold tabular-nums text-foreground">{item.relevanceScore}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="ms-card p-5 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 rounded-md bg-muted" />
        <div className="h-5 w-20 rounded-md bg-muted" />
      </div>
      <div className="h-5 w-3/4 rounded bg-muted mb-2" />
      <div className="h-5 w-1/2 rounded bg-muted mb-4" />
      <div className="h-4 w-full rounded bg-muted mb-1" />
      <div className="h-4 w-2/3 rounded bg-muted" />
    </div>
  );
}

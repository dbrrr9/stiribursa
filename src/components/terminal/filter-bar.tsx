import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { NewsSource, ThemeTag, ImpactLevel } from "@/lib/news-types";
import { THEME_LABELS } from "@/lib/news-types";

const SOURCES: NewsSource[] = ["Reuters", "Bloomberg", "Investing.com", "Yahoo Finance", "CNBC", "MarketWatch"];
const THEMES: ThemeTag[] = ["actiuni", "obligatiuni", "indici", "forex", "marfuri", "crypto", "macro", "earnings", "banci-centrale", "geopolitica"];
const IMPACTS: ImpactLevel[] = ["high", "medium", "low"];

export type SortMode = "relevance" | "newest" | "highest-impact";

export interface FilterState {
  q: string;
  sources: NewsSource[];
  themes: ThemeTag[];
  impacts: ImpactLevel[];
  sort: SortMode;
}

interface FilterBarProps {
  state: FilterState;
  onChange: (next: FilterState) => void;
  totalCount: number;
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterBar({ state, onChange, totalCount }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = state.sources.length + state.themes.length + state.impacts.length + (state.q ? 1 : 0);

  return (
    <div className="ms-card p-4 space-y-3">
      {/* Search + sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={state.q}
            onChange={(e) => onChange({ ...state, q: e.target.value })}
            placeholder="Caută titluri, teme, sectoare, companii..."
            className="ms-input w-full pl-10 pr-10 py-2.5 text-sm placeholder:text-muted-foreground/50"
          />
          {state.q && (
            <button onClick={() => onChange({ ...state, q: "" })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="șterge">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {(["newest", "relevance", "highest-impact"] as SortMode[]).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...state, sort: s })}
              className={cn(
                "px-3 py-2 text-xs font-medium rounded-md border transition-all whitespace-nowrap",
                state.sort === s
                  ? "border-teal text-teal bg-teal/5"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20",
              )}
            >
              {s === "newest" ? "Recente" : s === "relevance" ? "Relevanță" : "Impact"}
            </button>
          ))}
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border transition-all",
              expanded || activeCount > 0
                ? "border-teal text-teal bg-teal/5"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtre
            {activeCount > 0 && <span className="bg-teal text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">{activeCount}</span>}
          </button>
        </div>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="space-y-3 pt-3 border-t border-border">
          <FilterGroup label="Surse">
            {SOURCES.map((s) => (
              <FilterChip key={s} label={s} active={state.sources.includes(s)} onClick={() => onChange({ ...state, sources: toggle(state.sources, s) })} />
            ))}
          </FilterGroup>

          <FilterGroup label="Impact">
            {IMPACTS.map((imp) => (
              <FilterChip key={imp} label={imp === "high" ? "High" : imp === "medium" ? "Medium" : "Low"} active={state.impacts.includes(imp)} onClick={() => onChange({ ...state, impacts: toggle(state.impacts, imp) })} />
            ))}
          </FilterGroup>

          <FilterGroup label="Teme">
            {THEMES.map((t) => (
              <FilterChip key={t} label={THEME_LABELS[t]} active={state.themes.includes(t)} onClick={() => onChange({ ...state, themes: toggle(state.themes, t) })} />
            ))}
          </FilterGroup>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{totalCount}</span> rezultate
          {activeCount > 0 && <> · <span className="text-teal tabular-nums">{activeCount}</span> filtre active</>}
        </div>
        {activeCount > 0 && (
          <button onClick={() => onChange({ q: "", sources: [], themes: [], impacts: [], sort: state.sort })} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Resetează filtrele
          </button>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="ms-section-label w-16 sm:w-20 flex-shrink-0 text-[10px]">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "ms-chip cursor-pointer transition-all border",
        active ? "text-teal bg-teal/8 border-teal/30" : "border-transparent hover:bg-muted/80",
      )}
    >
      {label}
    </button>
  );
}

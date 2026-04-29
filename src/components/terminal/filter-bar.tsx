import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsSource, ThemeTag, ImpactLevel } from "@/lib/news-types";
import { THEME_LABELS } from "@/lib/news-types";

const SOURCES: NewsSource[] = [
  "Reuters",
  "Bloomberg",
  "Yahoo Finance",
  "CNBC",
  "MarketWatch",
];
const THEMES: ThemeTag[] = [
  "actiuni",
  "obligatiuni",
  "indici",
  "forex",
  "marfuri",
  "crypto",
  "macro",
  "earnings",
  "banci-centrale",
  "geopolitica",
];
const IMPACTS: ImpactLevel[] = ["high", "medium", "low"];

export interface FilterState {
  q: string;
  sources: NewsSource[];
  themes: ThemeTag[];
  impacts: ImpactLevel[];
  sort: "relevance" | "newest";
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
  const activeCount =
    state.sources.length + state.themes.length + state.impacts.length + (state.q ? 1 : 0);

  return (
    <div className="terminal-card p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={state.q}
            onChange={(e) => onChange({ ...state, q: e.target.value })}
            placeholder="search > caută titluri, teme, sectoare..."
            className="terminal-input w-full pl-10 pr-10 py-2.5 text-sm placeholder:text-muted-foreground/60"
          />
          {state.q && (
            <button
              onClick={() => onChange({ ...state, q: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-phosphor"
              aria-label="șterge căutarea"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onChange({ ...state, sort: "relevance" })}
            className={cn(
              "px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all",
              state.sort === "relevance"
                ? "border-phosphor text-phosphor bg-phosphor/10"
                : "border-border text-muted-foreground hover:text-foreground hover:border-phosphor/40",
            )}
          >
            Relevanță
          </button>
          <button
            onClick={() => onChange({ ...state, sort: "newest" })}
            className={cn(
              "px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all",
              state.sort === "newest"
                ? "border-phosphor text-phosphor bg-phosphor/10"
                : "border-border text-muted-foreground hover:text-foreground hover:border-phosphor/40",
            )}
          >
            Recente
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <FilterGroup label="SURSE">
          {SOURCES.map((s) => {
            const active = state.sources.includes(s);
            return (
              <button
                key={s}
                onClick={() => onChange({ ...state, sources: toggle(state.sources, s) })}
                className={cn(
                  "terminal-chip cursor-pointer transition-all hover:!border-cyan/60",
                  active && "!text-cyan !border-cyan/60 !bg-cyan/10",
                )}
              >
                {s}
              </button>
            );
          })}
        </FilterGroup>

        <FilterGroup label="IMPACT">
          {IMPACTS.map((imp) => {
            const active = state.impacts.includes(imp);
            const colorMap = {
              high: "!text-impact-high !border-impact-high/60 !bg-impact-high/10",
              medium: "!text-impact-medium !border-impact-medium/60 !bg-impact-medium/10",
              low: "!text-impact-low !border-impact-low/60 !bg-impact-low/10",
            } as const;
            return (
              <button
                key={imp}
                onClick={() => onChange({ ...state, impacts: toggle(state.impacts, imp) })}
                className={cn(
                  "terminal-chip cursor-pointer transition-all",
                  active && colorMap[imp],
                )}
              >
                {imp.toUpperCase()}
              </button>
            );
          })}
        </FilterGroup>

        <FilterGroup label="TEME">
          {THEMES.map((t) => {
            const active = state.themes.includes(t);
            return (
              <button
                key={t}
                onClick={() => onChange({ ...state, themes: toggle(state.themes, t) })}
                className={cn(
                  "terminal-chip cursor-pointer transition-all hover:!border-phosphor/60",
                  active && "!text-phosphor !border-phosphor/60 !bg-phosphor/10",
                )}
              >
                {THEME_LABELS[t]}
              </button>
            );
          })}
        </FilterGroup>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="font-mono text-xs text-muted-foreground">
          <span className="text-phosphor tabular-nums">{totalCount}</span> rezultate
          {activeCount > 0 && (
            <>
              {" "}
              · <span className="text-cyan tabular-nums">{activeCount}</span> filtre
            </>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() =>
              onChange({ q: "", sources: [], themes: [], impacts: [], sort: state.sort })
            }
            className="font-mono text-xs text-muted-foreground hover:text-phosphor transition-colors"
          >
            ✕ resetează filtrele
          </button>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider w-16 sm:w-20 flex-shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

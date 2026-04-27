export type NewsSource =
  | "Reuters"
  | "Bloomberg"
  | "Yahoo Finance"
  | "CNBC"
  | "MarketWatch"
  | "Financial Times"
  | "Investing.com";
export type ImpactLevel = "high" | "medium" | "low";
export type Sentiment = "positive" | "negative" | "mixed" | "uncertain";
export type ThemeTag =
  | "actiuni"
  | "obligatiuni"
  | "indici"
  | "forex"
  | "marfuri"
  | "crypto"
  | "macro"
  | "earnings"
  | "banci-centrale"
  | "geopolitica";
export type MarketRegion = "SUA" | "Europa" | "Asia" | "Global" | "Emergente";

export interface NewsItem {
  id: string;
  title: string;
  source: NewsSource;
  url: string;
  publishedAt: string; // ISO
  summary: string;
  themes: ThemeTag[];
  impact: ImpactLevel;
  sentiment: Sentiment;
  regions: MarketRegion[];
  markets: string[]; // e.g. equities, bonds, FX, commodities
  sectors?: string[];
  relevanceScore: number; // 0-100
}

export interface ArticleAnalysis {
  summarySimple: string; // explicat simplu
  whyItMatters: string;
  shortTermImpact: string;
  mediumTermImpact: string;
  affectedMarkets: string;
  watchPoints: string[];
  bottomLine: string[]; // 3-5 bullet
}

export const THEME_LABELS: Record<ThemeTag, string> = {
  actiuni: "Acțiuni",
  obligatiuni: "Obligațiuni",
  indici: "Indici",
  forex: "Forex",
  marfuri: "Mărfuri",
  crypto: "Crypto",
  macro: "Macro",
  earnings: "Earnings",
  "banci-centrale": "Bănci Centrale",
  geopolitica: "Geopolitică",
};

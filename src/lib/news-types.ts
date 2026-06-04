export type NewsSource =
  | "Reuters"
  | "Bloomberg"
  | "Yahoo Finance"
  | "CNBC"
  | "MarketWatch"
  | "Investing.com";
export type ImpactLevel = "high" | "medium" | "low";
export type Sentiment = "positive" | "negative" | "mixed" | "uncertain";
export type NewsStatus = "breaking" | "developing" | "confirmed" | "low-relevance";
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
  status: NewsStatus;
  regions: MarketRegion[];
  markets: string[]; // e.g. equities, bonds, FX, commodities
  sectors?: string[];
  relevanceScore: number; // 0-100
  urgencyScore?: number; // 0-100
  confidenceScore?: number; // 0-100
}

export interface ArticleAnalysis {
  summarySimple: string;
  whyItMatters: string;
  shortTermImpact: string;
  mediumTermImpact: string;
  affectedMarkets: string;
  watchPoints: string[];
  bottomLine: string[];
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

export const STATUS_LABELS: Record<NewsStatus, string> = {
  breaking: "Breaking",
  developing: "Developing",
  confirmed: "Confirmed",
  "low-relevance": "Low Relevance",
};

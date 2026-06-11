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
  tickers?: string[];
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

export interface DailyBrief {
  date: string;
  generatedAt: string;
  headline: string;
  snapshot: {
    bullets: string[];
    indices: { name: string; change: string; value: string }[];
    fx: { name: string; change: string; value: string }[];
    rates: { name: string; value: string }[];
    commodities: { name: string; change: string; value: string }[];
  };
  macroSentiment: { markdown: string };
  equities: {
    markdown: string;
    keyStocks: { symbol: string; move: string; trigger: string; importance: string }[];
  };
  ratesFx: { markdown: string };
  commoditiesCrypto: { markdown: string };
  topNews: {
    title: string;
    markdown: string;
    affectedInstruments: string[];
    bullishScenario: string;
    bearishScenario: string;
  }[];
  retailImpact: string[];
  riskScenarios: { markdown: string };
  pitch: string;
}

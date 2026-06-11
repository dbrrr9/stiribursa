-- Creare tabel pentru stocarea articolelor de știri
CREATE TABLE IF NOT EXISTS public.news_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    summary TEXT NOT NULL,
    themes TEXT[] DEFAULT '{}',
    impact TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    status TEXT NOT NULL,
    regions TEXT[] DEFAULT '{}',
    markets TEXT[] DEFAULT '{}',
    relevance_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creare tabel pentru stocarea analizelor AI generate
CREATE TABLE IF NOT EXISTS public.news_analyses (
    news_id TEXT PRIMARY KEY REFERENCES public.news_items(id) ON DELETE CASCADE,
    summary_simple TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    short_term_impact TEXT NOT NULL,
    medium_term_impact TEXT NOT NULL,
    affected_markets TEXT NOT NULL,
    watch_points TEXT[] DEFAULT '{}',
    bottom_line TEXT[] DEFAULT '{}',
    tickers TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Permisiuni Row Level Security (RLS) pentru acces la citire public
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News items are viewable by everyone." 
ON public.news_items FOR SELECT USING (true);

CREATE POLICY "News analyses are viewable by everyone." 
ON public.news_analyses FOR SELECT USING (true);

-- Notă: Scrierea în aceste tabele se va face folosind "Service Role Key" pe server,
-- ocolind RLS, astfel că nu e nevoie de politici de scriere (INSERT/UPDATE/DELETE) pentru public.

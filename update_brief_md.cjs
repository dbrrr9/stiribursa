const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/lib/news.functions.ts');
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `export interface DailyBrief {
  date: string;
  generatedAt: string;
  content: string;
}

export const getDailyBrief = createServerFn({ method: "POST" })
  .handler(async (): Promise<{ brief: DailyBrief | null; error?: string }> => {
    const rlKey = \`brief-\${Date.now()}\`;
    if (!checkRateLimit(rlKey)) {
      return { brief: null, error: "Prea multe cereri. Așteaptă un minut." };
    }
  if (dailyBriefCache && Date.now() - dailyBriefCache.ts < 1000 * 60 * 60) {
    return { brief: dailyBriefCache.brief };
  }

  const newsData = newsCache?.items ?? SEED_NEWS;
  const topNews = newsData.slice(0, 40);

  if (!process.env.GROQ_API_KEY) {
    const fallback: DailyBrief = {
      date: new Date().toISOString().split("T")[0],
      generatedAt: new Date().toISOString(),
      content: "# Briefing Indisponibil\\n\\nActivează cheia API Groq pentru a genera Market Brief-ul complet.",
    };
    return { brief: fallback };
  }

  const newsSummary = topNews.map((n, i) =>
    \`\${i + 1}. [\${n.source}] \${n.title} — Impact: \${n.impact}, Sentiment: \${n.sentiment}, Teme: \${n.themes.join(", ")}, Regiuni: \${n.regions.join(", ")}\\nRezumat: \${n.summary}\`
  ).join("\\n\\n");

  const sys = \`Ești un MARKET & NEWS ANALYST pentru piețele de capital globale (US, Europa, Asia) care lucrează pentru un broker/desk de tranzacționare. Rolul tău este să generezi un DAILY MARKET BRIEF foarte bine structurat, cu date REALE și CURENTE (folosind contextul oferit și cunoștințele tale generale actualizate pentru a estima nivelurile curente).
Scrie UN SINGUR document coerent și extrem de detaliat, în format Markdown, folosind liste, texte boldate și headere. Fii extrem de analitic, complex și detaliat.\`;

  const usr = \`Generează un MARKET BRIEF ZILNIC PREMIUM (în limba ROMÂNĂ) folosind ACESTE ȘTIRI RECENTE (\${topNews.length} articole):

CONȚINUT:
\${newsSummary}

STRUCTURĂ OBLIGATORIE (scrie minim un paragraf stufos pentru fiecare):
1) HEADLINE & SNAPSHOT: Un titlu urmat de 3-5 bullet-uri detaliate. Listează indici majori, FX și mărfuri estimând nivelul lor curent.
2) MACRO & SENTIMENT DE PIAȚĂ: Analiză amplă a driverelor macro.
3) ECHITY MARKETS (US, Europa, Asia): Detalii pe sectoare, inclusiv stocks cheie (Nvidia, Apple, etc) cu reacții.
4) RATES & FX: Analiza dobânzilor, curbei de randament și mișcărilor pe piața valutară.
5) COMMODITIES & CRYPTO: Aur, Petrol, BTC. Context și reacții la date.
6) TOP 3 ȘTIRI CU IMPACT: Cele mai vitale 3 povești macro, inclusiv cu scenarii Bull/Bear pentru piețe.
7) IMPACT PENTRU UN INVESTITOR DE RETAIL: Cum ne protejăm, oportunități.
8) RISK MANAGEMENT & SCENARII: Base, Bull și Bear case. Volatilitatea pieței.
9) MINI-REZUMAT PENTRU CLIENT (PITCH DE 1-2 MINUTE): O secțiune finală cu un speech concis (6-10 fraze) perfect de rostit la telefon de către un broker.

Păstrează un format Markdown profesional.\`;

  try {
    const markdownResult = await callAI(usr, sys);
    if (markdownResult) {
      const brief: DailyBrief = {
        date: new Date().toISOString().split("T")[0],
        generatedAt: new Date().toISOString(),
        content: typeof markdownResult === 'string' ? markdownResult : JSON.stringify(markdownResult),
      };
      dailyBriefCache = { brief, ts: Date.now() };
      return { brief };
    }
    return { brief: null, error: "Nu s-a putut genera briefing-ul." };
  } catch (e) {
    console.error("getDailyBrief", e);
    return { brief: null, error: "Eroare la generarea briefing-ului zilnic." };
  }
});`;

const startIndex = content.indexOf('export interface DailyBrief {');
const getDailyBriefIndex = content.indexOf('export const getDailyBrief = createServerFn({ method: "POST" })');
const endIndex = content.indexOf('});', getDailyBriefIndex) + 3;

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully replaced getDailyBrief section to Markdown format.");
} else {
    console.error("Could not find start or end index.");
}

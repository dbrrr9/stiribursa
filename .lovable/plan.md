
## Plan

### 1. Remove Password Gate
- Delete the `PasswordGate` wrapper from `src/routes/__root.tsx`
- Optionally remove `src/components/terminal/password-gate.tsx`

### 2. Add Dark Mode / Light Mode Toggle
- Add dark theme CSS variables in `src/styles.css` under `.dark` class (dark backgrounds, light text, adjusted shadows, etc.)
- Create a `ThemeToggle` component (Sun/Moon icon button) that toggles `.dark` on `<html>` and persists to `localStorage`
- Place it in `src/components/terminal/header.tsx` right before the `UserMenu` / "Conectare" button

### 3. Clean Up News Summaries (Remove href/HTML artifacts)
- In `src/lib/news.functions.ts`, enhance the `decodeEntities` function and the summary cleaning in `classifyArticle` to strip leftover `href=`, anchor tags, and other HTML remnants from titles and summaries
- Add a dedicated `cleanText()` function that removes URL fragments, `href="..."`, and other markup artifacts

### 4. Enhance News Aggregation (More Sources, More Quantity, Better Relevance)
- Add more RSS feed queries in `RSS_FEEDS` array:
  - Additional Reuters/Bloomberg queries for energy, tech earnings, specific geopolitical topics
  - More Yahoo Finance and MarketWatch specialized feeds
  - Add CNBC specific topic feeds (technology, energy)
- Increase `TARGET_TOTAL` from 80 to 120
- Increase `MAX_AGE_MS` to 48h for broader coverage
- Lower `MIN_RELEVANCE` slightly to capture more geopolitical news
- Expand `THEME_KEYWORDS` for better tech coverage (Intel, AMD, Micron, NVIDIA, Apple, Microsoft, etc.)
- Expand geopolitica keywords further for Iran/USA specifics

### 5. Upgrade Daily Brief (Much More Detailed)
- Expand the `DailyBrief` interface to include new sections:
  - `sectorPerformance`: array of sector entries with direction/percentage
  - `commodities`: oil, gold, silver performance data
  - `techHighlights`: key tech stock moves
  - `geopoliticalUpdate`: dedicated geopolitical section
- Update the `DAILY_BRIEF_SCHEMA` to include these new fields
- Update the AI prompt to request specific data points: exact prices, percentage changes, sector breakdowns for oil, gold, tech stocks (Intel, AMD, Micron, NVIDIA), Iran/USA developments
- Update `src/routes/brief.tsx` to render the new sections with proper formatting

### 6. General Bug Check and Polish
- Verify all navigation links work (Brief, Calendar, Themes, Saved, Watchlist, Alerts)
- Ensure dark mode works across all pages (password gate removed, login page, article pages, etc.)
- Check that the ticker bar and all badges render correctly in both themes

### Technical Details

**Dark mode CSS**: Will use the existing `@custom-variant dark (&:is(.dark *))` already in styles.css. Add a `:root.dark` block with inverted colors (dark bg `oklch(0.13 0.02 255)`, light text, dark card backgrounds, etc.).

**Theme toggle state**: Stored in `localStorage` key `ms_theme`, checked on mount to avoid flash. Will add a small inline script in the root shell for early theme application.

**News cleaning regex**: `/(href|src|class|style|id|rel|target)\s*=\s*["'][^"']*["']/gi` and remaining HTML tag stripping.

**Daily Brief enhancement**: The AI prompt will explicitly request market data with numbers, sector performance, commodity prices, and geopolitical summaries with specific detail about Iran/USA tensions, oil market impact, and tech sector moves.


# Plan de securizare MarketScope

## 1. Ștergere `password-gate.tsx` (parolă hardcoded)
- Șterge fișierul `src/components/terminal/password-gate.tsx` — conține parola `"dbrnews"` vizibilă în bundle-ul JS.
- Nu mai e folosit (a fost eliminat din `__root.tsx`), dar fișierul încă există.

## 2. Protecție SSRF pe `analyzeCustomNews`
- Validare URL: verifică că hostname-ul nu rezolvă la IP-uri private (127.x, 10.x, 172.16-31.x, 192.168.x, 169.254.x — AWS metadata).
- Allowlist de scheme: doar `https://`.
- Limită redirects: dezactivează `redirect: "follow"`, gestionează manual cu maxim 2 redirects doar pe domenii publice.
- Blochează URL-uri cu IP-uri directe (ex: `http://169.254.169.254`).

## 3. Autentificare pe funcțiile AI
Adaugă `requireSupabaseAuth` middleware pe:
- `analyzeArticle` — doar userii logați pot cere analiză AI
- `analyzeCustomNews` — doar userii logați pot trimite URL-uri/texte
- `getDailyBrief` — doar userii logați văd briefing-ul AI
- `getCatalystCalendar` — doar userii logați văd calendarul

Funcțiile `getNews` și `getNewsItem` rămân publice (sunt read-only, fără AI).

## 4. Validare Zod pe `getNewsItem` și `getAdvancedScore`
Înlocuiește validatoarele no-op cu schema Zod:
```
z.object({ id: z.string().min(1).max(128) })
```

## 5. Sistem de resetare parolă
- Adaugă link "Ai uitat parola?" pe pagina de login
- Mod "forgot" care apelează `supabase.auth.resetPasswordForEmail()` cu `redirectTo: origin + '/reset-password'`
- Crează ruta `/reset-password` — formular care apelează `supabase.auth.updateUser({ password })` după ce detectează `type=recovery` din URL hash

## 6. Rate limiting server-side pe funcțiile AI
- Implementează un rate limiter simplu in-memory (Map cu IP/userId + timestamp-uri)
- Limită: max 10 cereri AI / minut per user
- Returnează 429 cu mesaj clar când limita e depășită
- Se aplică pe `analyzeArticle`, `analyzeCustomNews`, `getDailyBrief`, `getCatalystCalendar`

---

### Detalii tehnice

**Fișiere modificate:**
- `src/lib/news.functions.ts` — adaugă middleware auth, SSRF protection, rate limiter, Zod validators
- `src/routes/login.tsx` — adaugă mod "forgot password"
- `src/routes/reset-password.tsx` — pagină nouă pentru setare parolă nouă

**Fișiere șterse:**
- `src/components/terminal/password-gate.tsx`

**Nota despre "anti-DDoS":** Un rate limiter server-side per user/IP pe funcțiile AI este cea mai bună protecție disponibilă la nivelul aplicației. Protecția DDoS la nivel de rețea (Cloudflare, WAF) este deja inclusă în infrastructura de hosting Lovable Cloud — nu trebuie configurată manual.

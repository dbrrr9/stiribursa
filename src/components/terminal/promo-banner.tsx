import { ArrowRight, GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import heroAsset from "@/assets/investorhood-hero.jpg.asset.json";

const COURSE_URL = "https://www.investorhood.ro/curs-gratuit/";

export function PromoBanner() {
  return (
    <section className="fade-up">
      <a
        href={COURSE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl border border-border bg-[#0a0f0a] shadow-elevated transition-all duration-300 hover:shadow-[0_12px_48px_oklch(0.55_0.18_150/0.3)]"
        aria-label="Aplică la cursul gratuit de investiții InvestorHood"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
          {/* IMAGE SIDE */}
          <div className="relative overflow-hidden">
            <img
              src={heroAsset.url}
              alt="Curs gratuit de investiții la bursă cu InvestorHood — învață de la profesioniști"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            {/* gradient bridge to text side on desktop */}
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-[#0a0f0a] lg:block" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f0a]/70 via-transparent to-transparent lg:hidden" />
          </div>

          {/* CONTENT SIDE */}
          <div className="relative flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
            {/* subtle green glow */}
            <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[oklch(0.6_0.2_150/0.18)] blur-3xl" />

            <div className="relative flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.6_0.2_150/0.15)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.75_0.2_150)]">
                <Sparkles className="h-3 w-3" />
                Recomandat
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                Parteneriat InvestorHood
              </span>
            </div>

            <h2 className="relative text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl [text-wrap:balance]">
              Curs <span className="text-[oklch(0.75_0.2_150)]">gratuit</span> de investiții la bursă
            </h2>

            <p className="relative max-w-md text-sm leading-relaxed text-white/70">
              Înțelege piețele pe care le urmărești zilnic aici. Învață de la
              profesioniști cum să analizezi acțiuni, să construiești un portofoliu
              și să iei decizii informate — pas cu pas, fără costuri.
            </p>

            <ul className="relative grid gap-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 shrink-0 text-[oklch(0.75_0.2_150)]" />
                Educație financiară aplicată, de la zero la primul tău plan
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 shrink-0 text-[oklch(0.75_0.2_150)]" />
                Strategii reale de investiții, explicate pe înțelesul tuturor
              </li>
            </ul>

            <div className="relative mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-[oklch(0.6_0.2_150)] px-5 py-2.5 text-sm font-semibold text-[#04140a] transition-all duration-300 group-hover:bg-[oklch(0.7_0.21_150)] group-hover:gap-3">
                Aplică gratuit acum
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              <span className="text-[11px] text-white/45">
                investorhood.ro · 100% gratuit
              </span>
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}

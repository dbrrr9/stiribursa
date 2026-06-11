import { forwardRef } from "react";
import { type Sentiment, type ImpactLevel, type NewsSource } from "@/lib/news-types";
import { Activity, TrendingUp, AlertTriangle, AlertCircle, TrendingDown, Minus } from "lucide-react";

interface ShareCardProps {
  title: string;
  bottomLine: string;
  source: NewsSource;
  sentiment: Sentiment;
  impact: ImpactLevel;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ title, bottomLine, source, sentiment, impact }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1080px] bg-[#0a0a0c] flex flex-col relative overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-teal/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-navy/20 rounded-full blur-[100px]" />
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-12 border-b border-white/5 bg-white/[0.02] relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)]">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-black text-white tracking-tight">MarketScope</div>
              <div className="text-teal text-lg font-medium tracking-widest uppercase">Intelligence</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xl font-medium">
              Sursă: {source}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-16 flex flex-col justify-center relative z-10">
          {/* Tags */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`px-6 py-2 rounded-full flex items-center gap-2 text-lg font-bold
              ${impact === "high" ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                impact === "medium" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : 
                "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
              {impact === "high" && <AlertTriangle className="w-5 h-5" />}
              {impact === "medium" && <AlertCircle className="w-5 h-5" />}
              {impact === "low" && <Minus className="w-5 h-5" />}
              Impact {impact === "high" ? "Major" : impact === "medium" ? "Mediu" : "Minor"}
            </div>

            <div className={`px-6 py-2 rounded-full flex items-center gap-2 text-lg font-bold
              ${sentiment === "bullish" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                sentiment === "bearish" ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
              {sentiment === "bullish" ? <TrendingUp className="w-5 h-5" /> : 
               sentiment === "bearish" ? <TrendingDown className="w-5 h-5" /> : 
               <Minus className="w-5 h-5" />}
              Sentiment {sentiment === "bullish" ? "Bullish" : sentiment === "bearish" ? "Bearish" : "Neutru"}
            </div>
          </div>

          <h1 className="text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-12 [text-wrap:balance]">
            {title}
          </h1>

          <div className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-teal rounded-l-3xl" />
            <div className="text-teal text-xl font-bold uppercase tracking-widest mb-4">The Bottom Line</div>
            <p className="text-3xl text-white/90 leading-relaxed font-serif">
              {bottomLine}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-12 border-t border-white/5 bg-black/40 flex items-center justify-between relative z-10">
          <div className="text-white/40 text-xl font-medium">
            Generat cu AI • {new Date().toLocaleDateString('ro-RO')}
          </div>
          <div className="text-white/60 text-xl font-bold">
            stiribursa.ro
          </div>
        </div>
      </div>
    );
  }
);
ShareCard.displayName = "ShareCard";

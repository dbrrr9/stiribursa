import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

interface TradingViewChartProps {
  symbol: string;
}

export function TradingViewChart({ symbol }: TradingViewChartProps) {
  // Curățăm simbolul dacă este cazul (deși AI-ul ar trebui să-l trimită corect)
  const cleanSymbol = symbol.trim().toUpperCase();

  return (
    <div className="w-full h-[400px] mt-6 rounded-lg overflow-hidden border border-border bg-black/20">
      <AdvancedRealTimeChart
        symbol={cleanSymbol}
        theme="dark"
        autosize
        hide_side_toolbar={false}
        allow_symbol_change={false}
        save_image={false}
        timezone="Europe/Bucharest"
      />
    </div>
  );
}

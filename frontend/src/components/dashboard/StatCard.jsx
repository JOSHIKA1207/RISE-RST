import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({ title, value, description, trend, trendText, icon: Icon }) {
  let trendIcon = <Minus className="w-3 h-3" />;
  let trendColor = "text-slate-400 bg-slate-800 border-slate-700";

  if (trend === "up") {
    trendIcon = <TrendingUp className="w-3 h-3" />;
    trendColor = "text-emerald-400 bg-emerald-950/60 border border-emerald-800/80";
  } else if (trend === "down") {
    trendIcon = <TrendingDown className="w-3 h-3" />;
    trendColor = "text-rose-400 bg-rose-950/60 border border-rose-800/80";
  }

  return (
    <div className="bg-[#12141e] rounded-xl border border-slate-800/90 p-4 hover:border-slate-600/80 transition-all shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/70">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black text-white tracking-tight">{value}</span>
        {trendText && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${trendColor}`}>
            {trendIcon}
            {trendText}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{description}</p>
    </div>
  );
}

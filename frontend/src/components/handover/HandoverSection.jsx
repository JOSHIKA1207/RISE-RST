import React from 'react';
import { SourceBadge } from '../common/SourceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ExternalLink } from 'lucide-react';

export function HandoverSection({ title, icon: Icon, items = [], type = "default", onInspectItem }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
      {/* Section Header */}
      <div className="px-6 py-3.5 bg-[#0d0e14] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
            {Icon && <Icon className="w-4 h-4" />}
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">{title}</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {items.length} items
        </span>
      </div>

      {/* Section Item Cards */}
      <div className="divide-y divide-slate-800/80">
        {items.map((item) => (
          <div key={item.id} className="p-5 hover:bg-[#161824] transition-colors space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <SourceBadge source={item.source} size="sm" />
                <span className="text-xs font-mono font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">
                  {item.referenceId}
                </span>
                <span className="text-xs text-slate-400">• {item.timestamp}</span>
              </div>
              <StatusBadge status={item.status} size="sm" />
            </div>

            <h4 className="text-sm font-bold text-white">{item.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0d0e14] p-3 rounded-xl border border-slate-800">
              {item.summary || item.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Source: <strong className="text-slate-200">{item.source}</strong> ({item.referenceId})</span>
              {onInspectItem && (
                <button
                  onClick={() => onInspectItem(item)}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-bold"
                >
                  <span>View Source Reference</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

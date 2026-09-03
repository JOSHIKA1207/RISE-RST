import React, { useState } from 'react';
import { SourceBadge } from '../common/SourceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Link2 } from 'lucide-react';

export function TraceabilityCard({ items = [], onInspectItem }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 shadow-xl p-6 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Traceability Matrix</h3>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-slate-800 text-slate-200 border border-slate-700 rounded-full inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              100% Traceable
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every generated handover item is linked to its original source activity and raw audit payload.
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-[#0d0e14]">
        {items.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="bg-[#0d0e14]">
              {/* Row Header */}
              <div className="p-4 flex items-center justify-between hover:bg-[#161824] transition-colors">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5">
                    <Link2 className="w-3 h-3 text-slate-300" />
                    {item.referenceId}
                  </span>
                  <SourceBadge source={item.source} size="sm" />
                  <span className="text-xs font-semibold text-slate-400">{item.timestamp}</span>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onInspectItem(item)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 border border-slate-700"
                  >
                    <span>View Source Activity</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Content Panel */}
              {isExpanded && (
                <div className="px-5 py-4 bg-[#12141e] border-t border-slate-800 text-xs space-y-2 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 font-mono text-[11px] text-slate-300 bg-[#090a0f] p-3 rounded-lg border border-slate-800">
                    <div><span className="text-slate-500">Activity ID:</span> {item.activityId || item.id}</div>
                    <div><span className="text-slate-500">Author:</span> {item.user || "System"}</div>
                    <div><span className="text-slate-500">Source Type:</span> {item.sourceType}</div>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">{item.summary || item.title}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

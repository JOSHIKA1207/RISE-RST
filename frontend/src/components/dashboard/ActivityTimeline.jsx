import React from 'react';
import { SourceBadge } from '../common/SourceBadge';
import { StatusBadge } from '../common/StatusBadge';
import { ExternalLink } from 'lucide-react';

export function ActivityTimeline({ activities = [], onSelectActivity }) {
  const sortedActivities = [...activities].sort((a, b) => a.timeMinutes - b.timeMinutes);

  return (
    <div className="bg-[#12141e] rounded-xl border border-slate-800/90 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Shift Activity Timeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">Chronological audit log across Jira, Slack, GitHub, and PagerDuty</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold bg-slate-800 text-slate-200 rounded-full border border-slate-700">
          {sortedActivities.length} Events Logged
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {sortedActivities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Silver timeline bullet dot */}
            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#12141e] border-2 border-slate-300 group-hover:scale-125 transition-transform" />

            <div className="bg-[#161824] hover:bg-[#1b1e2c] rounded-xl p-4 border border-slate-800/80 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge source={act.source} />
                  <span className="text-xs font-mono font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">
                    {act.referenceId}
                  </span>
                  <span className="text-xs font-medium text-slate-400">• {act.timestamp}</span>
                </div>
                <StatusBadge status={act.status} size="sm" />
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{act.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">{act.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Author: {act.user || "System"}</span>
                {onSelectActivity && (
                  <button
                    onClick={() => onSelectActivity(act)}
                    className="inline-flex items-center gap-1 text-slate-300 font-bold hover:text-white hover:underline"
                  >
                    <span>View Metadata</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

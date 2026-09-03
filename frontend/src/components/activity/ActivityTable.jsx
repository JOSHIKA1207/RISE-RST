import React from 'react';
import { SourceBadge } from '../common/SourceBadge';
import { ActivityBadge } from '../common/ActivityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Eye } from 'lucide-react';

export function ActivityTable({ activities = [], onRowClick }) {
  if (activities.length === 0) {
    return (
      <div className="p-8 text-center bg-[#12141e] rounded-2xl border border-slate-800 text-slate-400 text-sm">
        No activities match the current filter criteria.
      </div>
    );
  }

  return (
    <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0d0e14] border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4">Time</th>
              <th className="py-3.5 px-4">Source</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Reference</th>
              <th className="py-3.5 px-4">Activity Title</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {activities.map((act) => (
              <tr
                key={act.id}
                onClick={() => onRowClick && onRowClick(act)}
                className="hover:bg-[#161824] transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-slate-300 whitespace-nowrap">
                  {act.timestamp}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <SourceBadge source={act.source} size="sm" />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <ActivityBadge type={act.sourceType} size="sm" />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">
                    {act.referenceId}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                  {act.title}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={act.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick && onRowClick(act);
                    }}
                    className="p-1.5 text-slate-400 group-hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Inspect payload"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

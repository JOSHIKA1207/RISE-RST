import React from 'react';
import { SquareKanban, MessageSquare, GitCommit, AlertTriangle } from 'lucide-react';

export function SourceCard({ source, isSelected, onToggle }) {
  const iconMap = {
    jira: SquareKanban,
    slack: MessageSquare,
    github: GitCommit,
    incidents: AlertTriangle
  };

  const Icon = iconMap[source.id] || SquareKanban;

  return (
    <div
      onClick={onToggle}
      className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
        isSelected
          ? 'bg-[#181b2a] border-slate-400 ring-2 ring-slate-400/20 shadow-md'
          : 'bg-[#12141e] border-slate-800 hover:bg-[#161824] hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{source.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span className="text-[11px] font-bold text-emerald-400">Connected</span>
            </div>
          </div>
        </div>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4 text-slate-200 rounded border-slate-700 bg-slate-800 focus:ring-slate-400 mt-1 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
        <span className="text-slate-400">{source.description}</span>
        <span className="font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">
          {source.countInShift} activities
        </span>
      </div>
    </div>
  );
}

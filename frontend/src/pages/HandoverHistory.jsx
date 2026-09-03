import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/common/StatusBadge';
import { handoverHistory } from '../data/mockData';
import { Search, ArrowRight } from 'lucide-react';

export function HandoverHistory() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredHistory = handoverHistory.filter((item) => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchDate = item.date.toLowerCase().includes(q);
      const matchShift = item.shift.toLowerCase().includes(q);
      const matchUser = item.generatedBy.toLowerCase().includes(q);
      if (!matchDate && !matchShift && !matchUser) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Handover History</h1>
        <p className="text-sm text-slate-400 mt-1">
          Historical repository of generated shift handovers, audit logs, and status tracking.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by date (03 Sep), shift lead, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-slate-500"
          >
            <option value="All">All Statuses</option>
            <option value="READY FOR REVIEW">READY FOR REVIEW</option>
            <option value="SENT">SENT</option>
          </select>
        </div>
      </div>

      {/* Handover Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/handover/${item.id}`)}
            className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl hover:border-slate-500/80 transition-all cursor-pointer space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {item.date}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5 group-hover:text-slate-200 transition-colors">
                  {item.shift}
                </h3>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-[#0d0e14] rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Activities</span>
                <span className="font-mono font-bold text-white">{item.totalActivities}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Open Items</span>
                <span className="font-mono font-bold text-sky-400">{item.openItemsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Blockers</span>
                <span className="font-mono font-bold text-rose-400">{item.blockersCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Generated: <strong className="text-slate-200">{item.generatedAt}</strong> by {item.generatedBy}</span>
              <span className="text-slate-200 font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Handover <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

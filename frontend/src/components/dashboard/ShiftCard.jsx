import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, PlayCircle, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { currentShift } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';

export function ShiftCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 shadow-xl p-6 relative overflow-hidden">
      {/* Subtle silver radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-slate-700/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-slate-800/90 text-slate-200 font-bold text-xs rounded-lg inline-flex items-center gap-1.5 border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {currentShift.displayDate}
            </span>
            <StatusBadge status={currentShift.status} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Current Shift ({currentShift.startTime} – {currentShift.endTime})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Assigned Shift Lead: <span className="font-bold text-slate-200">{currentShift.lead}</span> (IST UTC+5:30)
            </p>
          </div>

          {/* Time Start / End Indicators */}
          <div className="flex items-center gap-6 pt-1 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold tracking-wider uppercase">STARTED</span>
              <span className="font-bold text-slate-200">{currentShift.startedAt}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] font-bold tracking-wider uppercase">ENDS</span>
              <span className="font-bold text-slate-200">{currentShift.endsAt}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] font-bold tracking-wider uppercase">ACTIVE TIME</span>
              <span className="font-bold text-emerald-400">6h 10m elapsed</span>
            </div>
          </div>
        </div>

        {/* Right Action & Progress */}
        <div className="lg:w-72 bg-[#171926] rounded-xl p-4 border border-slate-700/60 space-y-3 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Shift Progress</span>
            <span className="font-extrabold text-white">{currentShift.progress}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-slate-400 via-slate-100 to-white h-2 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${currentShift.progress}%` }}
            />
          </div>

          <button
            onClick={() => navigate('/generate')}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
          >
            <span>Generate Handover</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

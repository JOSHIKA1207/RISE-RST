import React from 'react';
import { Calendar, Clock, Globe, ArrowRight } from 'lucide-react';

export function ShiftSelector({ shiftConfig, onChange, onLoadActivity }) {
  return (
    <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Step 1 — Select Shift Window</h3>
          <p className="text-xs text-slate-400 mt-0.5">Specify exact date and timeframe to bound shift activity collection.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-200 rounded-full border border-slate-700">
          Window Match Required
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Shift Date */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Shift Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="date"
              value={shiftConfig.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Start Time
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={shiftConfig.startTime}
              onChange={(e) => onChange('startTime', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors appearance-none"
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="01:00 AM">01:00 AM</option>
            </select>
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            End Time
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={shiftConfig.endTime}
              onChange={(e) => onChange('endTime', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors appearance-none"
            >
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
              <option value="01:00 AM">01:00 AM (Next Day)</option>
              <option value="09:00 AM">09:00 AM</option>
            </select>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Timezone
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={shiftConfig.timezone}
              onChange={(e) => onChange('timezone', e.target.value)}
              disabled
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          Activities matching <span className="font-bold text-slate-200">{shiftConfig.startTime} to {shiftConfig.endTime}</span> on <span className="font-bold text-slate-200">{shiftConfig.displayDate || shiftConfig.date}</span> will be fetched.
        </p>
        <button
          onClick={onLoadActivity}
          className="px-4 py-2 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"
        >
          <span>Load Shift Activity</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export function LoadingProgress({ currentStepIndex, steps = [] }) {
  const defaultSteps = [
    "Collecting activities across connected integrations",
    "Filtering strict 09:00 AM – 05:00 PM shift window",
    "Grouping activities into Completed, Open, Blockers & Watch",
    "Generating structured handover notes",
    "Validating 100% source references & traceability matrix",
    "Complete ✓"
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / activeSteps.length) * 100));

  return (
    <div className="bg-[#12141e] rounded-2xl border border-slate-700/80 shadow-2xl p-8 max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-200 text-white">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center mx-auto shadow-md">
        <Sparkles className="w-7 h-7 animate-pulse text-slate-200" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-white">Generating Shift Handover Document</h3>
        <p className="text-xs text-slate-400 mt-1">
          Simulating automated structured handover compilation & metadata traceability verification...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-300">
          <span>Overall Progress</span>
          <span className="text-white">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-slate-300 via-slate-100 to-white h-2 rounded-full transition-all duration-300 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Multi-step progress list */}
      <div className="bg-[#0d0e14] rounded-xl p-4 border border-slate-800 text-left space-y-3">
        {activeSteps.map((stepText, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={idx} className="flex items-center gap-3 text-xs">
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-slate-200 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" />
                )}
              </div>
              <span
                className={`font-semibold ${
                  isDone
                    ? 'text-slate-200 font-bold'
                    : isCurrent
                    ? 'text-white font-black'
                    : 'text-slate-500'
                }`}
              >
                {stepText}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        Every item bound with source ticket, commit, or message ID.
      </div>
    </div>
  );
}

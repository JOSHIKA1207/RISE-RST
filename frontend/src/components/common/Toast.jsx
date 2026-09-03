import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = "info", message, title } = toast;

  let icon = <Info className="w-5 h-5 text-slate-300" />;
  let border = "border-slate-700 bg-[#161824] text-slate-100 shadow-2xl";

  if (type === "success") {
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    border = "border-emerald-800/80 bg-[#121c16] text-emerald-100 shadow-2xl";
  } else if (type === "warning") {
    icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
    border = "border-amber-800/80 bg-[#1f190e] text-amber-100 shadow-2xl";
  } else if (type === "error") {
    icon = <XCircle className="w-5 h-5 text-rose-400" />;
    border = "border-rose-800/80 bg-[#1f0f14] text-rose-100 shadow-2xl";
  }

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 p-4 rounded-xl border max-w-md animate-in slide-in-from-bottom-5 duration-300 ${border}`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-bold text-white">{title}</h4>}
        <p className="text-xs text-slate-300 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

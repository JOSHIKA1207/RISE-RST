import React from 'react';
import { CheckCircle2, Clock, AlertCircle, AlertTriangle, PlayCircle, ShieldAlert } from 'lucide-react';

export function StatusBadge({ status, size = "md" }) {
  const statusStr = (status || "").toUpperCase();

  let style = "bg-slate-800 text-slate-300 border-slate-700";
  let icon = <Clock className="w-3.5 h-3.5 text-slate-400" />;
  let label = status;

  switch (statusStr) {
    case 'ACTIVE':
      style = "bg-emerald-950/80 text-emerald-300 border-emerald-800/80 font-bold";
      icon = <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />;
      label = "ACTIVE";
      break;
    case 'RESOLVED':
    case 'COMPLETED':
      style = "bg-emerald-950/80 text-emerald-300 border-emerald-800/80 font-bold";
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      label = statusStr === 'COMPLETED' ? "COMPLETED" : "RESOLVED";
      break;
    case 'OPEN':
      style = "bg-sky-950/80 text-sky-300 border-sky-800/80 font-bold";
      icon = <AlertCircle className="w-3.5 h-3.5 text-sky-400" />;
      label = "OPEN";
      break;
    case 'IN_PROGRESS':
      style = "bg-blue-950/80 text-blue-300 border-blue-800/80 font-bold";
      icon = <Clock className="w-3.5 h-3.5 text-blue-400" />;
      label = "IN PROGRESS";
      break;
    case 'BLOCKED':
      style = "bg-rose-950/80 text-rose-300 border-rose-800/80 font-extrabold";
      icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      label = "BLOCKED";
      break;
    case 'WARNING':
    case 'WATCH':
      style = "bg-amber-950/80 text-amber-300 border-amber-800/80 font-bold";
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      label = statusStr === 'WARNING' ? "WARNING" : "WATCH";
      break;
    case 'READY FOR REVIEW':
      style = "bg-slate-800 text-slate-100 border-slate-600 font-extrabold";
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />;
      label = "READY FOR REVIEW";
      break;
    case 'SENT':
      style = "bg-emerald-950/80 text-emerald-300 border-emerald-800/80 font-extrabold";
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      label = "SENT";
      break;
    default:
      break;
  }

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs gap-1" 
    : "px-2.5 py-1 text-xs gap-1.5 font-semibold";

  return (
    <span className={`inline-flex items-center rounded-lg border ${style} ${sizeClasses}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
}

import React from 'react';
import { Tag, AlertOctagon, MessageCircle, GitBranch } from 'lucide-react';

export function ActivityBadge({ type, size = "md" }) {
  const typeLower = (type || "").toLowerCase();

  let style = "bg-slate-800 text-slate-300 border-slate-700";
  let icon = <Tag className="w-3.5 h-3.5" />;
  let label = type;

  if (typeLower === "ticket") {
    style = "bg-indigo-950/60 text-indigo-300 border-indigo-800/80";
    icon = <Tag className="w-3.5 h-3.5 text-indigo-400" />;
    label = "Ticket";
  } else if (typeLower === "incident") {
    style = "bg-rose-950/60 text-rose-300 border-rose-800/80";
    icon = <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
    label = "Incident";
  } else if (typeLower === "message") {
    style = "bg-purple-950/60 text-purple-300 border-purple-800/80";
    icon = <MessageCircle className="w-3.5 h-3.5 text-purple-400" />;
    label = "Message";
  } else if (typeLower === "commit") {
    style = "bg-emerald-950/60 text-emerald-300 border-emerald-800/80";
    icon = <GitBranch className="w-3.5 h-3.5 text-emerald-400" />;
    label = "Commit";
  }

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs gap-1" : "px-2.5 py-1 text-xs gap-1.5 font-semibold";

  return (
    <span className={`inline-flex items-center rounded-lg border ${style} ${sizeClasses}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
}

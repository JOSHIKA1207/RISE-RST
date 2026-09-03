import React from 'react';
import { SquareKanban, MessageSquare, GitCommit, AlertTriangle } from 'lucide-react';

export function SourceBadge({ source, showIcon = true, size = "md" }) {
  const srcLower = (source || "").toLowerCase();

  let style = "bg-slate-800 text-slate-200 border-slate-700";
  let icon = <SquareKanban className="w-3.5 h-3.5" />;
  let label = source;

  if (srcLower.includes("jira")) {
    style = "bg-blue-950/60 text-blue-300 border-blue-800/80";
    icon = <SquareKanban className="w-3.5 h-3.5 text-blue-400" />;
    label = "Jira";
  } else if (srcLower.includes("slack")) {
    style = "bg-purple-950/60 text-purple-300 border-purple-800/80";
    icon = <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
    label = "Slack";
  } else if (srcLower.includes("github") || srcLower.includes("git")) {
    style = "bg-slate-800 text-slate-200 border-slate-700";
    icon = <GitCommit className="w-3.5 h-3.5 text-slate-300" />;
    label = "GitHub";
  } else if (srcLower.includes("incident") || srcLower.includes("pager")) {
    style = "bg-amber-950/60 text-amber-300 border-amber-800/80";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    label = "Incident System";
  }

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs gap-1" 
    : "px-2.5 py-1 text-xs gap-1.5 font-semibold";

  return (
    <span className={`inline-flex items-center rounded-lg border ${style} ${sizeClasses}`}>
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
}

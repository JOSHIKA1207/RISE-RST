import React, { useState } from 'react';
import { ShiftCard } from '../components/dashboard/ShiftCard';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { Modal } from '../components/common/Modal';
import { SourceBadge } from '../components/common/SourceBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActivityBadge } from '../components/common/ActivityBadge';
import { rawActivities, hourlyChartData } from '../data/mockData';
import { filterShiftActivities } from '../utils/activityFilter';
import { SquareKanban, AlertTriangle, MessageSquare, GitCommit, AlertOctagon, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const shiftActivities = filterShiftActivities({
    activities: rawActivities,
    shiftDate: "2026-09-03",
    startTime: "09:00 AM",
    endTime: "05:00 PM"
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Shift Handover Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor shift activity and generate a traceable handover for the next team.
        </p>
      </div>

      {/* Current Shift Card */}
      <ShiftCard />

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Tickets Touched"
          value="12"
          description="Jira issues updated or closed"
          trend="up"
          trendText="+15% vs yesterday"
          icon={SquareKanban}
        />
        <StatCard
          title="Incidents"
          value="2"
          description="1 resolved, 1 under monitoring"
          trend="down"
          trendText="SEV-1 resolved"
          icon={AlertTriangle}
        />
        <StatCard
          title="Messages"
          value="28"
          description="Slack incident & ops updates"
          trend="up"
          trendText="High activity"
          icon={MessageSquare}
        />
        <StatCard
          title="Commits"
          value="7"
          description="GitHub PR deployments"
          trend="up"
          trendText="7/7 green"
          icon={GitCommit}
        />
        <StatCard
          title="Open Items"
          value="4"
          description="Requires next shift focus"
          trend="down"
          trendText="4 active items"
          icon={AlertOctagon}
        />
      </div>

      {/* Analytics Chart & Activity Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Hourly Shift Activity Chart */}
        <div className="lg:col-span-2 bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-300" />
                Hourly Shift Activity Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Events recorded across 09:00 AM – 05:00 PM shift window</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Messages
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Tickets
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyChartData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0e14', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="messages" stroke="#e2e8f0" fillOpacity={1} fill="url(#colorMessages)" />
                <Area type="monotone" dataKey="tickets" stroke="#64748b" fillOpacity={1} fill="url(#colorTickets)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Integration Status Card */}
        <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Connected Integrations</h3>
          <p className="text-xs text-slate-400">Live data feeds connected to current shift</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-[#161824] rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <SquareKanban className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Jira Software</span>
              </div>
              <span className="text-xs font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">12 items</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#161824] rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-200">Slack Channels</span>
              </div>
              <span className="text-xs font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">28 messages</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#161824] rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <GitCommit className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-bold text-slate-200">GitHub Repos</span>
              </div>
              <span className="text-xs font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">7 commits</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#161824] rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Incident System</span>
              </div>
              <span className="text-xs font-bold text-slate-200 bg-[#0d0e14] px-2 py-0.5 rounded border border-slate-700">2 incidents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <ActivityTimeline
        activities={shiftActivities}
        onSelectActivity={(act) => setSelectedActivity(act)}
      />

      {/* Activity Details Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title="Activity Audit Payload"
      >
        {selectedActivity && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SourceBadge source={selectedActivity.source} />
                <ActivityBadge type={selectedActivity.sourceType} />
              </div>
              <StatusBadge status={selectedActivity.status} />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-slate-300">{selectedActivity.referenceId}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedActivity.title}</h3>
            </div>

            <div className="bg-[#090a0f] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
              {JSON.stringify(selectedActivity, null, 2)}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

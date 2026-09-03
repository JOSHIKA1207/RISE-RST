import React, { useState } from 'react';
import { ActivityTable } from '../components/activity/ActivityTable';
import { Modal } from '../components/common/Modal';
import { SourceBadge } from '../components/common/SourceBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActivityBadge } from '../components/common/ActivityBadge';
import { rawActivities } from '../data/mockData';
import { filterShiftActivities } from '../utils/activityFilter';
import { Search, Filter, RefreshCw } from 'lucide-react';

export function ActivityExplorer() {
  const [shiftDate, setShiftDate] = useState('2026-09-03');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [activityType, setActivityType] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedActivity, setSelectedActivity] = useState(null);

  const sourcesMap = {
    Jira: ['Jira'],
    Slack: ['Slack'],
    GitHub: ['GitHub'],
    Incidents: ['Incident System']
  };
  const enabledSources = sourceFilter === 'All' ? ['Jira', 'Slack', 'GitHub', 'Incident System'] : sourcesMap[sourceFilter];

  const filteredActivities = filterShiftActivities({
    activities: rawActivities,
    shiftDate,
    startTime,
    endTime,
    enabledSources,
    activityType,
    statusFilter,
    searchQuery
  });

  const handleResetFilters = () => {
    setShiftDate('2026-09-03');
    setStartTime('09:00 AM');
    setEndTime('05:00 PM');
    setSourceFilter('All');
    setActivityType('All');
    setStatusFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Shift Activity Explorer</h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect raw telemetry, audit logs, tickets, and messages with precision shift-time window filtering.
        </p>
      </div>

      {/* Filter Control Panel */}
      <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-300" />
            <h3 className="text-sm font-bold text-white">Shift Window & Filter Criteria</h3>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Date</label>
            <input
              type="date"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Start Time</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500"
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">End Time</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500"
            >
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
              <option value="01:00 AM">01:00 AM</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500"
            >
              <option value="All">All Sources</option>
              <option value="Jira">Jira</option>
              <option value="Slack">Slack</option>
              <option value="GitHub">GitHub</option>
              <option value="Incidents">Incidents</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Activity Type</label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500"
            >
              <option value="All">All Types</option>
              <option value="Tickets">Tickets</option>
              <option value="Incidents">Incidents</option>
              <option value="Messages">Messages</option>
              <option value="Commits">Commits</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500"
            >
              <option value="All">All Statuses</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="OPEN">OPEN</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="WARNING">WARNING</option>
            </select>
          </div>
        </div>

        <div className="relative pt-2">
          <Search className="w-4 h-4 absolute left-3 top-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search ticket, incident, message or commit ID/title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Activity Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Displaying {filteredActivities.length} Raw Activities
          </span>
          <span className="text-xs text-slate-400">Click any row to view raw payload</span>
        </div>

        <ActivityTable
          activities={filteredActivities}
          onRowClick={(act) => setSelectedActivity(act)}
        />
      </div>

      {/* Activity Payload Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title="Activity Detail Payload"
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
              <p className="text-xs text-slate-300 mt-1">{selectedActivity.description}</p>
            </div>

            <div className="bg-[#090a0f] text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{JSON.stringify(selectedActivity, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700"
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

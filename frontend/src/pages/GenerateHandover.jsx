import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ShiftSelector } from '../components/handover/ShiftSelector';
import { SourceCard } from '../components/handover/SourceCard';
import { LoadingProgress } from '../components/handover/LoadingProgress';
import { SourceBadge } from '../components/common/SourceBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActivityBadge } from '../components/common/ActivityBadge';
import { rawActivities, sourcesList } from '../data/mockData';
import { filterShiftActivities } from '../utils/activityFilter';
import { Search, Sparkles, Filter, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export function GenerateHandover() {
  const navigate = useNavigate();
  const { setToast } = useOutletContext() || {};

  const [currentStep, setCurrentStep] = useState(1);

  const [shiftConfig, setShiftConfig] = useState({
    date: '2026-09-03',
    displayDate: '03 September 2026',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    timezone: 'IST (UTC+5:30)'
  });

  const [selectedSources, setSelectedSources] = useState(['jira', 'slack', 'github', 'incidents']);
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const sourceNameMap = {
    jira: 'Jira',
    slack: 'Slack',
    github: 'GitHub',
    incidents: 'Incident System'
  };
  const activeSourceNames = selectedSources.map((id) => sourceNameMap[id]);

  const filteredActivities = filterShiftActivities({
    activities: rawActivities,
    shiftDate: shiftConfig.date,
    startTime: shiftConfig.startTime,
    endTime: shiftConfig.endTime,
    enabledSources: activeSourceNames,
    activityType: activityTypeFilter,
    searchQuery: searchQuery
  });

  const handleShiftConfigChange = (field, val) => {
    setShiftConfig((prev) => ({ ...prev, [field]: val }));
  };

  const toggleSource = (sourceId) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((s) => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setLoadingStepIndex(0);

    const stepsCount = 6;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      setLoadingStepIndex(step);

      if (step >= stepsCount - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          if (setToast) {
            setToast({
              type: 'success',
              title: 'Handover Generated!',
              message: 'Traceable handover notes successfully compiled for shift window.'
            });
          }
          navigate('/handover/ho-20260903-day');
        }, 600);
      }
    }, 500);
  };

  if (isGenerating) {
    return (
      <div className="py-12 animate-in fade-in duration-200">
        <LoadingProgress currentStepIndex={loadingStepIndex} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Generate Shift Handover Note</h1>
        <p className="text-sm text-slate-400 mt-1">
          Automated collection of tickets, incidents, Slack communications, and code commits bounded by your shift time window.
        </p>
      </div>

      {/* Step Indicator Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#12141e] p-2 rounded-2xl border border-slate-800 shadow-xl">
        <button
          onClick={() => setCurrentStep(1)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            currentStep === 1
              ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
          <span>1. Select Shift</span>
        </button>

        <button
          onClick={() => setCurrentStep(2)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            currentStep === 2
              ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">2</span>
          <span>2. Sources ({selectedSources.length})</span>
        </button>

        <button
          onClick={() => setCurrentStep(3)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            currentStep === 3
              ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">3</span>
          <span>3. Preview ({filteredActivities.length})</span>
        </button>

        <button
          onClick={() => setCurrentStep(4)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            currentStep === 4
              ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">4</span>
          <span>4. Generate</span>
        </button>
      </div>

      {/* Step 1: Select Shift Window */}
      <ShiftSelector
        shiftConfig={shiftConfig}
        onChange={handleShiftConfigChange}
        onLoadActivity={() => setCurrentStep(2)}
      />

      {/* Step 2: Source Selection */}
      <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Step 2 — Connected Sources</h3>
            <p className="text-xs text-slate-400 mt-0.5">Toggle live integrations to include in this handover run.</p>
          </div>
          <span className="text-xs text-slate-400 font-bold">
            {selectedSources.length} of {sourcesList.length} enabled
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sourcesList.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              isSelected={selectedSources.includes(source.id)}
              onToggle={() => toggleSource(source.id)}
            />
          ))}
        </div>
      </div>

      {/* Step 3: Activity Preview */}
      <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Step 3 — Shift Activity Preview</h3>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 rounded-full">
                Strict Time Window Match
              </span>
            </div>
            <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {filteredActivities.length} activities found between {shiftConfig.startTime} and {shiftConfig.endTime}
            </p>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto bg-[#0d0e14] p-1 rounded-xl border border-slate-800">
            {['All', 'Tickets', 'Incidents', 'Messages', 'Commits'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActivityTypeFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activityTypeFilter === cat
                    ? 'bg-slate-200 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search activities by title, reference ID (INC-1024), author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
          />
        </div>

        {/* Activities List */}
        <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto border border-slate-800 rounded-2xl bg-[#0d0e14]">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No activities found in shift window matching search filters.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="p-4 hover:bg-[#161824] transition-colors flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5">
                    <SourceBadge source={act.source} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {act.referenceId}
                      </span>
                      <ActivityBadge type={act.sourceType} size="sm" />
                      <span className="text-xs text-slate-400">• {act.timestamp}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 mt-1 truncate">{act.title}</h5>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={act.status} size="sm" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Step 4: Primary Generate Action Button */}
      <div className="bg-[#12141e] border border-slate-700/80 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-slate-300" />
            Step 4 — Finalize & Generate
          </div>
          <h3 className="text-lg font-extrabold text-white">Ready to compile structured handover note?</h3>
          <p className="text-xs text-slate-400">
            {filteredActivities.length} shift activities will be categorized with 100% source traceability metadata.
          </p>
        </div>

        <button
          onClick={handleStartGeneration}
          disabled={filteredActivities.length === 0}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 shrink-0"
        >
          <span>Generate Handover Note</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

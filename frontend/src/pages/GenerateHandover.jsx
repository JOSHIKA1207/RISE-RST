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

import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

import { generateHandover } from '../services/api';


export function GenerateHandover() {
  const navigate = useNavigate();
  const { setToast } = useOutletContext() || {};

  const [currentStep, setCurrentStep] = useState(1);

  const [shiftConfig, setShiftConfig] = useState({
    date: '2026-09-03',
    displayDate: '03 September 2026',
    startTime: '05:00 PM',
    endTime: '08:00 PM',
    timezone: 'IST (UTC+5:30)'
  });

  const [selectedSources, setSelectedSources] = useState([
    'jira',
    'slack',
    'github',
    'incidents'
  ]);

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

  const activeSourceNames = selectedSources.map(
    (id) => sourceNameMap[id]
  );

  const filteredActivities = filterShiftActivities({
    activities: rawActivities,
    shiftDate: shiftConfig.date,
    startTime: shiftConfig.startTime,
    endTime: shiftConfig.endTime,
    enabledSources: activeSourceNames,
    activityType: activityTypeFilter,
    searchQuery
  });

  const handleShiftConfigChange = (field, value) => {
    setShiftConfig((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSource = (sourceId) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((source) => source !== sourceId)
        : [...prev, sourceId]
    );
  };

  const convertTimeToISO = (date, time) => {
    const [timePart, period] = time.trim().split(' ');

    let [hours, minutes] =
      timePart.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');

    return `${date}T${hh}:${mm}:00+05:30`;
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setLoadingStepIndex(0);

    const interval = setInterval(() => {
      setLoadingStepIndex((prev) =>
        prev < 4 ? prev + 1 : prev
      );
    }, 400);

    try {
      const shiftStart = convertTimeToISO(
        shiftConfig.date,
        shiftConfig.startTime
      );

      const shiftEnd = convertTimeToISO(
        shiftConfig.date,
        shiftConfig.endTime
      );

      console.log('Sending shift to backend:', {
        shift_start: shiftStart,
        shift_end: shiftEnd
      });

      const data = await generateHandover(
        shiftStart,
        shiftEnd
      );

      console.log('REAL BACKEND RESPONSE:', data);

      clearInterval(interval);
      setLoadingStepIndex(5);

      localStorage.setItem(
        'generatedHandover',
        JSON.stringify(data)
      );

      localStorage.setItem(
        'handoverFingerprint',
        data.fingerprint || ''
      );

      localStorage.setItem(
        'handoverMetrics',
        JSON.stringify(data.metrics || {})
      );

      if (setToast) {
        setToast({
          type: 'success',
          title: 'Handover Generated!',
          message: `${
            data.metrics?.unique_records ?? 0
          } unique records processed successfully.`
        });
      }

      setTimeout(() => {
        setIsGenerating(false);
        navigate('/handover/generated');
      }, 500);

    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);

      console.error(
        'Handover generation failed:',
        error
      );

      if (setToast) {
        setToast({
          type: 'error',
          title: 'Generation Failed',
          message:
            error.message ||
            'Unable to connect to backend.'
        });
      } else {
        alert(
          error.message ||
          'Unable to generate handover.'
        );
      }
    }
  };

  if (isGenerating) {
    return (
      <div className="py-12 animate-in fade-in duration-200">
        <LoadingProgress
          currentStepIndex={loadingStepIndex}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Generate Shift Handover Note
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Automated collection of tickets, incidents,
          communications and operational records bounded
          by your shift time window.
        </p>
      </div>


      {/* STEP INDICATOR */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#12141e] p-2 rounded-2xl border border-slate-800 shadow-xl">

        <button
          onClick={() => setCurrentStep(1)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            currentStep === 1
              ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
            1
          </span>

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
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
            2
          </span>

          <span>
            Sources ({selectedSources.length})
          </span>
        </button>


        <button
          onClick={() => setCurrentStep(3)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            currentStep === 3
              ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
            3
          </span>

          <span>
            Preview ({filteredActivities.length})
          </span>
        </button>


        <button
          onClick={() => setCurrentStep(4)}
          className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            currentStep === 4
              ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
            4
          </span>

          <span>4. Generate</span>
        </button>

      </div>


      {/* STEP 1 - SHIFT */}

      <ShiftSelector
        shiftConfig={shiftConfig}
        onChange={handleShiftConfigChange}
        onLoadActivity={() => setCurrentStep(2)}
      />


      {/* STEP 2 - SOURCES */}

      <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">

          <div>
            <h3 className="text-base font-bold text-white">
              Step 2 — Connected Sources
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              Select the operational sources to include
              in the handover.
            </p>
          </div>


          <span className="text-xs text-slate-400 font-bold">
            {selectedSources.length}
            {' '}
            of
            {' '}
            {sourcesList.length}
            {' '}
            enabled
          </span>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {sourcesList.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              isSelected={
                selectedSources.includes(source.id)
              }
              onToggle={() =>
                toggleSource(source.id)
              }
            />
          ))}

        </div>

      </div>


      {/* STEP 3 - PREVIEW */}

      <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">

          <div>

            <div className="flex items-center gap-2">

              <h3 className="text-base font-bold text-white">
                Step 3 — Shift Activity Preview
              </h3>


              <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 rounded-full">
                Strict Time Window Match
              </span>

            </div>


            <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">

              <CheckCircle2 className="w-4 h-4 text-emerald-400" />

              {filteredActivities.length}
              {' '}
              activities found between
              {' '}
              {shiftConfig.startTime}
              {' '}
              and
              {' '}
              {shiftConfig.endTime}

            </p>

          </div>


          <div className="flex items-center gap-1 overflow-x-auto bg-[#0d0e14] p-1 rounded-xl border border-slate-800">

            {[
              'All',
              'Tickets',
              'Incidents',
              'Messages',
              'Commits'
            ].map((cat) => (

              <button
                key={cat}
                onClick={() =>
                  setActivityTypeFilter(cat)
                }
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


        {/* SEARCH */}

        <div className="relative">

          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />


          <input
            type="text"
            placeholder="Search activities by title, reference ID, author..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
          />

        </div>


        {/* ACTIVITY LIST */}

        <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto border border-slate-800 rounded-2xl bg-[#0d0e14]">

          {filteredActivities.length === 0 ? (

            <div className="p-8 text-center text-slate-500 text-xs">
              No activities found in shift window.
            </div>

          ) : (

            filteredActivities.map((act) => (

              <div
                key={act.id}
                className="p-4 hover:bg-[#161824] transition-colors flex items-center justify-between gap-4"
              >

                <div className="flex items-start gap-3 min-w-0">

                  <div className="mt-0.5">
                    <SourceBadge
                      source={act.source}
                      size="sm"
                    />
                  </div>


                  <div className="min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <span className="font-mono font-bold text-xs text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {act.referenceId}
                      </span>


                      <ActivityBadge
                        type={act.sourceType}
                        size="sm"
                      />


                      <span className="text-xs text-slate-400">
                        • {act.timestamp}
                      </span>

                    </div>


                    <h5 className="text-xs font-bold text-slate-200 mt-1 truncate">
                      {act.title}
                    </h5>

                  </div>

                </div>


                <div className="shrink-0">

                  <StatusBadge
                    status={act.status}
                    size="sm"
                  />

                </div>

              </div>

            ))

          )}

        </div>

      </div>


      {/* STEP 4 - GENERATE */}

      <div className="bg-[#12141e] border border-slate-700/80 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">

        <div className="space-y-1">

          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">

            <Sparkles className="w-4 h-4 text-slate-300" />

            Step 4 — Finalize & Generate

          </div>


          <h3 className="text-lg font-extrabold text-white">
            Ready to compile structured handover note?
          </h3>


          <p className="text-xs text-slate-400">

            Selected shift:
            {' '}
            {shiftConfig.startTime}
            {' '}
            →
            {' '}
            {shiftConfig.endTime}

          </p>

        </div>


        <button
          onClick={handleStartGeneration}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 shrink-0"
        >

          <span>
            Generate Handover Note
          </span>

          <ArrowRight className="w-5 h-5" />

        </button>

      </div>

    </div>
  );
}
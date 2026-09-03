import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Eye,
  Database,
  ShieldCheck
} from 'lucide-react';

import { getPdfUrl } from '../services/api';


export function HandoverDetail() {
  const navigate = useNavigate();

  const stored =
    localStorage.getItem('generatedHandover');

  const handover =
    stored ? JSON.parse(stored) : null;


  if (!handover) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-white">
          No Handover Generated
        </h1>

        <p className="text-sm text-slate-400">
          Generate a handover first.
        </p>

        <button
          onClick={() =>
            navigate('/generate')
          }
          className="px-4 py-2 bg-white text-black rounded-xl font-bold"
        >
          Generate Handover
        </button>
      </div>
    );
  }


  const sections =
    handover.sections || {};

  const metrics =
    handover.metrics || {};


  const renderSection = (
    title,
    items,
    Icon
  ) => {
    const safeItems = items || [];

    return (
      <div className="bg-[#12141e] border border-slate-800 rounded-2xl p-6 shadow-xl">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3">

            <Icon className="w-5 h-5 text-slate-300" />

            <h2 className="text-lg font-black text-white">
              {title}
            </h2>

          </div>

          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-300">
            {safeItems.length}
          </span>

        </div>


        {safeItems.length === 0 ? (

          <div className="p-5 border border-dashed border-slate-800 rounded-xl text-center">

            <p className="text-sm text-slate-500">
              Nothing to report
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {safeItems.map((item, index) => (

              <div
                key={`${item.source}-${item.record_id}-${index}`}
                className="bg-[#0d0e14] border border-slate-800 rounded-xl p-4"
              >

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                  <div className="min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded">
                        {item.record_id}
                      </span>

                      <span className="text-xs px-2 py-1 bg-slate-900 text-slate-300 rounded border border-slate-800">
                        {item.source}
                      </span>

                      {item.status && (
                        <span className="text-xs text-slate-400">
                          {item.status}
                        </span>
                      )}

                    </div>


                    <h3 className="text-sm font-bold text-white mt-3">
                      {item.summary}
                    </h3>


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">

                      <p className="text-xs text-slate-400">
                        Timestamp:
                        {' '}
                        <span className="text-slate-300">
                          {item.timestamp}
                        </span>
                      </p>

                      <p className="text-xs text-slate-400">
                        Owner:
                        {' '}
                        <span className="text-slate-300">
                          {item.owner || 'Unassigned'}
                        </span>
                      </p>

                      <p className="text-xs text-slate-400">
                        Severity:
                        {' '}
                        <span className="text-slate-300">
                          {item.severity || 'N/A'}
                        </span>
                      </p>

                      <p className="text-xs text-slate-400">
                        Reference:
                        {' '}
                        <span className="font-mono text-slate-300">
                          {item.source_reference}
                        </span>
                      </p>

                    </div>

                  </div>


                  <div className="shrink-0 text-left md:text-right">

                    <p className="text-xs text-slate-500">
                      Risk
                    </p>

                    <p className="text-sm font-black text-white uppercase">
                      {item.risk_level || 'low'}
                    </p>

                    <p className="text-xs text-slate-500">
                      Score {item.risk_score ?? 0}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    );
  };


  const handleDownload = () => {
    window.open(
      getPdfUrl(),
      '_blank'
    );
  };


  return (
    <div className="space-y-7 animate-in fade-in duration-300">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>


          <h1 className="text-2xl font-black text-white">
            Generated Shift Handover
          </h1>


          <p className="text-sm text-slate-400 mt-1">
            {handover.shift?.start}
            {' '}
            →
            {' '}
            {handover.shift?.end}
          </p>

        </div>


        <button
          onClick={handleDownload}
          className="px-5 py-3 bg-white hover:bg-slate-200 text-black rounded-xl text-sm font-black flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>

      </div>


      {/* METRICS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <MetricCard
          title="Events Scanned"
          value={metrics.events_scanned ?? 0}
        />

        <MetricCard
          title="In Shift Window"
          value={metrics.events_in_window ?? 0}
        />

        <MetricCard
          title="Unique Records"
          value={metrics.unique_records ?? 0}
        />

        <MetricCard
          title="Duplicates Removed"
          value={metrics.duplicates_removed ?? 0}
        />

      </div>


      {/* SOURCE / DATABASE STATUS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-[#12141e] border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center gap-2">

            <ShieldCheck className="w-5 h-5 text-emerald-400" />

            <h3 className="text-sm font-bold text-white">
              Traceability
            </h3>

          </div>

          <p className="text-xs text-slate-400 mt-2">
            Every generated item includes its source,
            record ID and timestamp.
          </p>

        </div>


        <div className="bg-[#12141e] border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center gap-2">

            <Database className="w-5 h-5 text-slate-300" />

            <h3 className="text-sm font-bold text-white">
              PostgreSQL Analytics
            </h3>

          </div>

          <p className="text-xs text-slate-400 mt-2">

            {handover.database?.saved
              ? `Saved successfully — Handover ID ${handover.database.handover_id}`
              : 'Analytics database save unavailable'}

          </p>

        </div>

      </div>


      {/* FOUR REQUIRED SECTIONS */}

      {renderSection(
        'Completed',
        sections.completed,
        CheckCircle2
      )}


      {renderSection(
        'In Progress',
        sections.in_progress,
        Clock3
      )}


      {renderSection(
        'Blockers',
        sections.blockers,
        AlertTriangle
      )}


      {renderSection(
        'Watch-list',
        sections.watchlist,
        Eye
      )}


      {/* FINGERPRINT */}

      <div className="bg-[#12141e] border border-slate-800 rounded-2xl p-5">

        <p className="text-xs text-slate-500 font-bold">
          Reproducibility Fingerprint
        </p>

        <p className="text-xs font-mono text-slate-300 mt-2 break-all">
          {handover.fingerprint || 'N/A'}
        </p>

      </div>

    </div>
  );
}


function MetricCard({
  title,
  value
}) {
  return (
    <div className="bg-[#12141e] border border-slate-800 rounded-2xl p-5">

      <p className="text-xs text-slate-500 font-bold">
        {title}
      </p>

      <p className="text-2xl font-black text-white mt-2">
        {value}
      </p>

    </div>
  );
}
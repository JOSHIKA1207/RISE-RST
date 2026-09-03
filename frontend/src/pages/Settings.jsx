import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { currentUser, sourcesList } from '../data/mockData';
import {
  User,
  Bell,
  FileCheck2,
  Cpu,
  RotateCcw,
  Save,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Link2
} from 'lucide-react';

const STORAGE_KEY = 'shiftflow_settings_v1';

const DEFAULT_SETTINGS = {
  general: {
    operatorName: currentUser.name || "Arun Kumar",
    role: currentUser.role || "NOC Operator",
    shiftTiming: "09:00 AM – 05:00 PM",
    timeZone: "IST (UTC+5:30)"
  },
  notifications: {
    incidentAlerts: true,
    handoverReminders: true,
    criticalAlerts: true,
    emailNotifications: false
  },
  handoverSettings: {
    defaultFormat: "Structured (Markdown + Table)",
    autoIncludeUnresolvedTickets: true,
    includeRecentCommits: true,
    includeIncidentActivity: true
  },
  system: {
    autoSave: true,
    refreshInterval: "30 seconds",
    cachedSize: "1.4 MB"
  }
};

function ToggleSwitch({ id, checked, onChange, label, description, disabled = false }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <div className="pr-4">
        <label htmlFor={id} className="text-xs font-bold text-slate-200 cursor-pointer select-none">
          {label}
        </label>
        {description && (
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>

      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-slate-200' : 'bg-slate-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0d0e14] shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export function Settings() {
  const { setToast } = useOutletContext() || {};

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  const [cacheSize, setCacheSize] = useState("1.4 MB");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateGeneral = (field, val) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, [field]: val }
    }));
    setHasUnsavedChanges(true);
  };

  const updateNotifications = (field, val) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: val }
    }));
    setHasUnsavedChanges(true);
  };

  const updateHandover = (field, val) => {
    setSettings((prev) => ({
      ...prev,
      handoverSettings: { ...prev.handoverSettings, [field]: val }
    }));
    setHasUnsavedChanges(true);
  };

  const updateSystem = (field, val) => {
    setSettings((prev) => ({
      ...prev,
      system: { ...prev.system, [field]: val }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setHasUnsavedChanges(false);
      if (setToast) {
        setToast({
          type: "success",
          title: "Settings Saved",
          message: "All shift handover system preferences saved."
        });
      }
    } catch (err) {}
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      setHasUnsavedChanges(false);
      if (setToast) {
        setToast({
          type: "info",
          title: "Reset to Defaults",
          message: "System configuration restored to factory defaults."
        });
      }
    } catch (err) {}
  };

  const handleClearCache = () => {
    setCacheSize("0 KB");
    if (setToast) {
      setToast({
        type: "success",
        title: "Cache Cleared",
        message: "Cached telemetry payload cleared."
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Shift Handover Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage operator defaults, notification channels, handover automation rules, and system behavior.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="p-3 bg-amber-950/80 border border-amber-800/80 rounded-xl text-amber-200 text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            You have unsaved changes in your settings configuration.
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 bg-amber-200 hover:bg-amber-100 text-slate-950 font-bold rounded text-xs transition-colors"
          >
            Save Now
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: GENERAL SETTINGS */}
        <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">General Settings</h3>
              <p className="text-[11px] text-slate-400">Operator profile details and primary shift parameters.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Operator Name
              </label>
              <input
                type="text"
                value={settings.general.operatorName}
                onChange={(e) => updateGeneral('operatorName', e.target.value)}
                className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Role / Position
              </label>
              <select
                value={settings.general.role}
                onChange={(e) => updateGeneral('role', e.target.value)}
                className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors"
              >
                <option value="NOC Operator">NOC Operator</option>
                <option value="Support Engineer">Support Engineer</option>
                <option value="On-call Developer">On-call Developer</option>
                <option value="Shift Lead">Shift Lead</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Shift Timing Window
              </label>
              <select
                value={settings.general.shiftTiming}
                onChange={(e) => updateGeneral('shiftTiming', e.target.value)}
                className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors"
              >
                <option value="09:00 AM – 05:00 PM">Day Shift (09:00 AM – 05:00 PM)</option>
                <option value="05:00 PM – 01:00 AM">Evening Shift (05:00 PM – 01:00 AM)</option>
                <option value="01:00 AM – 09:00 AM">Night Shift (01:00 AM – 09:00 AM)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Primary Time Zone
              </label>
              <select
                value={settings.general.timeZone}
                onChange={(e) => updateGeneral('timeZone', e.target.value)}
                className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors"
              >
                <option value="IST (UTC+5:30)">IST (UTC+5:30) — Asia/Kolkata</option>
                <option value="UTC (UTC+0:00)">UTC (UTC+0:00)</option>
                <option value="PST (UTC-8:00)">PST (UTC-8:00)</option>
                <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: NOTIFICATIONS */}
        <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Notifications</h3>
              <p className="text-[11px] text-slate-400">Alert triggers and shift transition reminder channels.</p>
            </div>
          </div>

          <div className="space-y-1">
            <ToggleSwitch
              id="toggle-incidentAlerts"
              checked={settings.notifications.incidentAlerts}
              onChange={(val) => updateNotifications('incidentAlerts', val)}
              label="Incident Alerts"
              description="Notify immediately when P1/P2 incidents are logged during active shift."
            />

            <ToggleSwitch
              id="toggle-handoverReminders"
              checked={settings.notifications.handoverReminders}
              onChange={(val) => updateNotifications('handoverReminders', val)}
              label="Handover Reminders"
              description="Send automated reminder banner 30 minutes before shift window ends."
            />

            <ToggleSwitch
              id="toggle-criticalAlerts"
              checked={settings.notifications.criticalAlerts}
              onChange={(val) => updateNotifications('criticalAlerts', val)}
              label="Critical Alerts Push Notifications"
              description="Sound loud notification chime for unhandled blockers or open SEV-1 incidents."
            />

            <ToggleSwitch
              id="toggle-emailNotifications"
              checked={settings.notifications.emailNotifications}
              onChange={(val) => updateNotifications('emailNotifications', val)}
              label="Email Notifications Digest"
              description="Receive PDF copy of sent handover notes via work email."
            />
          </div>
        </div>

        {/* SECTION 3: HANDOVER SETTINGS */}
        <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Handover Settings</h3>
              <p className="text-[11px] text-slate-400">Automated categorization rules and summary export format.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Default Handover Document Format
              </label>
              <select
                value={settings.handoverSettings.defaultFormat}
                onChange={(e) => updateHandover('defaultFormat', e.target.value)}
                className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors"
              >
                <option value="Structured (Markdown + Table)">Structured (Markdown + Traceability Matrix Table)</option>
                <option value="Executive Summary Only">Executive Summary Only (High Level Stats)</option>
                <option value="Full Telemetry Audit Payload">Full Telemetry Audit Payload (JSON + Logs)</option>
              </select>
            </div>

            <div className="space-y-1 pt-2">
              <ToggleSwitch
                id="toggle-autoIncludeTickets"
                checked={settings.handoverSettings.autoIncludeUnresolvedTickets}
                onChange={(val) => updateHandover('autoIncludeUnresolvedTickets', val)}
                label="Automatically include unresolved tickets"
                description="Import active Jira tickets updated within the shift window directly into Open Items."
              />

              <ToggleSwitch
                id="toggle-includeCommits"
                checked={settings.handoverSettings.includeRecentCommits}
                onChange={(val) => updateHandover('includeRecentCommits', val)}
                label="Include recent commits"
                description="Link GitHub PR deployments committed during shift hours into Completed Work."
              />

              <ToggleSwitch
                id="toggle-includeIncidents"
                checked={settings.handoverSettings.includeIncidentActivity}
                onChange={(val) => updateHandover('includeIncidentActivity', val)}
                label="Include incident activity"
                description="Fetch PagerDuty alerts & Slack #incident war room communications automatically."
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SYSTEM */}
        <div className="bg-[#12141e] rounded-2xl border border-slate-800/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">System & Cache</h3>
              <p className="text-[11px] text-slate-400">Auto-save controls, polling intervals, and browser storage management.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Data Refresh Interval
                </label>
                <select
                  value={settings.system.refreshInterval}
                  onChange={(e) => updateSystem('refreshInterval', e.target.value)}
                  className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-colors"
                >
                  <option value="15 seconds">Realtime (15 seconds)</option>
                  <option value="30 seconds">Normal (30 seconds)</option>
                  <option value="1 minute">Relaxed (1 minute)</option>
                  <option value="5 minutes">Manual (5 minutes)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Cached Data Size
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-300">
                  <span className="font-mono font-bold text-white">{cacheSize}</span>
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 hover:border-rose-800 font-bold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cached Data</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <ToggleSwitch
                id="toggle-autoSave"
                checked={settings.system.autoSave}
                onChange={(val) => updateSystem('autoSave', val)}
                label="Auto-save drafts"
                description="Persist active handover draft state automatically into localStorage every 5 seconds."
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Settings</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

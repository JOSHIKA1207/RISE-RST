import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, Clock, CheckCircle, ShieldAlert, LogOut } from 'lucide-react';
import { currentUser, currentShift } from '../../data/mockData';

export function Topbar({ onMenuClick, onLogout }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  let activeUser = currentUser;
  try {
    const saved = localStorage.getItem('shiftflow_auth_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      activeUser = {
        name: parsed.name || currentUser.name,
        role: parsed.role || currentUser.role,
        avatar: parsed.avatar || currentUser.avatar
      };
    }
  } catch (e) {}

  let title = "Shift Handover";
  if (location.pathname === '/generate') title = "Generate Shift Handover";
  else if (location.pathname === '/activities') title = "Activity Explorer";
  else if (location.pathname === '/history') title = "Handover History";
  else if (location.pathname.startsWith('/handover')) title = "Handover Document Preview";
  else if (location.pathname === '/settings') title = "System Settings";

  const notifications = [
    {
      id: 1,
      title: "P2 Incident Logged",
      desc: "INC-1055 Payment Service degradation detected at 02:45 PM",
      time: "25m ago"
    },
    {
      id: 2,
      title: "Postgres Pool Normal",
      desc: "INC-1024 database connections resolved by Arun Kumar",
      time: "1h ago"
    },
    {
      id: 3,
      title: "Shift Window 76% Complete",
      desc: "Prepare shift handover notes for 05:00 PM transition",
      time: "Just now"
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0d0e14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-white leading-none tracking-tight">{title}</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="inline-flex items-center gap-1 font-medium text-slate-300">
              <Clock className="w-3 h-3 text-slate-400" />
              {currentShift.displayDate} ({currentShift.startTime} – {currentShift.endTime})
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Shift Active ({currentShift.progress}%)
            </span>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Global Search input */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tickets, commits..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#161824] border border-slate-700/60 rounded-xl text-slate-200 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-200 ring-2 ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#12141e] rounded-2xl border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Shift Alerts</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold border border-slate-700">3 New</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-1">
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700"
          />
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-white leading-tight">
              {activeUser.name}
            </span>
            <span className="block text-[10px] font-bold text-slate-300 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700 inline-block mt-0.5">
              {activeUser.role}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

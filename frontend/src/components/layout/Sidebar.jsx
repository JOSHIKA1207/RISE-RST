import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  Activity,
  History,
  Settings,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import { currentUser } from '../../data/mockData';

export function Sidebar({ isOpen, onClose, onLogout }) {
  const location = useLocation();

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

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Generate Handover',
      path: '/generate',
      icon: FileCheck2,
      badge: 'Core'
    },
    {
      name: 'Activity Explorer',
      path: '/activities',
      icon: Activity
    },
    {
      name: 'Handover History',
      path: '/history',
      icon: History
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d0e14] border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 via-slate-400 to-slate-100 flex items-center justify-center text-slate-950 font-bold shadow-md ring-1 ring-white/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">ShiftFlow</span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">Enterprise NOC</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold border border-slate-700/80 shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-200' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Metallic Silver Action Card */}
        <div className="p-4 m-3 bg-gradient-to-br from-slate-900 via-[#161824] to-black text-white rounded-xl border border-slate-700/60 shadow-lg">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            <span>AI Automated</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Traceable handover notes from Jira, Slack & GitHub.
          </p>
          <NavLink
            to="/generate"
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 rounded-lg hover:from-white hover:to-slate-300 transition-colors shadow-xs"
          >
            <span>Start Handover</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090a0f] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{activeUser.name}</h4>
              <p className="text-[10px] font-semibold text-slate-400 truncate">{activeUser.role}</p>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Mail, UserCheck, KeyRound, UserPlus, LogIn, User, Users, Filter, CheckCircle2, UserCheck2 } from 'lucide-react';
import { currentUser } from '../data/mockData';

export function Login({ onLogin }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signin');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  // Initial preset users
  const defaultPresetUsers = [
    { name: "Arun Kumar", email: "arun.kumar@enterprise.io", role: "NOC Operator", shiftWindow: "Day Shift (09:00 AM – 05:00 PM)", team: "NOC Operations Team B" },
    { name: "Vikram Rao", email: "vikram.rao@enterprise.io", role: "Shift Lead", shiftWindow: "Evening Shift (05:00 PM – 01:00 AM)", team: "Shift Operations Lead" },
    { name: "Priya Sharma", email: "priya.sharma@enterprise.io", role: "Support Engineer", shiftWindow: "Day Shift (09:00 AM – 05:00 PM)", team: "Customer Tier-3 Support" },
    { name: "Sarah Jenkins", email: "sarah.jenkins@enterprise.io", role: "On-call Developer", shiftWindow: "Night Shift (01:00 AM – 09:00 AM)", team: "Core Payment Backend" }
  ];

  // Load all personnel (preset + newly registered from localStorage)
  const [allUsers, setAllUsers] = useState(() => {
    try {
      const savedNew = JSON.parse(localStorage.getItem('shiftflow_registered_users') || '[]');
      // Merge unique by email
      const combined = [...defaultPresetUsers];
      savedNew.forEach((nu) => {
        if (!combined.some((u) => u.email.toLowerCase() === nu.email.toLowerCase())) {
          combined.push(nu);
        }
      });
      return combined;
    } catch (e) {
      return defaultPresetUsers;
    }
  });

  // Selected User state for Sign In
  const [selectedUser, setSelectedUser] = useState(allUsers[0]);
  const [signInPassword, setSignInPassword] = useState('••••••••••••');

  // Sign Up State (New User)
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('NOC Operator');
  const [signUpTeam, setSignUpTeam] = useState('NOC Operations Team A');
  const [signUpShift, setSignUpShift] = useState('Day Shift (09:00 AM – 05:00 PM)');

  // Filter users by selectedRoleFilter
  const filteredUsers = allUsers.filter((u) => {
    if (selectedRoleFilter === 'All') return true;
    return u.role.toLowerCase() === selectedRoleFilter.toLowerCase();
  });

  const handleSelectPerson = (user) => {
    setSelectedUser(user);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    const userSession = {
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      shiftWindow: selectedUser.shiftWindow || "Day Shift (09:00 AM – 05:00 PM)",
      avatar: selectedUser.avatar || currentUser.avatar,
      authenticatedAt: new Date().toLocaleTimeString()
    };

    localStorage.setItem('shiftflow_auth_session', JSON.stringify(userSession));
    if (onLogin) onLogin(userSession);
    navigate('/');
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim()) return;

    const newUser = {
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      role: signUpRole,
      team: signUpTeam,
      shiftWindow: signUpShift,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      isNewUser: true,
      registeredAt: new Date().toLocaleDateString()
    };

    // Save to localStorage registered users list
    try {
      const existing = JSON.parse(localStorage.getItem('shiftflow_registered_users') || '[]');
      existing.push(newUser);
      localStorage.setItem('shiftflow_registered_users', JSON.stringify(existing));
      
      // Update local component state so new person immediately shows up under their role!
      setAllUsers((prev) => [...prev, newUser]);
      setSelectedUser(newUser);
      setSelectedRoleFilter(signUpRole); // Automatically select their role tab
    } catch (err) {
      console.error("Error saving new user", err);
    }

    const userSession = {
      ...newUser,
      authenticatedAt: new Date().toLocaleTimeString()
    };

    localStorage.setItem('shiftflow_auth_session', JSON.stringify(userSession));
    if (onLogin) onLogin(userSession);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-4 antialiased font-sans text-slate-100">
      {/* Metallic Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-700/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-zinc-700/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl bg-[#12141e] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in duration-300">
        {/* Branding Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#181a27] to-[#0d0e14] text-white text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-200 via-slate-400 to-slate-100 text-slate-950 flex items-center justify-center mx-auto shadow-lg mb-3 ring-1 ring-white/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white">ShiftFlow Enterprise Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Role-Based Operations Sign In & New Personnel Registration</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0d0e14] p-1">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'signin'
                ? 'bg-[#181a26] text-white shadow-md border border-slate-700/60'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Select Personnel & Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'signup'
                ? 'bg-[#181a26] text-white shadow-md border border-slate-700/60'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Person (+ Add User)</span>
          </button>
        </div>

        {/* TAB 1: ROLE-BASED SIGN IN & PERSONNEL DISCOVERY */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
            {/* ROLE FILTER BUTTONS REQUIREMENT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  Select Role to View Personnel:
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {filteredUsers.length} operator(s) found
                </span>
              </div>

              {/* Role Buttons Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'NOC Operator', 'Shift Lead', 'Support Engineer', 'On-call Developer'].map((roleName) => (
                  <button
                    key={roleName}
                    type="button"
                    onClick={() => setSelectedRoleFilter(roleName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      selectedRoleFilter === roleName
                        ? 'bg-slate-200 text-slate-950 border-slate-300 shadow-sm'
                        : 'bg-[#161824] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {roleName}
                  </button>
                ))}
              </div>
            </div>

            {/* PERSON LIST UNDER SELECTED ROLE */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Personnel Registered Under {selectedRoleFilter === 'All' ? 'All Roles' : selectedRoleFilter}:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {filteredUsers.map((u) => {
                  const isSelected = selectedUser?.email.toLowerCase() === u.email.toLowerCase();
                  return (
                    <div
                      key={u.email}
                      onClick={() => handleSelectPerson(u)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1c1f2e] border-slate-300 ring-2 ring-slate-400/30 shadow-md'
                          : 'bg-[#0d0e14] border-slate-800 hover:bg-[#161824] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white truncate text-xs">{u.name}</span>
                            {u.isNewUser && (
                              <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                New
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-semibold truncate">{u.role}</span>
                        </div>
                      </div>

                      {isSelected && <UserCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AUTHENTICATION DETAILS FOR SELECTED PERSON */}
            {selectedUser && (
              <div className="p-4 bg-[#0d0e14] rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Selected Operator</span>
                    <span className="font-bold text-white text-xs">{selectedUser.name} ({selectedUser.email})</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {selectedUser.role}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Enter Password / Passkey
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedUser}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 font-black text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sign In as {selectedUser?.name || 'Selected Operator'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER NEW PERSON */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Full Name of New Person
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
                  placeholder="e.g. Ananya Roy"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
                  placeholder="ananya.roy@enterprise.io"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Assign Role (Determines Access & Personnel Grouping)
              </label>
              <select
                value={signUpRole}
                onChange={(e) => setSignUpRole(e.target.value)}
                className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
              >
                <option value="NOC Operator">NOC Operator</option>
                <option value="Shift Lead">Shift Lead</option>
                <option value="Support Engineer">Support Engineer</option>
                <option value="On-call Developer">On-call Developer</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Department / Team
                </label>
                <input
                  type="text"
                  value={signUpTeam}
                  onChange={(e) => setSignUpTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
                  placeholder="e.g. NOC Operations Team A"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Shift Assignment
                </label>
                <select
                  value={signUpShift}
                  onChange={(e) => setSignUpShift(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#161824] border border-slate-700/80 rounded-xl text-slate-100 focus:bg-[#1c1f2e] focus:border-slate-500 focus:outline-none"
                >
                  <option value="Day Shift (09:00 AM – 05:00 PM)">Day Shift</option>
                  <option value="Evening Shift (05:00 PM – 01:00 AM)">Evening Shift</option>
                  <option value="Night Shift (01:00 AM – 09:00 AM)">Night Shift</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-slate-100 via-slate-300 to-slate-200 hover:from-white hover:to-slate-300 text-slate-950 font-black text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group pt-2"
            >
              <span>Add Person & Authenticate Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="p-4 bg-[#0d0e14] border-t border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2 font-semibold">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Click any role button to discover assigned operators</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { GenerateHandover } from './pages/GenerateHandover';
import { HandoverDetail } from './pages/HandoverDetail';
import { ActivityExplorer } from './pages/ActivityExplorer';
import { HandoverHistory } from './pages/HandoverHistory';
import { Settings } from './pages/Settings';
import { Toast } from './components/common/Toast';

export function App() {
  const [toast, setToast] = useState(null);

  // Check auth session from localStorage
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('shiftflow_auth_session');
      return saved ? JSON.parse(saved) : { name: "Arun Kumar", role: "NOC Operator", authenticated: true };
    } catch (e) {
      return { name: "Arun Kumar", role: "NOC Operator", authenticated: true };
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('shiftflow_auth_session');
    setAuthSession(null);
    if (setToast) {
      setToast({
        type: 'info',
        title: 'Logged Out',
        message: 'ShiftFlow session ended.'
      });
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={(session) => {
                setAuthSession(session);
                setToast({
                  type: 'success',
                  title: 'Welcome back!',
                  message: `Logged in as ${session.name} (${session.role})`
                });
              }}
            />
          }
        />

        {/* Protected Application Routes inside Layout */}
        <Route
          element={
            authSession ? (
              <Layout toast={toast} setToast={setToast} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/generate" element={<GenerateHandover />} />
          <Route path="/activities" element={<ActivityExplorer />} />
          <Route path="/history" element={<HandoverHistory />} />
          <Route path="/handover/:id" element={<HandoverDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Router>
  );
}

export default App;

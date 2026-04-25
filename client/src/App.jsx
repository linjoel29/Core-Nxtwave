import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyEntry from './pages/DailyEntry';
import Analytics from './pages/Analytics';
import Loans from './pages/Loans';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

function App() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/ping`).catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-50 text-slate-900 md:pb-0">
                  <Navbar />
                  <main className="max-w-4xl mx-auto p-4 md:p-8">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/daily" element={<DailyEntry />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/loans" element={<Loans />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

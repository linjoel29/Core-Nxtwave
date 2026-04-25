import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Flame, Award, AlertCircle, TrendingUp, IndianRupee } from 'lucide-react';

const BADGE_META = {
  Bronze: { emoji: '🥉', color: 'border-amber-700 bg-amber-50 text-amber-800', threshold: '₹1,000' },
  Silver: { emoji: '🥈', color: 'border-slate-400 bg-slate-50 text-slate-700', threshold: '₹5,000' },
  Gold:   { emoji: '🥇', color: 'border-yellow-500 bg-yellow-50 text-yellow-700', threshold: '₹10,000' },
};

function StatCard({ title, value, sub, icon, colorClass, borderClass }) {
  return (
    <div className={`flat-card flex flex-col justify-between relative overflow-hidden ${borderClass || ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</span>
        <span className={`p-2 rounded-lg ${colorClass}`}>{icon}</span>
      </div>
      <p className="stat-number">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/${currentUser.uid}`);
        const data = await res.json();
        setDashboard(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <div className="bg-blue-100 p-4 rounded-2xl mb-2">
          <Zap size={40} className="text-primary animate-pulse" />
        </div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="mt-4">
          <h2 className="text-xl font-bold text-slate-800">Setting up your dashboard...</h2>
          <p className="text-slate-500 text-sm mt-1">This may take a few seconds on first load</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return <p className="text-slate-500 text-center mt-16">Failed to load dashboard. Make sure the server is running.</p>;
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── Nudge Banner ── */}
      <div className="alert-info flex items-center gap-3">
        <Zap size={18} className="text-primary shrink-0" />
        <span className="text-sm">{dashboard.nudge}</span>
      </div>

      {/* ── Loan Reminder Alert ── */}
      {dashboard.loanReminder && (
        <div className="alert-danger flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Loan Payment Due Today</p>
            <p className="text-sm mt-0.5">{dashboard.loanReminder}</p>
          </div>
        </div>
      )}

      {/* ── Key Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Savings"
          value={`₹${dashboard.totalSavings.toLocaleString('en-IN')}`}
          icon={<IndianRupee size={20} className="text-green-600" />}
          colorClass="bg-green-100"
          borderClass="border-l-4 border-l-green-500"
        />
        <StatCard
          title="Current Streak"
          value={`${dashboard.currentStreak} Days`}
          sub={`Longest: ${dashboard.longestStreak} days`}
          icon={<Flame size={20} className="text-orange-500" />}
          colorClass="bg-orange-100"
          borderClass="border-l-4 border-l-orange-400"
        />
        <StatCard
          title="Active Loans"
          value={dashboard.activeLoansCount}
          sub="tracked loans"
          icon={<TrendingUp size={20} className="text-blue-500" />}
          colorClass="bg-blue-100"
          borderClass="border-l-4 border-l-blue-400"
        />
      </div>

      {/* ── Badges ── */}
      <div className="flat-card">
        <div className="flex items-center gap-2 mb-4">
          <Award size={20} className="text-yellow-500" />
          <h2 className="font-bold text-slate-800">Earned Badges</h2>
        </div>

        {dashboard.badges.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Award size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Save ₹1,000 to earn your first badge!</p>
            <div className="flex justify-center gap-3 mt-4">
              {Object.entries(BADGE_META).map(([name, meta]) => (
                <div key={name} className={`badge-chip opacity-40 ${meta.color}`}>
                  {meta.emoji} {name} ({meta.threshold})
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {dashboard.badges.map(b => {
              const meta = BADGE_META[b.badge_name] || { emoji: '🎖️', color: 'border-slate-300 bg-slate-50 text-slate-700', threshold: '' };
              return (
                <div key={b.id} className={`badge-chip ${meta.color}`}>
                  {meta.emoji} {b.badge_name}
                  {meta.threshold && <span className="text-xs opacity-70 ml-1">({meta.threshold})</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

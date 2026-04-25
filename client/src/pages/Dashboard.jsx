import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Flame, Award, AlertCircle, TrendingUp, IndianRupee, Target, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateBadges } from '../utils/badgeCalculator';

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

function BadgeCard({ badge }) {
  const achieved = badge.achieved;
  const progress = badge.progress;

  return (
    <div
      className={`rounded-xl p-3 text-center border-2 transition-all duration-300 ${
        achieved
          ? 'border-yellow-400 bg-yellow-50 shadow-md shadow-yellow-100'
          : 'border-slate-200 bg-slate-50 opacity-60'
      }`}
    >
      <div className="text-3xl mb-1 relative inline-block">
        {badge.icon}
        {!achieved && (
          <span className="absolute -top-1 -right-2 text-xs">🔒</span>
        )}
      </div>
      <div className="font-bold text-xs text-slate-800 leading-tight">{badge.name}</div>
      <div className="text-slate-500 text-[10px] mt-0.5 leading-tight">{badge.desc}</div>
      {!achieved && progress && progress.percentage !== undefined && (
        <div className="mt-2">
          <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
            <div
              className="bg-primary h-1 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
            {progress.current} / {badge.req}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [incomeLogs, setIncomeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLocked, setShowLocked] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, historyRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/dashboard/${currentUser.uid}`),
          fetch(`${import.meta.env.VITE_API_URL}/history/${currentUser.uid}`),
        ]);
        const dashData = await dashRes.json();
        const historyData = await historyRes.json();
        setDashboard(dashData);
        setIncomeLogs(historyData.logs || historyData.savings || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentUser]);

  // Calculate badges from real data
  const badgeResult = useMemo(() => {
    if (!dashboard) return null;
    return calculateBadges({
      incomeLogs,
      loans: dashboard.loans || [],
      goals: dashboard.goals || [],
      totalSaved: dashboard.totalSavings || 0,
    });
  }, [dashboard, incomeLogs]);

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

  const stats = badgeResult?.stats || {};
  const earned = badgeResult?.earned || [];
  const locked = badgeResult?.locked || [];

  // Get unique categories from earned + locked
  const allBadges = [...earned, ...locked];
  const categories = ['All', ...new Set(allBadges.map(b => b.category).filter(Boolean))];

  const filteredEarned = activeCategory === 'All' ? earned : earned.filter(b => b.category === activeCategory);
  const filteredLocked = activeCategory === 'All' ? locked : locked.filter(b => b.category === activeCategory);

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
          value={`${stats.streak || dashboard.currentStreak} Days`}
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

      {/* ── Badge Stats Bar ── */}
      <div className="flat-card bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">🔥 {stats.streak || 0}</p>
            <p className="text-xs text-slate-300 font-medium">Day Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold">💰 ₹{(stats.totalSaved || 0).toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-300 font-medium">Total Saved</p>
          </div>
          <div>
            <p className="text-2xl font-bold">📅 {stats.daysLogged || 0}</p>
            <p className="text-xs text-slate-300 font-medium">Days Logged</p>
          </div>
          <div>
            <p className="text-2xl font-bold">🏆 {stats.earnedCount || 0}<span className="text-sm text-slate-400">/{stats.totalBadges || 0}</span></p>
            <p className="text-xs text-slate-300 font-medium">Badges Earned</p>
          </div>
        </div>
      </div>

      {/* ── Active Goals ── */}
      {dashboard.goals && dashboard.goals.length > 0 && (
        <div className="flat-card">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-primary" />
            <h2 className="font-bold text-slate-800">Active Goals Progress</h2>
          </div>
          <div className="space-y-4">
            {(() => {
              return dashboard.goals.map(goal => {
                const target = Number(goal.targetAmount || goal.target_amount || 0);
                const progress = Number(goal.currentAmount || goal.savedAmount || 0);
                
                let rawPercentage = target > 0 ? ((progress / target) * 100).toFixed(1) : 0;
                if (isNaN(rawPercentage)) rawPercentage = 0;
                const percentage = Math.min(Number(rawPercentage), 100);

                return (
                  <div key={goal.id} className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-700 text-sm">{goal.goalName || goal.goal_name}</span>
                      <span className="font-bold text-xs text-primary">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-1.5 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${percentage >= 100 ? 'bg-green-500' : 'bg-primary'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>₹{progress.toLocaleString('en-IN')}</span>
                      <span>₹{target.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* ── Achievement Badges ── */}
      <div className="flat-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-yellow-500" />
            <h2 className="font-bold text-slate-800">Achievements</h2>
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              {earned.length} Earned
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Earned Badges */}
        {filteredEarned.length > 0 && (
          <>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
              ✅ Unlocked ({filteredEarned.length})
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6">
              {filteredEarned.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </>
        )}

        {filteredEarned.length === 0 && (
          <div className="text-center py-4 text-slate-400 mb-4">
            <Award size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No badges earned in this category yet</p>
          </div>
        )}

        {/* Locked Badges Toggle */}
        <button
          onClick={() => setShowLocked(!showLocked)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 rounded-lg transition-colors"
        >
          <Lock size={14} />
          {showLocked ? 'Hide' : 'Show'} Locked Badges ({filteredLocked.length})
          {showLocked ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showLocked && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
            {filteredLocked.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

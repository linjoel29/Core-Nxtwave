import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Settings as SettingsIcon, Database, CheckCircle2, Loader2 } from 'lucide-react';

const demoLogs = [
  { income: 1200, expense: 450, saved: 120 },
  { income: 800, expense: 600, saved: 50 },
  { income: 1500, expense: 500, saved: 200 },
  { income: 900, expense: 700, saved: 80 },
  { income: 2000, expense: 800, saved: 300 },
  { income: 600, expense: 400, saved: 40 },
  { income: 1800, expense: 600, saved: 250 },
  { income: 1100, expense: 500, saved: 150 },
  { income: 700, expense: 550, saved: 30 },
  { income: 1600, expense: 700, saved: 220 },
  { income: 1300, expense: 450, saved: 180 },
  { income: 950, expense: 600, saved: 90 },
  { income: 1750, expense: 550, saved: 280 },
  { income: 1400, expense: 500, saved: 200 },
];

const demoLoans = [
  {
    loan_name: "Education Loan",
    total_amount: 150000,
    emi_amount: 3500,
    emi_due_day: 5,
    remaining_months: 18,
  },
  {
    loan_name: "Bike Loan",
    total_amount: 65000,
    emi_amount: 2000,
    emi_due_day: 15,
    remaining_months: 6,
  },
];

const demoGoals = [
  {
    goalName: "New Laptop",
    targetAmount: 50000,
    currentAmount: 18500,
    deadline: "2026-12-31",
  },
  {
    goalName: "Emergency Fund",
    targetAmount: 25000,
    currentAmount: 12000,
    deadline: "2026-09-30",
  },
  {
    goalName: "Goa Trip",
    targetAmount: 15000,
    currentAmount: 14200,
    deadline: "2026-06-15",
  },
];

export default function Settings() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleLoadDemoData = async () => {
    if (!currentUser?.uid) return;
    const confirmed = window.confirm(
      "This will add demo data (14 daily logs, 2 loans, 3 goals) to your account. Continue?"
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setDone(false);

    try {
      const uid = currentUser.uid;

      // 1. Insert income_logs (last 14 days)
      for (let i = 0; i < demoLogs.length; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        await addDoc(collection(db, 'income_logs'), {
          userId: uid,
          date: dateStr,
          income: demoLogs[i].income,
          expense: demoLogs[i].expense,
          saved: demoLogs[i].saved,
          suggestion: demoLogs[i].saved + 20,
          ai_explanation:
            "Great job managing your finances today! Your saving habit is building strong financial discipline.",
          createdAt: serverTimestamp(),
        });
      }

      // 2. Insert loans
      for (const loan of demoLoans) {
        await addDoc(collection(db, 'loans'), {
          userId: uid,
          ...loan,
          created_at: new Date().toISOString(),
        });
      }

      // 3. Insert goals
      for (const goal of demoGoals) {
        await addDoc(collection(db, 'goals'), {
          userId: uid,
          ...goal,
          createdAt: serverTimestamp(),
        });
      }

      setDone(true);

      // Auto-refresh after 2 seconds so user sees populated data
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error('Demo data error:', err);
      setError('Failed to load demo data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <SettingsIcon size={24} className="text-primary" /> Settings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your account and app preferences
        </p>
      </div>

      {/* Account Info */}
      <div className="flat-card">
        <h2 className="font-bold text-slate-700 mb-3">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-800">
              {currentUser?.email || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">User ID</span>
            <span className="font-mono text-xs text-slate-400">
              {currentUser?.uid?.slice(0, 16)}...
            </span>
          </div>
        </div>
      </div>

      {/* Demo Data Section */}
      <div className="flat-card border-2 border-dashed border-orange-200 bg-orange-50">
        <div className="flex items-center gap-2 mb-2">
          <Database size={20} className="text-orange-500" />
          <h2 className="font-bold text-slate-700">Demo / Judge Mode</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Populate your account with 14 days of income logs, 2 loans, and 3
          savings goals so you can demo a fully loaded app to judges.
        </p>

        {done && (
          <div className="alert-success text-sm flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} />
            Demo data loaded! Redirecting to Dashboard...
          </div>
        )}

        {error && (
          <div className="alert-danger text-sm mb-4">{error}</div>
        )}

        <button
          onClick={handleLoadDemoData}
          disabled={loading || done}
          className="flat-btn w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Inserting demo data...
            </>
          ) : done ? (
            <>
              <CheckCircle2 size={16} />
              Done!
            </>
          ) : (
            '🎯 Load Demo Data'
          )}
        </button>
      </div>
    </div>
  );
}

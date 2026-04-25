import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, CheckCircle2, Calculator } from 'lucide-react';

const NUDGE_MESSAGES = [
  "You earned more today — try saving a bit extra! 💪",
  "You're consistent — keep going! 🔥",
  "Small savings daily lead to big results. 📈",
  "Every rupee saved today is an investment in tomorrow.",
];

export default function DailyEntry() {
  const { currentUser } = useAuth();
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [finalSaving, setFinalSaving] = useState(0);

  const [goals, setGoals] = useState([]);
  const [saveType, setSaveType] = useState('general');
  const [selectedGoalId, setSelectedGoalId] = useState('');

  React.useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/goals/${currentUser.uid}`);
        const data = await res.json();
        setGoals(data.goals || []);
      } catch (err) {
        console.error("Failed to fetch goals");
      }
    };
    if (currentUser?.uid) fetchGoals();
  }, [currentUser]);

  const randomNudge = NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)];

  const handlePredict = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid, income, expense })
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setPrediction(data);
      setFinalSaving(data.saving || 0);
    } catch (err) {
      setError('Failed to get suggestion. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/log-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          income,
          expense,
          saving: finalSaving,
          suggestion: prediction.saving,
          explanation: prediction.explanation,
          date: new Date().toISOString().split('T')[0],
          type: saveType,
          goalId: saveType === 'goal' ? selectedGoalId : null
        })
      });
      if (!res.ok) throw new Error('Server error');
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setPrediction(null);
        setIncome('');
        setExpense('');
      }, 3000);
    } catch (err) {
      setError('Failed to log entry. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Entry Logged!</h2>
        <p className="text-slate-500">Your savings have been recorded for today.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Daily Savings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Enter today's income to get a smart saving suggestion.</p>
      </div>

      {/* Rotating nudge */}
      <div className="alert-info text-sm">{randomNudge}</div>

      {/* Input Form */}
      <div className="flat-card">
        <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Calculator size={18} className="text-primary" /> Income Details
        </h2>
        <form onSubmit={handlePredict} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Today's Income <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">     </span>
              <input
                type="number"
                required
                min="0"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="flat-input pl-7"
                placeholder=" e.g. ₹800"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Today's Expense <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">    </span>
              <input
                type="number"
                min="0"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                className="flat-input pl-7"
                placeholder="  e.g. ₹200"
              />
            </div>
          </div>
          {error && <div className="alert-danger text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="flat-btn w-full py-3">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Calculating...
              </span>
            ) : 'Get Saving Suggestion'}
          </button>
        </form>
      </div>

      {/* Prediction Result & Editable Suggestion */}
      {prediction && (
        <div className="flat-card border-green-300 bg-green-50 space-y-4">
          <div className="text-center">
            <p className="text-green-700 font-semibold text-sm uppercase tracking-wide mb-1">Suggested Daily Saving</p>

            {/* Editable Input */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl font-bold text-green-700">₹</span>
              <input
                type="number"
                className="text-5xl font-bold text-green-700 bg-transparent w-32 text-center outline-none border-b-2 border-green-300 focus:border-green-600 transition-colors"
                value={finalSaving}
                onChange={(e) => setFinalSaving(Number(e.target.value) || 0)}
              />
            </div>

            <p className="text-green-800 font-medium text-sm">
              {Number(income) > 0 ? Math.round((finalSaving / Number(income)) * 100) : 0}% of your income saved
            </p>

            <div className="flex justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setFinalSaving(Math.max(0, finalSaving - 50))}
                className="px-3 py-1.5 rounded bg-white text-green-700 border border-green-300 font-semibold text-xs hover:bg-green-100 transition-colors"
              >
                Round Down (-50)
              </button>
              <button
                type="button"
                onClick={() => setFinalSaving(prediction.saving)}
                className="px-3 py-1.5 rounded bg-green-200 text-green-800 font-bold text-xs hover:bg-green-300 transition-colors"
              >
                Keep (₹{prediction.saving})
              </button>
              <button
                type="button"
                onClick={() => setFinalSaving(finalSaving + 50)}
                className="px-3 py-1.5 rounded bg-white text-green-700 border border-green-300 font-semibold text-xs hover:bg-green-100 transition-colors"
              >
                Round Up (+50)
              </button>
            </div>

            {prediction.trend && (
              <span className="mt-4 inline-block text-xs bg-green-100 border border-green-300 text-green-700 px-3 py-1 rounded-full font-medium">
                Income Trend: {prediction.trend.charAt(0).toUpperCase() + prediction.trend.slice(1)}
              </span>
            )}
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-lg p-4 flex gap-3">
            <Sparkles size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-slate-700 text-sm leading-relaxed">{prediction.explanation}</p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-lg p-4 flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-700">Where should this go?</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="saveType"
                  value="general"
                  checked={saveType === 'general'}
                  onChange={() => setSaveType('general')}
                  className="accent-primary"
                />
                General Saving
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm" title={goals.length === 0 ? "You have no active goals" : ""}>
                <input
                  type="radio"
                  name="saveType"
                  value="goal"
                  checked={saveType === 'goal'}
                  onChange={() => setSaveType('goal')}
                  className="accent-primary"
                  disabled={goals.length === 0}
                />
                <span className={goals.length === 0 ? 'text-slate-400' : ''}>Specific Goal</span>
              </label>
            </div>
            {saveType === 'goal' && (
              <select
                className="flat-input bg-slate-50 mt-2"
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
              >
                <option value="" disabled>Select a goal...</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.goalName} (Target: ₹{g.targetAmount})</option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || (saveType === 'goal' && !selectedGoalId)}
            className="flat-btn flat-btn-success w-full py-3 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} /> Confirm & Log Entry
              </span>
            )}
          </button>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, PlusCircle, TrendingUp, Trash2 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const GoalCard = ({ goal, onDelete }) => {
  const saved = Number(goal.currentAmount || goal.savedAmount || 0);
  const target = Number(goal.targetAmount || goal.target_amount || 0);

  let percentage = target > 0 ? ((saved / target) * 100).toFixed(1) : 0;
  if (isNaN(percentage)) percentage = 0;
  // Ensure it doesn't exceed 100 visually for progress bar
  const visualPercentage = Math.min(Number(percentage), 100);

  let remaining = target - saved;
  if (isNaN(remaining) || remaining < 0) remaining = 0;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{goal.goalName}</h3>
        <div className="flex items-center gap-3">
          <span className="text-green-600 font-bold">{percentage}%</span>
          <button 
            onClick={() => onDelete(goal.id)} 
            className="text-red-400 hover:text-red-600 transition-colors p-1"
            title="Delete Goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div 
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${visualPercentage}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Saved: ₹{saved}</span>
        <span>Target: ₹{target}</span>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-orange-500">
          Remaining: ₹{remaining}
        </span>
        <span className="text-gray-400">
          Deadline: {goal.deadline}
        </span>
      </div>

      {/* Status Badge */}
      {percentage >= 100 ? (
        <div className="mt-2 text-center bg-green-100 text-green-700 rounded-lg py-1">
          🎉 Goal Achieved!
        </div>
      ) : (
        <div className="mt-2 text-center bg-blue-50 text-blue-600 rounded-lg py-1 text-sm">
          Keep going! ₹{remaining} more to reach your goal
        </div>
      )}
    </div>
  );
};

export default function Goals() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/${currentUser.uid}`
      );
      const data = await response.json();
      setGoals(data.goals || []);
    } catch (err) {
      console.error('Fetch goals error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!goalName || !targetAmount || !deadline) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUser.uid,
            goalName,
            targetAmount: Number(targetAmount),
            currentAmount: 0,
            deadline
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Goal created successfully! 🎯');
        setGoalName('');
        setTargetAmount('');
        setDeadline('');
        fetchGoals();
        setShowForm(false);
      } else {
        setError('Failed to create goal. Try again.');
      }
    } catch (err) {
      console.error('Goal save error:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "goals", goalId));
      // Remove goal from state instantly to update UI
      setGoals(goals.filter(g => g.id !== goalId));
    } catch (err) {
      console.error("Delete goal error:", err);
      alert("Failed to delete goal. Try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Target size={24} className="text-primary" /> Financial Goals
          </h1>
          <p className="text-sm text-slate-500">Set targets and track your saving progress</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flat-btn flex items-center gap-2"
        >
          <PlusCircle size={16} /> {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showForm && (
        <div className="flat-card bg-slate-50">
          <h2 className="font-bold text-slate-700 mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Goal Name</label>
              <input
                type="text"
                required
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="flat-input bg-white"
                placeholder="e.g. Emergency Fund, New Laptop"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="flat-input bg-white"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deadline</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="flat-input bg-white"
                />
              </div>
            </div>
            {error && <div className="alert-danger text-sm">{error}</div>}
            <button type="submit" disabled={submitting} className="flat-btn">
              {submitting ? 'Creating...' : 'Create Goal'}
            </button>
          </form>
        </div>
      )}

      {success && <div className="alert-success text-sm">{success}</div>}

      <div>
        <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <TrendingUp size={16} /> Your Goals
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center p-8 flat-card">
            <Target size={48} className="mx-auto mb-3 opacity-20 text-slate-400" />
            <p className="text-slate-500 text-lg font-bold">No active goals</p>
            <p className="text-slate-400 text-sm mt-1">
              Click "New Goal" to set your first financial target
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

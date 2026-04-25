import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Receipt, Calendar, CreditCard, PlusCircle, Trash2 } from 'lucide-react';

const EMPTY_FORM = { loan_name: '', amount: '', emi: '', due_date: '' };

function LoanCard({ loan }) {
  const principal = Number(loan.total_amount || loan.amount || loan.principal || loan.totalAmount || 0);
  const emi = Number(loan.emi_amount || loan.emi || loan.monthlyEmi || loan.monthlyEMI || 0);
  const dueDay = Number(loan.emi_due_day || loan.due_date || loan.dueDay || 0);
  const remaining = Number(loan.remaining_months || loan.remainingMonths || 0);

  const today = new Date().getDate();
  const isDueToday = dueDay === today;

  return (
    <div className={`flat-card flex flex-col gap-3 ${isDueToday ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-slate-200'}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-slate-800">{loan.loan_name}</h3>
          {isDueToday && (
            <span className="inline-block mt-1 text-xs font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              EMI Due Today
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">LOAN</span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase mb-0.5">Principal</p>
          <p className="font-bold text-slate-700">₹{principal.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase mb-0.5">Monthly EMI</p>
          <p className="font-bold text-red-600">₹{emi.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase mb-0.5">Due Date</p>
          <p className="font-bold text-slate-700 flex items-center gap-1">
            <Calendar size={13} className="text-slate-400" /> {dueDay ? `${dueDay}th` : 'Not set'}
          </p>
        </div>
      </div>
      {remaining > 0 && (
        <div className="text-xs text-slate-400 font-medium">
          {remaining} months remaining
        </div>
      )}
    </div>
  );
}

export default function Loans() {
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [listError, setListError] = useState(null);

  const fetchLoans = async () => {
    try {
      setListError(null);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/loan/${currentUser.uid}`);
      const data = await res.json();
      setLoans(Array.isArray(data) ? data : (data.loans || []));
    } catch (err) {
      setListError('Failed to load loans');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/loan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid, ...formData })
      });
      if (!res.ok) throw new Error('Failed');
      setFormData(EMPTY_FORM);
      setShowForm(false);
      fetchLoans();
    } catch (e) {
      setError('Failed to save loan. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard size={24} className="text-primary" /> Loan Manager
          </h1>
          <p className="text-sm text-slate-500">Track your active loans and EMIs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flat-btn flex items-center gap-2"
        >
          <PlusCircle size={16} /> {showForm ? 'Cancel' : 'Add Loan'}
        </button>
      </div>

      {/* Add Loan Form */}
      {showForm && (
        <div className="flat-card bg-slate-50">
          <h2 className="font-bold text-slate-700 mb-4">New Loan Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Loan Name</label>
              <input
                type="text"
                required
                value={formData.loan_name}
                onChange={(e) => setFormData({ ...formData, loan_name: e.target.value })}
                className="flat-input bg-white"
                placeholder="e.g. Bike Loan, Personal Loan"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="flat-input bg-white"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Monthly EMI (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.emi}
                  onChange={(e) => setFormData({ ...formData, emi: e.target.value })}
                  className="flat-input bg-white"
                  placeholder="2500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">EMI Due Date</label>
                <select
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="flat-input bg-white"
                >
                  <option value="">Select Day</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
            {error && <div className="alert-danger text-sm">{error}</div>}
            <button type="submit" disabled={submitting} className="flat-btn">
              {submitting ? 'Adding...' : 'Add Loan'}
            </button>
            {submitting ? (
              <div className="flex justify-center mt-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : null}
          </form>
        </div>
      )}

      {/* Loan List */}
      <div>
        <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Receipt size={16} /> Active Loans ({loans.length})
        </h2>
        {(() => {
          if (listError) {
            return (
              <div className="text-red-500 text-center p-4">{listError}</div>
            );
          }
          if (loans.length === 0) {
            return (
              <div className="text-center p-8">
                <p className="text-gray-500 text-lg">No active loans</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add your first loan above
                </p>
              </div>
            );
          }
          return (
            <div className="space-y-4">
              {loans.map(loan => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          );
        })()}
      </div>

    </div>
  );
}

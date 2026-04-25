import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BarChart2, TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="flat-card !p-3 !rounded-lg text-sm shadow-md">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-green-600 font-bold">₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { currentUser } = useAuth();
  const [allData, setAllData]       = useState([]);
  const [timeframe, setTimeframe]   = useState('1week');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [summary, setSummary]       = useState({ totalSaved: 0, dailyAvg: 0, bestDay: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, [currentUser]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/analytics/${currentUser.uid}`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }

      const json = await res.json();

      // Normalize chartData — ensure date is MM-DD for display
      const formatted = (json.chartData || []).map(r => ({
        ...r,
        date:  String(r.date || '').substring(5, 10),   // "2026-04-25" → "04-25"
        saved: Number(r.saved) || 0,
      }));

      setAllData(formatted);
      setSummary({
        totalSaved: json.totalSaved || 0,
        dailyAvg:   json.dailyAvg   || 0,
        bestDay:    json.bestDay?.amount || json.bestDay || 0,
      });
    } catch (e) {
      console.error('Analytics fetch error:', e);
      setError(e.message || 'Failed to load analytics. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = timeframe === '1week' ? allData.slice(-7) : allData.slice(-30);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <div className="bg-blue-100 p-4 rounded-2xl mb-2">
          <BarChart2 size={40} className="text-primary animate-pulse" />
        </div>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="mt-4">
          <h2 className="text-xl font-bold text-slate-800">Setting up your dashboard...</h2>
          <p className="text-slate-500 text-sm mt-1">This may take a few seconds on first load</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 size={24} className="text-primary" /> Analytics
          </h1>
          <p className="text-slate-500 text-sm">Your savings trend over time</p>
        </div>
        <div className="flex gap-2 bg-white border-2 border-slate-200 rounded-lg p-1">
          {['1week', '1month'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                timeframe === t ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t === '1week' ? '1 Week' : '1 Month'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert-danger text-sm">{error}</div>}

      {/* Summary mini-stats — always from full dataset */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Saved',  value: `₹${summary.totalSaved.toLocaleString('en-IN')}` },
          { label: 'Daily Avg',    value: `₹${summary.dailyAvg}` },
          { label: 'Best Day',     value: `₹${summary.bestDay}` },
        ].map(s => (
          <div key={s.label} className="flat-card text-center !py-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{s.label}</p>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flat-card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={18} className="text-green-500" />
          <h2 className="font-bold text-slate-700 text-sm">
            Daily Savings Trend ({timeframe === '1week' ? 'Last 7 Days' : 'Last 30 Days'})
          </h2>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BarChart2 size={48} className="mx-auto mb-3 opacity-25" />
            <p className="font-medium">No savings data yet</p>
            <p className="text-sm mt-1">Log your first daily saving to see the chart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={8} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${v}`} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="saved"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#greenGrad)"
                dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#16a34a' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}

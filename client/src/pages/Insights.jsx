import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Insights() {
  const { currentUser } = useAuth();
  const [data, setData] = useState({ weeklySavings: 0, streak: 0, savingsList: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`http://localhost:5000/insights/${currentUser.uid}`);
        if(response.ok) {
          const resData = await response.json();
          setData(resData);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadData();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black mb-6 tracking-tight">Financial Insights</h2>
      
      {loading ? (
        <p className="text-slate-400 font-bold">Loading Insights...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-flat p-6">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-2">Weekly Savings</p>
            <p className="text-4xl font-black text-[#4ade80]">₹{data.weeklySavings}</p>
          </div>
          
          <div className="card-flat p-6">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-2">Saving Consistency</p>
            <p className="text-4xl font-black">{data.streak} <span className="text-xl text-slate-500 font-semibold">Streak</span></p>
          </div>
          
          <div className="card-flat p-6 md:col-span-2">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-6">Recent Savings Logs</p>
            {data.savingsList.length === 0 ? (
              <div className="bg-[#152943] border border-[#3b618f] p-4 text-center text-slate-500 font-bold">
                No savings logged yet.
              </div>
            ) : (
              <div className="space-y-2">
                {data.savingsList.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#152943] border border-[#3b618f] p-4">
                    <span className="font-bold text-slate-300">{s.date}</span>
                    <span className="font-black text-[#4ade80]">₹{s.saving}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

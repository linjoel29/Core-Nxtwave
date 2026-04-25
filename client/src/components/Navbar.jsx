import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PiggyBank, LayoutDashboard, PlusCircle, BarChart2, CreditCard, LogOut, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/daily', label: 'Daily', icon: <PlusCircle size={18} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
    { path: '/loans', label: 'Loans', icon: <CreditCard size={18} /> },
    { path: '/goals', label: 'Goals', icon: <Target size={18} /> },
  ];

  return (
    <nav className="bg-white border-b-2 border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-3 gap-3">
        <Link to="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <PiggyBank size={26} className="text-primary" />
          <span className="text-xl font-bold tracking-tight text-slate-800">Gigsaver</span>
        </Link>

        <div className="flex flex-wrap justify-center items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}

          <div className="w-px h-6 bg-slate-200 hidden md:block mx-1"></div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-md transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

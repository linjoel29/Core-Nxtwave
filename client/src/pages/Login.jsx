import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PiggyBank, Loader2, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to ' + (isLogin ? 'log in' : 'create account') + '. ' + err.message);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-in failed. ' + err.message);
    }
    setLoading(false);
  }

  const features = [
    { icon: <TrendingUp size={18} />, text: 'AI-powered saving suggestions' },
    { icon: <Shield size={18} />, text: 'Track streaks & earn badges' },
    { icon: <Zap size={18} />, text: 'Smart loan payment reminders' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center px-16 text-white">
        <div className="flex items-center gap-3 mb-10">
          <PiggyBank size={40} className="text-green-400" />
          <span className="text-4xl font-bold tracking-tight">SmartSave</span>
        </div>
        <h1 className="text-3xl font-bold leading-snug mb-4">
          Your Daily Savings<br />Made Smarter
        </h1>
        <p className="text-blue-200 mb-10 text-base">
          Save micro-amounts daily, track your streaks, earn badges, and stay on top of your loans — all in one place.
        </p>
        <ul className="space-y-4">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-blue-100 font-medium">
              <span className="p-2 bg-white/10 rounded-md text-green-400">{f.icon}</span>
              {f.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <PiggyBank size={28} className="text-primary" />
            <span className="text-2xl font-bold text-slate-800">SmartSave</span>
          </div>

          <div className="flat-card">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {isLogin ? 'Sign in to your SmartSave account' : 'Start your savings journey today'}
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition mb-5 cursor-pointer"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t-2 border-slate-100" />
              <span className="text-xs text-slate-400 font-semibold">OR</span>
              <div className="flex-1 border-t-2 border-slate-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flat-input"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flat-input"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="alert-danger text-sm">{error}</div>
              )}

              <button type="submit" disabled={loading} className="flat-btn w-full mt-2 py-3">
                {loading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="mt-5 text-sm text-slate-500 hover:text-primary transition text-center w-full cursor-pointer"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="font-semibold text-primary">{isLogin ? 'Sign up' : 'Sign in'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, Activity, Moon, Sun, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

// New Organization Logo — Large for Login
const OrgIconLarge = () => (
  <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="40" width="25" height="40" rx="4" fill="#10b981" />
    <rect x="50" y="20" width="30" height="60" rx="4" fill="#3b82f6" />
    <circle cx="32.5" cy="25" r="8" fill="#f59e0b" />
    <rect x="60" y="35" width="10" height="5" rx="2" fill="white" />
    <rect x="60" y="50" width="10" height="5" rx="2" fill="white" />
    <rect x="60" y="65" width="10" height="5" rx="2" fill="white" />
    <rect x="27.5" y="55" width="10" height="5" rx="2" fill="white" />
    <rect x="27.5" y="65" width="10" height="5" rx="2" fill="white" />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isDarkMode, toggleTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'test' && password === 'test') {
        onLogin(username);
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-[#001e38]'}`}>

      {/* Theme Toggle */}
      {toggleTheme && (
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 backdrop-blur-md"
        >
          <div className="theme-icon-enter" key={isDarkMode ? 'dark' : 'light'}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </div>
        </button>
      )}

      {/* Animated Gradient Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px] animate-float-delayed" />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] animate-float-slow" />
        <div className="absolute bottom-[10%] left-[15%] w-[250px] h-[250px] rounded-full bg-violet-500/10 blur-[80px] animate-float-delayed" />
      </div>

      {/* Gradient Mesh Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-indigo-900/20 pointer-events-none" style={{ backgroundSize: '400% 400%', animation: 'gradientShift 8s ease-in-out infinite' }} />

      {/* Main Premium Glass Card */}
      <div className="relative z-10 w-full max-w-md p-10 m-4 glass-card-premium rounded-3xl animate-bounce-in">

        <div className="relative z-20 flex flex-col items-center text-center">

          {/* Logo with Glow */}
          <div className="mb-8 relative group">
            {/* Glow ring behind logo */}
            <div className="absolute inset-0 bg-blue-400/30 rounded-2xl blur-xl animate-glow-pulse scale-110" />
            <div className="relative p-5 bg-white/90 rounded-2xl shadow-2xl shadow-blue-500/20 group-hover:shadow-blue-400/40 transition-shadow duration-500">
              <OrgIconLarge />
            </div>
            {/* Shimmer BETA badge */}
            <div className="absolute -bottom-3 -right-3 shimmer-badge text-[#002f56] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <ShieldCheck size={10} />
              BETA
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-2 animate-fade-in">
            [Organization <span className="text-blue-400">Name]</span>
          </h1>
          <div className="text-slate-300 text-sm mb-8 font-medium flex items-center justify-center gap-2 opacity-90 animate-fade-in">
            <span className="uppercase tracking-widest font-bold text-[10px]">People Analytics</span>
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            <span>HR Intelligence Portal</span>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Username Input */}
            <div className="group relative animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-blue-400/50'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:bg-white/10 font-medium backdrop-blur-sm`}
              />
            </div>

            {/* Password Input */}
            <div className="group relative animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-blue-400/50'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:bg-white/10 font-medium backdrop-blur-sm`}
              />
            </div>

            {/* Error Message */}
            <div className={`h-6 text-red-400 text-xs font-bold transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
              Invalid credentials provided.
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-2 mb-2">
              <button type="button" className="text-xs text-blue-300/70 hover:text-blue-300 transition-colors flex items-center gap-1">
                <KeyRound size={10} />
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed animate-slide-up"
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            <Activity size={12} />
            <span>Authorized Personnel Only</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-slate-400 text-xs font-medium opacity-60">
        © 2026 [Organization Name] HRAP
      </div>
    </div>
  );
};
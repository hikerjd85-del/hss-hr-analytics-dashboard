import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, Activity, Moon, Sun } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

// Precise Interlocking HSS Logo Large
const HSSIconLarge = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="loginLogoClip">
        <circle cx="50" cy="50" r="50" />
      </clipPath>
    </defs>
    <g clipPath="url(#loginLogoClip)">
      <g strokeWidth={10} fill="none" strokeLinecap="butt">
        {/* Top Green Part */}
        <g stroke="#78be20" transform="translate(0, -1.5)">
          <path d="M 43 50 A 7 7 0 0 1 50 43 L 100 43" />
          <path d="M 31 50 A 19 19 0 0 1 50 31 L 100 31" />
          <path d="M 19 50 A 31 31 0 0 1 50 19 L 100 19" />
          <path d="M 7 50 A 43 43 0 0 1 50 7 L 100 7" />
        </g>
        {/* Bottom Blue Part */}
        <g stroke="#002f56" transform="translate(0, 1.5)">
          <path d="M 57 50 A 7 7 0 0 1 50 57 L 0 57" />
          <path d="M 69 50 A 19 19 0 0 1 50 69 L 0 69" />
          <path d="M 81 50 A 31 31 0 0 1 50 81 L 0 81" />
          <path d="M 93 50 A 43 43 0 0 1 50 93 L 0 93" />
        </g>
      </g>
    </g>
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
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-[#002f56]'}`}>
      {/* Theme Toggle for Login */}
      {toggleTheme && (
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 backdrop-blur-md"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}

      {/* Clean Background */}

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 m-4 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">

        <div className="relative z-20 flex flex-col items-center text-center">

          {/* Logo Animation */}
          <div className="mb-6 relative group">
            <div className="p-4 bg-white/90 rounded-2xl shadow-xl">
              <HSSIconLarge />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#78be20] text-[#002f56] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#002f56] flex items-center gap-1 shadow-sm">
              <ShieldCheck size={10} />
              BETA
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Health <span className="text-[#78be20]">Shared Services</span>
          </h1>
          <div className="text-slate-300 text-sm mb-8 font-medium flex items-center justify-center gap-2 opacity-90">
            <span className="uppercase tracking-widest font-bold text-[10px]">People Analytics</span>
            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
            <span>HR Intelligence Portal</span>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Username Input */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#78be20] transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full bg-[#001e38]/60 border ${error ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-[#78be20]/50'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:bg-[#001e38]/80 font-medium`}
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#78be20] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#001e38]/60 border ${error ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-[#78be20]/50'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:bg-[#001e38]/80 font-medium`}
              />
            </div>

            {/* Error Message */}
            <div className={`h-6 text-red-400 text-xs font-bold transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
              Invalid credentials provided.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#78be20] to-[#5a9615] hover:from-[#89d624] hover:to-[#6bb319] text-[#002f56] font-bold py-4 rounded-xl shadow-lg shadow-[#78be20]/20 transform transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#002f56]/30 border-t-[#002f56] rounded-full animate-spin"></div>
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
        © 2026 Health Shared Services HRAP
      </div>
    </div>
  );
};
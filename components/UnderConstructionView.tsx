import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';

interface UnderConstructionViewProps {
  onBack: () => void;
  title: string;
}

export const UnderConstructionView: React.FC<UnderConstructionViewProps> = ({ onBack, title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 blur-xl rounded-full"></div>
        <div className="relative bg-white dark:bg-slate-800 p-8 rounded-full shadow-xl border border-slate-100 dark:border-slate-700">
          <Construction size={64} className="text-[#002f56] dark:text-blue-400" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-4xl font-extrabold text-[#002f56] dark:text-white mb-4 tracking-tight">
        {title}
      </h2>
      
      <div className="w-16 h-1.5 bg-[#78be20] rounded-full mb-6"></div>
      
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
        We're currently building this page to provide you with better compliance and support resources. Please check back soon.
      </p>
      
      <button 
        onClick={onBack}
        className="flex items-center gap-2 px-8 py-3 bg-[#002f56] hover:bg-[#003f73] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1"
      >
        <ArrowLeft size={20} />
        Return to Dashboard
      </button>
    </div>
  );
};
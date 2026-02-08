import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, LayoutGrid, PieChart, FileText, Search, Calendar } from 'lucide-react';

interface OnboardingTourProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
}

const TOUR_STEPS = [
    {
        title: 'Welcome to HSS People Analytics',
        description: 'Your centralized hub for workforce intelligence and HR metrics. Let\'s take a quick tour of the key features.',
        icon: Sparkles,
        highlight: 'header'
    },
    {
        title: 'Overview Dashboard',
        description: 'The Overview tab displays all key HR metrics organized by category. Click any tile to drill down into detailed analytics.',
        icon: LayoutGrid,
        highlight: 'overview'
    },
    {
        title: 'Executive View',
        description: 'Switch to Executive View for AI-powered briefings and comprehensive written reports designed for leadership presentations.',
        icon: PieChart,
        highlight: 'executive'
    },
    {
        title: 'Report Builder',
        description: 'Create customized reports by selecting specific modules. Export to PDF or Word for offline access and distribution.',
        icon: FileText,
        highlight: 'reports'
    },
    {
        title: 'Smart Search & Filters',
        description: 'Use the search bar to quickly find metrics, and the date range picker to filter data across all views.',
        icon: Search,
        highlight: 'search'
    }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, isDarkMode }) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const step = TOUR_STEPS[currentStep];
    const Icon = step.icon;
    const isLastStep = currentStep === TOUR_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) {
            onClose();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirstStep) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />

            {/* Modal */}
            <div className={`
        relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden
        ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}
      `}>
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#002f56] to-[#004f71] p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Icon size={24} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                                Step {currentStep + 1} of {TOUR_STEPS.length}
                            </span>
                        </div>
                        <button onClick={handleSkip} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className={`text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {step.description}
                    </p>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 my-6">
                        {TOUR_STEPS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`
                  w-2 h-2 rounded-full transition-all
                  ${i === currentStep
                                        ? 'w-6 bg-[#78be20]'
                                        : (isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300')
                                    }
                `}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className={`
          flex items-center justify-between px-6 py-4 border-t
          ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}
        `}>
                    <button
                        onClick={handlePrev}
                        disabled={isFirstStep}
                        className={`
              flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${isFirstStep
                                ? 'text-slate-300 cursor-not-allowed'
                                : (isDarkMode ? 'text-white hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100')
                            }
            `}
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSkip}
                            className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}
              `}
                        >
                            Skip Tour
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-1 px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-[#78be20] to-[#5a9615] text-white hover:from-[#89d624] hover:to-[#6bb319] transition-colors"
                        >
                            {isLastStep ? 'Get Started' : 'Next'}
                            {!isLastStep && <ChevronRight size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * ============================================================
 * SECTION GUIDE — Reusable collapsible guide panel
 * ============================================================
 * A consistent, beautifully designed in-app guide component
 * for leaders. Content is passed via props so each section
 * can define its own guide content. Collapsible to save space.
 * ============================================================
 */
import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────
export interface GuideStep {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideProTip {
  text: string;
}

export interface SectionGuideProps {
  title: string;
  subtitle: string;
  purpose: string;
  steps: GuideStep[];
  keyMetrics?: { label: string; explanation: string }[];
  faqs?: GuideFaq[];
  proTips?: GuideProTip[];
  accentColor: string; // tailwind gradient class e.g. "from-violet-500 to-indigo-600"
  accentBg: string; // tailwind bg class for light accents
}

// ─── Component ──────────────────────────────────────────────
export const SectionGuide: React.FC<SectionGuideProps> = ({
  title,
  subtitle,
  purpose,
  steps,
  keyMetrics,
  faqs,
  proTips,
  accentColor,
  accentBg,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className={`mb-6 rounded-2xl border overflow-hidden transition-all duration-300 ${
      isOpen
        ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md'
        : 'bg-gradient-to-r ' + accentBg + ' border-slate-200/60 dark:border-slate-700/50 shadow-sm'
    }`}>
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all hover:opacity-90 ${
          isOpen ? '' : 'hover:bg-white/10'
        }`}
      >
        <div className={`p-2 rounded-lg bg-gradient-to-br ${accentColor} shrink-0`}>
          <BookOpen size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-bold ${isOpen ? 'text-slate-800 dark:text-white' : 'text-slate-700 dark:text-white'}`}>
              📘 How to Use: {title}
            </p>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isOpen ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400' : 'bg-white/20 text-white dark:text-white/80'
            }`}>
              Guide
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isOpen ? 'text-slate-400' : 'text-slate-500 dark:text-slate-300'}`}>
            {subtitle}
          </p>
        </div>
        <div className={`shrink-0 ${isOpen ? 'text-slate-400' : 'text-slate-500 dark:text-white/60'}`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded Guide Content */}
      {isOpen && (
        <div className="px-5 pb-6 pt-1 space-y-6 animate-slide-up">

          {/* Purpose Section */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What This Section Does</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{purpose}</p>
          </div>

          {/* Step-by-Step Guide */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ArrowRight size={12} /> How to Use — Step by Step
            </h4>
            <div className="space-y-3">
              {steps.map((step, i) => {
                const StepIcon = step.icon || CheckCircle2;
                return (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className={`shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${accentColor} flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:scale-110 transition-transform`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-bold text-slate-700 dark:text-white mb-0.5">{step.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Metrics Explained */}
          {keyMetrics && keyMetrics.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb size={12} /> Key Metrics Explained
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {keyMetrics.map((metric, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-3 border border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs font-bold text-slate-700 dark:text-white mb-0.5">{metric.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{metric.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pro Tips */}
          {proTips && proTips.length > 0 && (
            <div className={`rounded-xl p-4 border bg-gradient-to-r ${accentBg} border-slate-200/40 dark:border-slate-700/30`}>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                💡 Pro Tips for Leaders
              </h4>
              <ul className="space-y-1.5">
                {proTips.map((tip, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                    {tip.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs */}
          {faqs && faqs.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle size={12} /> Frequently Asked Questions
              </h4>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-100 dark:border-slate-700/50 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-white flex-1">{faq.question}</span>
                      <span className="text-slate-400 shrink-0">
                        {expandedFaq === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-3 pt-0">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

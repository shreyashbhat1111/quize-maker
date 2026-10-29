import React from 'react';
import { ArrowRight, Play, CheckCircle, ShieldCheck, Zap, FileText } from 'lucide-react';
import { InteractiveQuizPreview } from './InteractiveQuizPreview';

interface HeroProps {
  onStartQuiz: () => void;
  onTryDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartQuiz, onTryDemo }) => {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 lg:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
      {/* Subtle background ambient gradients */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/20 via-violet-200/20 to-sky-100/30 blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Clean unboxed kicker */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold tracking-wider text-indigo-700 uppercase">
              <span>Next-Gen Assessment Engine</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] text-balance">
              Turn Any Study Material Into Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600">A+.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Upload your notes, PDFs, slides or documents. Let AI create a personalized quiz in seconds. Practice with instant explanations or simulate strict exam conditions.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartQuiz}
                className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200/80 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                <span>Create My Quiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onTryDemo}
                className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-slate-700 text-slate-700" />
                <span>Try a Demo</span>
              </button>
            </div>

            {/* Quantitative Proof & Key Guarantees */}
            <div className="pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Zero Hallucinations Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>PDF, DOCX, Slides & Photos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span>Zero Data Retention</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quiz Preview Card */}
          <div className="lg:col-span-5 w-full max-w-lg mx-auto lg:max-w-none">
            <InteractiveQuizPreview />
          </div>
        </div>

        {/* Visual Hero Showcase Banner */}
        <div className="mt-14 sm:mt-20 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-100 overflow-hidden relative">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Quizora Workspace · Multimodal Study Engine</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Fast Gemini 3.8 Pipeline
              </span>
              <span>·</span>
              <span>Desktop & Mobile Optimized</span>
            </div>
          </div>

          <div className="relative aspect-[16/9] max-h-[460px] w-full overflow-hidden bg-slate-100">
            <img
              src="/src/assets/images/hero_quiz_study_hub_1793287668013.jpg"
              alt="Quizora AI modern study workspace interface displaying questions, flashcards, and conceptual progress"
              className="w-full h-full object-cover object-top"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Graceful fallback if image is unreachable
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

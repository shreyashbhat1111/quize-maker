import React from 'react';
import { Sparkles, BookOpen, Layers, HelpCircle, Play } from 'lucide-react';

interface NavbarProps {
  onStartQuiz: () => void;
  onTryDemo: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartQuiz, onTryDemo, onScrollTo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Quizora<span className="text-indigo-600 font-extrabold">.AI</span>
          </span>
        </button>

        {/* Zone 2: 4 Clean Single-Line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onScrollTo('how-it-works')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            How It Works
          </button>
          <button
            onClick={() => onScrollTo('features')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-slate-400" />
            Features
          </button>
          <button
            onClick={onTryDemo}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-indigo-600 font-semibold"
          >
            <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
            Try Demo
          </button>
          <button
            onClick={() => onScrollTo('faq')}
            className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            FAQ
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartQuiz}
            className="px-4 sm:px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-200 transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            Create My Quiz
          </button>
        </div>
      </div>
    </header>
  );
};

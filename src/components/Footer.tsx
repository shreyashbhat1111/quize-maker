import React from 'react';
import { Sparkles, Shield, Github } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onTryDemo: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onTryDemo, onScrollTo }) => {
  return (
    <footer className="bg-white border-t border-slate-200/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Quizora<span className="text-indigo-600">.AI</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <button onClick={() => onScrollTo('how-it-works')} className="hover:text-slate-900 transition-colors">
              How It Works
            </button>
            <button onClick={() => onScrollTo('features')} className="hover:text-slate-900 transition-colors">
              Features
            </button>
            <button onClick={onTryDemo} className="hover:text-indigo-600 transition-colors font-semibold text-indigo-600">
              Try Demo Quiz
            </button>
            <button onClick={() => onScrollTo('faq')} className="hover:text-slate-900 transition-colors">
              FAQ
            </button>
            <button onClick={onOpenPrivacy} className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Privacy Notice
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Quizora AI. Powered by Google Gemini 3.8 Flash.</p>
          <div className="flex items-center gap-3">
            <span>Built for academic excellence</span>
            <span>·</span>
            <span>Vercel & GitHub Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

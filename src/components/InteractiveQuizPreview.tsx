import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';

interface PreviewQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceContext: string;
}

const PREVIEW_QUESTIONS: PreviewQuestion[] = [
  {
    question: 'How do Mitochondria generate ATP during cellular respiration?',
    options: [
      'By pumping protons across the inner mitochondrial membrane via the electron transport chain',
      'By directly breaking down peptide bonds into amino acid chains in the Golgi apparatus',
      'By absorbing ambient solar photons through chlorophyll-rich stroma thylakoids',
      'By fermenting lactic acid anaerobically within the outer cytoplasm fluid'
    ],
    correctIndex: 0,
    explanation: 'Chemiosmosis in the electron transport chain establishes a proton gradient across the inner membrane, which powers ATP synthase to generate ATP.',
    sourceContext: 'Campbell Biology (11th Ed.), Chapter 9: Cellular Respiration & Fermentation.'
  },
  {
    question: 'What is the primary trade-off of using a B-Tree instead of a Hash Table for database indexing?',
    options: [
      'B-Trees efficiently support range queries and sorted scans at O(log n) cost, whereas Hash Tables only support point lookups',
      'B-Trees require zero memory allocation on disk pages compared to hash buckets',
      'B-Trees guarantee strictly O(1) worst-case time complexity for single item lookups',
      'B-Trees can only index alphanumeric text strings, whereas Hash Tables handle binary objects'
    ],
    correctIndex: 0,
    explanation: 'Hash tables offer O(1) point lookups but cannot perform range scans (e.g. "BETWEEN 100 AND 200"). B-Trees maintain sorted key order, making range queries efficient.',
    sourceContext: 'Database Internals: A Deep Dive into How Distributed Data Systems Work, Chapter 2.'
  }
];

export const InteractiveQuizPreview: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const q = PREVIEW_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isRevealed) return;
    setSelectedOption(idx);
    setIsRevealed(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsRevealed(false);
    setCurrentIdx((prev) => (prev + 1) % PREVIEW_QUESTIONS.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsRevealed(false);
  };

  const isCorrect = selectedOption === q.correctIndex;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-100/80 p-5 sm:p-7 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-indigo-600 font-semibold">Interactive Live Preview</span>
          <span aria-hidden="true">·</span>
          <span>Question {currentIdx + 1} of {PREVIEW_QUESTIONS.length}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-600">Practice Mode</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          title="Reset this question"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Question */}
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-5">
        {q.question}
      </h3>

      {/* Options List */}
      <div className="space-y-2.5 mb-6">
        {q.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedOption === idx;
          const isCorrectOption = idx === q.correctIndex;

          let btnClass = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-800';

          if (isRevealed) {
            if (isCorrectOption) {
              btnClass = 'border-emerald-500 bg-emerald-50/60 text-emerald-900 ring-1 ring-emerald-400';
            } else if (isSelected) {
              btnClass = 'border-rose-400 bg-rose-50/60 text-rose-900 ring-1 ring-rose-300';
            } else {
              btnClass = 'border-slate-200/60 bg-slate-50/50 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isRevealed}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3.5 group cursor-pointer disabled:cursor-default ${btnClass}`}
            >
              <span
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isRevealed && isCorrectOption
                    ? 'bg-emerald-600 text-white'
                    : isRevealed && isSelected
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-800'
                }`}
              >
                {letter}
              </span>
              <span className="text-sm leading-relaxed flex-1 font-normal">
                {option}
              </span>
              {isRevealed && isCorrectOption && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {isRevealed && isSelected && !isCorrectOption && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal Explanation Card */}
      {isRevealed && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-2 mb-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 font-semibold text-xs">
            <Lightbulb className={`w-4 h-4 ${isCorrect ? 'text-emerald-600' : 'text-amber-500'}`} />
            <span className={isCorrect ? 'text-emerald-700' : 'text-slate-800'}>
              {isCorrect ? 'Correct! Strong understanding' : 'Incorrect. Key takeaway:'}
            </span>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            {q.explanation}
          </p>
          <div className="pt-2 text-xs text-slate-500 border-t border-slate-200/60 flex items-center gap-1.5">
            <span className="font-medium text-slate-600">Source passage reference:</span>
            <span className="italic">{q.sourceContext}</span>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">
          {isRevealed ? 'Instant educational feedback active' : 'Select an option to test active recall'}
        </span>
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <span>Next preview sample</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Clock, Shuffle, AlertCircle, Check, Loader2, CheckSquare } from 'lucide-react';
import { Difficulty, Language, QuestionType, QuizConfig, QuizMode } from '../types/quiz';

interface QuizConfigPanelProps {
  config: QuizConfig;
  onConfigChange: (newConfig: QuizConfig) => void;
  onGenerateQuiz: () => void;
  isLoading: boolean;
  loadingStep: string;
  errorMessage: string | null;
  onClearError: () => void;
  onTryDemo: () => void;
}

export const QuizConfigPanel: React.FC<QuizConfigPanelProps> = ({
  config,
  onConfigChange,
  onGenerateQuiz,
  isLoading,
  loadingStep,
  errorMessage,
  onClearError,
  onTryDemo,
}) => {
  const [isCustomCount, setIsCustomCount] = useState(false);

  const countPresets = [5, 10, 15, 20, 30];

  const questionTypeOptions: Array<{ id: QuestionType; label: string; desc: string }> = [
    { id: 'mcq', label: 'Single Choice (MCQ)', desc: 'Standard 4-option questions with one answer' },
    { id: 'multi_select', label: 'Multiple Select', desc: 'Select all correct answers that apply' },
    { id: 'true_false', label: 'True / False', desc: 'Binary verification of key statements' },
    { id: 'fill_in_blank', label: 'Fill in the Blanks', desc: 'Sentence completion with word bank' },
  ];

  const handleToggleQuestionType = (type: QuestionType) => {
    let updated: QuestionType[];
    if (config.questionTypes.includes(type)) {
      if (config.questionTypes.length === 1) return; // Keep at least one
      updated = config.questionTypes.filter((t) => t !== type);
    } else {
      updated = [...config.questionTypes, type];
    }
    onConfigChange({ ...config, questionTypes: updated });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-7">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Quiz Settings & Configuration</h3>
        <p className="text-xs text-slate-500">Fine-tune evaluation depth, mode, timer, and language</p>
      </div>

      {/* 1. Question Count */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Number of Questions
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {countPresets.map((count) => {
            const isSelected = !isCustomCount && config.questionCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setIsCustomCount(false);
                  onConfigChange({ ...config, questionCount: count });
                }}
                disabled={isLoading}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
                }`}
              >
                {count} Questions
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsCustomCount(true)}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isCustomCount
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
            }`}
          >
            Custom
          </button>
        </div>

        {isCustomCount && (
          <div className="mt-2.5 flex items-center gap-2 max-w-xs">
            <input
              type="number"
              min={1}
              max={40}
              value={config.questionCount}
              onChange={(e) => {
                const val = Math.max(1, Math.min(40, Number(e.target.value) || 1));
                onConfigChange({ ...config, questionCount: val });
              }}
              disabled={isLoading}
              className="w-24 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
            />
            <span className="text-xs text-slate-400">Questions (1 to 40 max)</span>
          </div>
        )}
      </div>

      {/* 2. Difficulty & Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Difficulty Target
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map((diff) => {
              const isSelected = config.difficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onConfigChange({ ...config, difficulty: diff })}
                  disabled={isLoading}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-center capitalize transition-all ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Assessment Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['practice', 'exam'] as QuizMode[]).map((mode) => {
              const isSelected = config.mode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onConfigChange({ ...config, mode })}
                  disabled={isLoading}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-center capitalize transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mode === 'practice' ? 'Practice (Instant)' : 'Strict Exam'}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            {config.mode === 'practice'
              ? 'Answers and detailed rationales are revealed instantly.'
              : 'Answers are hidden until submission, with timer enforcement.'}
          </p>
        </div>
      </div>

      {/* 3. Question Types (Multi-Selection) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Allowed Question Types
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {questionTypeOptions.map((opt) => {
            const isChecked = config.questionTypes.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleToggleQuestionType(opt.id)}
                disabled={isLoading}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-indigo-50/50 border-indigo-300 text-indigo-950'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Language & Timer Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Quiz Language
          </label>
          <select
            value={config.language}
            onChange={(e) => onConfigChange({ ...config, language: e.target.value as Language })}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="english">English (Standard)</option>
            <option value="hindi">Hindi (हिंदी)</option>
            <option value="hinglish">Hinglish (Colloquial Academic)</option>
            <option value="marathi">Marathi (मराठी)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Exam Timer
          </label>
          <select
            value={config.timeLimitMinutes}
            onChange={(e) => onConfigChange({ ...config, timeLimitMinutes: Number(e.target.value) })}
            disabled={isLoading}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value={0}>No Timer (Untimed Practice)</option>
            <option value={5}>5 Minutes (Sprint)</option>
            <option value={10}>10 Minutes (Standard)</option>
            <option value={15}>15 Minutes</option>
            <option value={20}>20 Minutes</option>
            <option value={30}>30 Minutes (Deep Test)</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes (Comprehensive)</option>
          </select>
        </div>
      </div>

      {/* 5. Toggles: Negative marking, Shuffle */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
          <input
            type="checkbox"
            checked={config.negativeMarking}
            onChange={(e) => onConfigChange({ ...config, negativeMarking: e.target.checked })}
            disabled={isLoading}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <span>Negative marking (-0.25 per wrong answer)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
          <input
            type="checkbox"
            checked={config.shuffleQuestions}
            onChange={(e) => onConfigChange({ ...config, shuffleQuestions: e.target.checked })}
            disabled={isLoading}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
          />
          <span>Shuffle question order</span>
        </label>
      </div>

      {/* 6. Custom Instructions Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Custom Teacher Instructions (Optional)
        </label>
        <input
          type="text"
          value={config.customInstructions || ''}
          onChange={(e) => onConfigChange({ ...config, customInstructions: e.target.value })}
          disabled={isLoading}
          placeholder="e.g. Focus on mechanism of action, include calculation questions, avoid trivial trivia"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2 animate-in fade-in">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
            <button
              onClick={onClearError}
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
            >
              Dismiss
            </button>
          </div>
          {errorMessage.includes('GEMINI_API_KEY') && (
            <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
              <span className="text-[11px] text-rose-700">Want to test without configuring an API key?</span>
              <button
                type="button"
                onClick={onTryDemo}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
              >
                Launch Demo Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Generate Quiz CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerateQuiz}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200/80 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{loadingStep || 'Generating Assessment with Gemini...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Quiz ({config.questionCount} Questions)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

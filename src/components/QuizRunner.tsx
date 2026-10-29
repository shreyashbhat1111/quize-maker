import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Flag,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  XCircle,
  Eye,
  Send
} from 'lucide-react';
import { QuizData, QuizQuestion } from '../types/quiz';

interface QuizRunnerProps {
  quiz: QuizData;
  onComplete: (userAnswers: Record<string, string | string[]>, timeSpentSeconds: number) => void;
  onExit: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [showPracticeFeedback, setShowPracticeFeedback] = useState<Record<string, boolean>>({});

  // Timer state
  const hasTimer = (quiz.config.timeLimitMinutes || 0) > 0;
  const initialSeconds = hasTimer ? quiz.config.timeLimitMinutes * 60 : 0;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [timeSpent, setTimeSpent] = useState(0);

  const isExamMode = quiz.config.mode === 'exam';
  const currentQuestion = quiz.questions[currentIndex];

  // Save progress locally to prevent data loss
  useEffect(() => {
    try {
      localStorage.setItem(
        `quizora_attempt_${quiz.id}`,
        JSON.stringify({
          currentIndex,
          userAnswers,
          markedForReview,
          timeSpent,
          timestamp: Date.now(),
        })
      );
    } catch {
      // Ignore localStorage quotas
    }
  }, [currentIndex, userAnswers, markedForReview, timeSpent, quiz.id]);

  // Submit action handler
  const handleSubmitQuiz = useCallback(() => {
    setIsSubmitModalOpen(false);
    onComplete(userAnswers, timeSpent);
  }, [onComplete, userAnswers, timeSpent]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);

      if (hasTimer) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Automatic submission when time expires
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hasTimer, handleSubmitQuiz]);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Answer handler for current question
  const handleSelectAnswer = (option: string) => {
    const qId = currentQuestion.id;
    if (currentQuestion.type === 'multi_select') {
      const currentSelected = Array.isArray(userAnswers[qId])
        ? (userAnswers[qId] as string[])
        : [];
      let updated: string[];
      if (currentSelected.includes(option)) {
        updated = currentSelected.filter((item) => item !== option);
      } else {
        updated = [...currentSelected, option];
      }
      setUserAnswers((prev) => ({ ...prev, [qId]: updated }));
    } else {
      // Single choice, true_false, fill_in_blank
      setUserAnswers((prev) => ({ ...prev, [qId]: option }));
      if (!isExamMode) {
        // In practice mode, enable instant feedback for this question
        setShowPracticeFeedback((prev) => ({ ...prev, [qId]: true }));
      }
    }
  };

  const handleToggleReview = () => {
    const qId = currentQuestion.id;
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' && currentIndex < quiz.questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleReview();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        if (currentQuestion.options[idx]) {
          handleSelectAnswer(currentQuestion.options[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, quiz.questions.length]);

  // Compute question statuses
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(userAnswers).filter((k) => {
    const a = userAnswers[k];
    return Array.isArray(a) ? a.length > 0 : Boolean(a);
  }).length;
  const unansweredCount = totalQuestions - answeredCount;

  const currentAnswer = userAnswers[currentQuestion.id];
  const isCurrentAnswered = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : Boolean(currentAnswer);
  const isMarked = Boolean(markedForReview[currentQuestion.id]);

  // Practice mode feedback check
  const isFeedbackRevealed = !isExamMode && Boolean(showPracticeFeedback[currentQuestion.id]);
  const isAnswerCorrectInPractice = () => {
    if (!isCurrentAnswered) return false;
    if (currentQuestion.type === 'multi_select') {
      const correctArr = Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer
        : [currentQuestion.correctAnswer];
      const userArr = (currentAnswer as string[]) || [];
      return (
        correctArr.length === userArr.length &&
        correctArr.every((item) => userArr.includes(item))
      );
    }
    return String(currentAnswer).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Controls Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Exit quiz"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              {quiz.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">{quiz.config.mode} Mode</span>
              <span>·</span>
              <span className="capitalize">{quiz.config.difficulty}</span>
              {quiz.config.negativeMarking && (
                <>
                  <span>·</span>
                  <span className="text-amber-600 font-medium">Negative Marking (-0.25)</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {hasTimer && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold tabular-nums ${
                secondsRemaining < 120
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          )}

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Quiz</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Question Display Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative">
            {/* Question Progress & Review Flag */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="text-indigo-600">Question {currentIndex + 1}</span>
                <span>of {totalQuestions}</span>
                {currentQuestion.topic && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-600">{currentQuestion.topic}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="capitalize text-slate-400">{currentQuestion.type.replace('_', ' ')}</span>
              </div>

              <button
                onClick={handleToggleReview}
                className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isMarked
                    ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
              {currentQuestion.question}
            </h3>

            {/* Multi-select hint */}
            {currentQuestion.type === 'multi_select' && (
              <div className="mb-4 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-700 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Select all options that apply to this question.</span>
              </div>
            )}

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected =
                  currentQuestion.type === 'multi_select'
                    ? Array.isArray(currentAnswer) && currentAnswer.includes(option)
                    : currentAnswer === option;

                let optClass = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-800';

                if (isSelected) {
                  optClass = 'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-1 ring-indigo-500 shadow-2xs';
                }

                // If practice feedback is shown
                if (isFeedbackRevealed) {
                  const isCorrectChoice =
                    currentQuestion.type === 'multi_select'
                      ? Array.isArray(currentQuestion.correctAnswer) &&
                        currentQuestion.correctAnswer.includes(option)
                      : String(currentQuestion.correctAnswer).trim().toLowerCase() === option.trim().toLowerCase();

                  if (isCorrectChoice) {
                    optClass = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-400';
                  } else if (isSelected) {
                    optClass = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAnswer(option)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${optClass}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed flex-1">
                      {option}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Practice Mode Instant Explanation Box */}
            {isFeedbackRevealed && (
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2 mb-6 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lightbulb
                    className={`w-4 h-4 ${
                      isAnswerCorrectInPractice() ? 'text-emerald-600' : 'text-amber-500'
                    }`}
                  />
                  <span className={isAnswerCorrectInPractice() ? 'text-emerald-700' : 'text-slate-900'}>
                    {isAnswerCorrectInPractice() ? 'Correct Answer' : 'Explanation & Source Grounding'}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{currentQuestion.explanation}</p>
                {currentQuestion.sourcePassage && (
                  <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">Source: </span>
                    <span className="italic">{currentQuestion.sourcePassage}</span>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-400 hidden sm:block">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-600 font-mono">1-4</kbd> to select · <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-600 font-mono">M</kbd> to flag
              </div>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Review & Finish</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Question Navigator
            </h4>

            {/* Overall Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Completed</span>
                <span className="font-bold tabular-nums">
                  {answeredCount} / {totalQuestions} ({Math.round((answeredCount / totalQuestions) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md bg-indigo-600" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md border border-slate-300 bg-white" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300" />
                <span>Marked for review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md ring-2 ring-indigo-500 bg-white" />
                <span>Current</span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {quiz.questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isAnswered = Array.isArray(ans) ? ans.length > 0 : Boolean(ans);
                const isCurrent = idx === currentIndex;
                const flagged = Boolean(markedForReview[q.id]);

                let btnStyles = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300';

                if (isAnswered) {
                  btnStyles = 'bg-indigo-600 text-white border-indigo-600 shadow-2xs';
                }

                if (flagged) {
                  btnStyles = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
                }

                if (isCurrent) {
                  btnStyles += ' ring-2 ring-indigo-600 ring-offset-2';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${btnStyles}`}
                  >
                    <span>{idx + 1}</span>
                    {flagged && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Finish and Submit Assessment?</h4>
                <p className="text-xs text-slate-500">Check your review items before finalizing</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900 font-mono">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Answered:</span>
                <span className="font-bold text-emerald-600 font-mono">{answeredCount}</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Unanswered Questions:</span>
                  <span className="font-mono">{unansweredCount}</span>
                </div>
              )}
              {Object.values(markedForReview).filter(Boolean).length > 0 && (
                <div className="flex justify-between text-indigo-700">
                  <span>Marked for Review:</span>
                  <span className="font-mono">{Object.values(markedForReview).filter(Boolean).length}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-xs font-bold text-white transition-colors shadow-xs"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

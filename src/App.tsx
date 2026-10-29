import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesSection } from './components/FeaturesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MaterialInput } from './components/MaterialInput';
import { QuizConfigPanel } from './components/QuizConfigPanel';
import { QuizRunner } from './components/QuizRunner';
import { QuizResults } from './components/QuizResults';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { DEMO_QUIZ } from './data/demo-quiz';
import { QuizConfig, QuizData, QuizQuestion, UploadedFileItem } from './types/quiz';
import { ArrowLeft, BookOpen, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  // App views: 'landing' | 'create' | 'taking' | 'results'
  const [currentView, setCurrentView] = useState<'landing' | 'create' | 'taking' | 'results'>('landing');

  // Creation State
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [pastedText, setPastedText] = useState<string>('');
  const [topicFocus, setTopicFocus] = useState<string>('');
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    questionCount: 10,
    difficulty: 'mixed',
    questionTypes: ['mcq', 'multi_select', 'true_false', 'fill_in_blank'],
    language: 'english',
    mode: 'practice',
    timeLimitMinutes: 0,
    negativeMarking: false,
    shuffleQuestions: false,
    customInstructions: '',
  });

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [lastUserAnswers, setLastUserAnswers] = useState<Record<string, string | string[]>>({});
  const [lastTimeSpent, setLastTimeSpent] = useState<number>(0);

  // Loading & Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Ref to create section for smooth scrolling
  const createSectionRef = useRef<HTMLDivElement>(null);

  // Check if saved attempt exists
  useEffect(() => {
    try {
      const savedQuiz = localStorage.getItem('quizora_last_generated_quiz');
      if (savedQuiz) {
        const parsed = JSON.parse(savedQuiz);
        if (parsed?.id && parsed?.questions?.length > 0) {
          // Keep as last active in memory
          setActiveQuiz(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleScrollTo = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartCreate = () => {
    setCurrentView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchDemo = () => {
    setActiveQuiz(DEMO_QUIZ);
    setLastUserAnswers({});
    setLastTimeSpent(0);
    setCurrentView('taking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateQuiz = async () => {
    setErrorMessage(null);

    // Validate input
    const hasFiles = files.length > 0;
    const hasText = pastedText.trim().length > 0;
    const hasTopic = topicFocus.trim().length > 0;

    if (!hasFiles && !hasText && !hasTopic) {
      setErrorMessage('Please upload a document, paste notes, or enter a topic focus before generating.');
      return;
    }

    // Check for file processing errors
    const hasPendingError = files.some((f) => f.status === 'error');
    if (hasPendingError) {
      setErrorMessage('One or more uploaded files have parsing errors. Please remove invalid files before proceeding.');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Ingesting and structuring study material...');

    // Combine extracted text
    const extractedParts: string[] = [];
    if (topicFocus) {
      extractedParts.push(`Subject Topic Focus: ${topicFocus}`);
    }
    if (pastedText.trim()) {
      extractedParts.push(`Notes & Excerpts:\n${pastedText.trim()}`);
    }

    // Filter multimodal files (PDFs, images)
    const multimodalFiles = files
      .filter((f) => f.base64Data && f.mimeType)
      .map((f) => ({
        name: f.name,
        mimeType: f.mimeType!,
        base64Data: f.base64Data!,
      }));

    for (const f of files) {
      if (f.extractedText && !f.extractedText.startsWith('[')) {
        extractedParts.push(`File Content (${f.name}):\n${f.extractedText}`);
      }
    }

    const aggregatedText = extractedParts.join('\n\n');

    try {
      setLoadingStep('Synthesizing questions via Gemini 3.8 Flash...');

      // Dynamic step interval for user engagement
      const stepTimer = setTimeout(() => {
        setLoadingStep('Verifying single correct answers & distractor plausibility...');
      }, 2500);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 75000);

      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialText: aggregatedText,
          topicFocus,
          config: quizConfig,
          multimodalFiles,
        }),
        signal: controller.signal,
      });

      clearTimeout(stepTimer);
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate assessment. Please try again.');
      }

      const generatedQuiz: QuizData = data.quiz;

      // Save locally
      try {
        localStorage.setItem('quizora_last_generated_quiz', JSON.stringify(generatedQuiz));
      } catch {
        // Ignore quota issues
      }

      setActiveQuiz(generatedQuiz);
      setLastUserAnswers({});
      setLastTimeSpent(0);
      setCurrentView('taking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Generation error:', err);
      const msg = err instanceof Error ? err.message : 'Server error encountered during quiz generation.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleQuizCompleted = (answers: Record<string, string | string[]>, timeSpent: number) => {
    setLastUserAnswers(answers);
    setLastTimeSpent(timeSpent);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeAll = () => {
    if (!activeQuiz) return;
    setLastUserAnswers({});
    setLastTimeSpent(0);
    setCurrentView('taking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetryIncorrect = (incorrectQuestions: QuizQuestion[]) => {
    if (!activeQuiz || incorrectQuestions.length === 0) return;

    const focusedQuiz: QuizData = {
      ...activeQuiz,
      id: `quiz-retry-${Date.now()}`,
      title: `${activeQuiz.title} (Targeted Practice)`,
      description: `Focused review on ${incorrectQuestions.length} missed question${incorrectQuestions.length > 1 ? 's' : ''}.`,
      questions: incorrectQuestions,
      config: {
        ...activeQuiz.config,
        questionCount: incorrectQuestions.length,
        mode: 'practice', // Practice mode is ideal for retrying missed items
      },
    };

    setActiveQuiz(focusedQuiz);
    setLastUserAnswers({});
    setLastTimeSpent(0);
    setCurrentView('taking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearLocalStorage = () => {
    try {
      localStorage.clear();
      setActiveQuiz(null);
      setLastUserAnswers({});
      setFiles([]);
      setPastedText('');
      setTopicFocus('');
      setCurrentView('landing');
    } catch {
      // Safe fallback
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Universal Top Navigation */}
      <Navbar
        onStartQuiz={handleStartCreate}
        onTryDemo={handleLaunchDemo}
        onScrollTo={handleScrollTo}
      />

      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <>
            <Hero onStartQuiz={handleStartCreate} onTryDemo={handleLaunchDemo} />
            <HowItWorks />
            <FeaturesSection />
            <FaqSection />
          </>
        )}

        {/* VIEW 2: QUIZ GENERATOR CREATION DASHBOARD */}
        {currentView === 'create' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" ref={createSectionRef}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <button
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors p-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Skip & Try Demo
                </button>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Your Custom AI Assessment
              </h2>
              <p className="mt-2 text-slate-600 text-sm">
                Provide your study documents or lecture notes, select assessment criteria, and let Gemini build your quiz.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Material Input (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
                <MaterialInput
                  files={files}
                  onFilesChange={setFiles}
                  pastedText={pastedText}
                  onPastedTextChange={setPastedText}
                  topicFocus={topicFocus}
                  onTopicFocusChange={setTopicFocus}
                  disabled={isLoading}
                />
              </div>

              {/* Right Column: Quiz Configuration Panel (5 cols) */}
              <div className="lg:col-span-5">
                <QuizConfigPanel
                  config={quizConfig}
                  onConfigChange={setQuizConfig}
                  onGenerateQuiz={handleGenerateQuiz}
                  isLoading={isLoading}
                  loadingStep={loadingStep}
                  errorMessage={errorMessage}
                  onClearError={() => setErrorMessage(null)}
                  onTryDemo={handleLaunchDemo}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ACTIVE QUIZ RUNNER */}
        {currentView === 'taking' && activeQuiz && (
          <QuizRunner
            quiz={activeQuiz}
            onComplete={handleQuizCompleted}
            onExit={() => setCurrentView(activeQuiz.id === DEMO_QUIZ.id ? 'landing' : 'create')}
          />
        )}

        {/* VIEW 4: QUIZ RESULTS & LEARNING REVIEW */}
        {currentView === 'results' && activeQuiz && (
          <QuizResults
            quiz={activeQuiz}
            userAnswers={lastUserAnswers}
            timeSpentSeconds={lastTimeSpent}
            onRetakeAll={handleRetakeAll}
            onRetryIncorrect={handleRetryIncorrect}
            onNewQuiz={handleStartCreate}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onTryDemo={handleLaunchDemo}
        onScrollTo={handleScrollTo}
      />

      {/* Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onClearLocalStorage={handleClearLocalStorage}
      />
    </div>
  );
}

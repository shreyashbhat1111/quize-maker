export type QuestionType = 'mcq' | 'true_false' | 'multi_select' | 'fill_in_blank';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export type Language = 'english' | 'hindi' | 'hinglish' | 'marathi';

export type QuizMode = 'practice' | 'exam';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[]; // Options for MCQ, True/False, MultiSelect. For Fill in the Blank, may be empty or contain distractor word bank.
  correctAnswer: string | string[]; // Single string for mcq, true_false, fill_in_blank; string[] for multi_select
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  sourcePassage?: string; // Reference passage or excerpt from the provided material
}

export interface QuizConfig {
  questionCount: number; // 5, 10, 15, 20, 30 or custom
  difficulty: Difficulty;
  questionTypes: QuestionType[];
  language: Language;
  mode: QuizMode;
  timeLimitMinutes: number; // 0 = no timer
  negativeMarking: boolean; // -0.25 for incorrect in exam mode
  shuffleQuestions: boolean;
  topicFocus?: string;
  customInstructions?: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'parsing' | 'ready' | 'error';
  extractedText?: string;
  errorMessage?: string;
  base64Data?: string; // For multimodal PDF / image support
  mimeType?: string;
}

export interface QuizMaterialPayload {
  pastedText: string;
  topicFocus: string;
  files: Array<{
    name: string;
    mimeType: string;
    extractedText?: string;
    base64Data?: string;
  }>;
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  config: QuizConfig;
  questions: QuizQuestion[];
  sourceSummary?: string;
}

export interface QuizAttemptState {
  quizId: string;
  startedAt: number;
  completedAt?: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, string | string[]>; // questionId -> answer(s)
  markedForReview: Record<string, boolean>; // questionId -> true
  isSubmitted: boolean;
}

export interface QuizEvaluationResult {
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  correctCount: number;
  incorrectCount: number;
  rawScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  topicBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
}

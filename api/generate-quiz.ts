import type { Request, Response } from 'express';
import { generateQuizWithGemini } from '../src/server/quiz-engine.js';
import { QuizConfig } from '../src/types/quiz.js';

export default async function handler(req: Request, res: Response) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  const { materialText = '', topicFocus = '', config, multimodalFiles = [] } = req.body || {};

  if (!materialText.trim() && !topicFocus.trim() && (!Array.isArray(multimodalFiles) || multimodalFiles.length === 0)) {
    res.status(400).json({
      success: false,
      error: 'Please provide study notes, a topic, or upload a document/image.',
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured in Vercel environment variables. Please add GEMINI_API_KEY in project settings.',
      isMissingApiKey: true,
    });
    return;
  }

  const validatedConfig: QuizConfig = {
    questionCount: Math.max(1, Math.min(40, Number(config?.questionCount) || 10)),
    difficulty: ['easy', 'medium', 'hard', 'mixed'].includes(config?.difficulty) ? config.difficulty : 'mixed',
    questionTypes: Array.isArray(config?.questionTypes) && config.questionTypes.length > 0 ? config.questionTypes : ['mcq'],
    language: ['english', 'hindi', 'hinglish', 'marathi'].includes(config?.language) ? config.language : 'english',
    mode: config?.mode === 'exam' ? 'exam' : 'practice',
    timeLimitMinutes: Math.max(0, Math.min(180, Number(config?.timeLimitMinutes) || 0)),
    negativeMarking: Boolean(config?.negativeMarking),
    shuffleQuestions: Boolean(config?.shuffleQuestions),
    topicFocus: typeof topicFocus === 'string' ? topicFocus.trim() : undefined,
    customInstructions: typeof config?.customInstructions === 'string' ? config.customInstructions.trim() : undefined,
  };

  try {
    const quiz = await generateQuizWithGemini({
      materialText,
      topicFocus,
      config: validatedConfig,
      multimodalFiles,
    });

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (err: unknown) {
    console.error('Vercel API error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Quiz generation failed.';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}

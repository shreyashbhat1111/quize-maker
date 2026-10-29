import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQuizWithGemini } from './src/server/quiz-engine.js';
import { QuizConfig } from './src/types/quiz.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security and payload parsing (generous 25mb limit for multimodal PDF/image base64 data)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Quizora AI Server',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Simple in-memory IP rate limiter to mitigate abuse
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count++;
  return true;
}

// Quiz generation API endpoint
app.post('/api/generate-quiz', async (req: Request, res: Response): Promise<void> => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a minute before generating another quiz.',
    });
    return;
  }

  const { materialText = '', topicFocus = '', config, multimodalFiles = [] } = req.body;

  // Validation
  if (!materialText.trim() && !topicFocus.trim() && (!Array.isArray(multimodalFiles) || multimodalFiles.length === 0)) {
    res.status(400).json({
      success: false,
      error: 'Please provide either study notes, a topic, or upload a document/image to generate questions from.',
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your environment variables, or try the interactive Demo Mode.',
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

    res.json({
      success: true,
      quiz,
    });
  } catch (err: unknown) {
    console.error('Quiz generation error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz. Please check your material and retry.';
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// Start dev or production server
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: hook Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quizora AI server active on http://0.0.0.0:${PORT} [mode: ${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

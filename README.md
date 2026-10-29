# Quizora AI — Intelligent Assessment & Study Engine

Quizora AI is a production-grade, AI-powered quiz generator that transforms any study material—lecture slides, textbook PDFs, Word documents, Markdown notes, or photos of handwritten diagrams—into rigorous, personalized quizzes with step-by-step educational explanations and source citations.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and the official **Google GenAI SDK** (`@google/genai`) powered by **Gemini 3.8 Flash**.

---

## 🌟 Key Features

- **Multimodal Document Processing:**
  - Standard & scanned **PDF**s
  - Microsoft Word (**DOCX**) & PowerPoint (**PPTX**)
  - Plain Text (**TXT**) & Markdown (**MD**)
  - Direct handwritten lecture photos & diagrams (**JPG, PNG, WebP**) with native multimodal OCR
  - Direct notes and textbook excerpt pasting
- **Flexible Quiz Customization:**
  - 5, 10, 15, 20, 30 or custom question counts (up to 40)
  - 4 Question Types: Single Choice (MCQ), Multi-Select, True/False, and Fill-in-the-Blanks
  - 4 Difficulty Targets: Easy, Medium, Hard, Mixed
  - Multilingual: English, Hindi, Hinglish, Marathi
  - Modes: Instant **Practice Mode** vs Timed **Exam Simulation**
  - Optional negative marking (-0.25) and question shuffling
- **Interactive Exam Experience:**
  - Clean one-question-at-a-time viewport
  - Question navigator palette with Answered, Unanswered, and "Mark for Review" statuses
  - Keyboard shortcuts (`1`-`4` to select options, `Arrow` keys for navigation, `M` to flag)
  - Timed countdown with automatic submission
- **Deep Educational Diagnostics:**
  - Score, percentage, letter grade, and topic-wise breakdown
  - Question-by-question review with source passage excerpts
  - **"Retry Missed Questions"**: Focus exclusively on incorrect answers
  - Clean printable report and 1-click **Export to Markdown or JSON**
- **Zero API Key Demo Mode:**
  - Pre-compiled 10-question AI & Computing exam ready to test instantly

---

## 🔒 Security Architecture

- **Server-Side Only Gemini SDK:** All Gemini API calls run strictly on the Node.js backend. The `GEMINI_API_KEY` is never exposed to browser bundles, source maps, or client requests.
- **Untrusted Data Isolation:** Documents and notes are processed strictly as untrusted data inputs, preventing prompt injection.
- **Zero Remote Storage:** Documents are analyzed in-memory and immediately discarded.

---

## 🚀 Local Development

### 1. Prerequisites
- Node.js 20+
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Setup
```bash
# Clone or extract repository
git clone <your-repo-url>
cd quizora-ai

# Install dependencies
npm install

# Configure your environment variable
cp .env.example .env
# Edit .env and set GEMINI_API_KEY="your-actual-gemini-api-key"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 How to Connect GitHub and Deploy to Vercel

Quizora AI is architected with dual compatibility:
- **Local / Docker:** Express server with Vite middleware (`server.ts`).
- **Vercel Serverless:** Native serverless function located at `/api/generate-quiz.ts` and Vite static build configured in `vercel.json`.

### Step 1: Push Code to GitHub
1. Create a new repository on [GitHub](https://github.com/new) (e.g., `quizora-ai`).
2. In your local terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Quizora AI"
   git branch -M main
   git remote add origin https://github.com/<your-username>/quizora-ai.git
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository (`quizora-ai`) and click **Import**.
4. In the **Configure Project** screen:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 3: Configure GEMINI_API_KEY in Vercel
1. In the same project configuration screen (or later under **Settings > Environment Variables**):
2. Add a new variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `your-google-gemini-api-key`
   - **Environments:** Check Production, Preview, and Development.
3. Click **Deploy**.

### Step 4: Live URL
Once deployment finishes (usually ~45 seconds), Vercel will output a public domain like `https://quizora-ai.vercel.app`. Visitors can open this link directly in any standard browser on mobile or desktop without needing Google AI Studio or Vercel accounts!

---

## 📄 License
Apache-2.0

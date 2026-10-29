import React from 'react';
import { Sparkles, Shield, Cpu, Globe2, BookCheck, Timer } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
            Academic Grade Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Genuine Deep Learning
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Every quiz is anchored in academic rigor, source transparency, and cognitive science principles.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: Multimodal Document Parsing (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-3">
                <Cpu className="w-4 h-4" />
                <span>Multimodal Vision & OCR</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Understands Scans, Diagrams & Complex Formulas
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Don't worry if your PDF is scanned or contains complex biological diagrams, circuit layouts, or mathematical formulas. Gemini 3.8 Flash reads visual inputs natively without lossy conversion.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[4/3] max-h-64 sm:max-h-72 w-full">
              <img
                src="/src/assets/images/feature_doc_analysis_1793287668141.jpg"
                alt="Document analysis showing textbook synthesis and neural knowledge extraction"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 2: Performance Analytics & Mastery (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-3">
                <Timer className="w-4 h-4" />
                <span>Exam Simulation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Detailed Topic-Level Diagnostics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Pinpoint exact conceptual weaknesses. Filter results by subtopic, inspect source citations, and re-attempt only the questions you missed.
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[4/3] max-h-64 sm:max-h-72 w-full">
              <img
                src="/src/assets/images/feature_exam_analytics_1793287668054.jpg"
                alt="Exam analytics report displaying accuracy radar chart and mastery score"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 3: Zero Hallucination Guarantee (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              Zero Hallucinations Guarantee
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We treat uploaded notes strictly as untrusted data. Quizora AI refuses to invent facts, dates, or citations absent from your provided source text.
            </p>
          </div>

          {/* Card 4: Multilingual Support (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              Native Multilingual Quizzes
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Generate assessments seamlessly in English, Hindi, Hinglish (colloquial study dialect), or Marathi while preserving technical terminology.
            </p>
          </div>

          {/* Card 5: Multiple Question Typologies (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <BookCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              4 Distinct Assessment Types
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mix and match Single Choice (MCQ), Multi-Select, True/False, and Fill-in-the-Blanks with word banks to test both recall and deep reasoning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

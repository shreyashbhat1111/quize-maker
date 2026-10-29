import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What file formats are supported for quiz generation?',
    answer: 'Quizora AI supports PDF (both standard text and scanned documents), Microsoft Word (.docx), PowerPoint (.pptx), Markdown (.md), plain text (.txt), and high-resolution images (.jpg, .jpeg, .png, .webp). You can also paste notes directly into the editor.'
  },
  {
    question: 'How are scanned PDFs and handwritten textbook notes processed?',
    answer: 'Quizora AI leverages Gemini 3.8 Flash’s native multimodal visual reasoning. When an image or scanned document is provided, the model performs high-precision OCR directly on the visual pixels, deciphering diagrams, mathematical formulas, and handwritten text.'
  },
  {
    question: 'Are my uploaded files or personal notes permanently stored?',
    answer: 'No. We enforce a strict ephemeral privacy architecture. Uploaded documents and pasted notes are processed in-memory solely to generate your quiz questions and are immediately discarded. Nothing is permanently stored in a remote database.'
  },
  {
    question: 'Can I test Quizora AI without setting up a Gemini API key?',
    answer: 'Yes! Quizora AI comes with a built-in pre-compiled Demo Quiz covering artificial intelligence, operating systems, and complexity theory. You can test all features—including timed exam mode, review flags, and export options—with zero setup.'
  },
  {
    question: 'How do Practice Mode and Exam Mode differ?',
    answer: 'In Practice Mode, you can inspect instant feedback and source explanations after answering each question. In Exam Mode, questions are timed, correct answers are hidden until final submission, and optional negative marking (-0.25) can be activated to simulate standardized test environments.'
  },
  {
    question: 'How do I deploy this project on GitHub and Vercel?',
    answer: 'Simply push the codebase to your GitHub repository and import it into Vercel. In Vercel Project Settings > Environment Variables, add GEMINI_API_KEY. Vercel automatically deploys the frontend build and routes /api/generate-quiz as a high-performance serverless function.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything you need to know about processing materials, exam modes, and security.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/90 bg-slate-50/50 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/40 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

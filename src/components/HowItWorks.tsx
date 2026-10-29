import React from 'react';
import { UploadCloud, Sliders, Award, FileCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload or Paste Your Notes',
      subtitle: 'Drop lecture slides, textbook PDFs, DOCX docs, or photos of your handwritten notes. Quizora extracts text with OCR and deep vision.',
      icon: UploadCloud,
      highlights: ['PDF, DOCX, TXT, PPTX & Images', 'In-browser OCR & multimodal vision', 'No persistent file storage']
    },
    {
      step: '02',
      title: 'Configure Your Assessment',
      subtitle: 'Select from 5 to 40 questions, choose difficulty (Easy to Mixed), pick languages (English, Hindi, Hinglish, Marathi), and set timers.',
      icon: Sliders,
      highlights: ['MCQ, Multi-Select, True/False, Blanks', 'Practice Mode vs Strict Exam Simulation', 'Optional negative marking (-0.25)']
    },
    {
      step: '03',
      title: 'Practice, Simulate & Master',
      subtitle: 'Answer questions one by one with review flags. Receive source-grounded explanations, topic breakdowns, and instant retries.',
      icon: Award,
      highlights: ['Detailed step-by-step rationales', 'Source quotes from your documents', 'Export PDF reports & JSON data']
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
            Clear Workflow
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Quizora AI Works
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Turn dense study material into structured learning in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/70 rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-300 font-mono tabular-nums">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 space-y-2">
                  {item.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

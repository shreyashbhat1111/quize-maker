import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Trash2, Eye, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { UploadedFileItem } from '../types/quiz';
import { processUploadedFile, MAX_FILE_SIZE_BYTES, MAX_TOTAL_TEXT_CHARS } from '../utils/document-parser';

interface MaterialInputProps {
  files: UploadedFileItem[];
  onFilesChange: (files: UploadedFileItem[]) => void;
  pastedText: string;
  onPastedTextChange: (text: string) => void;
  topicFocus: string;
  onTopicFocusChange: (topic: string) => void;
  disabled?: boolean;
}

export const MaterialInput: React.FC<MaterialInputProps> = ({
  files,
  onFilesChange,
  pastedText,
  onPastedTextChange,
  topicFocus,
  onTopicFocusChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFileItem | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Compute total characters extracted
  const totalChars = pastedText.length + files.reduce((acc, f) => acc + (f.extractedText?.length || 0), 0);

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setGlobalError(null);

    if (files.length + fileList.length > 5) {
      setGlobalError('You can upload a maximum of 5 files per quiz session.');
      return;
    }

    const newFiles: UploadedFileItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const processed = await processUploadedFile(f);
      newFiles.push(processed);
    }

    onFilesChange([...files, ...newFiles]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesSelected(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
    if (previewFile?.id === id) setPreviewFile(null);
  };

  const sampleMaterialSnippets = [
    {
      label: 'Mitochondria & ATP (Biology)',
      text: `Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the biochemical reactions of the cell. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP). Mitochondria contain their own small chromosomes. Generally, mitochondria are inherited only from the mother.\n\nThe process of creating cellular energy involves Glycolysis, the Krebs Cycle (Citric Acid Cycle), and Oxidative Phosphorylation on the inner mitochondrial cristae membrane. Chemiosmosis couples electron transport to ATP synthesis via the enzyme ATP synthase, producing roughly 30 to 32 ATP molecules per oxidized glucose molecule.`
    },
    {
      label: 'Database Transactions & ACID (CS)',
      text: `A transaction is a single logical unit of work in a database system. ACID properties guarantee database reliability:
1. Atomicity: All changes are performed, or none are.
2. Consistency: Data remains in a valid state adhering to all defined rules and constraints before and after the transaction.
3. Isolation: Intermediate transaction states are invisible to other concurrently executing transactions. Isolation levels include Read Uncommitted, Read Committed, Repeatable Read, and Serializable.
4. Durability: Once a transaction is committed, its effects survive system crashes, typically guaranteed using write-ahead logging (WAL).`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Topic Focus Header Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Subject or Core Topic (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={topicFocus}
            onChange={(e) => onTopicFocusChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Modern Physics, Campbell Biology Ch. 9, Macroeconomics, Operating Systems"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-xs"
          />
          {topicFocus && (
            <button
              onClick={() => onTopicFocusChange('')}
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Upload Study Files
          </label>
          <span className="text-xs text-slate-400">
            PDF, DOCX, TXT, MD, PPTX, JPG, PNG (Max 10MB each)
          </span>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 bg-white'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md,.markdown,.pptx,.jpg,.jpeg,.png,.webp"
            onChange={(e) => handleFilesSelected(e.target.files)}
            disabled={disabled}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-semibold text-slate-800 mb-1">
            Drag & drop lecture slides or documents here, or <span className="text-indigo-600 hover:underline">browse files</span>
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Scanned PDFs and handwritten diagrams are supported via Gemini multimodal OCR.
          </p>
        </div>

        {globalError && (
          <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Uploaded Files Badges */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              Attached Files ({files.length}/5)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {files.map((file) => {
                const isImage = ['JPG', 'JPEG', 'PNG', 'WEBP'].includes(file.type);
                const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                const isError = file.status === 'error';

                return (
                  <div
                    key={file.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-left transition-all ${
                      isError
                        ? 'border-rose-300 bg-rose-50/60'
                        : 'border-slate-200 bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {file.type} · {sizeMb}MB {file.extractedText ? `· ~${file.extractedText.length} chars` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {file.extractedText && (
                        <button
                          type="button"
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                          title="Preview Extracted Content"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        disabled={disabled}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Direct Notes Paste Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Or Paste Study Notes Directly
          </label>
          <div className="text-xs text-slate-400 font-mono tabular-nums">
            {pastedText.length.toLocaleString()} chars
          </div>
        </div>

        <textarea
          rows={5}
          value={pastedText}
          onChange={(e) => onPastedTextChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste lecture notes, study guide bullet points, textbook excerpts, or syllabus topics here..."
          className="w-full p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-xs"
        />

        {/* Quick Sample Inserters for instant testing */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Insert sample notes:
          </span>
          {sampleMaterialSnippets.map((snippet, sIdx) => (
            <button
              key={sIdx}
              type="button"
              onClick={() => onPastedTextChange(snippet.text)}
              disabled={disabled}
              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors"
            >
              + {snippet.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Text Preview Drawer Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{previewFile.name}</h4>
                <p className="text-xs text-slate-400">{previewFile.type} · Extracted content preview</p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
              {previewFile.extractedText || 'No plain text extracted. Multimodal visual parsing will be used.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, BookOpen, CheckCircle, Scale, Calculator } from 'lucide-react';

interface ExamGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamGuideModal: React.FC<ExamGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Government Exam Typing Criteria & Marking Scheme</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-2xl border border-blue-100 dark:border-blue-900">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>1. SSC CHSL & CGL (Staff Selection Commission)</span>
            </h4>
            <ul className="space-y-1 pl-5 list-disc text-slate-700 dark:text-slate-300">
              <li>
                <b>English Typing:</b> 35 Words Per Minute (10,500 KDPH key depressions per hour).
              </li>
              <li>
                <b>Hindi Typing:</b> 30 Words Per Minute (9,000 KDPH key depressions per hour) using Mangal font.
              </li>
              <li>
                <b>Permissible Error Limit:</b> 5% for General category, 7% for reserved categories.
              </li>
              <li>
                <b>CGL DEST:</b> 2,000 key depressions in 15 minutes (~27 WPM).
              </li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-100 dark:border-emerald-900">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1.5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>2. MP CPCT (Computer Proficiency Certification Test)</span>
            </h4>
            <ul className="space-y-1 pl-5 list-disc text-slate-700 dark:text-slate-300">
              <li>
                <b>English Section:</b> Minimum 30 WPM (50% qualifying score). 50+ WPM achieves highest grade.
              </li>
              <li>
                <b>Hindi Section:</b> Minimum 20 WPM (50% qualifying score) on Unicode Mangal InScript / Remington layout.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-100 dark:border-amber-900">
            <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-1.5 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>3. High Court Assistant & Judicial Stenographer</span>
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              Allahabad, Patna, and Delhi High Courts require <b>30 to 40 WPM</b>. Court evaluations apply strict penalties for spelling and punctuation errors (accuracy must exceed 95%).
            </p>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-100 dark:border-indigo-900">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1.5 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>4. Standard Sarkari Calculation Formula</span>
            </h4>
            <ul className="space-y-1 pl-5 list-disc text-slate-700 dark:text-slate-300">
              <li><b>1 Word</b> = Standardized as 5 Characters (keystrokes including spaces).</li>
              <li><b>Gross WPM</b> = (Total Characters Typed ÷ 5) ÷ Time Elapsed (Minutes).</li>
              <li><b>Net WPM</b> = [(Total Correct Characters - Errors) ÷ 5] ÷ Time Elapsed (Minutes).</li>
              <li><b>KDPH (Depressions/Hour)</b> = CPM × 60.</li>
            </ul>
          </div>

        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Got it, Close
          </button>
        </div>

      </div>
    </div>
  );
};

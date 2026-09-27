import React from 'react';
import { Award, CheckCircle2, RotateCcw, Printer, X, AlertTriangle } from 'lucide-react';

export interface TestResultData {
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  cpm: number;
  kdph: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  timeElapsed: number;
  targetWpm: number;
  examBenchmarkName: string;
  isPass: boolean;
  dateStr: string;
}

interface ScorecardModalProps {
  isOpen: boolean;
  data: TestResultData | null;
  onClose: () => void;
  onRetry: () => void;
  onViewCertificate: () => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({
  isOpen,
  data,
  onClose,
  onRetry,
  onViewCertificate,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Result Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white text-center relative">
          <span
            className={`inline-block text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full mb-2 ${
              data.isPass
                ? 'bg-emerald-400 text-slate-900 font-bold'
                : 'bg-rose-400 text-slate-900 font-bold'
            }`}
          >
            {data.isPass ? 'EXAM QUALIFIED (PASS)' : 'NEEDS PRACTICE (BELOW TARGET)'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">Typing Test Scorecard</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Official performance report based on Government Standard Calculations
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Primary Big Score Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            
            <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-2xl border border-blue-100 dark:border-blue-900">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Net Speed</span>
              <div className="text-3xl sm:text-4xl font-black text-blue-700 dark:text-blue-300 font-mono mt-1">
                {data.netWpm}
              </div>
              <span className="text-[11px] text-slate-500">Words / Min</span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Accuracy</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-300 font-mono mt-1">
                {data.accuracy}%
              </div>
              <span className="text-[11px] text-slate-500">Precision rate</span>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Gross Speed</span>
              <div className="text-3xl sm:text-4xl font-black text-indigo-700 dark:text-indigo-300 font-mono mt-1">
                {data.grossWpm}
              </div>
              <span className="text-[11px] text-slate-500">Raw WPM</span>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/50 p-4 rounded-2xl border border-purple-100 dark:border-purple-900">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">KDPH Rate</span>
              <div className="text-3xl sm:text-4xl font-black text-purple-700 dark:text-purple-300 font-mono mt-1">
                {data.kdph.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">Key Hits / Hour</span>
            </div>

          </div>

          {/* Detailed Breakdown Grid */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Total Characters Keystrokes</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                {data.totalChars}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-emerald-600 font-medium">✓ Correct Characters Keystrokes</span>
              <span className="font-bold font-mono text-emerald-600">
                {data.correctChars}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-red-500 font-medium">✗ Incorrect Mistakes / Errors</span>
              <span className="font-bold font-mono text-red-500">
                {data.incorrectChars}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Test Duration Elapsed</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                {data.timeElapsed}s ({Math.round((data.timeElapsed / 60) * 10) / 10} min)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Target Standard Benchmark</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {data.targetWpm} WPM ({data.examBenchmarkName})
              </span>
            </div>
          </div>

          {/* Benchmark Verdict Card */}
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 ${
              data.isPass
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 font-bold ${
                data.isPass ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {data.isPass ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">
                {data.isPass
                  ? `PASSED: Meets ${data.targetWpm} WPM Benchmark Requirement!`
                  : `Target Not Met: Target was ${data.targetWpm} WPM`}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {data.isPass
                  ? `Outstanding! Your net speed of ${data.netWpm} WPM with ${data.accuracy}% accuracy exceeds the qualifying standard.`
                  : `Your net speed was ${data.netWpm} WPM. Focus on steady pacing and accuracy to prevent mistake deductions.`}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onRetry}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all text-center flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again / Next Passage</span>
            </button>
            <button
              onClick={onViewCertificate}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>View Certificate</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

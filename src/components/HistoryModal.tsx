import React from 'react';
import { X, History, Trash2, Award } from 'lucide-react';
import { TestResultData } from './ScorecardModal.tsx';

interface HistoryModalProps {
  isOpen: boolean;
  history: TestResultData[];
  onClose: () => void;
  onClear: () => void;
  onSelectResult: (item: TestResultData) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onClear,
  onSelectResult,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Practice Attempt History
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {history.length} tests
            </span>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Clear History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
            <Award className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p>No tests recorded yet.</p>
            <p className="text-slate-400 mt-1">Complete a timed session to log your typing speed and accuracy scorecard.</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer"
                onClick={() => onSelectResult(item)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-blue-600 dark:text-blue-400 font-mono">
                      {item.netWpm} WPM
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                      {item.accuracy}% Acc
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.isPass
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.isPass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.examBenchmarkName} • {item.timeElapsed}s duration • {item.dateStr}
                  </p>
                </div>

                <button className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  View Report →
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import { TestResultData } from './ScorecardModal.tsx';

interface CertificateModalProps {
  isOpen: boolean;
  data: TestResultData | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  data,
  onClose,
}) => {
  const [candidateName, setCandidateName] = useState('Typing Aspirant (Candidate)');

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const verifyId = `TS-${Math.floor(1000 + (data.netWpm * 37) % 8999)}-${String.fromCharCode(65 + (data.accuracy % 26))}${data.totalChars % 99}`;

  return (
    <div id="certificate-modal" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-3xl w-full my-8">
        
        {/* Close & Print Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-t-2xl no-print">
          <span className="text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Official Typing Speed Achievement Certificate
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium cursor-pointer"
            >
              <X className="w-4 h-4 inline mr-1" />
              Close
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div
          id="printable-certificate"
          className="bg-[#fcfaf2] text-slate-900 p-8 sm:p-12 border-8 border-double border-blue-950 rounded-b-2xl shadow-2xl relative font-sans"
        >
          {/* Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <svg className="w-96 h-96" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M50 15 L55 35 L75 35 L60 48 L65 70 L50 55 L35 70 L40 48 L25 35 L45 35 Z" />
            </svg>
          </div>

          <div className="text-center relative z-10 space-y-4">
            
            {/* Header / Authority Logo */}
            <div className="flex justify-center items-center gap-3">
              <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md">
                TS
              </div>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-widest">
                  TypeSpeed Practice
                </h2>
                <p className="text-[10px] tracking-wider text-slate-600 uppercase font-semibold">
                  National Speed Typing & Skill Evaluation Authority
                </p>
              </div>
            </div>

            <div className="border-b-2 border-blue-900/20 max-w-sm mx-auto my-3"></div>

            <h3 className="text-2xl sm:text-3xl font-serif font-black text-blue-900 uppercase tracking-wider">
              Certificate of Typing Proficiency
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              This is to certify that the test candidate has successfully undertaken an online timed typing evaluation under standardized government examination conditions.
            </p>

            {/* Candidate Name Input Field (Interactive for printing!) */}
            <div className="pt-2">
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="text-center text-xl sm:text-2xl font-bold font-serif text-slate-900 border-b-2 border-slate-400 bg-transparent focus:outline-none focus:border-blue-700 px-4 py-1 max-w-md w-full"
                placeholder="Enter Candidate Name"
              />
              <p className="text-[11px] text-slate-500 mt-1 italic no-print">
                (Click name above to edit before printing)
              </p>
            </div>

            {/* Official Stats Stamp Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto my-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-900/20 shadow-sm text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Net Speed</span>
                <div className="text-2xl font-black text-blue-900 font-mono mt-0.5">
                  {data.netWpm} WPM
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Accuracy</span>
                <div className="text-2xl font-black text-emerald-800 font-mono mt-0.5">
                  {data.accuracy}%
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Gross WPM</span>
                <div className="text-2xl font-black text-slate-800 font-mono mt-0.5">
                  {data.grossWpm} WPM
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Total Key Hits</span>
                <div className="text-2xl font-black text-slate-800 font-mono mt-0.5">
                  {data.totalChars.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Exam Qualification Seal */}
            <div className="max-w-md mx-auto py-2">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-bold text-xs uppercase tracking-wider ${
                  data.isPass
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-blue-100 text-blue-900 border-blue-300'
                }`}
              >
                {data.isPass
                  ? `✓ ${data.examBenchmarkName} Benchmark Qualified`
                  : `Assessment Completed (${data.netWpm} WPM / ${data.accuracy}% Acc)`}
              </div>
            </div>

            {/* Verification Signatures & Date */}
            <div className="flex justify-between items-end pt-8 px-4 text-left border-t border-slate-300">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Date of Assessment</p>
                <p className="text-xs font-semibold text-slate-800">{data.dateStr}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  Verify ID: <span className="font-semibold text-slate-700">{verifyId}</span>
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-[10px] font-bold text-amber-700 uppercase tracking-tighter mx-auto mb-1">
                  SEAL OK
                </div>
                <span className="text-[10px] text-slate-500">Official Evaluator</span>
              </div>
              <div className="text-right">
                <div className="font-serif italic font-bold text-blue-900 text-sm">Examiner Desk</div>
                <div className="border-t border-slate-700 w-28 my-1 ml-auto"></div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Signature Authority</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

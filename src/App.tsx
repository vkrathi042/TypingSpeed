/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  History,
  BookOpen,
  RotateCcw,
  Plus,
  ArrowRight,
  Printer,
  Sparkles,
  Award
} from 'lucide-react';
import { PASSAGES, EXAM_PRESETS, PassageItem } from './data/passages.ts';
import { soundFX } from './utils/audio.ts';
import { ScorecardModal, TestResultData } from './components/ScorecardModal.tsx';
import { CertificateModal } from './components/CertificateModal.tsx';
import { ExamGuideModal } from './components/ExamGuideModal.tsx';
import { CustomPassageModal } from './components/CustomPassageModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ts_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sound FX state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Configuration state
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [duration, setDuration] = useState<number>(60); // seconds
  const [targetSpeed, setTargetSpeed] = useState<number>(35); // WPM

  // Passage state
  const [currentPassage, setCurrentPassage] = useState<PassageItem>(() => {
    const list = PASSAGES.filter((p) => p.language === 'en' && p.difficulty === 'medium');
    return list[0] || PASSAGES[0];
  });
  const [passageText, setPassageText] = useState<string>(currentPassage.text);
  const [customPassageTag, setCustomPassageTag] = useState<string | null>(null);

  // Typing session state
  const [typedValue, setTypedValue] = useState<string>('');
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [capsLockOn, setCapsLockOn] = useState<boolean>(false);

  // Metrics
  const [netWpm, setNetWpm] = useState<number>(0);
  const [grossWpm, setGrossWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [kdph, setKdph] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Font size zoom level (-1, 0, 1, 2)
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);

  // Modals state
  const [isScorecardOpen, setIsScorecardOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [activeScorecardData, setActiveScorecardData] = useState<TestResultData | null>(null);

  // History state
  const [history, setHistory] = useState<TestResultData[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ts_practice_history');
        if (saved) return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync dark theme class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ts_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ts_theme', 'light');
    }
  }, [isDark]);

  // Sync sound setting
  useEffect(() => {
    soundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  // Caps lock detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        setCapsLockOn(true);
      } else {
        setCapsLockOn(false);
      }

      // Shortcut: Esc to reset test
      if (e.key === 'Escape') {
        resetTest();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.getModifierState && !e.getModifierState('CapsLock')) {
        setCapsLockOn(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer Tick and Metric Calculation
  const calculateLiveMetrics = useCallback(
    (currentTyped: string, elapsedSecs: number) => {
      const targetChars = Array.from(passageText);
      const typedChars = Array.from(currentTyped);

      let correct = 0;
      let mistakes = 0;

      for (let i = 0; i < typedChars.length; i++) {
        if (typedChars[i] === targetChars[i]) {
          correct++;
        } else {
          mistakes++;
        }
      }

      setCorrectCount(correct);
      setErrorsCount(mistakes);

      const effectiveElapsedSecs = Math.max(elapsedSecs, 1);
      const minutesElapsed = effectiveElapsedSecs / 60;

      // Sarkari standard formulas
      // Gross WPM = (Total Typed Characters / 5) / minutes
      const rawGross = Math.round((typedChars.length / 5) / minutesElapsed);
      setGrossWpm(rawGross);

      // Net WPM = (Correct Characters / 5) / minutes - mistake penalty
      const netWords = Math.max(0, (correct - mistakes) / 5);
      const rawNet = Math.round(netWords / minutesElapsed);
      setNetWpm(rawNet);

      // CPM (Characters Per Minute)
      const currentCpm = Math.round(typedChars.length / minutesElapsed);
      setCpm(currentCpm);

      // KDPH = CPM * 60
      const currentKdph = currentCpm * 60;
      setKdph(currentKdph);

      // Accuracy %
      if (typedChars.length > 0) {
        const acc = Math.max(0, Math.round((correct / typedChars.length) * 100));
        setAccuracy(acc);
      } else {
        setAccuracy(100);
      }
    },
    [passageText]
  );

  // Complete session & trigger scorecard
  const finishSession = useCallback(
    (finalElapsed: number, finalTyped: string) => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setIsTestRunning(false);
      setIsTestFinished(true);

      const targetChars = Array.from(passageText);
      const typedChars = Array.from(finalTyped);

      let correct = 0;
      let mistakes = 0;
      for (let i = 0; i < typedChars.length; i++) {
        if (typedChars[i] === targetChars[i]) {
          correct++;
        } else {
          mistakes++;
        }
      }

      const effectiveElapsed = Math.max(finalElapsed, 1);
      const mins = effectiveElapsed / 60;
      const finalGross = Math.round((typedChars.length / 5) / mins);
      const finalNet = Math.round(Math.max(0, (correct - mistakes) / 5) / mins);
      const finalCpm = Math.round(typedChars.length / mins);
      const finalKdph = finalCpm * 60;
      const finalAcc = typedChars.length > 0 ? Math.round((correct / typedChars.length) * 100) : 100;
      const isPassed = finalNet >= targetSpeed && finalAcc >= 90;

      const benchmarkName = getBenchmarkLabel(targetSpeed);
      const todayStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const report: TestResultData = {
        netWpm: finalNet,
        grossWpm: finalGross,
        accuracy: finalAcc,
        cpm: finalCpm,
        kdph: finalKdph,
        totalChars: typedChars.length,
        correctChars: correct,
        incorrectChars: mistakes,
        timeElapsed: effectiveElapsed,
        targetWpm: targetSpeed,
        examBenchmarkName: benchmarkName,
        isPass: isPassed,
        dateStr: todayStr,
      };

      setActiveScorecardData(report);
      setIsScorecardOpen(true);

      // Save to localStorage history
      setHistory((prev) => {
        const next = [report, ...prev].slice(0, 30);
        try {
          localStorage.setItem('ts_practice_history', JSON.stringify(next));
        } catch {
          // ignore storage error
        }
        return next;
      });

      soundFX.playBeep();
    },
    [passageText, targetSpeed]
  );

  // Timer interval handling
  useEffect(() => {
    if (isTestRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed((prevElapsed) => {
          const nextElapsed = prevElapsed + 1;
          calculateLiveMetrics(typedValue, nextElapsed);
          return nextElapsed;
        });

        setTimeRemaining((prevRemaining) => {
          if (prevRemaining <= 1) {
            finishSession(duration, typedValue);
            return 0;
          }
          return prevRemaining - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTestRunning, typedValue, duration, calculateLiveMetrics, finishSession]);

  // Reset test
  const resetTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsTestRunning(false);
    setIsTestFinished(false);
    setTimeRemaining(duration);
    setTimeElapsed(0);
    setTypedValue('');
    setNetWpm(0);
    setGrossWpm(0);
    setCpm(0);
    setKdph(0);
    setAccuracy(100);
    setErrorsCount(0);
    setCorrectCount(0);

    if (textDisplayRef.current) {
      textDisplayRef.current.scrollTop = 0;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [duration]);

  // Select next passage
  const loadNewPassage = useCallback(() => {
    const list = PASSAGES.filter((p) => p.language === language && p.difficulty === difficulty);
    const available = list.length > 0 ? list : PASSAGES.filter((p) => p.language === language);
    const randomItem = available[Math.floor(Math.random() * available.length)];
    setCurrentPassage(randomItem);
    setPassageText(randomItem.text);
    setCustomPassageTag(null);
    resetTest();
  }, [language, difficulty, resetTest]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isTestFinished) return;

    const val = e.target.value;
    const targetChars = Array.from(passageText);
    const newChars = Array.from(val);

    // Audio feedback on keypress
    if (newChars.length > typedValue.length) {
      const lastIndex = newChars.length - 1;
      const isCorrect = newChars[lastIndex] === targetChars[lastIndex];
      soundFX.playKeyClick(isCorrect);
    }

    // Start timer on first keystroke
    if (!isTestRunning && val.length > 0) {
      setIsTestRunning(true);
    }

    setTypedValue(val);
    calculateLiveMetrics(val, timeElapsed);

    // Auto-scroll passage view to keep cursor visible
    if (textDisplayRef.current) {
      const activeCharEl = document.getElementById(`char-${newChars.length}`);
      if (activeCharEl) {
        const container = textDisplayRef.current;
        const elemTop = activeCharEl.offsetTop - container.offsetTop;
        const elemBottom = elemTop + activeCharEl.clientHeight;
        const contScroll = container.scrollTop;
        const contHeight = container.clientHeight;

        if (elemBottom > contScroll + contHeight - 30) {
          container.scrollTop = elemTop - 40;
        } else if (elemTop < contScroll + 20) {
          container.scrollTop = Math.max(0, elemTop - 40);
        }
      }
    }

    // Check if entire text completed
    if (newChars.length >= targetChars.length) {
      finishSession(timeElapsed + 1, val);
    }
  };

  // Switch language
  const handleLanguageChange = (newLang: 'en' | 'hi') => {
    if (language === newLang) return;
    setLanguage(newLang);
    if (newLang === 'hi' && targetSpeed > 30) {
      setTargetSpeed(30);
    }
    const list = PASSAGES.filter((p) => p.language === newLang && p.difficulty === difficulty);
    const item = list[0] || PASSAGES.filter((p) => p.language === newLang)[0];
    setCurrentPassage(item);
    setPassageText(item.text);
    setCustomPassageTag(null);
    resetTest();
  };

  // Switch difficulty
  const handleDifficultyChange = (newDiff: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDiff);
    const list = PASSAGES.filter((p) => p.language === language && p.difficulty === newDiff);
    if (list.length > 0) {
      const item = list[Math.floor(Math.random() * list.length)];
      setCurrentPassage(item);
      setPassageText(item.text);
    }
    setCustomPassageTag(null);
    resetTest();
  };

  // Switch duration
  const handleDurationChange = (secs: number) => {
    setDuration(secs);
    setTimeRemaining(secs);
    resetTest();
  };

  // Apply exam preset
  const applyPreset = (preset: typeof EXAM_PRESETS[0]) => {
    setLanguage(preset.language);
    setDifficulty(preset.difficulty);
    setTargetSpeed(preset.targetWpm);
    setDuration(preset.durationSeconds);
    setTimeRemaining(preset.durationSeconds);

    const list = PASSAGES.filter((p) => p.language === preset.language && p.difficulty === preset.difficulty);
    const item = list[0] || PASSAGES.filter((p) => p.language === preset.language)[0];
    setCurrentPassage(item);
    setPassageText(item.text);
    setCustomPassageTag(null);
    resetTest();

    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  // Apply custom passage
  const handleApplyCustomPassage = (customText: string) => {
    setPassageText(customText);
    const isHindi = /[\u0900-\u097F]/.test(customText);
    if (isHindi && language !== 'hi') {
      setLanguage('hi');
    } else if (!isHindi && language !== 'en') {
      setLanguage('en');
    }
    setCustomPassageTag('Custom User Passage');
    resetTest();
  };

  // Clear history
  const handleClearHistory = () => {
    if (confirm('Clear all typing history?')) {
      setHistory([]);
      localStorage.removeItem('ts_practice_history');
    }
  };

  // Helper labels
  const getBenchmarkLabel = (wpm: number) => {
    if (wpm <= 20) return 'CPCT Minimum (20 WPM)';
    if (wpm <= 25) return 'Steno / Court (25 WPM)';
    if (wpm <= 30) return 'SSC Hindi Exam (30 WPM)';
    if (wpm <= 35) return 'SSC CHSL ENG (35 WPM)';
    if (wpm <= 40) return 'High Court Assistant (40 WPM)';
    return 'Pro Speedster (50+ WPM)';
  };

  // Font size classes for the passage box
  const fontSizeClasses = [
    'text-base sm:text-lg leading-relaxed',
    'text-lg sm:text-xl md:text-2xl leading-relaxed',
    'text-xl sm:text-2xl md:text-3xl leading-relaxed',
    'text-2xl sm:text-3xl md:text-4xl leading-relaxed',
  ];
  const currentFontClass = fontSizeClasses[fontSizeLevel + 1] || fontSizeClasses[1];

  // Character array for target text
  const targetChars = Array.from(passageText);
  const typedChars = Array.from(typedValue);

  return (
    <div className="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Notification & Exam Banner (Govt Exam Mode) */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs sm:text-sm font-medium py-1.5 px-4 shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/20 uppercase text-[10px] tracking-wider font-bold px-1.5 py-0.5 rounded shrink-0">
              Govt Exam Mode
            </span>
            <span className="truncate">
              SSC CGL Tier-II (27 WPM / 2000 KDPH), CHSL (35 WPM Eng / 30 WPM Hindi), CPCT MP, Allahabad High Court Pattern Ready!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
              Unicode (Mangal Font) Supported
            </span>
            <span className="text-white/60">|</span>
            <span className="text-amber-100 font-semibold">100% Client-Side & Free</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 text-xl tracking-tight shrink-0">
              TS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  TypeSpeed Practice
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300/40">
                  Sarkari Exam Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Online Speed Test & Accuracy Evaluator
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>🇮🇳</span>
                <span>हिन्दी (Mangal)</span>
              </button>
            </div>

            {/* Sound Feedback Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title={soundEnabled ? 'Mute Mechanical Sound' : 'Enable Mechanical Typing Sound'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* History Trigger */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer relative"
              title="Attempt History"
            >
              <History className="w-5 h-5" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {history.length}
                </span>
              )}
            </button>

            {/* Exam Guide Modal Trigger */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Exam Criteria
            </button>

          </div>

        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Configuration Strip (Pre-Test Controls) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            
            {/* Test Duration Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>⏱️ TEST DURATION</span>
                <span className="text-blue-600 dark:text-blue-400 lowercase font-semibold">
                  {duration / 60} min standard
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
                {[60, 120, 300, 600].map((secs) => (
                  <button
                    key={secs}
                    onClick={() => handleDurationChange(secs)}
                    className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      duration === secs
                        ? 'bg-white dark:bg-slate-700 font-bold text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {secs / 60}m
                  </button>
                ))}
              </div>
            </div>

            {/* Target Speed / Exam Benchmark Preset */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>🎯 TARGET BENCHMARK</span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                  {getBenchmarkLabel(targetSpeed)}
                </span>
              </label>
              <select
                value={targetSpeed}
                onChange={(e) => setTargetSpeed(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="20">20 WPM (Beginner / CPCT Cutoff)</option>
                <option value="25">25 WPM (SSC Stenographer / State Court)</option>
                <option value="30">30 WPM (SSC Hindi Qualifying / Clerk)</option>
                <option value="35">35 WPM (SSC CHSL LDC English Standard)</option>
                <option value="40">40 WPM (High Court Assistant / Professional)</option>
                <option value="50">50+ WPM (Pro Speedster Master)</option>
              </select>
            </div>

            {/* Paragraph Difficulty */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>📚 TEXT DIFFICULTY</span>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {difficulty} (Exam Mix)
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`py-1.5 rounded-lg text-center transition-all cursor-pointer capitalize ${
                      difficulty === diff
                        ? 'bg-white dark:bg-slate-700 font-bold text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Passage & Custom Text Buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={loadNewPassage}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800/80 rounded-xl text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Next Passage</span>
              </button>
              <button
                onClick={() => setIsCustomOpen(true)}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Paste Your Own Passage / Exam PDF Text"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Live Performance Dashboard (6 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Card 1: Time Remaining */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>⏱️ TIME REMAINING</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isTestRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              ></span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-800 dark:text-white">
                {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
                {String(timeRemaining % 60).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {duration / 60}m
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(timeRemaining / duration) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Card 2: Speed (WPM) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>⚡ SPEED (WPM)</span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold px-1.5 rounded">
                Net
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
                {netWpm}
              </span>
              <span className="text-xs text-slate-400 font-medium">wpm</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>
                Gross: <b className="text-slate-600 dark:text-slate-300 font-mono">{grossWpm}</b>
              </span>
              <span>
                Target: <b className="text-slate-600 dark:text-slate-300 font-mono">{targetSpeed}</b>
              </span>
            </div>
          </div>

          {/* Card 3: CPM / KDPH */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>⌨️ CPM / KDPH</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-1.5 rounded">
                Govt
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
                {cpm}
              </span>
              <span className="text-xs text-slate-400 font-medium">cpm</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 truncate">
              KDPH (hr): <b className="text-slate-600 dark:text-slate-300 font-mono">{kdph.toLocaleString()}</b>
            </div>
          </div>

          {/* Card 4: Accuracy */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>🎯 ACCURACY</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 rounded">
                {accuracy}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                {accuracy}
              </span>
              <span className="text-xs text-slate-400 font-medium">%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  accuracy >= 95 ? 'bg-emerald-500' : accuracy >= 85 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
          </div>

          {/* Card 5: Errors / Mistakes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>❌ ERRORS</span>
              <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-bold px-1.5 rounded">
                Mistakes
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-red-600 dark:text-red-400">
                {errorsCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">chars</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Correct: <b className="text-emerald-600 font-mono">{correctCount}</b>
            </div>
          </div>

          {/* Card 6: Benchmark Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>🏆 BENCHMARK STATUS</span>
            </div>
            <div className="mt-2">
              {!isTestRunning && typedValue.length === 0 ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Awaiting Start</span>
                </div>
              ) : netWpm >= targetSpeed && accuracy >= 90 ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Passing Speed (✓)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Below Target</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 truncate">
              Pass threshold: <b>≥{targetSpeed} WPM</b>
            </div>
          </div>

        </div>

        {/* Active Typing Arena */}
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col gap-6">
          
          {/* Passage Header & Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold px-2.5 py-1 rounded-lg">
                {customPassageTag || `Govt Exam Passage #${currentPassage.id}`}
              </span>
              <span className="hidden sm:inline-block text-slate-400">
                • {currentPassage.category || 'General Administration'}
              </span>
            </div>

            {/* Live Hindi Typing Hint Helper (Shown when in Hindi mode) */}
            {language === 'hi' && (
              <div className="flex items-center gap-2 text-xs bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                <span>ℹ️ Use standard Hindi InScript / phonetic IME (Unicode Mangal Font)</span>
              </div>
            )}

            {/* Font Size & Reset Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Font Size:</span>
              <button
                onClick={() => setFontSizeLevel((prev) => Math.max(-1, prev - 1))}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeLevel((prev) => Math.min(2, prev + 1))}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
              <button
                onClick={resetTest}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Restart with same text"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Passage Character Display Container */}
          <div
            ref={textDisplayRef}
            onClick={() => inputRef.current?.focus()}
            className={`relative max-h-56 sm:max-h-64 overflow-y-auto pr-2 select-none border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 cursor-text transition-all ${
              language === 'hi' ? 'font-hindi' : 'font-mono'
            } ${currentFontClass}`}
          >
            {targetChars.map((char, index) => {
              let charClass = 'char';
              if (index < typedChars.length) {
                if (typedChars[index] === char) {
                  charClass += ' char-correct';
                } else {
                  charClass += ' char-incorrect';
                }
              } else if (index === typedChars.length) {
                charClass += ' char-current';
              }

              return (
                <span key={index} id={`char-${index}`} className={charClass}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>

          {/* Typing Input Box */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                Type Here (Test timer starts on first keystroke):
              </span>
              {capsLockOn && (
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  ⚠️ Caps Lock is ON
                </span>
              )}
            </div>

            <textarea
              ref={inputRef}
              rows={3}
              value={typedValue}
              onChange={handleInputChange}
              disabled={isTestFinished}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Start typing the passage text above. The timer will automatically begin upon typing your first character..."
              className={`w-full bg-white dark:bg-slate-950 border-2 border-blue-400 dark:border-blue-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 rounded-2xl p-4 text-base sm:text-lg md:text-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none transition-all resize-none shadow-inner ${
                language === 'hi' ? 'font-hindi' : 'font-mono'
              }`}
            />

            {/* Character counter overlay in input bottom-right */}
            <div className="absolute bottom-3 right-4 flex items-center gap-2 pointer-events-none text-xs text-slate-400 font-mono">
              <span>
                {typedChars.length} / {targetChars.length} chars
              </span>
            </div>
          </div>

          {/* Keyboard Shortcuts & Quick Exam Tips */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  Tab + Enter
                </kbd>
                <span>Restart Test</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  Esc
                </kbd>
                <span>Pause / Reset</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Formula: <span className="font-mono text-blue-600 dark:text-blue-400">Net WPM = (Total Correct Chars / 5) ÷ Minutes</span>
            </div>
          </div>

        </div>

        {/* Exam Guidelines & Reference Speed Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: SSC CGL & CHSL */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  SSC CGL & CHSL (DEST)
                </h3>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  15 Mins
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                CHSL requires <b>35 WPM</b> (10,500 KDPH in English) or <b>30 WPM</b> (9,000 KDPH in Hindi). CGL Data Entry demands 2,000 key depressions in 15 mins (approx 27 WPM).
              </p>
            </div>
            <button
              onClick={() => applyPreset(EXAM_PRESETS[0])}
              className="w-full text-center text-xs font-semibold py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 transition-colors cursor-pointer"
            >
              Load SSC CHSL Pattern
            </button>
          </div>

          {/* Card 2: MP CPCT */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  MP CPCT (Hindi + English)
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  15 Mins
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                English qualifying score is <b>30 WPM (50%)</b>. Hindi typing test requires <b>20 WPM (50%)</b> using Unicode Mangal Inscript layout.
              </p>
            </div>
            <button
              onClick={() => applyPreset(EXAM_PRESETS[1])}
              className="w-full text-center text-xs font-semibold py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Load CPCT Hindi Pattern
            </button>
          </div>

          {/* Card 3: High Court & Stenographer */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                  High Court & Stenographer
                </h3>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded">
                  10 Mins
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Allahabad & Patna High Court tests require <b>30-40 WPM</b> with high accuracy (over 95%). Mistakes are heavily penalized in court exams.
              </p>
            </div>
            <button
              onClick={() => applyPreset(EXAM_PRESETS[2])}
              className="w-full text-center text-xs font-semibold py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/60 dark:hover:text-orange-300 transition-colors cursor-pointer"
            >
              Load High Court Pattern
            </button>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              TypeSpeed Practice — sarkaritypingtest.com Inspired Exam Simulator
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Designed for SSC, CPCT, Railway NTPC, Bank Clerk, and Judicial High Court Typing Exams.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Strict Sarkari WPM Calculation</span>
            <span>•</span>
            <span>Zero Server Footprint</span>
            <span>•</span>
            <button
              onClick={() => {
                if (activeScorecardData) {
                  setIsCertificateOpen(true);
                } else {
                  // Create sample data for previewing certificate
                  const sampleReport: TestResultData = {
                    netWpm: 38,
                    grossWpm: 40,
                    accuracy: 98,
                    cpm: 190,
                    kdph: 11400,
                    totalChars: 1240,
                    correctChars: 1215,
                    incorrectChars: 25,
                    timeElapsed: 60,
                    targetWpm: 35,
                    examBenchmarkName: 'SSC CHSL (35 WPM)',
                    isPass: true,
                    dateStr: new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  };
                  setActiveScorecardData(sampleReport);
                  setIsCertificateOpen(true);
                }
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Print Certificate
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ScorecardModal
        isOpen={isScorecardOpen}
        data={activeScorecardData}
        onClose={() => setIsScorecardOpen(false)}
        onRetry={() => {
          setIsScorecardOpen(false);
          loadNewPassage();
        }}
        onViewCertificate={() => {
          setIsScorecardOpen(false);
          setIsCertificateOpen(true);
        }}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        data={activeScorecardData}
        onClose={() => {
          setIsCertificateOpen(false);
          inputRef.current?.focus();
        }}
      />

      <ExamGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <CustomPassageModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        onApply={handleApplyCustomPassage}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onClear={handleClearHistory}
        onSelectResult={(item) => {
          setActiveScorecardData(item);
          setIsHistoryOpen(false);
          setIsScorecardOpen(true);
        }}
      />

    </div>
  );
}

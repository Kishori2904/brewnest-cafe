import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Copy, Check, Presentation, Clock, Award, FileText } from 'lucide-react';
import { PITCH_SLIDES } from '../data/cafeData';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const currentSlide = PITCH_SLIDES[currentSlideIndex];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyFullScript = () => {
    const fullScript = PITCH_SLIDES.map(
      (s) =>
        `### SLIDE ${s.id}: ${s.title} (${s.duration})\n` +
        `Theme: ${s.keyTheme}\n\n` +
        `PRESENTER SCRIPT:\n${s.speakerNotes}\n\n` +
        `KEY BULLETS:\n${s.talkingPoints.map((p) => `- ${p}`).join('\n')}\n\n` +
        `EVALUATION CRITERIA: ${s.evaluationCriterion}\n` +
        `----------------------------------------\n`
    ).join('\n');

    navigator.clipboard.writeText(fullScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl bg-[#FAF7F2] dark:bg-[#120A06] rounded-2xl shadow-2xl border border-stone-300 dark:border-amber-950/60 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pitch-modal-title"
      >
        {/* Pitch Modal Header */}
        <div className="p-4 sm:p-5 bg-[#2B1810] dark:bg-[#1A0E08] text-[#FAF7F2] flex items-center justify-between border-b border-[#44281B] dark:border-amber-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#2B1810] flex items-center justify-center font-bold">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-300 tracking-wider uppercase">
                  BrewNest Café · Strategic Concept Deck
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-900/60 rounded text-amber-200 border border-amber-700/50">
                  Target: 3–5 Minutes
                </span>
              </div>
              <h2 id="pitch-modal-title" className="font-serif text-lg sm:text-xl font-bold text-white">
                Concept &amp; Business Showcase
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Stopwatch / Timer */}
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-900/40 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span className={`font-bold ${timerSeconds > 300 ? 'text-rose-400' : 'text-amber-200'}`}>
                {formatTimer(timerSeconds)}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1 hover:text-white transition-colors cursor-pointer ml-1"
                title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Pitch Deck"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Tracker Navigation Bar */}
        <div className="bg-[#FAF7F2] dark:bg-[#190F09] border-b border-stone-200 dark:border-amber-950/50 px-4 py-2.5 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5">
            {PITCH_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'bg-[#331C12] text-amber-200 shadow-2xs dark:bg-amber-500 dark:text-stone-950'
                    : 'bg-white dark:bg-[#251710] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#332017] border border-stone-200 dark:border-amber-950/40'
                }`}
              >
                Slide {slide.id}: {slide.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyFullScript}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-[#251710] hover:bg-stone-100 dark:hover:bg-[#332017] border border-stone-200 dark:border-amber-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Copy full presentation script to clipboard"
          >
            {copiedScript ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Script Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Slide Heading & Target Timing */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-amber-950/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                  Segment {currentSlide.id} of {PITCH_SLIDES.length}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  Suggested Time: {currentSlide.duration}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-[#F7EAE1] mt-1">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                Theme: {currentSlide.keyTheme}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800/40">
                <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Evaluation Rubric</span>
              </span>
            </div>
          </div>

          {/* Presenter Talking Points */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Key Talking Points (On-Slide Summary)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentSlide.talkingPoints.map((point, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-white dark:bg-[#190F09] rounded-xl border border-stone-200 dark:border-amber-950/50 text-xs text-stone-800 dark:text-stone-200 flex items-start gap-2 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 dark:bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verbatim Presenter Speaking Script */}
          <div className="p-4 sm:p-5 bg-amber-50/80 dark:bg-[#1E110A] rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider">
                Verbatim Presenter Speaking Notes (Read Aloud During Pitch)
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-400 italic">~45–60 seconds</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950/90 dark:text-amber-100/90 leading-relaxed font-serif">
              "{currentSlide.speakerNotes}"
            </p>
          </div>

          {/* Section Business Benchmark */}
          <div className="p-3 bg-stone-100 dark:bg-[#190F09] rounded-xl border border-stone-200 dark:border-amber-950/40 text-xs text-stone-600 dark:text-stone-300 flex items-center justify-between">
            <span><strong>Operational Focus:</strong> {currentSlide.evaluationCriterion}</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">BrewNest Standards</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white dark:bg-[#190F09] border-t border-stone-200 dark:border-amber-950/50 flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentSlideIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentSlideIndex === 0}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#251710] hover:bg-stone-200 dark:hover:bg-[#332017] rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          <span className="text-xs font-bold text-stone-600 dark:text-stone-300 font-mono">
            {currentSlideIndex + 1} / {PITCH_SLIDES.length}
          </span>

          <button
            onClick={() =>
              setCurrentSlideIndex((prev) =>
                Math.min(PITCH_SLIDES.length - 1, prev + 1)
              )
            }
            disabled={currentSlideIndex === PITCH_SLIDES.length - 1}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white dark:text-stone-950 bg-[#331C12] hover:bg-[#201109] dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

};

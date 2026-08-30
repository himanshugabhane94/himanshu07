import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Calendar } from 'lucide-react';

export default function TimelineSlider({ onDateRangeChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(100);

  const dates = [
    '2024-01-01', '2024-01-15', '2024-02-01', 
    '2024-02-15', '2024-03-01', '2024-03-15', '2024-04-01'
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 10;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    // Map currentStep (0 - 100) to date
    const idx = Math.min(dates.length - 1, Math.floor((currentStep / 100) * dates.length));
    const targetDate = dates[idx] + 'T23:59:59Z';
    if (onDateRangeChange) {
      onDateRangeChange(currentStep === 100 ? null : targetDate);
    }
  }, [currentStep]);

  const togglePlay = () => {
    if (currentStep >= 100) setCurrentStep(10);
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(100);
  };

  const currentIdx = Math.min(dates.length - 1, Math.floor((currentStep / 100) * dates.length));
  const activeDisplayDate = currentStep === 100 ? 'All Time (Full Network)' : dates[currentIdx];

  return (
    <div className="bg-[#090e1a]/95 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-4 text-xs">
      
      {/* Play Controls & Label */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 transition-all flex items-center gap-1 font-bold"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="text-[11px] hidden sm:inline">{isPlaying ? 'Pause' : 'Play Timeline'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
          title="Reset to Full Timeline"
        >
          <RotateCcw className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Timeline Horizon:</span>
          <strong className="text-cyan-300">{activeDisplayDate}</strong>
        </div>
      </div>

      {/* Range Slider */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        <span className="text-[10px] font-mono text-slate-500 hidden md:inline">Jan 2024</span>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={currentStep}
          onChange={(e) => setCurrentStep(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <span className="text-[10px] font-mono text-slate-500 hidden md:inline">Apr 2024</span>
      </div>

    </div>
  );
}

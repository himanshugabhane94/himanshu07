import React from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, 
  Volume2, VolumeX, X, Sparkles, Radio,
  Compass, Eye, CheckCircle2
} from 'lucide-react';

export default function GuidedDemoController({
  currentStep,
  totalSteps,
  stepData,
  isPaused,
  isMuted,
  onPauseToggle,
  onMuteToggle,
  onNext,
  onPrev,
  onExit
}) {
  if (!stepData) return null;

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-4xl animate-in slide-in-from-bottom-5 duration-200 select-none">
      <div className="rounded-3xl bg-[#141210]/95 backdrop-blur-xl border border-[#d68a1f]/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 space-y-3 relative overflow-hidden ring-1 ring-[#d68a1f]/30">
        
        {/* Top Header Strip: Step Indicator & Title & Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-2 border-b border-[#2a2620]">
          
          {/* Left: Step Badge & Audio Pulse */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#24211d] border border-[#d68a1f]/50 text-[#f5c074] text-xs font-mono font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#d68a1f] animate-ping" />
              <span>STEP {currentStep} OF {totalSteps}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#ece7de] font-serif">
                {stepData.title}
              </span>
              <span className="hidden sm:inline text-[11px] font-mono text-[#8a8478]">
                ({stepData.tab.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Right: Controller Buttons */}
          <div className="flex items-center gap-1.5 bg-[#0f0e0d] p-1 rounded-2xl border border-[#3a352d]">
            
            {/* Prev Button */}
            <button
              onClick={onPrev}
              disabled={currentStep <= 1}
              className="p-1.5 rounded-xl text-[#8a8478] hover:text-[#ece7de] hover:bg-[#1c1a17] disabled:opacity-30 transition-all"
              title="Previous Step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Pause / Resume Button */}
            <button
              onClick={onPauseToggle}
              className="px-2.5 py-1.5 rounded-xl bg-[#24211d] border border-[#d68a1f]/60 hover:border-[#d68a1f] text-[#f5c074] text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
              title={isPaused ? "Resume Walkthrough" : "Pause Walkthrough"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>

            {/* Next / Skip Button */}
            <button
              onClick={onNext}
              disabled={currentStep >= totalSteps}
              className="p-1.5 rounded-xl text-[#8a8478] hover:text-[#ece7de] hover:bg-[#1c1a17] disabled:opacity-30 transition-all"
              title="Next Step / Skip"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Mute / Unmute Button */}
            <button
              onClick={onMuteToggle}
              className={`p-1.5 rounded-xl transition-all ${
                isMuted ? 'text-[#e27d75] hover:bg-[#241a18]' : 'text-[#8a8478] hover:text-[#ece7de] hover:bg-[#1c1a17]'
              }`}
              title={isMuted ? "Unmute Voice Narration" : "Mute Voice Narration"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Exit Demo Button */}
            <button
              onClick={onExit}
              className="p-1.5 rounded-xl text-[#8a8478] hover:text-[#e27d75] hover:bg-[#241a18] transition-all ml-1"
              title="Exit Guided Demo"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Subtitle / Closed Caption Box */}
        <div className="p-3 rounded-2xl bg-[#0f0e0d] border border-[#2a2620] flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-[#1c1a17] border border-[#d68a1f]/40 text-[#f5c074] shrink-0 mt-0.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#d68a1f]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#ece7de] font-serif leading-relaxed tracking-wide">
              "{stepData.caption}"
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#0f0e0d] h-1.5 rounded-full overflow-hidden border border-[#2a2620]">
          <div 
            className="h-full bg-gradient-to-r from-[#d68a1f] to-[#f5c074] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

      </div>
    </div>
  );
}

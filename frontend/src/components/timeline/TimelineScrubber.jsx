import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Calendar, Sparkles, 
  ChevronRight, FastForward, Clock, ShieldAlert, 
  CheckCircle2, Milestone, ArrowRight, Eye
} from 'lucide-react';
import { api } from '../../services/api';

export default function TimelineScrubber({
  caseId,
  onTimelineChange,
  onSelectNode
}) {
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 4x
  const [progress, setProgress] = useState(100); // 0 to 100%
  const [currentDateStr, setCurrentDateStr] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const animTimerRef = useRef(null);

  // Fetch timeline data when case changes
  useEffect(() => {
    loadTimeline();
  }, [caseId]);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await api.getTimeline(caseId);
      setTimelineData(data);
      setProgress(100); // Start showing full network by default
      if (data && data.end_date) {
        setCurrentDateStr(data.end_date);
        const lastMilestone = data.milestones?.length ? data.milestones[data.milestones.length - 1] : null;
        setActiveMilestone(lastMilestone);
      }
    } catch (err) {
      console.error("Failed to load investigation timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current date and active entities based on progress (0 - 100)
  useEffect(() => {
    if (!timelineData || !timelineData.start_date || !timelineData.end_date) return;

    const startTime = new Date(timelineData.start_date).getTime();
    const endTime = new Date(timelineData.end_date).getTime();
    const totalDuration = endTime - startTime;

    // Current simulated timestamp
    const currentTimestamp = startTime + (progress / 100) * totalDuration;
    const currentIso = new Date(currentTimestamp).toISOString();
    setCurrentDateStr(currentIso);

    // Filter nodes and edges discovered on or before this date
    const activeNodes = (timelineData.nodes || []).filter(n => {
      if (!n.discovered_date) return true;
      return new Date(n.discovered_date).getTime() <= currentTimestamp;
    });

    const activeNodeIds = new Set(activeNodes.map(n => n.id));

    const activeEdges = (timelineData.edges || []).filter(e => {
      const edgeDate = e.discovered_date || e.timestamp;
      const isTimeValid = !edgeDate || new Date(edgeDate).getTime() <= currentTimestamp;
      return isTimeValid && activeNodeIds.has(e.source) && activeNodeIds.has(e.target);
    });

    const activeEdgeIds = new Set(activeEdges.map(e => e.id));

    // Find the latest milestone reached up to this timestamp
    const passedMilestones = (timelineData.milestones || []).filter(m => {
      return new Date(m.date).getTime() <= currentTimestamp;
    });
    const latestMilestone = passedMilestones.length > 0 ? passedMilestones[passedMilestones.length - 1] : null;
    setActiveMilestone(latestMilestone);

    // Notify GraphCanvas
    if (onTimelineChange) {
      onTimelineChange({
        timelineDate: progress >= 100 ? null : currentIso,
        progressPercent: progress,
        activeNodeIds: Array.from(activeNodeIds),
        activeEdgeIds: Array.from(activeEdgeIds),
        activeNodesCount: activeNodes.length,
        totalNodesCount: timelineData.total_nodes,
        activeEdgesCount: activeEdges.length,
        totalEdgesCount: timelineData.total_edges,
        activeMilestone: latestMilestone
      });
    }

  }, [progress, timelineData]);

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
      return;
    }

    const intervalMs = 60;
    const stepIncrement = (100 / (14 * 1000 / intervalMs)) * playbackSpeed;

    animTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return Math.min(100, prev + stepIncrement);
      });
    }, intervalMs);

    return () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    if (progress >= 100) {
      setProgress(2);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetToStart = () => {
    setIsPlaying(false);
    setProgress(2);
  };

  const handleResetToFull = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleJumpToMilestone = (m) => {
    if (!timelineData) return;
    const startTime = new Date(timelineData.start_date).getTime();
    const endTime = new Date(timelineData.end_date).getTime();
    const totalDuration = endTime - startTime;
    const mTime = new Date(m.date).getTime();
    const targetPercent = Math.max(2, Math.min(100, ((mTime - startTime) / totalDuration) * 100));
    setProgress(targetPercent);
    setIsPlaying(false);
    if (m.entity_id && onSelectNode) {
      onSelectNode(m.entity_id);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  if (!timelineData || !timelineData.start_date) return null;

  const startTime = new Date(timelineData.start_date).getTime();
  const endTime = new Date(timelineData.end_date).getTime();
  const totalDuration = Math.max(1, endTime - startTime);

  return (
    <div className="w-full bg-[#1c1a17] border-t border-[#3a352d] shadow-dossier select-none">
      
      {/* Top Control Strip */}
      <div className="px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2620]">
        
        {/* Left: Playback & Horizon Indicators */}
        <div className="flex items-center gap-3">
          
          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isPlaying
                ? 'bg-[#a5342a] hover:bg-[#73221b] text-white'
                : 'bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
          </button>

          {/* Reset to Inception */}
          <button
            onClick={handleResetToStart}
            className="p-1.5 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#8a8478] hover:text-[#ece7de] border border-[#3a352d]"
            title="Rewind to Day 1 of Investigation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Playback Speed Multiplier */}
          <div className="flex items-center rounded-xl bg-[#0f0e0d] border border-[#3a352d] p-0.5 text-[10px] font-mono">
            {[1, 2, 4].map(spd => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg transition-all font-bold ${
                  playbackSpeed === spd
                    ? 'bg-[#d68a1f] text-[#0f0e0d]'
                    : 'text-[#8a8478] hover:text-[#ece7de]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Current Date Horizon Display */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#d68a1f]" />
            <span className="text-[#8a8478]">Horizon:</span>
            <strong className="text-[#f5c074] font-bold">
              {progress >= 100 ? `Full Network (${formatDate(timelineData.end_date)})` : formatDate(currentDateStr)}
            </strong>
          </div>
        </div>

        {/* Right: Real-time Discovery Counters & Jump to Full */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 text-[#8a8478]">
            <span>Discovered:</span>
            <span className="text-[#ece7de] font-bold">
              {timelineData.nodes?.filter(n => !n.discovered_date || new Date(n.discovered_date).getTime() <= (startTime + (progress / 100) * totalDuration)).length}
              <span className="text-[#666157]"> / {timelineData.total_nodes} Entities</span>
            </span>
            <span className="text-[#3a352d]">|</span>
            <span className="text-[#5c7a5c] font-bold">
              {Math.round(progress)}% Unfolded
            </span>
          </div>

          <button
            onClick={handleResetToFull}
            className="px-2.5 py-1 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] border border-[#3a352d] text-[11px] font-bold font-mono"
          >
            Full Case View
          </button>
        </div>

      </div>

      {/* Main Scrubber Track & Milestone Diamonds */}
      <div className="px-6 py-3 space-y-2">
        <div className="relative flex items-center">
          
          {/* Background Timeline Range Bar */}
          <div className="relative w-full h-2.5 bg-[#0f0e0d] rounded-full border border-[#3a352d] overflow-visible">
            
            {/* Active Progress Fill */}
            <div 
              className="h-full bg-gradient-to-r from-[#d68a1f]/40 to-[#d68a1f] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />

            {/* Milestone Diamond Markers Along Track */}
            {(timelineData.milestones || []).map((m, idx) => {
              const mTime = new Date(m.date).getTime();
              const mPercent = Math.max(0, Math.min(100, ((mTime - startTime) / totalDuration) * 100));
              const isPassed = progress >= mPercent;

              return (
                <div
                  key={idx}
                  onClick={() => handleJumpToMilestone(m)}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer group z-20"
                  style={{ left: `${mPercent}%` }}
                  title={`${formatDate(m.date)}: ${m.title}`}
                >
                  <div className={`w-3.5 h-3.5 rotate-45 border transition-all duration-200 flex items-center justify-center ${
                    isPassed
                      ? 'bg-[#d68a1f] border-[#ece7de] shadow-md scale-110'
                      : 'bg-[#24211d] border-[#666157] group-hover:border-[#d68a1f] group-hover:scale-125'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${isPassed ? 'bg-[#0f0e0d]' : 'bg-[#666157]'}`} />
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 bg-[#1c1a17] border border-[#d68a1f] px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#ece7de] whitespace-nowrap shadow-xl z-30 shadow-dossier">
                    <span className="text-[#f5c074] font-bold">{formatDate(m.date)}</span>: {m.node_label || m.title}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Interactive Range Input */}
          <input
            type="range"
            min="2"
            max="100"
            step="0.5"
            value={progress}
            onMouseDown={() => setIsScrubbing(true)}
            onMouseUp={() => setIsScrubbing(false)}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />

        </div>

        {/* Date Axis Scale Markers */}
        <div className="flex justify-between items-center text-[10px] font-mono text-[#8a8478] px-1">
          <span>{formatDate(timelineData.start_date)} (FIR Inception)</span>
          <span>{formatDate(new Date(startTime + totalDuration * 0.33).toISOString())}</span>
          <span>{formatDate(new Date(startTime + totalDuration * 0.66).toISOString())}</span>
          <span>{formatDate(timelineData.end_date)} (Chargesheet Filed)</span>
        </div>
      </div>

      {/* Cinematic Dramatic Milestone Callout Banner */}
      {activeMilestone && (
        <div className="px-5 py-2 bg-[#141311] border-t border-[#2a2620] flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-5 h-5 rounded-lg bg-[#d68a1f]/20 border border-[#d68a1f]/40 flex items-center justify-center text-[#d68a1f] shrink-0">
              <Sparkles className="w-3 h-3 animate-pulse" />
            </div>
            <div className="truncate">
              <span className="font-mono font-bold text-[#f5c074] uppercase text-[10px] mr-2">
                [KEY BREAKTHROUGH • {formatDate(activeMilestone.date)}]
              </span>
              <strong className="text-[#ece7de] font-serif">{activeMilestone.title}: </strong>
              <span className="text-[#8a8478] font-serif italic">{activeMilestone.description}</span>
            </div>
          </div>

          {activeMilestone.entity_id && (
            <button
              onClick={() => onSelectNode && onSelectNode(activeMilestone.entity_id)}
              className="px-2.5 py-1 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#f5c074] border border-[#3a352d] text-[10px] font-mono shrink-0 flex items-center gap-1 transition-all active:scale-95"
            >
              <Eye className="w-3 h-3" />
              <span>Inspect Suspect</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
}

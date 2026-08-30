import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, AlertTriangle, ArrowRight, 
  ExternalLink, Sparkles, Flame, CheckCircle2 
} from 'lucide-react';
import { api } from '../../services/api';

export default function CasePriorityWidget({ onSelectCase, onOpenFullQueue }) {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPriorityQueue()
      .then(res => {
        setQueueData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load priority queue widget:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !queueData) return null;

  const topCases = queueData.cases_queue?.slice(0, 3) || [];

  return (
    <div className="p-4 rounded-2xl bg-[#0f0e0d]/90 backdrop-blur-md border border-[#3a352d] shadow-dossier space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#e27d75] animate-pulse" />
          <span className="font-bold text-xs text-[#ece7de] font-serif uppercase tracking-wider">
            Urgent Triage Queue (Top Cases)
          </span>
        </div>
        
        <button
          onClick={onOpenFullQueue}
          className="text-[11px] text-[#f5c074] hover:text-[#ece7de] font-mono flex items-center gap-1 transition-all"
        >
          <span>View All ({queueData.total_cases_analyzed})</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Top 3 Cases List */}
      <div className="space-y-2">
        {topCases.map((c, idx) => {
          const isCritical = c.priority_score >= 80;
          return (
            <div
              key={c.case_id}
              onClick={() => onSelectCase(c.case_id)}
              className={`p-2.5 rounded-xl bg-[#1c1a17] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isCritical 
                  ? 'border-[#a5342a]/60 hover:border-[#e27d75]' 
                  : 'border-[#3a352d] hover:border-[#d68a1f]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg border text-xs font-mono font-bold shrink-0 ${
                  isCritical 
                    ? 'bg-[#241a18] border-[#a5342a] text-[#e27d75]' 
                    : 'bg-[#242018] border-[#d68a1f] text-[#f5c074]'
                }`}>
                  <span>{c.priority_score}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-mono text-xs font-bold text-[#ece7de]">{c.fir_number}</span>
                    <span className="text-[10px] text-[#8a8478] font-serif truncate">— {c.title}</span>
                  </div>
                  <div className="text-[10px] text-[#8a8478] font-mono mt-0.5 flex items-center gap-2">
                    <span className="text-[#d68a1f]">{c.crime_category}</span>
                    <span>•</span>
                    <span>{c.cross_case_links_count} Syndicate Links</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <button className="p-1 rounded-lg bg-[#24211d] border border-[#3a352d] hover:border-[#d68a1f] text-[#f5c074] text-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

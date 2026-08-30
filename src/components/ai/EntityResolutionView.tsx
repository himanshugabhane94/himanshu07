'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { EntityMatchCandidate } from '@/types/synapx';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Eye, 
  Scale,
  RefreshCw
} from 'lucide-react';
import { RedactedText } from '@/components/common/RedactedText';

export function EntityResolutionView() {
  const { matchCandidates, acceptEntityMatch, rejectEntityMatch } = useInvestigation();
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(matchCandidates[0]?.id || 'MATCH-01');

  const selectedCandidate = matchCandidates.find(c => c.id === selectedCandidateId) || matchCandidates[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-obsidian-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">AI Entity Resolution Engine</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Fuzzy alias clustering and multi-attribute identity deduplication. Human verification required before merging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Human-in-the-Loop Enforced</span>
          </span>
        </div>
      </div>

      {/* Main Candidate Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Pending Candidates Queue */}
        <div className="synapx-card p-4 bg-obsidian-850 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center justify-between pb-2 border-b border-obsidian-700">
            <span>Duplicate Candidates Queue</span>
            <span className="text-teal-400 font-mono">{matchCandidates.length} Items</span>
          </div>

          <div className="space-y-2.5">
            {matchCandidates.map((cand) => {
              const isAccepted = cand.status === 'ACCEPTED_MERGED';
              const isRejected = cand.status === 'REJECTED_SEPARATE';
              return (
                <button
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedCandidateId === cand.id
                      ? 'bg-teal-500/15 border-teal-500/50 shadow-sm'
                      : 'bg-obsidian-900 hover:bg-obsidian-750 border-obsidian-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400">{cand.id}</span>
                    <span className="text-xs font-mono font-bold text-teal-400">
                      {cand.matchScore}% Match
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200">
                    {cand.primaryEntity.name} <span className="text-slate-500">vs</span> {cand.candidateEntity.name}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 truncate max-w-[130px]">{cand.primaryEntity.orgAffiliation}</span>
                    {isAccepted ? (
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">MERGED</span>
                    ) : isRejected ? (
                      <span className="text-red-400 font-bold bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">REJECTED</span>
                    ) : (
                      <span className="text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">NEEDS REVIEW</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Side-by-Side Entity Comparison & Radar Attributes */}
        <div className="lg:col-span-2 synapx-card p-6 bg-obsidian-850 space-y-6 flex flex-col justify-between">
          <div>
            {/* Header & Overall Match Meter */}
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700 gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">Candidate Match ID: {selectedCandidate.id}</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">
                  &quot;{selectedCandidate.primaryEntity.name}&quot; & &quot;{selectedCandidate.candidateEntity.name}&quot;
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Fuzzy Match Score</div>
                  <div className="text-xl font-mono font-extrabold text-teal-400">{selectedCandidate.matchScore}%</div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Entity Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              
              {/* Primary Entity (Record A) */}
              <div className="p-4 rounded-xl bg-obsidian-900 border border-teal-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-obsidian-800">
                  <span className="font-mono text-teal-400 font-bold uppercase">PRIMARY RECORD (A)</span>
                  <span className="text-[10px] text-slate-400">{selectedCandidate.primaryEntity.id}</span>
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-100">{selectedCandidate.primaryEntity.name}</div>
                  <div className="text-xs text-slate-400">{selectedCandidate.primaryEntity.role}</div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-obsidian-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Org:</span>
                    <span className="font-semibold text-slate-200">{selectedCandidate.primaryEntity.orgAffiliation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Phone:</span>
                    <RedactedText value={selectedCandidate.primaryEntity.phone} type="phone" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">PAN/Tax ID:</span>
                    <RedactedText value={selectedCandidate.primaryEntity.taxIdOrAadhaar} type="taxId" />
                  </div>
                </div>
              </div>

              {/* Candidate Entity (Record B) */}
              <div className="p-4 rounded-xl bg-obsidian-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-obsidian-800">
                  <span className="font-mono text-amber-400 font-bold uppercase">CANDIDATE ALIAS (B)</span>
                  <span className="text-[10px] text-slate-400">{selectedCandidate.candidateEntity.id}</span>
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-100">{selectedCandidate.candidateEntity.name}</div>
                  <div className="text-xs text-slate-400">{selectedCandidate.candidateEntity.role}</div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-obsidian-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Org:</span>
                    <span className="font-semibold text-slate-200">{selectedCandidate.candidateEntity.orgAffiliation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Phone:</span>
                    <RedactedText value={selectedCandidate.candidateEntity.phone} type="phone" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">PAN/Tax ID:</span>
                    <RedactedText value={selectedCandidate.candidateEntity.taxIdOrAadhaar} type="taxId" />
                  </div>
                </div>
              </div>

            </div>

            {/* Similarity Score Breakdown Bars */}
            <div className="mt-6 p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-300 font-bold">
                Attribute Similarity Score Breakdown
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Name String:</span>
                    <strong className="text-teal-400">{selectedCandidate.nameSimilarity}%</strong>
                  </div>
                  <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400" style={{ width: `${selectedCandidate.nameSimilarity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Org / Affiliation:</span>
                    <strong className="text-amber-400">{selectedCandidate.orgSimilarity}%</strong>
                  </div>
                  <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${selectedCandidate.orgSimilarity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Metadata Overlap:</span>
                    <strong className="text-teal-300">{selectedCandidate.metadataSimilarity}%</strong>
                  </div>
                  <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-300" style={{ width: `${selectedCandidate.metadataSimilarity}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Timeline Overlap:</span>
                    <strong className="text-cyan-400">{selectedCandidate.timelineOverlap}%</strong>
                  </div>
                  <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${selectedCandidate.timelineOverlap}%` }} />
                  </div>
                </div>
              </div>

              {/* Match Reasons List */}
              <div className="mt-3 pt-3 border-t border-obsidian-800">
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">Corroborating Match Signals</div>
                <ul className="space-y-1">
                  {selectedCandidate.matchReasons.map((reason, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons: Accept Match, Reject, Review Later */}
          <div className="pt-4 border-t border-obsidian-700 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-slate-400">
              {selectedCandidate.status === 'ACCEPTED_MERGED' ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Merged and added as recognized alias.
                </span>
              ) : selectedCandidate.status === 'REJECTED_SEPARATE' ? (
                <span className="text-red-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Marked as distinct unrelated entities.
                </span>
              ) : (
                <span>Verification required to update knowledge graph.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => rejectEntityMatch(selectedCandidate.id)}
                className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 text-xs font-medium border border-obsidian-700 transition-colors"
              >
                Reject Match
              </button>

              <button
                onClick={() => acceptEntityMatch(selectedCandidate.id)}
                className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-teal transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Match (Human Verified)</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

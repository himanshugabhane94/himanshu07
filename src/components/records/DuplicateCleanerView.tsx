'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Trash2,
  FileCheck,
  History
} from 'lucide-react';

export function DuplicateCleanerView() {
  const { duplicateRecords, mergeDuplicateRecords, dismissDuplicateRecord } = useInvestigation();
  const [selectedPairId, setSelectedPairId] = useState<string>(duplicateRecords[0]?.id || 'DUP-01');

  const selectedPair = duplicateRecords.find(p => p.id === selectedPairId) || duplicateRecords[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-obsidian-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <Copy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">Smart Duplicate Record Cleaner</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Detects redundant corporate filings, GST registrations, and customs declarations with safe merge provenance tracking.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audit Provenance Preserved</span>
        </span>
      </div>

      {/* Duplicate Pairs Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Duplicate Candidates Queue */}
        <div className="synapx-card p-4 bg-obsidian-850 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center justify-between pb-2 border-b border-obsidian-700">
            <span>Duplicate Records Queue</span>
            <span className="text-teal-400 font-mono">{duplicateRecords.length} Pairs</span>
          </div>

          <div className="space-y-2.5">
            {duplicateRecords.map((pair) => (
              <button
                key={pair.id}
                onClick={() => setSelectedPairId(pair.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedPairId === pair.id
                    ? 'bg-teal-500/15 border-teal-500/50 shadow-sm'
                    : 'bg-obsidian-900 hover:bg-obsidian-750 border-obsidian-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">{pair.id}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{pair.similarityScore}% Similar</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">{pair.recordA.title}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{pair.recordB.title}</div>
                <div className="mt-2 text-[10px]">
                  {pair.status === 'MERGED' ? (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">MERGED & AUDITED</span>
                  ) : pair.status === 'DISMISSED' ? (
                    <span className="text-slate-400 font-bold bg-slate-500/10 px-1.5 py-0.2 rounded border border-slate-500/20">KEPT SEPARATE</span>
                  ) : (
                    <span className="text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">PENDING REVIEW</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Side-by-Side Record Comparison */}
        <div className="lg:col-span-2 synapx-card p-6 bg-obsidian-850 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700">
              <div>
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">Pair ID: {selectedPair.id}</span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">Side-by-Side Record Comparison</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Similarity Overlap</span>
                <div className="text-xl font-mono font-extrabold text-amber-400">{selectedPair.similarityScore}%</div>
              </div>
            </div>

            {/* Side-by-Side Record Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              
              {/* Record A */}
              <div className="p-4 rounded-xl bg-obsidian-900 border border-teal-500/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-obsidian-800">
                  <span className="font-mono text-teal-400 font-bold uppercase">RECORD A (ORIGINAL)</span>
                  <span className="text-[10px] text-slate-400">{selectedPair.recordA.id}</span>
                </div>
                <div className="text-sm font-bold text-slate-100">{selectedPair.recordA.title}</div>
                <div className="text-xs text-slate-400">Source: <strong className="text-slate-200">{selectedPair.recordA.source}</strong></div>
                <div className="text-xs text-slate-400">Date: {selectedPair.recordA.date}</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-obsidian-800">
                  {selectedPair.recordA.summary}
                </p>
              </div>

              {/* Record B */}
              <div className="p-4 rounded-xl bg-obsidian-900 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-obsidian-800">
                  <span className="font-mono text-amber-400 font-bold uppercase">RECORD B (CANDIDATE DUPLICATE)</span>
                  <span className="text-[10px] text-slate-400">{selectedPair.recordB.id}</span>
                </div>
                <div className="text-sm font-bold text-slate-100">{selectedPair.recordB.title}</div>
                <div className="text-xs text-slate-400">Source: <strong className="text-slate-200">{selectedPair.recordB.source}</strong></div>
                <div className="text-xs text-slate-400">Date: {selectedPair.recordB.date}</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-obsidian-800">
                  {selectedPair.recordB.summary}
                </p>
              </div>

            </div>

            {/* Overlapping Attributes */}
            <div className="mt-4 p-4 rounded-xl bg-obsidian-900 border border-obsidian-750">
              <div className="text-xs font-mono uppercase text-slate-300 font-bold mb-2">
                Matched Redundant Attributes (4 Overlaps)
              </div>
              <ul className="space-y-1.5">
                {selectedPair.overlappingAttributes.map((attr, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>{attr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Merge Actions */}
          <div className="pt-4 border-t border-obsidian-700 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-slate-400">
              Merging consolidates entities while archiving raw source records in the Evidence Vault.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => dismissDuplicateRecord(selectedPair.id)}
                className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-medium border border-obsidian-700 transition-colors"
              >
                Keep Separate
              </button>

              <button
                onClick={() => mergeDuplicateRecords(selectedPair.id)}
                className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-teal transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>Merge After Verification</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  Link2, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Share2, 
  Briefcase, 
  Users, 
  Building, 
  Hash, 
  CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

export default function RelatedCasesPage() {
  const { cases, activeCase, entities } = useInvestigation();

  const relatedSuggestions = activeCase.suggestedRelatedCaseIds || [];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Link2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Cross-Case Linkage & Pattern Matching
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Automated correlation across shared digital infrastructure, customs brokers, and shell company networks.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested for Review — AI Decision Support</span>
          </span>
        </div>

        {/* Current Active Case Context */}
        <div className="synapx-card p-5 bg-obsidian-850 border border-obsidian-700">
          <div className="text-[10px] font-mono uppercase text-teal-400 font-bold mb-1">
            Active Baseline Investigation
          </div>
          <h3 className="text-base font-bold text-slate-100">{activeCase.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{activeCase.caseNumber} • Lead: {activeCase.leadInvestigator}</p>
        </div>

        {/* Suggested Related Cases Grid */}
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase font-bold text-slate-300">
            Detected Cross-Case Corroborations ({relatedSuggestions.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {relatedSuggestions.map((rel, idx) => {
              const matchedCase = cases.find(c => c.id === rel.caseId);
              return (
                <div
                  key={idx}
                  className="synapx-card p-6 bg-obsidian-850 border border-teal-500/30 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-teal-400">{rel.caseId}</span>
                      <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
                        {rel.similarityScore}% Similarity
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">
                      {matchedCase ? matchedCase.title : `Investigation ${rel.caseId}`}
                    </h4>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {matchedCase?.description}
                    </p>

                    {/* Match Rationale Card */}
                    <div className="mt-4 p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 space-y-1 text-xs">
                      <div className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Overlap Rationale & Shared Signatures</span>
                      </div>
                      <p className="text-slate-300 italic">{rel.matchRationale}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-obsidian-750 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">Status: Suggested Review</span>
                    <Link
                      href={`/cases/${rel.caseId}`}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
                    >
                      <span>Inspect Corroborated Case</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

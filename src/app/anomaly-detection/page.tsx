'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { ExplainableAiCard } from '@/components/common/ExplainableAiCard';
import { 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  CheckCircle2, 
  ArrowRight, 
  Activity,
  Layers,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function AnomalyDetectionPage() {
  const { aiFindings, activeCase, highlightEntitiesOnGraph } = useInvestigation();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredFindings = aiFindings.filter(f => {
    if (filterStatus !== 'ALL' && f.reviewStatus !== filterStatus) return false;
    if (filterType !== 'ALL' && f.findingType !== filterType) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                AI Anomaly Detection & Explainable Findings
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Automated pattern scanner for circular fund velocity, covert bridge nodes, and timeline volume spikes.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Strict Decision-Support Framing</span>
          </span>
        </div>

        {/* Filters */}
        <div className="synapx-card p-4 bg-obsidian-850 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-mono text-[10px]">REVIEW STATUS:</span>
            {['ALL', 'NEEDS_REVIEW', 'REVIEWED', 'CONFIRMED', 'DISMISSED'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[10px]">ANOMALY TYPE:</span>
            {['ALL', 'HIDDEN_BRIDGE', 'CYCLIC_TRANSFER', 'UNUSUAL_EXPANSION'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filterType === t
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Explainable AI Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFindings.map((finding) => (
            <ExplainableAiCard
              key={finding.id}
              finding={finding}
              showActions={true}
            />
          ))}
        </div>

        {/* Bottom Educational Banner on Explainable AI Trust */}
        <div className="synapx-card p-5 bg-obsidian-900 border border-obsidian-750 flex items-start gap-3 text-xs text-slate-300">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-slate-100 font-semibold">SYNAPX AI Trust Standard:</strong>
            <p>
              Every finding above provides full evidentiary provenance, mathematical confidence scoring, and explicit reasons why it was flagged. No black-box accusations are made. Human investigator verification is mandatory before judicial submission.
            </p>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

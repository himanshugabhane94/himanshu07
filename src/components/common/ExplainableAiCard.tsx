'use client';

import React from 'react';
import { ExplainableAiFinding } from '@/types/synapx';
import { useInvestigation } from '@/context/InvestigationContext';
import { Sparkles, AlertTriangle, CheckCircle2, XCircle, ChevronRight, Eye, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface ExplainableAiCardProps {
  finding: ExplainableAiFinding;
  onViewOnGraph?: (entityIds: string[]) => void;
  showActions?: boolean;
}

export function ExplainableAiCard({ finding, onViewOnGraph, showActions = true }: ExplainableAiCardProps) {
  const { reviewAiFinding, highlightEntitiesOnGraph } = useInvestigation();

  const handleHighlight = () => {
    if (onViewOnGraph) {
      onViewOnGraph(finding.affectedEntityIds);
    } else {
      highlightEntitiesOnGraph(finding.affectedEntityIds);
    }
  };

  const getStatusBadge = () => {
    switch (finding.reviewStatus) {
      case 'CONFIRMED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>;
      case 'DISMISSED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">Dismissed</span>;
      case 'REVIEWED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">Analyst Reviewed</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">Needs Review</span>;
    }
  };

  return (
    <div className="synapx-card synapx-card-hover p-4 relative border-l-4 border-l-amber-500 flex flex-col justify-between">
      <div>
        {/* Header with type & confidence */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-amber-400">
              {finding.findingType.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Confidence: <strong className="text-teal-400 font-bold">{finding.confidence}%</strong>
            </span>
            {getStatusBadge()}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-slate-100 mb-1.5 leading-snug">
          {finding.title}
        </h4>

        {/* Core Finding */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {finding.finding}
        </p>

        {/* Why Flagged (Explainability Pillar) */}
        <div className="mb-3 p-2.5 rounded bg-obsidian-950/60 border border-obsidian-700/60">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Why Flagged (Explainability Rationale)
          </div>
          <p className="text-xs text-slate-300 italic">
            &ldquo;{finding.whyFlagged}&rdquo;
          </p>
        </div>

        {/* Evidence Points */}
        {finding.evidence && finding.evidence.length > 0 && (
          <div className="mb-3">
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
              Corroborating Evidence ({finding.evidence.length})
            </div>
            <ul className="space-y-1">
              {finding.evidence.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                  <span className="text-teal-400 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested Action */}
        <div className="text-xs text-teal-300 bg-teal-950/30 border border-teal-800/40 p-2 rounded mb-3 flex items-start gap-1.5">
          <span className="font-semibold text-teal-400 shrink-0">Recommendation:</span>
          <span>{finding.suggestedAction}</span>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-2 border-t border-obsidian-700/60 flex items-center justify-between gap-2 flex-wrap text-xs">
        <button
          onClick={handleHighlight}
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View on Graph
        </button>

        {showActions && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => reviewAiFinding(finding.id, 'REVIEWED')}
              className="px-2 py-1 rounded text-[11px] font-medium bg-obsidian-750 text-slate-300 hover:bg-obsidian-700 transition-colors"
            >
              Mark Reviewed
            </button>
            <button
              onClick={() => reviewAiFinding(finding.id, 'CONFIRMED')}
              className="px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
            >
              Accept Finding
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

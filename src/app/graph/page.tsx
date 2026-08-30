'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { InteractiveNetworkGraph } from '@/components/graph/InteractiveNetworkGraph';
import { useInvestigation } from '@/context/InvestigationContext';
import { Share2, Network, Dna, Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';

function GraphContent() {
  const searchParams = useSearchParams();
  const focusParam = searchParams.get('focus') === 'true';
  const entityParam = searchParams.get('entity') || undefined;

  const { activeCase, entities, relationships } = useInvestigation();

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <Share2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              Multi-Layer Relationship Knowledge Graph
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active: <strong className="text-slate-200">{activeCase.title.split(':')[0]}</strong> ({entities.length} Nodes, {relationships.length} Links)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hidden-bridges"
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Network className="w-4 h-4" />
            <span>Hidden Bridges</span>
          </Link>
          <Link
            href="/indirect-connections"
            className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-semibold border border-obsidian-700 transition-colors"
          >
            Pathfinder
          </Link>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 min-h-0">
        <InteractiveNetworkGraph initialFocusEntityId={entityParam} forceFocusMode={focusParam} />
      </div>
    </div>
  );
}

export default function GraphPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-teal-400 font-mono">Loading Knowledge Graph Engine...</div>}>
        <GraphContent />
      </Suspense>
    </AppLayout>
  );
}

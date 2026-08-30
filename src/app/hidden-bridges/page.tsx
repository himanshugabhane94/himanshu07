'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { InteractiveNetworkGraph } from '@/components/graph/InteractiveNetworkGraph';
import { 
  Network, 
  Sparkles, 
  ShieldAlert, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Share2, 
  Zap, 
  Activity,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function HiddenBridgesPage() {
  const { entities, relationships, highlightEntitiesOnGraph, aiFindings } = useInvestigation();
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>('ENT-P-01');

  const bridgeEntities = entities.filter(e => e.isBridgeCandidate);
  const selectedEntity = entities.find(e => e.id === selectedBridgeId) || bridgeEntities[0];

  const handleHighlightBridge = () => {
    highlightEntitiesOnGraph(['ENT-P-01', 'ENT-O-01', 'ENT-O-02']);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                <Network className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Hidden Bridge Entity Detector
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Isolate covert conduit nodes linking structurally independent syndicate sub-clusters using betweenness centrality.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Algorithmic Centrality Analysis</span>
          </span>
        </div>

        {/* Bridge Visual Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Bridge Candidates List & Centrality Metrics */}
          <div className="synapx-card p-5 bg-obsidian-850 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold uppercase text-slate-300 pb-2 border-b border-obsidian-700">
                Detected Bridge Entities ({bridgeEntities.length})
              </div>

              {bridgeEntities.map((bridge) => (
                <div
                  key={bridge.id}
                  onClick={() => setSelectedBridgeId(bridge.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedBridgeId === bridge.id
                      ? 'bg-amber-500/15 border-amber-500/60 shadow-glow-amber'
                      : 'bg-obsidian-900 hover:bg-obsidian-750 border-obsidian-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">TOP BRIDGE CONDUIT</span>
                    <span className="text-xs font-mono font-bold text-teal-400">91% Confidence</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{bridge.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{bridge.roleOrDesignation}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-obsidian-750 text-[10px] font-mono text-slate-300">
                    <div>Betweenness: <strong className="text-amber-400">0.84</strong></div>
                    <div>Clusters: <strong className="text-teal-300">2 Connected</strong></div>
                  </div>
                </div>
              ))}

              {/* Explanatory Context */}
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2 text-xs">
                <div className="font-mono uppercase font-bold text-amber-400 text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Why Flagged as a Hidden Bridge</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  <strong>{selectedEntity?.name}</strong> connects the <strong>Invoicing Cluster</strong> (Surya Bullion) and <strong>Maritime Freight Cluster</strong> (Apex Global Logistics). Without this individual, the two clusters share zero registered corporate overlap in public filings.
                </p>
                <div className="pt-2 border-t border-obsidian-800 text-[10px] text-slate-400">
                  Corroboration: BKC Conclave Search Warrant Cache (EVD-07) + Shared Server Auth Logs.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-obsidian-700">
              <button
                onClick={handleHighlightBridge}
                className="w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center justify-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Highlight Bridge Nodes on Graph</span>
              </button>
            </div>
          </div>

          {/* Right 2 Cols: Interactive Graph with Bridge Focus */}
          <div className="lg:col-span-2 h-[600px]">
            <InteractiveNetworkGraph
              initialFocusEntityId="ENT-P-01"
              forceFocusMode={false}
            />
          </div>

        </div>

      </div>
    </AppLayout>
  );
}

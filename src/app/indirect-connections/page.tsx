'use client';

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { InteractiveNetworkGraph } from '@/components/graph/InteractiveNetworkGraph';
import { 
  GitFork, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Share2,
  Navigation
} from 'lucide-react';

export default function IndirectConnectionsPage() {
  const { entities, relationships, highlightEntitiesOnGraph } = useInvestigation();

  const [sourceEntityId, setSourceEntityId] = useState<string>('ENT-P-01'); // Ramesh Kumar
  const [targetEntityId, setTargetEntityId] = useState<string>('ENT-P-02'); // Vikramaditya Sharma

  const sourceEntity = entities.find(e => e.id === sourceEntityId) || entities[0];
  const targetEntity = entities.find(e => e.id === targetEntityId) || entities[1];

  // Primary Path (Physical Surveillance & Meeting Chain)
  const primaryPath = ['ENT-P-01', 'ENT-E-03', 'ENT-O-01', 'ENT-P-02'];
  
  // Secondary Path (Financial Invoicing & Customs Manifest Chain)
  const secondaryPath = ['ENT-P-01', 'ENT-O-02', 'ENT-O-05', 'ENT-O-01', 'ENT-P-02'];

  const handleHighlightPath = (path: string[]) => {
    highlightEntitiesOnGraph(path);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Navigation className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Indirect Connection & Relational Pathfinder
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Traverse multi-hop relational chains between any two target suspects or corporate entities.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Shortest Evidentiary Path Traversal</span>
          </span>
        </div>

        {/* Pathfinder Controls & Graph Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Target Selectors & Computed Paths */}
          <div className="synapx-card p-5 bg-obsidian-850 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Selectors */}
              <div className="space-y-3 p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-teal-400 font-bold mb-1">
                    Origin Node (Entity A)
                  </label>
                  <select
                    value={sourceEntityId}
                    onChange={(e) => setSourceEntityId(e.target.value)}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg p-2 text-xs text-slate-100 font-semibold"
                  >
                    {entities.map(ent => (
                      <option key={ent.id} value={ent.id}>{ent.name} ({ent.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-amber-400 font-bold mb-1">
                    Destination Node (Entity B)
                  </label>
                  <select
                    value={targetEntityId}
                    onChange={(e) => setTargetEntityId(e.target.value)}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg p-2 text-xs text-slate-100 font-semibold"
                  >
                    {entities.map(ent => (
                      <option key={ent.id} value={ent.id}>{ent.name} ({ent.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Computed Path 1: Physical Surveillance Chain */}
              <div className="p-4 rounded-xl bg-obsidian-900 border border-teal-500/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase font-bold text-teal-400">PATHWAY 1: 3-HOP PHYSICAL LINK</span>
                  <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded">94% Confidence</span>
                </div>

                {/* Trajectory Stepper */}
                <div className="space-y-1.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <strong>Ramesh Kumar</strong> (Managing Director)
                  </div>
                  <div className="text-[10px] text-slate-400 pl-4">↓ Attended physical meeting at Trident BKC</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <strong>BKC Coordination Conclave</strong> (Event)
                  </div>
                  <div className="text-[10px] text-slate-400 pl-4">↓ Jointly reviewed customs shipping papers for</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <strong>Apex Global Logistics</strong> (Freight Consignee)
                  </div>
                  <div className="text-[10px] text-slate-400 pl-4">↓ Direct operational control by</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <strong>Vikramaditya Sharma</strong> (Logistics Head)
                  </div>
                </div>

                <button
                  onClick={() => handleHighlightPath(primaryPath)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-500/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Highlight Path 1 on Graph</span>
                </button>
              </div>

              {/* Computed Path 2: Financial Wire & Manifest Chain */}
              <div className="p-4 rounded-xl bg-obsidian-900 border border-amber-500/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase font-bold text-amber-400">PATHWAY 2: 4-HOP COMMERCIAL LINK</span>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">88% Confidence</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Surya Bullion remitted funds to Al-Zahra Dubai, which subsequently consigned container #MSCU-889104 directly to Apex Global Logistics.
                </p>
                <button
                  onClick={() => handleHighlightPath(secondaryPath)}
                  className="w-full mt-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Highlight Path 2 on Graph</span>
                </button>
              </div>

            </div>

            <div className="pt-3 border-t border-obsidian-700 text-[11px] text-slate-400">
              Evidence based on CCTV log DOC-03 & Seizure Panchnama DOC-02.
            </div>
          </div>

          {/* Right 2 Cols: Interactive Graph with Trajectory Highlight */}
          <div className="lg:col-span-2 h-[600px]">
            <InteractiveNetworkGraph
              initialFocusEntityId={sourceEntityId}
              highlightPath={primaryPath}
              forceFocusMode={false}
            />
          </div>

        </div>

      </div>
    </AppLayout>
  );
}

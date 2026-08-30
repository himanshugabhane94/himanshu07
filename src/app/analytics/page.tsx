'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  BarChart3, 
  TrendingUp, 
  Share2, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Layers, 
  PieChart, 
  Network
} from 'lucide-react';

export default function AnalyticsPage() {
  const { entities, relationships, activeCase, aiFindings } = useInvestigation();

  const entityTypeCounts = {
    PERSON: entities.filter(e => e.type === 'PERSON').length,
    ORGANIZATION: entities.filter(e => e.type === 'ORGANIZATION').length,
    EVENT: entities.filter(e => e.type === 'EVENT').length,
    LOCATION: entities.filter(e => e.type === 'LOCATION').length,
    DIGITAL_ENTITY: entities.filter(e => e.type === 'DIGITAL_ENTITY').length,
    DOCUMENT: entities.filter(e => e.type === 'DOCUMENT').length
  };

  const growthTrajectory = [
    { year: '2021', entities: 6, links: 5, volume: '₹1.2 Cr' },
    { year: '2022', entities: 12, links: 14, volume: '₹18.4 Cr' },
    { year: '2023', entities: 20, links: 26, volume: '₹42.1 Cr' },
    { year: '2024', entities: 28, links: 40, volume: '₹108.5 Cr' },
    { year: '2025', entities: 33, links: 54, volume: '₹142.0 Cr' },
    { year: '2026', entities: 35, links: 60, volume: '₹142.0 Cr' }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Network Topology Analytics & Quantitative Metrics
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Statistical graph analysis, centrality distributions, growth rates, and verification metrics.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
            Graph Density: <strong className="text-teal-400 font-bold">0.102 (High Interconnectedness)</strong>
          </span>
        </div>

        {/* Top Quantitative KPI Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="synapx-card p-4 bg-obsidian-850">
            <div className="text-[10px] font-mono uppercase text-slate-400">Node Degree Centrality</div>
            <div className="text-xl font-mono font-bold text-teal-400 mt-1">8.2 Links / Node</div>
            <div className="text-[10px] text-slate-400 mt-1">Dense multi-layer clustering</div>
          </div>

          <div className="synapx-card p-4 bg-obsidian-850">
            <div className="text-[10px] font-mono uppercase text-slate-400">Top Betweenness Hub</div>
            <div className="text-xl font-mono font-bold text-amber-400 mt-1">Ramesh Kumar (0.84)</div>
            <div className="text-[10px] text-slate-400 mt-1">Key inter-cluster bridge</div>
          </div>

          <div className="synapx-card p-4 bg-obsidian-850">
            <div className="text-[10px] font-mono uppercase text-slate-400">Average Path Length</div>
            <div className="text-xl font-mono font-bold text-cyan-400 mt-1">2.4 Hops</div>
            <div className="text-[10px] text-slate-400 mt-1">Tight covert diameter</div>
          </div>

          <div className="synapx-card p-4 bg-obsidian-850">
            <div className="text-[10px] font-mono uppercase text-slate-400">Verification Rate</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">{activeCase.verificationPercentage}%</div>
            <div className="text-[10px] text-slate-400 mt-1">Human-in-the-loop progress</div>
          </div>
        </div>

        {/* Growth Trajectory Chart & Entity Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Temporal Growth Trajectory */}
          <div className="lg:col-span-2 synapx-card p-6 bg-obsidian-850 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-slate-100">Syndicate Multi-Year Growth Trajectory (2021–2026)</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Node & Link Velocity</span>
            </div>

            {/* Custom Bar/Line Trajectory Visualization */}
            <div className="space-y-3 pt-2">
              {growthTrajectory.map((item) => (
                <div key={item.year} className="space-y-1 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="font-bold text-slate-200">{item.year}</span>
                    <span className="text-slate-400">
                      {item.entities} Nodes • <strong className="text-teal-400">{item.links} Links</strong> • Vol: <strong className="text-amber-400">{item.volume}</strong>
                    </span>
                  </div>
                  <div className="h-3 bg-obsidian-950 rounded-full overflow-hidden flex">
                    <div
                      className="bg-teal-500 h-full transition-all duration-500"
                      style={{ width: `${(item.entities / 40) * 100}%` }}
                    />
                    <div
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${(item.links / 70) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-obsidian-750 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Entities</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Relational Edges</span>
              </div>
              <span>Peak surge detected in Q4 2024</span>
            </div>
          </div>

          {/* Right Col: Entity Archetype Distribution */}
          <div className="synapx-card p-6 bg-obsidian-850 space-y-4 flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-obsidian-700 mb-3">
                <h3 className="text-sm font-bold text-slate-100">Entity Type Distribution</h3>
                <p className="text-xs text-slate-400 mt-0.5">35 Total Entities Classified</p>
              </div>

              <div className="space-y-2.5 text-xs">
                {Object.entries(entityTypeCounts).map(([type, count]) => {
                  const percent = Math.round((count / entities.length) * 100);
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-300">{type.replace('_', ' ')}</span>
                        <span className="font-bold text-teal-400">{count} ({percent}%)</span>
                      </div>
                      <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-obsidian-700 text-[10px] text-slate-400">
              SYNAPX Mathematical Analytics Engine v2.6
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}

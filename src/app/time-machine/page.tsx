'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { InteractiveNetworkGraph } from '@/components/graph/InteractiveNetworkGraph';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Share2, 
  Layers, 
  Calendar,
  Zap,
  Activity
} from 'lucide-react';

export default function TimeMachinePage() {
  const { 
    timeMachineYear, 
    setTimeMachineYear, 
    isTimeMachinePlaying, 
    setIsTimeMachinePlaying,
    entities,
    relationships,
    timelineEvents
  } = useInvestigation();

  const years = [2021, 2022, 2023, 2024, 2025, 2026];

  const yearDescriptions: Record<number, { title: string; desc: string; newEntities: number; newLinks: number; highlight: string }> = {
    2021: {
      title: 'Inception & Core Vehicle Setup',
      desc: 'Incorporation of Surya Bullion Traders LLP in Zaveri Bazaar and signing of JNPT Berth 4 container yard lease by Apex Global Logistics.',
      newEntities: 6,
      newLinks: 5,
      highlight: 'RoC Incorporations in Mumbai & Navi Mumbai'
    },
    2022: {
      title: 'Agricultural Camouflage Expansion',
      desc: 'Surat industrial unit (GreenHorizon Agro) activated. First major circular invoice batches generated without physical delivery.',
      newEntities: 8,
      newLinks: 9,
      highlight: 'First ₹18.2 Cr circular invoicing batch'
    },
    2023: {
      title: 'Offshore Re-Invoicing & Cyber Relays',
      desc: 'Farhan Qureshi incorporates Al-Zahra General Trading LLC in Deira, Dubai. Ananya Iyer deploys encrypted matrix server relay 185.220.101.5.',
      newEntities: 14,
      newLinks: 16,
      highlight: 'Dubai & Switzerland multi-hop channels open'
    },
    2024: {
      title: 'Remittance Surge & Crypto Layering',
      desc: '18 rapid structured wire transfers ($2.4M) routed into Zurich escrow account #CH-88 and converted to Tether USDT via OTC desk.',
      newEntities: 22,
      newLinks: 28,
      highlight: 'Sudden 140% network volume expansion anomaly'
    },
    2025: {
      title: 'Physical Coordination & Port Interception',
      desc: 'Surveillance conclave at Trident BKC followed by enforcement interdiction of misdeclared container MSCU-889104 recovering ₹24.5 Cr unmanifested bullion.',
      newEntities: 30,
      newLinks: 42,
      highlight: 'DRI Panchnama 492 forensic seizure at JNPT'
    },
    2026: {
      title: 'Full Graph Synthesis & Judicial Dossier',
      desc: 'Complete digital evidence reconciliation, Section 65B forensic verification, and cross-case pattern matching across regional syndicates.',
      newEntities: 35,
      newLinks: 60,
      highlight: 'Court-admissible multi-hop dossier finalized'
    }
  };

  const currentYearInfo = yearDescriptions[timeMachineYear] || yearDescriptions[2026];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Clock className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Network Time Machine (2021 — 2026)
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Dynamic temporal slider visualizing syndicate inception, transaction surges, and network expansion velocity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimeMachinePlaying(!isTimeMachinePlaying)}
              className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
            >
              {isTimeMachinePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimeMachinePlaying ? 'Pause Time Evolution' : 'Play Time Animation'}</span>
            </button>

            <button
              onClick={() => {
                setTimeMachineYear(2021);
                setIsTimeMachinePlaying(false);
              }}
              className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 border border-obsidian-700 text-xs"
              title="Rewind to 2021"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Year Slider Banner */}
        <div className="synapx-card p-6 bg-obsidian-850 border border-obsidian-700 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-teal-400 tracking-wider">
              Temporal Dimension: Year {timeMachineYear}
            </span>
            <span className="text-xs font-mono text-slate-300 bg-obsidian-950 px-3 py-1 rounded border border-obsidian-750">
              Active Phase: <strong className="text-amber-400">{currentYearInfo.title}</strong>
            </span>
          </div>

          {/* Stepper Timeline Axis */}
          <div className="relative pt-2 pb-6">
            <input
              type="range"
              min="2021"
              max="2026"
              step="1"
              value={timeMachineYear}
              onChange={(e) => {
                setTimeMachineYear(parseInt(e.target.value));
                setIsTimeMachinePlaying(false);
              }}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-obsidian-950 rounded-lg"
            />

            <div className="flex justify-between mt-3 text-xs font-mono">
              {years.map(yr => (
                <button
                  key={yr}
                  onClick={() => {
                    setTimeMachineYear(yr);
                    setIsTimeMachinePlaying(false);
                  }}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    timeMachineYear === yr
                      ? 'text-teal-300 font-bold scale-110'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="text-sm">{yr}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: timeMachineYear >= yr ? '#14B8A6' : '#334155' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Year Context Card */}
          <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1 max-w-2xl">
              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{timeMachineYear}: {currentYearInfo.title}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {currentYearInfo.highlight}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentYearInfo.desc}
              </p>
            </div>

            {/* Growth Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-2 rounded bg-obsidian-950 border border-obsidian-800 text-center">
                <div className="text-slate-400 text-[10px]">Entities Active</div>
                <div className="text-base font-bold text-teal-400 mt-0.5">{currentYearInfo.newEntities}</div>
              </div>
              <div className="p-2 rounded bg-obsidian-950 border border-obsidian-800 text-center">
                <div className="text-slate-400 text-[10px]">Relational Edges</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{currentYearInfo.newLinks}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Graph Canvas for Selected Temporal Slice */}
        <div className="h-[600px]">
          <InteractiveNetworkGraph />
        </div>

      </div>
    </AppLayout>
  );
}

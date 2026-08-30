'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { ExplainableAiCard } from '@/components/common/ExplainableAiCard';
import { CaseBriefModal } from '@/components/cases/CaseBriefModal';
import { 
  Briefcase, 
  Share2, 
  Users, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Clock, 
  Compass, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  TrendingUp,
  Dna,
  Network,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { 
    cases, 
    activeCase, 
    entities, 
    relationships, 
    aiFindings, 
    timelineEvents, 
    geoPoints, 
    auditLogs,
    startJudgeMode 
  } = useInvestigation();

  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const pendingAnomalies = aiFindings.filter(f => f.reviewStatus === 'NEEDS_REVIEW');
  const verifiedEntitiesCount = entities.filter(e => e.verificationStatus === 'VERIFIED').length;
  const verificationRate = Math.round((verifiedEntitiesCount / (entities.length || 1)) * 100);

  const kpis = [
    { label: 'Active Cases', value: cases.length, change: '+1 this week', icon: Briefcase, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'Entities Analyzed', value: entities.length, change: 'Across 6 types', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Connections Discovered', value: relationships.length, change: 'Multi-layer graph', icon: Share2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Anomalies Flagged', value: pendingAnomalies.length, change: 'Require human review', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'AI Priority Score', value: '94/100', change: 'Tier-1 Critical Risk', icon: Sparkles, color: 'text-teal-300', bg: 'bg-teal-500/10' },
    { label: 'Dossiers Exported', value: '8', change: 'Watermarked & signed', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Top Operational Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Activity className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                  Command Center Dashboard
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Intelligence Decision-Support & Criminal Record Synthesis (SIH26189)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBriefModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-teal-300 text-xs font-semibold border border-obsidian-700 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Case Brief</span>
            </button>

            <Link
              href="/graph"
              className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Full Graph View</span>
            </Link>
          </div>
        </div>

        {/* 6 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="synapx-card p-4 bg-obsidian-850 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 truncate">{kpi.label}</span>
                    <span className={`p-1 rounded-md ${kpi.bg} ${kpi.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-100">{kpi.value}</div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 truncate">{kpi.change}</div>
              </div>
            );
          })}
        </div>

        {/* Primary Row: Network Overview Mini-Canvas & AI Insights Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Interactive Network Overview Widget */}
          <div className="lg:col-span-2 synapx-card p-5 bg-obsidian-850 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700 mb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Active Investigation Graph: {activeCase.title.split(':')[0]}
                </h3>
              </div>
              <Link
                href="/graph"
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <span>Launch Graph</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visual SVG Topology Preview */}
            <div className="relative h-64 bg-obsidian-950 rounded-xl border border-obsidian-800 p-3 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 240" className="w-full h-full">
                {/* Cluster A: Finance */}
                <circle cx="150" cy="110" r="65" fill="rgba(245, 158, 11, 0.05)" stroke="rgba(245, 158, 11, 0.2)" strokeDasharray="3 3" />
                <text x="105" y="40" fill="#F59E0B" fontSize="9" fontFamily="monospace">INVOICING CLUSTER</text>

                {/* Cluster B: Logistics */}
                <circle cx="450" cy="110" r="65" fill="rgba(20, 184, 166, 0.05)" stroke="rgba(20, 184, 166, 0.2)" strokeDasharray="3 3" />
                <text x="405" y="40" fill="#14B8A6" fontSize="9" fontFamily="monospace">LOGISTICS CLUSTER</text>

                {/* Bridge Edges */}
                <line x1="150" y1="110" x2="300" y2="120" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 2" />
                <line x1="300" y1="120" x2="450" y2="110" stroke="#14B8A6" strokeWidth="2.5" strokeDasharray="4 2" />
                <line x1="150" y1="110" x2="110" y2="150" stroke="rgba(51, 65, 85, 0.8)" strokeWidth="1.5" />
                <line x1="450" y1="110" x2="490" y2="150" stroke="rgba(51, 65, 85, 0.8)" strokeWidth="1.5" />

                {/* Nodes */}
                <circle cx="150" cy="110" r="14" fill="#151B23" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="150" cy="110" r="5" fill="#F59E0B" />
                <text x="150" y="138" fill="#CBD5E1" fontSize="9" textAnchor="middle">Surya Bullion</text>

                <circle cx="450" cy="110" r="14" fill="#151B23" stroke="#14B8A6" strokeWidth="2" />
                <circle cx="450" cy="110" r="5" fill="#14B8A6" />
                <text x="450" y="138" fill="#CBD5E1" fontSize="9" textAnchor="middle">Apex Logistics</text>

                {/* Hidden Bridge Node */}
                <circle cx="300" cy="120" r="18" fill="#151B23" stroke="#FBBF24" strokeWidth="3" className="animate-pulse" />
                <circle cx="300" cy="120" r="7" fill="#F59E0B" />
                <text x="300" y="152" fill="#FBBF24" fontSize="9.5" fontWeight="bold" textAnchor="middle">Ramesh Kumar (Bridge)</text>

                <circle cx="110" cy="150" r="10" fill="#151B23" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="490" cy="150" r="10" fill="#151B23" stroke="#14B8A6" strokeWidth="1.5" />
              </svg>

              <div className="absolute top-2 right-2 bg-obsidian-900/90 border border-obsidian-750 px-2 py-1 rounded text-[10px] font-mono text-teal-400">
                {entities.length} Nodes • {relationships.length} Relational Links
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="pt-3 mt-3 border-t border-obsidian-700/60 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px]"><span className="w-2 h-2 rounded-full bg-teal-400" /> People</span>
                <span className="flex items-center gap-1 text-[11px]"><span className="w-2 h-2 rounded-full bg-amber-500" /> Organizations</span>
                <span className="flex items-center gap-1 text-[11px]"><span className="w-2 h-2 rounded-full bg-purple-400" /> Crypto / Cyber</span>
              </div>
              <Link href="/hidden-bridges" className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] flex items-center gap-1">
                <span>1 Bridge Detected</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Right Col: Explainable AI Insights Feed */}
          <div className="synapx-card p-5 bg-obsidian-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-obsidian-700 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100">Explainable AI Insights</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {aiFindings.length} Insights
                </span>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {aiFindings.map((finding) => (
                  <ExplainableAiCard key={finding.id} finding={finding} showActions={false} />
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-obsidian-700">
              <Link
                href="/anomaly-detection"
                className="w-full py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-teal-300 font-semibold text-xs border border-obsidian-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View All AI Anomaly Detections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Secondary Row: Recent Cases & Case DNA Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Recent Cases */}
          <div className="lg:col-span-2 synapx-card p-5 bg-obsidian-850 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-slate-100">Investigation Dossiers & Workspaces</h3>
              </div>
              <Link href="/cases" className="text-xs text-teal-400 hover:text-teal-300 font-semibold">
                View All Cases
              </Link>
            </div>

            <div className="space-y-3">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 hover:border-teal-500/40 transition-all flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-400">{c.caseNumber}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-obsidian-950 text-slate-400 border border-obsidian-800">
                        {c.status}
                      </span>
                      <span className={`text-[10px] font-mono font-bold uppercase ${c.priority === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
                        {c.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200">{c.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cases/${c.id}`}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-semibold border border-teal-500/40 transition-colors"
                    >
                      Open Case
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Case DNA Signature Preview */}
          <div className="synapx-card p-5 bg-obsidian-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-obsidian-700 mb-3">
                <div className="flex items-center gap-2">
                  <Dna className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100">Case DNA Signature</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {activeCase.qualityCompletenessScore}% Complete
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Case DNA organizes the structural topology of <strong>{activeCase.title.split(':')[0]}</strong> across 8 vectors.
              </p>

              {/* Vector Stats List */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded bg-obsidian-900 border border-obsidian-800">
                  <span className="text-slate-400">People Implicated:</span>
                  <strong className="text-teal-400">{entities.filter(e => e.type === 'PERSON').length} Suspects</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-obsidian-900 border border-obsidian-800">
                  <span className="text-slate-400">Shell Corporate Vehicles:</span>
                  <strong className="text-amber-400">{entities.filter(e => e.type === 'ORGANIZATION').length} Firms</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-obsidian-900 border border-obsidian-800">
                  <span className="text-slate-400">Human Verification Rate:</span>
                  <strong className="text-emerald-400">{verificationRate}% Verified</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-obsidian-700">
              <Link
                href="/case-dna"
                className="w-full py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-500/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Dna className="w-3.5 h-3.5" />
                <span>Explore Full Case DNA Hub</span>
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* One-Click Smart Case Brief Generator Modal */}
      <CaseBriefModal isOpen={isBriefModalOpen} onClose={() => setIsBriefModalOpen(false)} />
    </AppLayout>
  );
}

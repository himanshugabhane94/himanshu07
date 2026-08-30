'use client';

import React from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { useRouter } from 'next/navigation';
import { 
  PlayCircle, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

interface JudgeStepInfo {
  stepNumber: number;
  title: string;
  badge: string;
  route: string;
  description: string;
  keyDifferentiator: string;
  actionText: string;
  actionHandler?: () => void;
}

export function JudgeModeModal() {
  const { 
    isJudgeModeActive, 
    judgeModeStep, 
    setJudgeModeStep, 
    nextJudgeStep, 
    prevJudgeStep, 
    stopJudgeMode,
    acceptEntityMatch,
    highlightEntitiesOnGraph,
    setIsAiCopilotOpen,
    setTimeMachineYear,
    toggleRedaction
  } = useInvestigation();
  const router = useRouter();

  if (!isJudgeModeActive) return null;

  const STEPS: JudgeStepInfo[] = [
    {
      stepNumber: 1,
      title: 'Command Center & Executive KPIs',
      badge: 'OVERVIEW',
      route: '/dashboard',
      description: 'Central operational cockpit displaying active investigations, high-risk entity clusters, 6 real-time KPI metrics, and instant AI insight feeds.',
      keyDifferentiator: 'Real-time telemetry showing verified vs unverified ratios and AI risk scores with strict decision-support boundaries.',
      actionText: 'View Command Center Dashboard'
    },
    {
      stepNumber: 2,
      title: 'Investigation Case Dossier',
      badge: 'CASE MGMT',
      route: '/cases/CASE-2026-FALCON',
      description: 'Detailed inspection of Operation Falcon Nexus: Trans-state hawala, fake freight forwarding syndicate, and encrypted crypto off-ramps.',
      keyDifferentiator: 'One-click Case Brief generation with automated "AI-Assisted Summary — Human Review Required" provenance seals.',
      actionText: 'Inspect Active Case Dossier'
    },
    {
      stepNumber: 3,
      title: 'Document Intelligence & Simulated OCR',
      badge: 'OCR & NER',
      route: '/document-intelligence',
      description: 'Raw document ingestion (customs manifests, corporate deeds, surveillance transcripts) with 5-stage automated entity & relationship extraction.',
      keyDifferentiator: 'Full provenance trace linking every extracted entity back to the exact OCR bounding box and source panchnama document.',
      actionText: 'Run Document OCR Pipeline'
    },
    {
      stepNumber: 4,
      title: 'AI Entity Resolution & Human Verification',
      badge: 'IDENTITY RESOLUTION',
      route: '/entity-resolution',
      description: 'Fuzzy identity matching detecting aliases (e.g. Ramesh Kumar vs R. Kumar vs Rajesh K. Merchant) with 92% attribute overlap scoring.',
      keyDifferentiator: 'Zero automated merges: requires explicit authorized investigator review and logs an immutable audit trail entry.',
      actionText: 'Review Duplicate Identity Match'
    },
    {
      stepNumber: 5,
      title: 'Smart Duplicate Cleaner',
      badge: 'DATA QUALITY',
      route: '/duplicate-cleaner',
      description: 'Side-by-side comparison of duplicate corporate registration records with similarity attribute breakdown and safe merge mechanics.',
      keyDifferentiator: 'Preserves complete multi-source evidentiary provenance even after record deduplication.',
      actionText: 'Compare & Merge Duplicate Records'
    },
    {
      stepNumber: 6,
      title: 'Case DNA — Signature Feature',
      badge: 'SIGNATURE DIFFERENTIATOR',
      route: '/case-dna',
      description: 'Signature visual hub-and-spoke visualization connecting the central case to People, Organizations, Events, Locations, Digital Entities, and Documents.',
      keyDifferentiator: 'Provides instant visual completeness assessment and verification percentage for leadership briefing in seconds.',
      actionText: 'Explore Interactive Case DNA'
    },
    {
      stepNumber: 7,
      title: 'Interactive Network Graph & Multi-Layer Filters',
      badge: 'KNOWLEDGE GRAPH',
      route: '/graph',
      description: 'High-performance interactive force graph with zoom, pan, 1-hop/2-hop expansion, cluster detection, and 6-layer entity toggles.',
      keyDifferentiator: 'Differentiates 6 node archetypes with Obsidian × Teal × Amber color system and real-time relationship weight sliders.',
      actionText: 'Explore Knowledge Graph'
    },
    {
      stepNumber: 8,
      title: 'Hidden Bridge Detection',
      badge: 'ALGORITHMIC INTELLIGENCE',
      route: '/hidden-bridges',
      description: 'Betweenness centrality scanner identifying Ramesh Kumar as the secret conduit connecting the Bullion Invoicing cluster with the Freight Logistics network.',
      keyDifferentiator: 'Discovers covert links across seemingly separate corporate entities with explainable evidence reasoning.',
      actionText: 'Isolate Bridge Entity'
    },
    {
      stepNumber: 9,
      title: 'Indirect Connection Multi-Hop Pathfinder',
      badge: 'TRAJECTORY ANALYSIS',
      route: '/indirect-connections',
      description: 'Computes multi-hop relational path between target suspect Ramesh Kumar and customs broker Vikramaditya Sharma through BKC meeting and proxy relay.',
      keyDifferentiator: 'Transforms fragmented circumstantial evidence into a solid, court-admissible relationship trajectory.',
      actionText: 'Trace Multi-Hop Indirect Path'
    },
    {
      stepNumber: 10,
      title: 'Network Time Machine (2021–2026)',
      badge: 'TEMPORAL EVOLUTION',
      route: '/time-machine',
      description: 'Interactive year-by-year slider showing how the syndicate incorporated shell companies in 2021, expanded invoicing in 2022, and surged wire remittances in 2024.',
      keyDifferentiator: 'Dynamic timeline animation revealing network expansion velocity and pre-raid coordination surges.',
      actionText: 'Launch Network Time Machine'
    },
    {
      stepNumber: 11,
      title: 'Geographic Intelligence & Map Sync',
      badge: 'GEOSPATIAL INTEL',
      route: '/geo-intelligence',
      description: 'Interactive geospatial map correlating Mumbai bullion hubs, Surat invoicing front, JNPT container terminal, and Dubai off-ramp offices.',
      keyDifferentiator: 'Bi-directional synchronization: selecting entities in the graph immediately highlights their physical operational coordinates.',
      actionText: 'View Geospatial Crime Map'
    },
    {
      stepNumber: 12,
      title: 'AI Anomaly Detection with Explainable Cards',
      badge: 'EXPLAINABLE AI',
      route: '/anomaly-detection',
      description: 'Pattern scanner detecting cyclical ₹38.4 Cr fund flows and sudden node volume surges with confidence ratings and recommendations.',
      keyDifferentiator: 'Strict explainability: every finding details "Finding", "Why Flagged", "Corroborating Evidence", and "Suggested Action".',
      actionText: 'Inspect Explainable Anomalies'
    },
    {
      stepNumber: 13,
      title: 'AI Investigation Copilot (Decision Support)',
      badge: 'NATURAL LANGUAGE COPILOT',
      route: '/ai-copilot',
      description: 'Conversational assistant providing instant answers to queries like "Show strongest indirect connections" with direct "View on Graph" highlighting triggers.',
      keyDifferentiator: 'Assists hypothesis formulation without ever declaring guilt or overriding human investigator authority.',
      actionText: 'Query AI Copilot'
    },
    {
      stepNumber: 14,
      title: 'AI Investigation Report Generator & Case Brief',
      badge: 'REPORTING & DOSSIER',
      route: '/reports',
      description: 'One-click generation of formal court-ready investigation dossiers featuring Case DNA summaries, timeline charts, and watermark safeguards.',
      keyDifferentiator: 'Complies with legal standards with mandatory "AI-Assisted Analysis — Human Verification Required" watermarks.',
      actionText: 'Generate Investigation Dossier'
    },
    {
      stepNumber: 15,
      title: 'Immutable Audit Trail & Chain of Custody',
      badge: 'GOVTECH COMPLIANCE',
      route: '/audit-trail',
      description: 'Complete append-only audit ledger recording every entity match, document ingestion, data redaction toggle, and report export with timestamps.',
      keyDifferentiator: 'Guarantees integrity, zero data tampering, and full transparency for oversight authorities and judicial review.',
      actionText: 'Review Immutable Audit Logs'
    }
  ];

  const currentStepInfo = STEPS[judgeModeStep] || STEPS[0];
  const progressPercent = Math.round(((judgeModeStep + 1) / STEPS.length) * 100);

  const handleStepNavigate = (stepIdx: number) => {
    setJudgeModeStep(stepIdx);
    router.push(STEPS[stepIdx].route);
  };

  const handleLaunchCurrentStep = () => {
    router.push(currentStepInfo.route);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-obsidian-850/95 backdrop-blur-xl border-2 border-amber-500/80 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
      
      {/* Top Banner with Step Progress Bar */}
      <div className="h-1.5 w-full bg-obsidian-950">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 via-amber-400 to-amber-500 transition-all duration-300 shadow-glow-amber"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-4 sm:p-5">
        {/* Header with Step Tracker */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-obsidian-950 font-mono font-bold text-xs shadow-glow-amber">
              <Compass className="w-3.5 h-3.5" />
              JUDGE TOUR: STEP {currentStepInfo.stepNumber} OF {STEPS.length}
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {currentStepInfo.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              {progressPercent}% Completed
            </span>
            <button
              onClick={stopJudgeMode}
              className="p-1 rounded-lg bg-obsidian-750 hover:bg-obsidian-700 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 px-2 border border-obsidian-700"
              title="Exit Judge Guided Tour"
            >
              <span>Exit Tour</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Title & Main Explanation */}
        <div className="mb-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            {currentStepInfo.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
            {currentStepInfo.description}
          </p>
        </div>

        {/* Key SIH Differentiator Box */}
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 mb-4 flex items-start gap-2 text-xs text-amber-200">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-semibold">Key Differentiator: </strong>
            <span>{currentStepInfo.keyDifferentiator}</span>
          </div>
        </div>

        {/* Controls and Jump Action */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-obsidian-700/80">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                prevJudgeStep();
                router.push(STEPS[Math.max(0, judgeModeStep - 1)].route);
              }}
              disabled={judgeModeStep === 0}
              className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 disabled:opacity-40 text-slate-300 text-xs font-medium flex items-center gap-1 border border-obsidian-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <button
              onClick={() => {
                nextJudgeStep();
                router.push(STEPS[Math.min(STEPS.length - 1, judgeModeStep + 1)].route);
              }}
              disabled={judgeModeStep === STEPS.length - 1}
              className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 disabled:opacity-40 text-slate-300 text-xs font-medium flex items-center gap-1 border border-obsidian-700 transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleLaunchCurrentStep}
            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-teal transition-all"
          >
            <span>{currentStepInfo.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

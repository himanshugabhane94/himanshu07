'use client';

import React from 'react';
import Link from 'next/link';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  Share2, 
  Dna, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Network, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  FileText, 
  Users, 
  Eye, 
  PlayCircle,
  Layers,
  ChevronRight,
  Zap,
  Building
} from 'lucide-react';

export default function LandingPage() {
  const { startJudgeMode } = useInvestigation();

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-obsidian-900/90 backdrop-blur-md border-b border-obsidian-700/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center shadow-glow-teal">
            <Share2 className="w-5 h-5 text-obsidian-950 font-bold" />
          </div>
          <div>
            <span className="font-mono text-base font-extrabold tracking-wider text-slate-100">
              SYNAPX
            </span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              SIH26189
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-obsidian-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
          >
            <span>Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-16 pb-20 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SIH 2026 Problem Statement SIH26189 — Production-Style Intelligence Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
          From Fragmented Records → <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-teal-200 to-amber-300">
            Explainable Criminal Intelligence
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          <strong>SYNAPX</strong> converts disconnected investigation records, trade manifests, and digital transactions into unified relationship graphs. Detect covert bridge entities, track multi-year syndicate evolution, and generate verified court dossiers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-sm shadow-glow-teal flex items-center gap-2 transition-all group"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button
            onClick={() => {
              startJudgeMode();
              window.location.href = '/dashboard';
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-500/50 hover:bg-amber-500 hover:text-obsidian-950 text-amber-300 font-bold text-sm shadow-glow-amber flex items-center gap-2 transition-all"
          >
            <PlayCircle className="w-4 h-4 animate-pulse" />
            <span>Start 15-Step Judge Demo Tour</span>
          </button>

          <Link
            href="/architecture"
            className="px-5 py-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 border border-obsidian-700 text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Architecture Blueprint</span>
          </Link>
        </div>

        {/* Safety & Compliance Badge */}
        <div className="mt-8 inline-flex items-center gap-2 text-xs text-slate-400 bg-obsidian-900/80 px-4 py-2 rounded-lg border border-obsidian-800">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Decision-Support Architecture • Strict Synthetic Demonstration Data • Human Verification Enforced</span>
        </div>
      </section>

      {/* Interactive Core Capabilities Grid */}
      <section className="px-4 sm:px-8 py-16 bg-obsidian-900 border-y border-obsidian-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400">
              SIX INTELLIGENCE PILLARS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
              Engineered for Law Enforcement & Financial Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Case DNA */}
            <Link href="/case-dna" className="synapx-card p-6 synapx-card-hover group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                  <Dna className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                  Case DNA Signature Hub
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Visual hub-and-spoke synthesis linking cases to People, Orgs, Events, Locations, Documents, Digital IDs, and Timelines with instant completeness scoring.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-400">
                <span>Inspect Case DNA</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 2. Hidden Bridge Detector */}
            <Link href="/hidden-bridges" className="synapx-card p-6 synapx-card-hover group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                  <Network className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  Hidden Bridge Detector
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Betweenness centrality algorithms isolate covert intermediaries connecting otherwise disconnected shell company and freight clusters.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-400">
                <span>View Bridge Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 3. Network Time Machine */}
            <Link href="/time-machine" className="synapx-card p-6 synapx-card-hover group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Network Time Machine (2021–2026)
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Interactive year-by-year slider animating syndicate inception, transaction volume spikes, and pre-interception coordination patterns.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-cyan-400">
                <span>Launch Time Machine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 4. AI Entity Resolution */}
            <Link href="/entity-resolution" className="synapx-card p-6 synapx-card-hover group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  AI Entity Resolution Engine
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Fuzzy alias resolution across PAN, Phone, and RoC filings with 92% attribute overlap scoring and safe human-verified merging.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-400">
                <span>Review Duplicate Aliases</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 5. Geospatial Intelligence */}
            <Link href="/geo-intelligence" className="synapx-card p-6 synapx-card-hover group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-yellow-300 transition-colors">
                  Geographic Intelligence & Map Sync
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Correlate port container yards, bullion trading bazaars, and offshore settlement hubs with bi-directional graph synchronization.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-yellow-400">
                <span>Explore Geospatial Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* 6. Explainable AI & Copilot */}
            <Link href="/ai-copilot" className="synapx-card p-6 synapx-card-hover group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                  Explainable AI & Investigation Copilot
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Natural language decision support with transparent rationale ("Why Flagged", "Evidence", "Confidence") and instant graph highlights.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-300">
                <span>Interact with Copilot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Problem vs Solution Comparison Table */}
      <section className="px-4 sm:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            PROBLEM STATEMENT SIH26189 CONTEXT
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">
            Transforming Fragmented Records into Actionable Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase text-red-400 flex items-center gap-2">
              <span>Traditional Siloed Investigations</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Records trapped in disparate PDF panchnamas, bank sheets, and customs logs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Suspects create minor spelling variations to avoid watchlists.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Hidden bridge entities between shell firms remain undetected for years.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Zero visibility into syndicate structural growth across time dimensions.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase text-teal-400 flex items-center gap-2">
              <span>SYNAPX AI Intelligence Solution</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Automated OCR & NER pipelines convert documents into unified knowledge graphs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Multi-attribute fuzzy resolution flags duplicate aliases with similarity scores.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Betweenness centrality algorithms instantly highlight covert bridge conduits.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Network Time Machine & Case DNA provide leadership with complete clarity.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-8 py-8 bg-obsidian-900 border-t border-obsidian-800 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-200">SYNAPX Intelligence Platform</span>
            <span>•</span>
            <span>SIH 2026 Problem Statement SIH26189</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/architecture" className="hover:text-teal-300">Architecture</Link>
            <Link href="/privacy-redaction" className="hover:text-teal-300">Privacy Shield</Link>
            <Link href="/audit-trail" className="hover:text-teal-300">Audit Logs</Link>
            <Link href="/dashboard" className="text-teal-400 font-bold hover:underline">Command Center</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

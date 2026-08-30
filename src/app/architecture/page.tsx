'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Cpu, 
  Database, 
  FileSearch, 
  Users, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  History, 
  FileText, 
  ArrowDown, 
  ArrowRight,
  Layers,
  Zap,
  Activity
} from 'lucide-react';

export default function ArchitecturePage() {
  const pipelineStages = [
    {
      step: '01',
      title: 'DATA SOURCES & CONNECTORS',
      icon: Database,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
      tech: 'MCA21 API • ICEGATE Customs • FIU-IND Gateway • I4C Kafka Stream',
      description: 'Multi-modal ingestion of corporate registries, shipping manifests, financial wire transfers, and telecom CDR dumps.'
    },
    {
      step: '02',
      title: 'DATA INGESTION & DOCUMENT INTELLIGENCE',
      icon: FileSearch,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      tech: 'Simulated Tesseract OCR • LayoutLM • Named Entity Recognition (NER)',
      description: 'Raw PDF/scan parsing, structural bounding box alignment, entity extraction (Persons, Orgs, Locations, Dates), and checksum hashing.'
    },
    {
      step: '03',
      title: 'AI ENTITY RESOLUTION & DEDUPLICATION',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      tech: 'Jaro-Winkler & Levenshtein Metrics • Multi-Attribute Overlap • Human Gatekeeper',
      description: 'Disambiguates phonetic variations, masked identifiers, and alias clusters with explicit human-in-the-loop verification approval.'
    },
    {
      step: '04',
      title: 'GRAPH RELATIONSHIP ENGINE & TOPOLOGY',
      icon: Share2,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      tech: 'NetworkX / Cytoscape Algorithms • Multi-Layer Weighted Edges • Graph Traversal',
      description: 'Generates directed, weighted knowledge graphs connecting 6 node archetypes with dynamic hop-expansion and focus isolation.'
    },
    {
      step: '05',
      title: 'AI ANALYTICS & HIDDEN BRIDGE SCANNER',
      icon: Sparkles,
      color: 'text-teal-300',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
      tech: 'Betweenness Centrality • Cyclic Flow Detection • Network Time Machine (2021-2026)',
      description: 'Identifies covert intermediaries connecting disparate clusters and tracks syndicate velocity across multi-year temporal dimensions.'
    },
    {
      step: '06',
      title: 'DECISION SUPPORT, PROVENANCE & REPORTING',
      icon: FileText,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      tech: 'Explainable AI Cards • Immutable SHA-256 Audit Ledger • Section 65B Dossiers',
      description: 'Synthesizes Case DNA, generates printable court dossiers with verified provenance watermarks, and maintains append-only audit records.'
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Cpu className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                SYNAPX System Architecture & Intelligence Pipeline
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              End-to-end technical blueprint demonstrating ingestion, knowledge graph engine, AI explainability, and compliance safeguards.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
            GovTech Grade Architecture
          </span>
        </div>

        {/* 6-Stage End-to-End Pipeline Visualization */}
        <div className="space-y-4">
          {pipelineStages.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={st.step} className="space-y-2">
                <div className={`synapx-card p-5 bg-obsidian-850 border ${st.border} flex items-start gap-4`}>
                  <div className={`p-3 rounded-xl ${st.bg} ${st.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">STAGE {st.step}</span>
                        <h3 className="text-sm font-bold text-slate-100">{st.title}</h3>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${st.bg} ${st.color} font-bold`}>
                        {st.tech}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {st.description}
                    </p>
                  </div>
                </div>

                {idx < pipelineStages.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-4 h-4 text-teal-500/60 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security, Privacy & Provenance Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="synapx-card p-4 bg-obsidian-850 border border-obsidian-750 space-y-1.5">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Role-Based Access Control</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Granular access separation across Admin, Lead Investigator, and Cyber Intelligence Analyst personas.
            </p>
          </div>

          <div className="synapx-card p-4 bg-obsidian-850 border border-obsidian-750 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>Smart PII Redaction Shield</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Automatic masking of sensitive Aadhaar, PAN, phone, and financial identifiers with audit unmasking logs.
            </p>
          </div>

          <div className="synapx-card p-4 bg-obsidian-850 border border-obsidian-750 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <History className="w-4 h-4" />
              <span>Immutable Audit Ledger</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Append-only tamper-evident event logging guaranteeing judicial compliance under Section 65B.
            </p>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

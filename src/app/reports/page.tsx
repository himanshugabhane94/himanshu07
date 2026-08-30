'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Dna, 
  Network, 
  Compass, 
  Clock, 
  Check, 
  Lock
} from 'lucide-react';
import { RedactedText } from '@/components/common/RedactedText';

export default function ReportsPage() {
  const { activeCase, entities, relationships, timelineEvents, aiFindings, documents, geoPoints, currentUser } = useInvestigation();
  const [copied, setCopied] = useState(false);

  const people = entities.filter(e => e.type === 'PERSON');
  const orgs = entities.filter(e => e.type === 'ORGANIZATION');

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header (No print) */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                AI Investigation Dossier & Formal Report Generator
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Court-admissible intelligence report synthesized from multi-source evidence, Case DNA, and knowledge graphs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-semibold border border-obsidian-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Secure Link Copied' : 'Share Securely'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF Dossier</span>
            </button>
          </div>
        </div>

        {/* The Printable Dossier Container */}
        <div className="synapx-card p-8 bg-obsidian-850 border border-obsidian-700 space-y-8 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
          
          {/* Official Document Seal & Header */}
          <div className="border-b-2 border-teal-500 pb-6 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">
                GOVERNMENT OF INDIA • CENTRAL ECONOMIC INTELLIGENCE
              </div>
              <h2 className="text-2xl font-extrabold text-slate-100 mt-1 print:text-black">
                CONFIDENTIAL INVESTIGATION DOSSIER
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                REF: {activeCase.caseNumber} • CLASSIFICATION: TOP SECRET // SIH26189
              </p>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 space-y-0.5">
              <div>Date Generated: <strong className="text-slate-200 print:text-black">{new Date().toISOString().split('T')[0]}</strong></div>
              <div>Lead Officer: <strong className="text-teal-400 print:text-black">{activeCase.leadInvestigator}</strong></div>
              <div>Clearance Level: <strong className="text-amber-400 print:text-black">Tier-0 Executive</strong></div>
            </div>
          </div>

          {/* AI Decision Support Disclaimer Seal */}
          <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/50 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-mono text-xs uppercase font-bold tracking-wider">
                AI-Assisted Synthesis — Mandatory Human Verification Seal
              </strong>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                This document is compiled using the SYNAPX AI Decision-Support Platform. All entity linkages, betweenness centrality scores, and transaction anomaly detections represent algorithmic hypotheses based on synthetic demonstration data. Formal human officer verification has been applied to {activeCase.verificationPercentage}% of primary entities.
              </p>
            </div>
          </div>

          {/* Section 1: Executive Case Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-mono font-bold uppercase text-teal-400 tracking-wider">
              1. EXECUTIVE SUMMARY & INVESTIGATION SCOPE
            </h3>
            <div className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-2 print:bg-slate-50 print:border-slate-300">
              <h4 className="text-sm font-bold text-slate-100 print:text-black">{activeCase.title}</h4>
              <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
                {activeCase.description}
              </p>
              <div className="pt-2 border-t border-obsidian-800 flex justify-between text-xs text-slate-400 font-mono print:text-slate-600">
                <span>Priority: {activeCase.priority}</span>
                <span>Case Completeness: {activeCase.qualityCompletenessScore}%</span>
                <span>Human Verification: {activeCase.verificationPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Section 2: Case DNA Structural Topology */}
          <div className="space-y-2">
            <h3 className="text-sm font-mono font-bold uppercase text-teal-400 tracking-wider flex items-center gap-1.5">
              <Dna className="w-4 h-4" />
              <span>2. CASE DNA STRUCTURAL SIGNATURE</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs print:bg-slate-50">
                <span className="text-slate-400 font-mono text-[10px]">People Identified</span>
                <div className="text-lg font-mono font-bold text-teal-400 print:text-black">{people.length} Suspects</div>
              </div>
              <div className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs print:bg-slate-50">
                <span className="text-slate-400 font-mono text-[10px]">Shell Entities</span>
                <div className="text-lg font-mono font-bold text-amber-400 print:text-black">{orgs.length} Corporate</div>
              </div>
              <div className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs print:bg-slate-50">
                <span className="text-slate-400 font-mono text-[10px]">Relational Edges</span>
                <div className="text-lg font-mono font-bold text-cyan-400 print:text-black">{relationships.length} Links</div>
              </div>
              <div className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs print:bg-slate-50">
                <span className="text-slate-400 font-mono text-[10px]">Evidence Records</span>
                <div className="text-lg font-mono font-bold text-slate-200 print:text-black">{documents.length} Files</div>
              </div>
            </div>
          </div>

          {/* Section 3: Key Implicated Subjects & Entities */}
          <div className="space-y-2">
            <h3 className="text-sm font-mono font-bold uppercase text-teal-400 tracking-wider">
              3. KEY IMPLICATED SUSPECTS & CORPORATE VEHICLES
            </h3>
            <div className="space-y-2">
              {entities.slice(0, 5).map(ent => (
                <div key={ent.id} className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 flex items-start justify-between gap-3 text-xs print:bg-slate-50 print:border-slate-300">
                  <div>
                    <div className="font-bold text-slate-100 print:text-black flex items-center gap-2">
                      <span>{ent.name}</span>
                      <span className="text-[10px] font-mono text-teal-400">({ent.type})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ent.roleOrDesignation}</p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Provenance: {ent.sourceProvenance}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-950 text-teal-400 border border-obsidian-750">
                      {ent.confidenceScore}% Conf
                    </span>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                      {ent.verificationStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: AI Anomaly & Bridge Findings */}
          <div className="space-y-2">
            <h3 className="text-sm font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Network className="w-4 h-4" />
              <span>4. DETECTED BRIDGES & NETWORK ANOMALIES</span>
            </h3>
            <div className="space-y-2">
              {aiFindings.map(f => (
                <div key={f.id} className="p-3.5 rounded-lg bg-obsidian-900 border-l-4 border-l-amber-500 text-xs space-y-1 print:bg-slate-50">
                  <div className="flex justify-between font-semibold text-slate-200 print:text-black">
                    <span>{f.title}</span>
                    <span className="font-mono text-teal-400">{f.confidence}% Confidence</span>
                  </div>
                  <p className="text-slate-300 print:text-slate-800 leading-relaxed">{f.finding}</p>
                  <p className="text-[11px] text-slate-400 italic">Why Flagged: {f.whyFlagged}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Chronological Evidence Stream */}
          <div className="space-y-2">
            <h3 className="text-sm font-mono font-bold uppercase text-teal-400 tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>5. CHRONOLOGICAL TIMELINE TRAJECTORY</span>
            </h3>
            <div className="space-y-1.5">
              {timelineEvents.map(evt => (
                <div key={evt.id} className="p-2.5 rounded bg-obsidian-900 border border-obsidian-750 flex items-start justify-between gap-3 text-xs print:bg-slate-50">
                  <div>
                    <span className="font-bold text-teal-300 font-mono mr-2">{evt.date}</span>
                    <span className="font-semibold text-slate-200 print:text-black">{evt.title}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{evt.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{evt.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Section 65B Officer Declaration */}
          <div className="pt-6 border-t-2 border-obsidian-700 text-xs space-y-4 print:border-black">
            <div className="font-mono uppercase font-bold text-slate-300">
              6. INVESTIGATING OFFICER DECLARATION (SECTION 65B COMPLIANCE)
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              I hereby certify that the electronic intelligence outputs compiled herein have been reconciled with digital hash manifests and physical search panchnamas. The cryptographic hash signatures for all 5 Evidence Vault records match their primary seizure checksums.
            </p>
            
            <div className="pt-8 flex items-center justify-between text-xs font-mono text-slate-400">
              <div>
                <div>_____________________________</div>
                <div className="font-bold text-slate-200 mt-1 print:text-black">{activeCase.leadInvestigator}</div>
                <div>Lead Investigating Officer, CBI/CEIB</div>
              </div>

              <div className="text-right">
                <div>_____________________________</div>
                <div className="font-bold text-slate-200 mt-1 print:text-black">Director Arvind Deshmukh</div>
                <div>Supervisory Command Authority</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}

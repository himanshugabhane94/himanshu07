'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { InvestigationCase } from '@/types/synapx';
import { 
  FileText, 
  X, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Building, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { RedactedText } from '@/components/common/RedactedText';

interface CaseBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigationCase?: InvestigationCase;
}

export function CaseBriefModal({ isOpen, onClose, investigationCase }: CaseBriefModalProps) {
  const { activeCase, entities, relationships, aiFindings, documents, timelineEvents } = useInvestigation();
  const [copied, setCopied] = useState(false);

  const c = investigationCase || activeCase;

  if (!isOpen) return null;

  const people = entities.filter(e => e.type === 'PERSON');
  const orgs = entities.filter(e => e.type === 'ORGANIZATION');
  const unverifiedRecords = entities.filter(e => e.verificationStatus !== 'VERIFIED');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-obsidian-850 border border-obsidian-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 bg-obsidian-900 border-b border-obsidian-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
                  SMART INVESTIGATION CASE BRIEF
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  AI-ASSISTED SYNTHESIS
                </span>
              </div>
              <p className="text-xs text-slate-400">{c.caseNumber} • Lead: {c.leadInvestigator}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs flex items-center gap-1 border border-obsidian-700 transition-colors"
              title="Copy Brief Text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs flex items-center gap-1 border border-obsidian-700 transition-colors"
              title="Print Investigation Brief"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-obsidian-800 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Brief Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-xs leading-relaxed print:text-black">
          
          {/* Official AI Safety Disclaimer Watermark Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono font-bold text-amber-300 text-xs uppercase tracking-wider">
                AI-Assisted Summary — Human Review Required
              </div>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                This document is generated as an investigatory decision-support aid. AI-extracted correlations do NOT constitute definitive proof of criminal liability and must be independently corroborated by an authorized investigating officer prior to judicial filing.
              </p>
            </div>
          </div>

          {/* Section 1: Executive Case Overview */}
          <div className="synapx-card p-4 bg-obsidian-900 border border-obsidian-750 space-y-2">
            <div className="text-[11px] font-mono uppercase text-teal-400 font-bold tracking-wider">
              1. EXECUTIVE SUMMARY & MODUS OPERANDI
            </div>
            <h4 className="text-sm font-bold text-slate-100">{c.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-obsidian-800 text-[11px]">
              <div><span className="text-slate-400">Status:</span> <strong className="text-teal-400">{c.status}</strong></div>
              <div><span className="text-slate-400">Priority:</span> <strong className="text-amber-400">{c.priority}</strong></div>
              <div><span className="text-slate-400">Completeness:</span> <strong className="text-slate-200">{c.qualityCompletenessScore}%</strong></div>
              <div><span className="text-slate-400">Verified:</span> <strong className="text-emerald-400">{c.verificationPercentage}%</strong></div>
            </div>
          </div>

          {/* Section 2: Core Key Entities */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase text-teal-400 font-bold tracking-wider">
              2. KEY IMPLICATED ENTITIES (PERSONS & CORPORATE VEHICLES)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {entities.slice(0, 6).map((ent) => (
                <div key={ent.id} className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{ent.name}</span>
                    <span className="text-[10px] font-mono text-teal-400">{ent.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{ent.roleOrDesignation}</p>
                  {ent.aliases.length > 0 && (
                    <div className="text-[10px] text-slate-400 truncate">
                      Aliases: {ent.aliases.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Critical AI Findings & Anomalies */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase text-amber-400 font-bold tracking-wider">
              3. DETECTED NETWORK ANOMALIES & HIDDEN BRIDGES
            </div>
            <div className="space-y-2">
              {aiFindings.map((finding) => (
                <div key={finding.id} className="p-3 rounded-lg bg-obsidian-900 border-l-4 border-l-amber-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{finding.title}</span>
                    <span className="text-[10px] font-mono text-teal-400 font-bold">Confidence: {finding.confidence}%</span>
                  </div>
                  <p className="text-xs text-slate-300">{finding.finding}</p>
                  <p className="text-[11px] text-slate-400 italic">Why Flagged: {finding.whyFlagged}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Potentially Related Cases */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase text-teal-400 font-bold tracking-wider">
              4. CROSS-CASE SIMILARITY CORRELATIONS
            </div>
            <div className="space-y-2">
              {c.suggestedRelatedCaseIds.map((rel, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-teal-300">{rel.caseId}</span>
                    <p className="text-xs text-slate-300 mt-0.5">{rel.matchRationale}</p>
                  </div>
                  <span className="font-mono text-teal-400 font-bold px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-700">
                    {rel.similarityScore}% Overlap
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Records Requiring Verification & Missing Information */}
          <div className="p-4 rounded-xl bg-obsidian-900 border border-red-500/30 space-y-2">
            <div className="text-[11px] font-mono uppercase text-red-400 font-bold tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              5. ACTION ITEMS: RECORDS REQUIRING HUMAN VERIFICATION
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span>Fuzzy match between <strong>Ramesh Kumar</strong> and <strong>R. Kumar</strong> (92% overlap) pending supervisor confirmation.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span>Offshore wire statement from <strong>Al-Zahra General Trading LLC</strong> ($6.2M) requires authenticated SWIFT MT-103 certificate.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold mt-0.5">•</span>
                <span>Section 65B forensic certificate pending for seized digital accounting spreadsheet <em>Falcon_Transactions_2025.xlsx</em>.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-obsidian-900 border-t border-obsidian-700 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-slate-400">
            Exported by: {c.leadInvestigator} • {new Date().toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-semibold border border-obsidian-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-teal transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

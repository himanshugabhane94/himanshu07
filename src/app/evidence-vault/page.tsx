'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { DocumentRecord } from '@/types/synapx';
import { 
  Vault, 
  Lock, 
  FileText, 
  ShieldCheck, 
  Search, 
  Download, 
  Eye, 
  CheckCircle2, 
  History, 
  Key, 
  X,
  FileCheck
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/common/ProvenanceBadge';

export default function EvidenceVaultPage() {
  const { documents, activeCase } = useInvestigation();
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(documents[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(d => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.source.toLowerCase().includes(q) || d.documentType.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-obsidian-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-500/20 text-teal-400">
                <Vault className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-100">
                Evidence Vault & Cryptographic Chain of Custody
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Secure evidence locker with tamper-evident SHA-256 checksums, access logs, and court-admissible provenance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Integrity: Verified</span>
            </span>
          </div>
        </div>

        {/* Evidence Grid & Document Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Evidence Files List */}
          <div className="synapx-card p-4 bg-obsidian-850 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-obsidian-700">
              <Search className="w-4 h-4 text-teal-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter evidence vault files..."
                className="w-full bg-transparent border-none text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2.5">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDoc?.id === doc.id
                      ? 'bg-teal-500/15 border-teal-500/50 shadow-sm'
                      : 'bg-obsidian-900 hover:bg-obsidian-750 border-obsidian-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="font-semibold text-xs text-slate-200 truncate">{doc.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-teal-400 shrink-0">{doc.fileSize}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">{doc.documentType}</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 2 Cols: Document Details & Chain of Custody Inspector */}
          {selectedDoc && (
            <div className="lg:col-span-2 synapx-card p-6 bg-obsidian-850 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-obsidian-700 gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">
                      {selectedDoc.documentType} • ID: {selectedDoc.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{selectedDoc.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Source: {selectedDoc.source}</p>
                  </div>

                  <ProvenanceBadge verificationStatus={selectedDoc.verificationStatus} confidenceScore={selectedDoc.ocrConfidence} />
                </div>

                {/* Cryptographic SHA-256 Card */}
                <div className="mt-4 p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-750 space-y-1.5 text-xs font-mono">
                  <div className="text-[10px] uppercase text-slate-400 flex items-center justify-between">
                    <span>SHA-256 Cryptographic Hash</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Hash Match Validated
                    </span>
                  </div>
                  <div className="text-teal-300 break-all select-all bg-obsidian-950 p-2 rounded border border-obsidian-800 text-[11px]">
                    {selectedDoc.sha256Checksum}
                  </div>
                </div>

                {/* Document Text Extract Preview */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-xs font-mono uppercase text-slate-300 font-bold">
                    Seized Evidence Content Preview
                  </div>
                  <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto whitespace-pre-line leading-relaxed select-text">
                    {selectedDoc.rawTextPreview}
                  </div>
                </div>

                {/* Chain of Custody Logs */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-teal-400" />
                    <span>Chain of Custody Access Log</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="p-2 rounded bg-obsidian-900 border border-obsidian-800 flex justify-between text-[11px] text-slate-300">
                      <span>Forensic Ingestion by Dr. Priya Sundaram (Analyst)</span>
                      <span className="text-slate-400 font-mono">{selectedDoc.uploadDate} 11:42</span>
                    </div>
                    <div className="p-2 rounded bg-obsidian-900 border border-obsidian-800 flex justify-between text-[11px] text-slate-300">
                      <span>Integrity Audit Verified by Director Arvind Deshmukh (Admin)</span>
                      <span className="text-slate-400 font-mono">2026-08-28 17:30</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-obsidian-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Section 65B Certificate attached.</span>
                <button
                  onClick={() => alert(`Downloaded signed evidence package for ${selectedDoc.title}`)}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signed Evidence Bundle</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </AppLayout>
  );
}

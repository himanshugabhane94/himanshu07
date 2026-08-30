'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { DocumentRecord, EntityType } from '@/types/synapx';
import { 
  FileSearch, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  FileText, 
  User, 
  Building, 
  Calendar, 
  MapPin, 
  Hash, 
  Play, 
  RefreshCw,
  PlusCircle,
  Eye
} from 'lucide-react';
import { EntityTypeBadge, ProvenanceBadge } from '@/components/common/ProvenanceBadge';

export function DocumentOcrPipeline() {
  const { documents, activeCase, addDocument } = useInvestigation();
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'DOC-01');
  const [processingStage, setProcessingStage] = useState<number>(4); // 0 to 4 (Complete)
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleSimulateNewUpload = () => {
    setIsProcessing(true);
    setProcessingStage(0);

    const steps = [
      { stage: 1, delay: 600 },
      { stage: 2, delay: 1200 },
      { stage: 3, delay: 1800 },
      { stage: 4, delay: 2400 }
    ];

    steps.forEach(({ stage, delay }) => {
      setTimeout(() => {
        setProcessingStage(stage);
        if (stage === 4) {
          setIsProcessing(false);
        }
      }, delay);
    });
  };

  const stages = [
    { num: 1, title: 'DOCUMENT UPLOADED', desc: 'Secure hash generation & PDF parsing' },
    { num: 2, title: 'OCR EXTRACTION COMPLETE', desc: 'Optical Character Recognition & layout analysis' },
    { num: 3, title: 'ENTITIES DETECTED', desc: 'Named Entity Recognition (NER) for Persons, Orgs, Locations' },
    { num: 4, title: 'RELATIONSHIPS EXTRACTED', desc: 'Triangular graph relationship & transaction mapping' },
    { num: 5, title: 'REVIEW REQUIRED', desc: 'Human-in-the-loop verification before case ingestion' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-obsidian-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <FileSearch className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">Document Intelligence & OCR Pipeline</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Simulated OCR, Layout Extraction & Named Entity Recognition for evidence ingestion.
          </p>
        </div>

        <button
          onClick={handleSimulateNewUpload}
          disabled={isProcessing}
          className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-obsidian-950 font-bold text-xs flex items-center gap-2 shadow-glow-teal transition-all"
        >
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          <span>{isProcessing ? 'Processing OCR Stream...' : 'Simulate New Document Upload'}</span>
        </button>
      </div>

      {/* 5-Step Pipeline Stepper */}
      <div className="synapx-card p-4 bg-obsidian-850">
        <div className="text-[10px] font-mono uppercase text-slate-400 mb-3 tracking-wider">
          Automated Ingestion Pipeline Progress
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {stages.map((st, idx) => {
            const isCompleted = processingStage >= idx;
            const isCurrent = processingStage === idx;
            return (
              <div
                key={st.num}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  isCompleted
                    ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                    : 'bg-obsidian-900 border-obsidian-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold">STAGE 0{st.num}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                </div>
                <div className="font-bold text-slate-200 text-[11px] leading-tight">{st.title}</div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Selector & OCR Inspection Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Document File List */}
        <div className="synapx-card p-4 bg-obsidian-850 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center justify-between pb-2 border-b border-obsidian-700">
            <span>Evidence Document Locker</span>
            <span className="text-teal-400">{documents.length} Files</span>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedDocId === doc.id
                    ? 'bg-teal-500/15 border-teal-500/50 shadow-sm'
                    : 'bg-obsidian-900 hover:bg-obsidian-750 border-obsidian-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="font-semibold text-xs text-slate-200 truncate">{doc.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-teal-400 shrink-0">{doc.ocrConfidence}% OCR</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                  <span>{doc.documentType} • {doc.fileSize}</span>
                  <span className="text-slate-400">{doc.uploadDate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Middle Col: Raw OCR Text Extraction Viewer */}
        <div className="synapx-card p-4 bg-obsidian-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-obsidian-700">
              <span className="text-xs font-mono font-bold uppercase text-slate-300">
                OCR Text Stream with NER Highlighting
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-950 text-teal-400 border border-obsidian-750">
                Confidence: {selectedDoc.ocrConfidence}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-950 border border-obsidian-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-line select-text">
              {selectedDoc.rawTextPreview}
            </div>

            <div className="mt-3 p-2 rounded bg-obsidian-850 border border-obsidian-750 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>SHA-256: {selectedDoc.sha256Checksum.slice(0, 24)}...</span>
              <span className="text-teal-400">Integrity Verified</span>
            </div>
          </div>

          <div className="pt-3 border-t border-obsidian-700 text-xs text-slate-400 flex items-center justify-between">
            <span>Source: {selectedDoc.source}</span>
            <span className="text-amber-400 font-medium text-[11px]">Human Review Required</span>
          </div>
        </div>

        {/* Right Col: Extracted Entities & Relationships */}
        <div className="synapx-card p-4 bg-obsidian-850 space-y-4">
          <div className="pb-2 border-b border-obsidian-700">
            <span className="text-xs font-mono font-bold uppercase text-teal-400">
              NER Extraction Results ({selectedDoc.extractedEntities.length} Entities)
            </span>
          </div>

          {/* Entities List */}
          <div className="space-y-2 max-h-44 overflow-y-auto">
            {selectedDoc.extractedEntities.map((ent, idx) => (
              <div key={idx} className="p-2 rounded bg-obsidian-900 border border-obsidian-750 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{ent.name}</div>
                  <div className="text-[10px] text-slate-400">{ent.type}</div>
                </div>
                <span className="text-[10px] font-mono text-teal-400 px-1.5 py-0.5 rounded bg-obsidian-950 border border-obsidian-700">
                  {ent.confidence}%
                </span>
              </div>
            ))}
          </div>

          {/* Extracted Relationships */}
          <div>
            <div className="text-[11px] font-mono uppercase text-amber-400 mb-1.5">
              Extracted Relational Edges ({selectedDoc.extractedRelationships.length})
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {selectedDoc.extractedRelationships.map((rel, idx) => (
                <div key={idx} className="p-2 rounded bg-obsidian-900 border border-obsidian-750 text-[11px]">
                  <div className="font-semibold text-slate-200">{rel.source} ➔ {rel.target}</div>
                  <div className="text-[10px] text-teal-400 font-mono mt-0.5">{rel.relation} ({rel.confidence}%)</div>
                </div>
              ))}
            </div>
          </div>

          {/* Human Confirmation Action */}
          <button
            onClick={() => alert(`Document records from "${selectedDoc.title}" confirmed by investigator and merged into active case graph.`)}
            className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-obsidian-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-glow-teal"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Ingest Extracted Graph Nodes</span>
          </button>
        </div>

      </div>

    </div>
  );
}

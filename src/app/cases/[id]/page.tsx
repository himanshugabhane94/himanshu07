'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { CaseBriefModal } from '@/components/cases/CaseBriefModal';
import { CaseDnaView } from '@/components/dna/CaseDnaView';
import { InteractiveNetworkGraph } from '@/components/graph/InteractiveNetworkGraph';
import { ExplainableAiCard } from '@/components/common/ExplainableAiCard';
import { 
  Briefcase, 
  FileText, 
  Dna, 
  Share2, 
  Clock, 
  Vault, 
  AlertTriangle, 
  CheckSquare, 
  History, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Plus,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.id as string;
  const { cases, entities, relationships, documents, aiFindings, tasks, auditLogs, addTask, toggleTaskStatus } = useInvestigation();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DNA' | 'GRAPH' | 'EVIDENCE' | 'ANOMALIES' | 'TASKS' | 'AUDIT'>('OVERVIEW');
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const currentCase = cases.find(c => c.id === caseId) || cases[0];
  const caseEntities = entities.filter(e => currentCase.entityIds.includes(e.id));
  const caseDocs = documents.filter(d => currentCase.documentIds.includes(d.id));
  const caseAnomalies = aiFindings.filter(a => a.caseId === currentCase.id || currentCase.anomalyIds.includes(a.id));
  const caseTasks = tasks.filter(t => t.caseId === currentCase.id);
  const caseAuditLogs = auditLogs.filter(a => a.caseNumber === currentCase.caseNumber || a.details.includes(currentCase.caseNumber));

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      id: `TSK-${Date.now().toString().slice(-3)}`,
      caseId: currentCase.id,
      title: newTaskTitle,
      assignedTo: currentCase.leadInvestigator,
      priority: 'HIGH',
      status: 'TODO',
      dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      notesCount: 0
    });
    setNewTaskTitle('');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Case Banner */}
        <div className="synapx-card p-6 bg-obsidian-850 border border-obsidian-700 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-400">{currentCase.caseNumber}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-obsidian-950 text-slate-300 border border-obsidian-750">
                  {currentCase.status}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  currentCase.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {currentCase.priority} PRIORITY
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                {currentCase.title}
              </h1>
              <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
                {currentCase.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBriefOpen(true)}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>One-Click Case Brief</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-3 border-t border-obsidian-750 text-xs">
            <div><span className="text-slate-400">Lead:</span> <strong className="text-slate-200">{currentCase.leadInvestigator}</strong></div>
            <div><span className="text-slate-400">Unit:</span> <strong className="text-slate-200">{currentCase.assignedUnit}</strong></div>
            <div><span className="text-slate-400">Entities:</span> <strong className="text-teal-400">{caseEntities.length}</strong></div>
            <div><span className="text-slate-400">Evidence Docs:</span> <strong className="text-slate-200">{caseDocs.length}</strong></div>
            <div><span className="text-slate-400">Completeness:</span> <strong className="text-slate-200">{currentCase.qualityCompletenessScore}%</strong></div>
            <div><span className="text-slate-400">Verified:</span> <strong className="text-emerald-400">{currentCase.verificationPercentage}%</strong></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-obsidian-700 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'OVERVIEW', label: 'Overview', icon: Briefcase },
            { id: 'DNA', label: 'Case DNA', icon: Dna },
            { id: 'GRAPH', label: 'Network Graph', icon: Share2 },
            { id: 'EVIDENCE', label: 'Evidence & OCR', icon: Vault },
            { id: 'ANOMALIES', label: 'AI Anomalies', icon: AlertTriangle },
            { id: 'TASKS', label: 'Tasks & Collaboration', icon: CheckSquare },
            { id: 'AUDIT', label: 'Audit Trail', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-t-lg font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-obsidian-850 text-teal-300 border-t-2 border-t-teal-400 border-x border-obsidian-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-850/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Suspects & Entities Grid */}
              <div className="synapx-card p-5 bg-obsidian-850 space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                  <span>Implicated Subjects & Shell Entities ({caseEntities.length})</span>
                  <Link href="/graph" className="text-xs text-teal-400 hover:underline">View in Graph</Link>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseEntities.map(ent => (
                    <div key={ent.id} className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{ent.name}</span>
                        <span className="text-[10px] font-mono text-teal-400">{ent.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{ent.roleOrDesignation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Notes */}
              <div className="synapx-card p-5 bg-obsidian-850 space-y-2 text-xs">
                <h3 className="font-bold text-slate-100 font-mono uppercase text-teal-400">
                  Investigative Findings Summary
                </h3>
                <p className="text-slate-300 leading-relaxed bg-obsidian-900 p-3 rounded-lg border border-obsidian-750">
                  {currentCase.summaryNotes}
                </p>
              </div>
            </div>

            {/* Right Col: AI Insights & Related Cases */}
            <div className="space-y-6">
              <div className="synapx-card p-5 bg-obsidian-850 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Key Explainable Findings</span>
                </h3>
                <div className="space-y-3">
                  {caseAnomalies.slice(0, 2).map(f => (
                    <ExplainableAiCard key={f.id} finding={f} showActions={false} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DNA' && <CaseDnaView />}

        {activeTab === 'GRAPH' && (
          <div className="h-[650px]">
            <InteractiveNetworkGraph forceFocusMode={false} />
          </div>
        )}

        {activeTab === 'EVIDENCE' && (
          <div className="synapx-card p-6 bg-obsidian-850 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Seized Documents & OCR Extractions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseDocs.map(doc => (
                <div key={doc.id} className="p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{doc.title}</span>
                    <span className="font-mono text-teal-400">{doc.ocrConfidence}% OCR</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{doc.rawTextPreview}</p>
                  <div className="pt-2 border-t border-obsidian-800 text-[10px] text-slate-400 flex justify-between">
                    <span>Source: {doc.source}</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ANOMALIES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseAnomalies.map(anom => (
              <ExplainableAiCard key={anom.id} finding={anom} />
            ))}
          </div>
        )}

        {activeTab === 'TASKS' && (
          <div className="synapx-card p-6 bg-obsidian-850 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-700">
              <h3 className="text-sm font-bold text-slate-100">Investigation Action Items & Collaboration</h3>
              <form onSubmit={handleAddTask} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add new task..."
                  className="bg-obsidian-900 border border-obsidian-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                />
                <button type="submit" className="p-1.5 rounded-lg bg-teal-500 text-obsidian-950 font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="space-y-2.5">
              {caseTasks.map(t => (
                <div key={t.id} className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={t.status === 'COMPLETED'}
                      onChange={() => toggleTaskStatus(t.id)}
                      className="rounded bg-obsidian-950 border-obsidian-700 text-teal-500"
                    />
                    <span className={t.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {t.title}
                    </span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Assigned: {t.assignedTo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'AUDIT' && (
          <div className="synapx-card p-6 bg-obsidian-850 space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Case Evidentiary Audit Trail</h3>
            <div className="space-y-2">
              {caseAuditLogs.map(log => (
                <div key={log.id} className="p-3 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{log.action}</div>
                    <p className="text-[11px] text-slate-400">{log.details}</p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <CaseBriefModal isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} investigationCase={currentCase} />
    </AppLayout>
  );
}

'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useInvestigation } from '@/context/InvestigationContext';
import { InvestigationCase, CaseStatus, CasePriority } from '@/types/synapx';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Clock, 
  Users, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Dna,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function CasesPage() {
  const { cases, addCase, setActiveCaseId } = useInvestigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Case Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState('CBI/ECIR/2026/0994');
  const [newPriority, setNewPriority] = useState<CasePriority>('HIGH');
  const [newInvestigator, setNewInvestigator] = useState('Inspector Vikram Rathore');

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.caseNumber.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: InvestigationCase = {
      id: `CASE-2026-${Date.now().toString().slice(-4)}`,
      caseNumber: newCaseNumber,
      title: newTitle,
      description: newDesc,
      status: 'OPEN',
      priority: newPriority,
      leadInvestigator: newInvestigator,
      assignedUnit: 'Special Financial Crimes Wing',
      tags: ['Synthetic Case', 'Intelligence Dossier'],
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      entityIds: ['ENT-P-01', 'ENT-O-01'],
      relationshipIds: ['REL-01'],
      documentIds: ['DOC-01'],
      anomalyIds: [],
      timelineEventIds: ['EVT-01'],
      qualityCompletenessScore: 75,
      verificationPercentage: 50,
      summaryNotes: 'Newly initiated synthetic investigation dossier.',
      suggestedRelatedCaseIds: []
    };

    addCase(created);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Briefcase className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                  Case Management Directory
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organize, investigate, and collaborate on multi-agency criminal network dossiers.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Investigation Case</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="synapx-card p-4 bg-obsidian-850 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-teal-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by case title, FIR/ECIR number, suspect or keyword..."
              className="w-full bg-transparent border-none text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-mono text-[10px]">STATUS:</span>
            {['ALL', 'OPEN', 'UNDER_REVIEW', 'VERIFIED', 'ARCHIVED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}

            <span className="text-slate-400 font-mono text-[10px] ml-2">PRIORITY:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(pr => (
              <button
                key={pr}
                onClick={() => setPriorityFilter(pr)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  priorityFilter === pr
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {pr}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="synapx-card p-5 bg-obsidian-850 synapx-card-hover flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Status Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-teal-400">{c.caseNumber}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                    c.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    c.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  }`}>
                    {c.priority}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
                  {c.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-obsidian-950 text-slate-400 border border-obsidian-750">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-obsidian-750 text-[11px] text-slate-400 mb-3">
                  <div>Completeness: <strong className="text-slate-200">{c.qualityCompletenessScore}%</strong></div>
                  <div>Verified: <strong className="text-emerald-400">{c.verificationPercentage}%</strong></div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/cases/${c.id}`}
                    onClick={() => setActiveCaseId(c.id)}
                    className="flex-1 py-2 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 font-bold text-xs border border-teal-500/30 flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Open Case Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/case-dna"
                    onClick={() => setActiveCaseId(c.id)}
                    className="p-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-amber-300 border border-obsidian-700 transition-colors"
                    title="Inspect Case DNA"
                  >
                    <Dna className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Create Case Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-obsidian-850 border border-obsidian-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-2 border-b border-obsidian-700">
              <h3 className="text-sm font-mono font-bold uppercase text-slate-100">Initiate New Investigation</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono uppercase mb-1">Case Number / Reference ID</label>
                <input
                  type="text"
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                  required
                  className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase mb-1">Investigation Title / Operation Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Operation Golden Transit: Customs Freight Discrepancies"
                  required
                  className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono uppercase mb-1">Modus Operandi & Scope Summary</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detailed summary of suspected network, shell entities, and predicate offenses..."
                  rows={3}
                  required
                  className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as CasePriority)}
                    className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase mb-1">Lead Investigator</label>
                  <input
                    type="text"
                    value={newInvestigator}
                    onChange={(e) => setNewInvestigator(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-700 rounded-lg p-2 text-slate-100"
                  >
                  </input>
                </div>
              </div>

              <div className="pt-3 border-t border-obsidian-700 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-obsidian-800 text-slate-300 hover:bg-obsidian-750"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-bold shadow-glow-teal"
                >
                  Initialize Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  Dna, 
  Users, 
  Building, 
  Calendar, 
  MapPin, 
  Hash, 
  FileText, 
  Link2, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export function CaseDnaView() {
  const { activeCase, entities, relationships, timelineEvents, documents, geoPoints } = useInvestigation();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Group entities by type
  const people = entities.filter(e => e.type === 'PERSON');
  const orgs = entities.filter(e => e.type === 'ORGANIZATION');
  const events = entities.filter(e => e.type === 'EVENT');
  const locations = entities.filter(e => e.type === 'LOCATION');
  const digital = entities.filter(e => e.type === 'DIGITAL_ENTITY');
  const docs = documents;
  const related = activeCase.suggestedRelatedCaseIds || [];

  const verifiedEntitiesCount = entities.filter(e => e.verificationStatus === 'VERIFIED').length;
  const verificationPercent = Math.round((verifiedEntitiesCount / (entities.length || 1)) * 100);

  const branches = [
    { id: 'PEOPLE', label: 'PEOPLE', count: people.length, icon: Users, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30', items: people },
    { id: 'ORGANIZATIONS', label: 'ORGANIZATIONS', count: orgs.length, icon: Building, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', items: orgs },
    { id: 'EVENTS', label: 'EVENTS', count: events.length, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', items: events },
    { id: 'LOCATIONS', label: 'LOCATIONS', count: locations.length, icon: MapPin, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', items: locations },
    { id: 'DOCUMENTS', label: 'DOCUMENTS', count: docs.length, icon: FileText, color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/30', items: docs },
    { id: 'DIGITAL_ENTITIES', label: 'DIGITAL ENTITIES', count: digital.length, icon: Hash, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', items: digital },
    { id: 'RELATED_CASES', label: 'RELATED CASES', count: related.length, icon: Link2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', items: related },
    { id: 'TIMELINE', label: 'TIMELINE SPAN', count: `${timelineEvents.length} Events`, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', items: timelineEvents }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top DNA Telemetry Banner */}
      <div className="synapx-card p-6 bg-gradient-to-r from-obsidian-850 via-obsidian-800 to-obsidian-850 border border-obsidian-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Dna className="w-64 h-64 text-teal-400" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Dna className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
              CASE DNA SIGNATURE ARCHITECTURE
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mb-2">
            Case DNA: {activeCase.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mb-6">
            Case DNA visually deconstructs and clusters the multi-dimensional anatomy of an entire criminal syndicate across 8 interconnected structural vectors.
          </p>

          {/* DNA Metrics Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-3 rounded-lg bg-obsidian-900/80 border border-obsidian-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Entities Analyzed</div>
              <div className="text-lg font-mono font-bold text-teal-400 mt-1">{entities.length}</div>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900/80 border border-obsidian-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Relationships</div>
              <div className="text-lg font-mono font-bold text-amber-400 mt-1">{relationships.length}</div>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900/80 border border-obsidian-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Documents & OCR</div>
              <div className="text-lg font-mono font-bold text-slate-200 mt-1">{docs.length}</div>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900/80 border border-obsidian-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Timeline Events</div>
              <div className="text-lg font-mono font-bold text-cyan-400 mt-1">{timelineEvents.length}</div>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900/80 border border-obsidian-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Geo Crime Sites</div>
              <div className="text-lg font-mono font-bold text-yellow-400 mt-1">{geoPoints.length}</div>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900/80 border border-obsidian-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Human Verified</div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-1">{verificationPercent}%</div>
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900/80 border border-obsidian-700">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Completeness</div>
              <div className="text-lg font-mono font-bold text-teal-300 mt-1">{activeCase.qualityCompletenessScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Hub & Spoke Tree Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Radial Spoke Tree */}
        <div className="lg:col-span-2 synapx-card p-6 bg-obsidian-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-obsidian-700">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              Interactive Case DNA Tree
            </div>
            <span className="text-[11px] text-slate-400">Click any vector branch to inspect connected assets</span>
          </div>

          {/* Hub Core */}
          <div className="relative py-8 px-4 flex flex-col items-center">
            {/* Center Case Node */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-600/30 to-amber-600/30 border-2 border-teal-400 shadow-glow-teal text-center max-w-sm z-10">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                {activeCase.caseNumber}
              </span>
              <h4 className="text-sm font-bold text-slate-100 mt-0.5">{activeCase.title.split(':')[0]}</h4>
              <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-300">
                <span className="px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-700 font-mono">
                  Completeness: {activeCase.qualityCompletenessScore}%
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Verified: {verificationPercent}%
                </span>
              </div>
            </div>

            {/* Connecting Spoke Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-8">
              {branches.map((branch) => {
                const isSelected = selectedBranch === branch.id;
                const Icon = branch.icon;
                return (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(isSelected ? null : branch.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative group ${
                      isSelected
                        ? `${branch.bg} ${branch.border} ring-2 ring-teal-400 shadow-lg`
                        : 'bg-obsidian-850 hover:bg-obsidian-800 border-obsidian-700 hover:border-obsidian-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`p-1.5 rounded-lg ${branch.bg} ${branch.color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-200">{branch.count}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                      {branch.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Click to view items</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-obsidian-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>SYNAPX Case DNA Signature Engine v2.6</span>
            <Link href="/graph" className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold">
              <span>View Full Network Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Col: Selected Vector Branch Breakdown */}
        <div className="synapx-card p-5 bg-obsidian-850 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-obsidian-700 mb-4">
              <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">DNA Sub-Vector Breakdown</span>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                {selectedBranch ? `${selectedBranch.replace('_', ' ')} INVENTORY` : 'SELECT A DNA VECTOR'}
              </h3>
            </div>

            {selectedBranch ? (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {selectedBranch === 'PEOPLE' && people.map(p => (
                  <div key={p.id} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{p.name}</span>
                      <span className="text-[10px] font-mono text-teal-400">{p.confidenceScore}% Conf</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.roleOrDesignation}</p>
                    {p.isBridgeCandidate && (
                      <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ★ Bridge Candidate
                      </span>
                    )}
                  </div>
                ))}

                {selectedBranch === 'ORGANIZATIONS' && orgs.map(o => (
                  <div key={o.id} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{o.name}</span>
                      <span className="text-[10px] font-mono text-amber-400">{o.riskRating}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{o.roleOrDesignation}</p>
                  </div>
                ))}

                {selectedBranch === 'DOCUMENTS' && docs.map(d => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200 truncate">
                      <span className="truncate">{d.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{d.source} • OCR Conf: {d.ocrConfidence}%</p>
                  </div>
                ))}

                {selectedBranch === 'DIGITAL_ENTITIES' && digital.map(d => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="font-semibold text-slate-200">{d.name}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{d.roleOrDesignation}</p>
                  </div>
                ))}

                {selectedBranch === 'RELATED_CASES' && related.map((r, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{r.caseId}</span>
                      <span className="text-teal-400 font-mono font-bold">{r.similarityScore}% Match</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{r.matchRationale}</p>
                  </div>
                ))}

                {selectedBranch === 'EVENTS' && events.map(e => (
                  <div key={e.id} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="font-semibold text-slate-200">{e.name}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{e.firstSeen}</p>
                  </div>
                ))}

                {selectedBranch === 'LOCATIONS' && locations.map(l => (
                  <div key={l.id} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="font-semibold text-slate-200">{l.name}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{l.metadata.city}, {l.metadata.country}</p>
                  </div>
                ))}

                {selectedBranch === 'TIMELINE' && timelineEvents.map(t => (
                  <div key={t.id} className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{t.title}</span>
                      <span className="font-mono text-teal-400">{t.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Dna className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p>Click on any of the 8 DNA vectors in the diagram to inspect its underlying entities, evidence records, and verification status.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-obsidian-700">
            <Link
              href="/reports"
              className="w-full py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-teal-300 font-semibold text-xs border border-obsidian-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Case DNA in Dossier</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

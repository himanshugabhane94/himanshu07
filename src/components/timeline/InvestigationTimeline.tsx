'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { TimelineEvent } from '@/types/synapx';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  FileText, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  ArrowRight,
  Filter,
  DollarSign,
  Activity,
  Radio,
  Truck
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/common/ProvenanceBadge';

export function InvestigationTimeline() {
  const { timelineEvents, entities, documents, highlightEntitiesOnGraph } = useInvestigation();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(timelineEvents[0]?.id || null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredEvents = timelineEvents.filter(e => {
    if (categoryFilter === 'ALL') return true;
    return e.category === categoryFilter;
  });

  const selectedEvent = timelineEvents.find(e => e.id === selectedEventId);

  const getCategoryIcon = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'FINANCIAL': return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'LOGISTICS': return <Truck className="w-4 h-4 text-teal-400" />;
      case 'MEETING': return <Users className="w-4 h-4 text-cyan-400" />;
      case 'ENFORCEMENT': return <ShieldCheck className="w-4 h-4 text-red-400" />;
      case 'CYBER': return <Radio className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-obsidian-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">Automatic Investigation Timeline Builder</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Chronological reconstruction of financial wire spikes, shell corporate formations, surveillance conclaves, and raids.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-obsidian-850 p-1 rounded-lg border border-obsidian-700 text-xs">
          <span className="text-slate-400 font-mono text-[10px] px-1 uppercase">Category:</span>
          {['ALL', 'FINANCIAL', 'LOGISTICS', 'MEETING', 'CYBER', 'ENFORCEMENT'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream & Event Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Chronological Timeline Stream */}
        <div className="lg:col-span-2 synapx-card p-6 bg-obsidian-850 space-y-6">
          <div className="relative border-l-2 border-obsidian-700 ml-4 pl-6 space-y-8">
            {filteredEvents.map((evt) => {
              const isSelected = selectedEventId === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline Dot on axis */}
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                    isSelected
                      ? 'bg-teal-400 border-obsidian-950 ring-4 ring-teal-500/30'
                      : 'bg-obsidian-850 border-teal-500 group-hover:bg-teal-500'
                  }`} />

                  {/* Event Card */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/50 shadow-lg'
                      : 'bg-obsidian-900 hover:bg-obsidian-800 border-obsidian-750'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-obsidian-950 border border-obsidian-800">
                          {getCategoryIcon(evt.category)}
                        </span>
                        <span className="text-xs font-mono font-bold text-teal-400">{evt.date}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-obsidian-950 text-slate-400 border border-obsidian-800">
                          {evt.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Confidence: {evt.confidenceScore}%</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{evt.description}</p>

                    {/* Metadata Footer */}
                    <div className="mt-3 pt-2 border-t border-obsidian-800/80 flex items-center justify-between text-[10px] text-slate-400 flex-wrap gap-2">
                      {evt.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-yellow-400" />
                          <span>{evt.location}</span>
                        </span>
                      )}
                      <span>{evt.entityIds.length} Linked Entities</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Event Deep-Dive */}
        <div className="synapx-card p-5 bg-obsidian-850 flex flex-col justify-between">
          {selectedEvent ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-obsidian-700">
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">
                  EVENT DETAILS • {selectedEvent.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <ProvenanceBadge verificationStatus={selectedEvent.verificationStatus} confidenceScore={selectedEvent.confidenceScore} />
                </div>
              </div>

              {/* Event Description */}
              <div className="text-xs text-slate-300 leading-relaxed bg-obsidian-900 p-3 rounded-lg border border-obsidian-750">
                {selectedEvent.description}
              </div>

              {/* Linked Entities */}
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                  Implicated Entities ({selectedEvent.entityIds.length})
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedEvent.entityIds.map(entId => {
                    const ent = entities.find(e => e.id === entId);
                    if (!ent) return null;
                    return (
                      <div key={ent.id} className="p-2 rounded bg-obsidian-900 border border-obsidian-750 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-200">{ent.name}</div>
                          <div className="text-[10px] text-slate-400">{ent.roleOrDesignation}</div>
                        </div>
                        <span className="text-[10px] font-mono text-teal-400">{ent.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Source Provenance */}
              <div className="p-2.5 rounded bg-obsidian-950 border border-obsidian-750 text-[10px] text-slate-400">
                <strong className="text-slate-300">Evidentiary Provenance: </strong>
                <span>{selectedEvent.sourceProvenance}</span>
              </div>

              {/* Graph Highlight Action */}
              <button
                onClick={() => highlightEntitiesOnGraph(selectedEvent.entityIds)}
                className="w-full py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-500/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Highlight Linked Nodes on Graph</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p>Select any chronological event to inspect linked intelligence assets.</p>
            </div>
          )}

          <div className="pt-3 border-t border-obsidian-700 text-[11px] text-slate-400">
            <span>Automated Timeline Engine v2.6</span>
          </div>
        </div>

      </div>

    </div>
  );
}

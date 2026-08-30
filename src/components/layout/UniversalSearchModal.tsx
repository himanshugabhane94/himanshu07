'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  User, 
  Building, 
  Calendar, 
  MapPin, 
  Hash, 
  FileText, 
  Briefcase, 
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { EntityType } from '@/types/synapx';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UniversalSearchModal({ isOpen, onClose }: UniversalSearchModalProps) {
  const { entities, cases, documents, aiFindings, highlightEntitiesOnGraph } = useInvestigation();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // handled in parent or toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'ENTITY' | 'CASE' | 'DOCUMENT' | 'ANOMALY';
      type?: EntityType;
      url: string;
      highlightId?: string;
    }> = [];

    // Search Entities
    if (filterType === 'ALL' || filterType === 'ENTITY') {
      entities.forEach((ent) => {
        if (
          ent.name.toLowerCase().includes(q) ||
          ent.aliases.some(a => a.toLowerCase().includes(q)) ||
          ent.roleOrDesignation.toLowerCase().includes(q) ||
          ent.sourceProvenance.toLowerCase().includes(q)
        ) {
          results.push({
            id: ent.id,
            title: ent.name,
            subtitle: `${ent.roleOrDesignation} • ${ent.type}`,
            category: 'ENTITY',
            type: ent.type,
            url: `/graph?entity=${ent.id}`,
            highlightId: ent.id
          });
        }
      });
    }

    // Search Cases
    if (filterType === 'ALL' || filterType === 'CASE') {
      cases.forEach((c) => {
        if (
          c.title.toLowerCase().includes(q) ||
          c.caseNumber.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        ) {
          results.push({
            id: c.id,
            title: c.title,
            subtitle: `${c.caseNumber} • ${c.status} • Priority: ${c.priority}`,
            category: 'CASE',
            url: `/cases/${c.id}`
          });
        }
      });
    }

    // Search Documents
    if (filterType === 'ALL' || filterType === 'DOCUMENT') {
      documents.forEach((doc) => {
        if (
          doc.title.toLowerCase().includes(q) ||
          doc.rawTextPreview.toLowerCase().includes(q) ||
          doc.source.toLowerCase().includes(q)
        ) {
          results.push({
            id: doc.id,
            title: doc.title,
            subtitle: `${doc.documentType} • Source: ${doc.source} (OCR Conf: ${doc.ocrConfidence}%)`,
            category: 'DOCUMENT',
            url: `/document-intelligence?doc=${doc.id}`
          });
        }
      });
    }

    // Search Anomalies
    if (filterType === 'ALL' || filterType === 'ANOMALY') {
      aiFindings.forEach((anom) => {
        if (
          anom.title.toLowerCase().includes(q) ||
          anom.finding.toLowerCase().includes(q) ||
          anom.whyFlagged.toLowerCase().includes(q)
        ) {
          results.push({
            id: anom.id,
            title: anom.title,
            subtitle: `${anom.findingType} • Confidence: ${anom.confidence}%`,
            category: 'ANOMALY',
            url: `/anomaly-detection?finding=${anom.id}`,
            highlightId: anom.affectedEntityIds[0]
          });
        }
      });
    }

    return results.slice(0, 15);
  }, [query, filterType, entities, cases, documents, aiFindings]);

  if (!isOpen) return null;

  const handleSelectResult = (result: any) => {
    if (result.highlightId) {
      highlightEntitiesOnGraph([result.highlightId]);
    }
    router.push(result.url);
    onClose();
  };

  const getEntityIcon = (type?: EntityType) => {
    switch (type) {
      case 'PERSON': return <User className="w-4 h-4 text-teal-400" />;
      case 'ORGANIZATION': return <Building className="w-4 h-4 text-amber-400" />;
      case 'EVENT': return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'LOCATION': return <MapPin className="w-4 h-4 text-yellow-400" />;
      case 'DIGITAL_ENTITY': return <Hash className="w-4 h-4 text-purple-400" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-slate-400" />;
      default: return <Search className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-obsidian-850 border border-obsidian-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-3 border-b border-obsidian-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-400 shrink-0 ml-1" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Universal Search across Entities, Shell Orgs, Cases, OCR Docs, Anomalies..."
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-0"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-obsidian-750 rounded text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1 text-xs text-slate-400 hover:text-slate-200 bg-obsidian-900 px-2 py-1 rounded border border-obsidian-700">
            ESC
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="px-3 py-2 bg-obsidian-900 border-b border-obsidian-700 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['ALL', 'ENTITY', 'CASE', 'DOCUMENT', 'ANOMALY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterType === cat
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-obsidian-800">
          {searchResults.length > 0 ? (
            searchResults.map((res) => (
              <button
                key={`${res.category}-${res.id}`}
                onClick={() => handleSelectResult(res)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-obsidian-800 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-start gap-3 truncate">
                  <div className="p-2 rounded bg-obsidian-900 border border-obsidian-700 shrink-0 mt-0.5">
                    {res.category === 'ENTITY' ? getEntityIcon(res.type) :
                     res.category === 'CASE' ? <Briefcase className="w-4 h-4 text-teal-400" /> :
                     res.category === 'DOCUMENT' ? <FileText className="w-4 h-4 text-slate-300" /> :
                     <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100 group-hover:text-teal-300 truncate">
                        {res.title}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-obsidian-950 text-slate-400 border border-obsidian-750">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{res.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          ) : query.trim() ? (
            <div className="p-8 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm">No intelligence records match &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;Ramesh&quot;, &quot;Surya&quot;, &quot;JNPT&quot;, &quot;Falcon&quot; or &quot;Hawala&quot;</p>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400">
              <div className="text-xs uppercase font-mono text-teal-400 mb-2">Quick Search Suggestions</div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                {['Ramesh Kumar', 'Apex Global Logistics', 'Surya Bullion', 'JNPT Cargo Raid', 'Crypto Wallet', 'Operation Falcon'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded bg-obsidian-900 hover:bg-obsidian-750 text-slate-300 border border-obsidian-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-obsidian-900 border-t border-obsidian-700 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search scope: Active Case + All Cross-Case Entities</span>
          <span className="font-mono text-teal-400/80">SYNAPX Universal Engine</span>
        </div>
      </div>
    </div>
  );
}

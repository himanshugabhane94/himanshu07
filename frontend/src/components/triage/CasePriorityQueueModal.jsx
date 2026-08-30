import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, ShieldAlert, ArrowRight, X, 
  ChevronDown, ChevronUp, Sparkles, CheckCircle2, 
  Layers, ExternalLink, Activity, Info, RefreshCw,
  Clock, Award, BarChart3, Scale
} from 'lucide-react';
import { api } from '../../services/api';

export default function CasePriorityQueueModal({ isOpen, onClose, onSelectCase }) {
  const [priorityData, setPriorityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [showRubric, setShowRubric] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState('ALL');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.getPriorityQueue();
      setPriorityData(res);
      if (res.cases_queue && res.cases_queue.length > 0) {
        setExpandedCaseId(res.cases_queue[0].case_id); // Auto expand top case
      }
    } catch (err) {
      console.error('Failed to load priority queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQueue();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCases = priorityData?.cases_queue?.filter(c => {
    if (filterUrgency === 'ALL') return true;
    return c.urgency_level === filterUrgency;
  }) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-[#141210] border border-[#3a352d] shadow-2xl overflow-hidden shadow-dossier">
        
        {/* Header */}
        <div className="p-6 border-b border-[#3a352d] bg-[#0f0e0d] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#241a18] border border-[#a5342a]/60 text-[#e27d75]">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold font-cinzel text-[#ece7de] tracking-wide">
                  Automated Case Priority & Triage Queue
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#241a18] text-[#e27d75] border border-[#a5342a]/50">
                  {priorityData?.critical_urgent_count || 0} Critical Urgent
                </span>
              </div>
              <p className="text-xs text-[#8a8478] font-serif italic mt-0.5">
                Transparent multi-factor triage ranking to guide high-caseload operational resource allocation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRubric(!showRubric)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] text-xs font-mono text-[#f5c074] transition-all"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Scoring Formula</span>
            </button>
            <button
              onClick={fetchQueue}
              className="p-2 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] text-[#8a8478] hover:text-[#ece7de] transition-all"
              title="Refresh Priority Scores"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#d68a1f]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#a5342a] text-[#8a8478] hover:text-[#ece7de] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Explainable Rubric Banner (Expandable) */}
        {showRubric && (
          <div className="p-4 bg-[#1c1a17] border-b border-[#3a352d] space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#f5c074] uppercase tracking-wider">
                ⚖️ 5-Factor Weighted Triage Rubric (Total: 100 Points)
              </span>
              <span className="text-[#8a8478] text-[11px]">Judicially Defensible Allocation Standard</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                <span className="text-[10px] text-[#8a8478] block">1. CRIME SEVERITY</span>
                <strong className="text-[#ece7de]">Max 30 Pts</strong>
                <p className="text-[9px] text-[#8a8478] font-serif mt-0.5">Tier 5 Homicide / Terror vs Tier 1 Financial</p>
              </div>
              <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                <span className="text-[10px] text-[#8a8478] block">2. SYNDICATE TIES</span>
                <strong className="text-[#ece7de]">Max 25 Pts</strong>
                <p className="text-[9px] text-[#8a8478] font-serif mt-0.5">Cross-case shared suspects, guns, vehicles</p>
              </div>
              <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                <span className="text-[10px] text-[#8a8478] block">3. VICTIM SAFETY</span>
                <strong className="text-[#ece7de]">Max 20 Pts</strong>
                <p className="text-[9px] text-[#8a8478] font-serif mt-0.5">Repeat offender history & escalating violence</p>
              </div>
              <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                <span className="text-[10px] text-[#8a8478] block">4. EVIDENCE STRENGTH</span>
                <strong className="text-[#ece7de]">Max 15 Pts</strong>
                <p className="text-[9px] text-[#8a8478] font-serif mt-0.5">Graph density & verified forensic attachments</p>
              </div>
              <div className="p-2 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
                <span className="text-[10px] text-[#8a8478] block">5. RECENCY</span>
                <strong className="text-[#ece7de]">Max 10 Pts</strong>
                <p className="text-[9px] text-[#8a8478] font-serif mt-0.5">Active operational window & discovery velocity</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-6 py-3 bg-[#141210] border-b border-[#3a352d] flex items-center justify-between gap-3 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[#8a8478] text-[11px]">Filter by Urgency:</span>
            {['ALL', 'CRITICAL_URGENT', 'HIGH_PRIORITY', 'MODERATE_TRIAGE', 'STANDARD_ROUTINE'].map((urg) => (
              <button
                key={urg}
                onClick={() => setFilterUrgency(urg)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterUrgency === urg
                    ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50 font-bold'
                    : 'text-[#8a8478] hover:text-[#ece7de]'
                }`}
              >
                {urg.replace('_', ' ')}
              </button>
            ))}
          </div>
          <span className="text-[#8a8478]">
            Showing {filteredCases.length} of {priorityData?.total_cases_analyzed || 0} active investigations
          </span>
        </div>

        {/* Priority Cases List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#3a352d]">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#8a8478]">
              <div className="w-8 h-8 border-2 border-[#d68a1f] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono">Calculating multi-factor case priority scores...</span>
            </div>
          ) : filteredCases.length > 0 ? (
            filteredCases.map((caseItem, idx) => {
              const isExpanded = expandedCaseId === caseItem.case_id;
              const isCritical = caseItem.priority_score >= 80;
              const isHigh = caseItem.priority_score >= 65 && caseItem.priority_score < 80;
              const isModerate = caseItem.priority_score >= 45 && caseItem.priority_score < 65;

              return (
                <div
                  key={caseItem.case_id}
                  className={`rounded-2xl bg-[#0f0e0d] border transition-all overflow-hidden shadow-dossier ${
                    isCritical
                      ? 'border-[#a5342a]/70 hover:border-[#e27d75]'
                      : isHigh
                      ? 'border-[#d68a1f]/60 hover:border-[#f5c074]'
                      : 'border-[#3a352d] hover:border-[#8a8478]'
                  }`}
                >
                  {/* Case Card Header */}
                  <div className="p-5 flex items-start justify-between gap-4">
                    
                    {/* Rank Badge & Score Ring */}
                    <div className="flex items-center gap-3.5">
                      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-2xl bg-[#1c1a17] border border-[#3a352d] text-xs font-mono font-bold text-[#8a8478]">
                        #{idx + 1}
                      </div>

                      {/* Score Badge */}
                      <div className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-2xl border ${
                        isCritical 
                          ? 'bg-[#241a18] border-[#a5342a] text-[#e27d75]' 
                          : isHigh 
                          ? 'bg-[#242018] border-[#d68a1f] text-[#f5c074]' 
                          : 'bg-[#1a201c] border-[#5c7a5c] text-[#9fc49f]'
                      }`}>
                        <span className="text-xl font-bold font-mono tracking-tight leading-none">
                          {caseItem.priority_score}
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest mt-0.5">
                          / 100 PTS
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#d68a1f]">
                            {caseItem.fir_number}
                          </span>
                          <span className={isCritical ? 'seal-badge-critical' : isHigh ? 'seal-badge-high' : 'seal-badge-medium'}>
                            {caseItem.urgency_level.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#ece7de] font-serif mt-0.5">
                          {caseItem.title}
                        </h3>
                        <div className="text-[11px] text-[#8a8478] font-mono mt-0.5">
                          {caseItem.agency} • {caseItem.state} • Discovered: {caseItem.last_activity_date}
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Button & Expand Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onSelectCase(caseItem.case_id);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24211d] border border-[#d68a1f]/60 hover:border-[#d68a1f] text-[#f5c074] text-xs font-mono font-bold transition-all active:scale-95 shadow-md"
                      >
                        <span>Investigate Case</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setExpandedCaseId(isExpanded ? null : caseItem.case_id)}
                        className="p-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] text-[#8a8478] hover:text-[#ece7de] transition-all"
                        title="Toggle Factor Breakdown"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>

                  {/* Summary Directives & Stats Strip */}
                  <div className="px-5 py-2.5 bg-[#141210] border-t border-[#2a2620] flex items-center justify-between gap-3 flex-wrap text-xs font-mono">
                    <div className="flex items-center gap-3 text-[#8a8478]">
                      <span>Syndicate Ties: <strong className="text-[#ece7de]">{caseItem.cross_case_links_count}</strong></span>
                      <span>Victims: <strong className="text-[#ece7de]">{caseItem.victims_count}</strong></span>
                      <span>Graph Entities: <strong className="text-[#ece7de]">{caseItem.nodes_count} Nodes / {caseItem.edges_count} Edges</strong></span>
                    </div>

                    <div className="text-[11px] text-[#f5c074] font-serif italic truncate max-w-md">
                      🎯 <strong>Triage Directive:</strong> {caseItem.triage_recommendation}
                    </div>
                  </div>

                  {/* Expandable Explainable Factor Breakdown */}
                  {isExpanded && (
                    <div className="p-5 border-t border-[#2a2620] bg-[#141210] space-y-3 animate-in fade-in">
                      <div className="text-xs font-bold text-[#8a8478] uppercase font-mono tracking-wider">
                        Transparent Scoring Breakdown ({caseItem.score_breakdown.length} Evaluated Factors)
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {caseItem.score_breakdown.map((factor, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-[#ece7de]">{factor.name}</span>
                              <span className="font-bold text-[#f5c074]">
                                +{factor.points} / {factor.max_points} pts
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 rounded-full bg-[#1c1a17] overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  factor.points >= (factor.max_points * 0.8) ? 'bg-[#a5342a]' : 'bg-[#d68a1f]'
                                }`}
                                style={{ width: `${(factor.points / factor.max_points) * 100}%` }}
                              />
                            </div>

                            <p className="text-[11px] text-[#8a8478] font-serif leading-relaxed">
                              {factor.explanation}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Directive Callout Box */}
                      <div className="p-3.5 rounded-xl bg-[#1c1a17] border border-[#a5342a]/40 text-xs text-[#ece7de] font-serif flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#e27d75] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#e27d75] font-mono">OPERATIONAL ACTION PLAN:</strong>
                          <p className="mt-0.5">{caseItem.triage_recommendation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#8a8478] font-mono rounded-2xl bg-[#0f0e0d] border border-[#3a352d]">
              No cases found matching the selected priority filter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3a352d] bg-[#0f0e0d] flex items-center justify-between text-xs font-mono text-[#8a8478]">
          <span>⚖️ Standardized Triage Metric conforming to MHA SOP-2024</span>
          <span>Click any case to immediately load its full graph investigation</span>
        </div>

      </div>
    </div>
  );
}

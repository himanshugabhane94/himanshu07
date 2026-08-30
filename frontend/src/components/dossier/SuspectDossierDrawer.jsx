import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, Landmark, Building2, Truck, 
  MapPin, Globe, ShieldAlert, Key, ExternalLink, 
  Clock, Hash, FileCheck, ArrowUpRight, ArrowDownLeft, 
  Share2, Eye, Network, Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import RiskExplanationPanel from './RiskExplanationPanel';
import ChainOfCustodyView from '../blockchain/ChainOfCustodyView';

export default function SuspectDossierDrawer({
  nodeId,
  caseId,
  onClose,
  onSelectNode,
  onFindPathFromNode,
  onExpandNeighborhood
}) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('xai'); // default to 'xai'

  useEffect(() => {
    if (!nodeId) return;
    setLoading(true);
    api.getNodeDossier(nodeId)
      .then(data => {
        setDossier(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dossier:", err);
        setLoading(false);
      });
  }, [nodeId]);

  if (!nodeId) return null;

  const node = dossier?.node;
  const riskSealClass = node?.risk_level === 'Critical' ? 'seal-badge-critical' :
                        node?.risk_level === 'High' ? 'seal-badge-high' :
                        node?.risk_level === 'Medium' ? 'seal-badge-medium' :
                        'seal-badge-low';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[490px] bg-[#1c1a17]/98 backdrop-blur-xl border-l border-[#3a352d] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header with Risk Banner */}
      <div className="p-4 border-b border-[#3a352d] flex items-center justify-between bg-[#0f0e0d]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#d68a1f] uppercase">
            SUTRA Intelligence Dossier
          </span>
          <span className="text-[#3a352d]">•</span>
          <span className="text-xs text-[#8a8478] font-mono">{nodeId}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#8a8478] hover:text-[#ece7de] transition-all border border-[#3a352d]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#8a8478]">
          <div className="w-8 h-8 border-2 border-[#d68a1f] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono">Decrypting intelligence dossier...</span>
        </div>
      ) : node ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 relative">
          
          {/* Subtle Classified Stamp Watermark */}
          <div className="stamp-watermark">
            CLASSIFIED // SUTRA DOSSIER
          </div>

          {/* Profile Card */}
          <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-3 shadow-dossier relative z-10">
            <div className="flex items-start gap-3.5">
              
              {/* Entity Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-[#1c1a17] border border-[#3a352d] flex items-center justify-center text-2xl shrink-0">
                {node.type === 'Person' ? '👤' : 
                 node.type === 'Phone' ? '📞' :
                 node.type === 'BankAccount' ? '🏦' :
                 node.type === 'Vehicle' ? '🚗' :
                 node.type === 'Organization' ? '🏢' :
                 node.type === 'Location' ? '📍' : '🌐'}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-[#ece7de] truncate font-serif">{node.label}</h3>
                  <span className={riskSealClass}>
                    {node.risk_level}
                  </span>
                </div>
                <p className="text-xs text-[#f5c074] font-medium font-serif italic">
                  {node.properties?.role || `${node.type} Entity`}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#8a8478] font-mono">
                  <span>Degree: <strong className="text-[#ece7de]">{dossier.degree}</strong></span>
                  <span>•</span>
                  <span>PageRank: <strong className="text-[#d68a1f]">{node.centrality_score ? node.centrality_score.toFixed(4) : '0.0450'}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Bar (Trace Path, 2-Hop Expand) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2a2620]">
              <button
                onClick={() => onFindPathFromNode && onFindPathFromNode(nodeId)}
                className="py-1.5 px-3 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] border border-[#3a352d] text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Network className="w-3.5 h-3.5 text-[#d68a1f]" />
                <span>Trace Path</span>
              </button>
              <button
                onClick={() => onExpandNeighborhood && onExpandNeighborhood(nodeId)}
                className="py-1.5 px-3 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] border border-[#3a352d] text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-[#4a6670]" />
                <span>Expand 2-Hop</span>
              </button>
            </div>
          </div>

          {/* Dossier Tabs (XAI, MO Pattern, Victim Safety, Direct Connections, Blockchain Custody) */}
          <div className="flex items-center rounded-2xl bg-[#0f0e0d] border border-[#3a352d] p-1 text-xs font-mono flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('xai')}
              className={`flex-1 min-w-[75px] py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === 'xai' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#d68a1f]" />
              <span>AI Risk</span>
            </button>
            <button
              onClick={() => setActiveTab('mo')}
              className={`flex-1 min-w-[75px] py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === 'mo' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <Network className="w-3 h-3 text-[#e5aa70]" />
              <span>MO</span>
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`flex-1 min-w-[85px] py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === 'safety' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#a5342a]/60' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-[#e27d75]" />
              <span>Safety</span>
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 min-w-[75px] py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === 'connections' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <Share2 className="w-3 h-3 text-[#4a6670]" />
              <span>Links ({dossier.neighbors?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('custody')}
              className={`flex-1 min-w-[75px] py-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === 'custody' 
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40' 
                  : 'text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <FileCheck className="w-3 h-3 text-[#5c7a5c]" />
              <span>Sec 65B</span>
            </button>
          </div>

          {/* TAB CONTENT 1: EXPLAINABLE AI RISK EXPLANATION */}
          {activeTab === 'xai' && (
            <RiskExplanationPanel 
              nodeId={nodeId}
              caseId={caseId}
              onSelectNode={onSelectNode}
            />
          )}

          {/* TAB CONTENT: VICTIM SAFETY & RECIDIVISM DETECTOR */}
          {activeTab === 'safety' && (
            <VictimSafetySuspectSection suspectId={nodeId} />
          )}

          {/* TAB CONTENT: SERIAL OFFENDER MO PATTERN DETECTOR */}
          {activeTab === 'mo' && (
            <ModusOperandiSuspectSection nodeId={nodeId} />
          )}

          {/* TAB CONTENT 2: DIRECT NEIGHBORHOOD CONNECTIONS */}
          {activeTab === 'connections' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#8a8478] uppercase font-mono tracking-wider">
                Direct Counterparty Entities ({dossier.neighbors?.length || 0})
              </div>

              <div className="space-y-2">
                {(dossier.neighbors || []).map((nbr) => (
                  <div
                    key={nbr.id}
                    onClick={() => onSelectNode && onSelectNode(nbr.id)}
                    className="p-3 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f]/60 cursor-pointer transition-all flex items-center justify-between text-xs shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#ece7de] font-serif">{nbr.label}</div>
                      <div className="text-[11px] text-[#8a8478] font-mono">{nbr.type} • {nbr.relationship}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={
                        nbr.risk_level === 'Critical' ? 'seal-badge-critical' :
                        nbr.risk_level === 'High' ? 'seal-badge-high' :
                        'seal-badge-medium'
                      }>
                        {nbr.risk_level}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#8a8478]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: BLOCKCHAIN CHAIN OF CUSTODY */}
          {activeTab === 'custody' && (
            <ChainOfCustodyView nodeId={nodeId} />
          )}

        </div>
      ) : null}

    </div>
  );
}

function ModusOperandiSuspectSection({ nodeId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nodeId) return;
    setLoading(true);
    api.getMoPattern(nodeId)
      .then(res => {
        setProfile(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load MO pattern:", err);
        setLoading(false);
      });
  }, [nodeId]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-2 text-[#8a8478]">
        <div className="w-6 h-6 border-2 border-[#d68a1f] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Synthesizing behavioral Modus Operandi...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#8a8478] font-mono">
        No established MO pattern record for this entity identifier.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in">
      
      {/* 1. MO Profile Tag Badges */}
      <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-3 shadow-dossier">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#f5c074] font-mono tracking-wider uppercase">
            Aggregated Behavioral Signatures
          </span>
          <span className="text-[10px] font-mono text-[#8a8478]">
            {profile.primary_crime_categories?.join(' • ') || 'General'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(profile.mo_tags || []).map((tag, idx) => (
            <span 
              key={idx}
              className="px-2.5 py-1 rounded-xl bg-[#1c1a17] text-[#ece7de] border border-[#d68a1f]/40 text-[11px] font-mono font-medium flex items-center gap-1 shadow-sm"
            >
              <span>⚡</span> {tag}
            </span>
          ))}
        </div>

        <p className="text-xs text-[#8a8478] font-serif italic pt-1 border-t border-[#2a2620] leading-relaxed">
          "{profile.behavioral_summary}"
        </p>
      </div>

      {/* 2. Potentially Related Unsolved Cases */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#8a8478] uppercase font-mono tracking-wider px-1">
          <span>Potentially Related Unsolved Cases ({profile.potential_related_cases?.length || 0})</span>
        </div>

        {profile.potential_related_cases && profile.potential_related_cases.length > 0 ? (
          profile.potential_related_cases.map((rc, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#d68a1f]/40 space-y-3 shadow-dossier"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-xs text-[#ece7de] font-serif">{rc.fir_number}</div>
                  <div className="text-[11px] text-[#8a8478] font-serif">{rc.title}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={rc.match_score >= 80 ? 'seal-badge-critical' : 'seal-badge-high'}>
                    {rc.match_score}% MO Match
                  </span>
                </div>
              </div>

              {/* Matched Attribute Badges */}
              <div className="flex flex-wrap gap-1">
                {rc.matched_attributes?.map((attr, aIdx) => (
                  <span 
                    key={aIdx} 
                    className="px-2 py-0.5 rounded-lg bg-[#24211d] text-[#f5c074] border border-[#3a352d] text-[10px] font-mono"
                  >
                    ✓ {attr}
                  </span>
                ))}
              </div>

              {/* Rationale */}
              <p className="text-[11px] text-[#ece7de] font-serif bg-[#1c1a17] p-2.5 rounded-xl border border-[#3a352d]">
                {rc.investigative_rationale}
              </p>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#8a8478] font-serif">
            No matching unsolved cold cases currently found exceeding similarity threshold.
          </div>
        )}

        {/* 3. Statutory Legal Disclaimer */}
        <div className="p-3 rounded-2xl bg-[#1c1a17] border border-[#3a352d] text-[10px] text-[#8a8478] font-serif italic text-center">
          ⚖️ <strong className="text-[#f5c074]">Statutory Notice:</strong> This is a pattern-based investigative lead generated via explainable behavioral matching, not confirmed evidence. Requires human verification before judicial filings.
        </div>
      </div>

    </div>
  );
}

function VictimSafetySuspectSection({ suspectId }) {
  const [safetyReport, setSafetyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!suspectId) return;
    setLoading(true);
    api.getRepeatOffenseReport(suspectId)
      .then(res => {
        setSafetyReport(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load Victim Safety report:", err);
        setLoading(false);
      });
  }, [suspectId]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-2 text-[#8a8478]">
        <div className="w-6 h-6 border-2 border-[#a5342a] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Running Victim Safety & Recidivism analytics...</span>
      </div>
    );
  }

  if (!safetyReport) {
    return (
      <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#8a8478] font-mono">
        No repeat victim safety records for this entity.
      </div>
    );
  }

  const isCritical = safetyReport.risk_level === 'CRITICAL';
  const isHigh = safetyReport.risk_level === 'HIGH';

  return (
    <div className="space-y-4 animate-in fade-in">
      
      {/* 1. Recidivism Risk Meter Card */}
      <div className={`p-4 rounded-2xl bg-[#0f0e0d] border ${isCritical ? 'border-[#a5342a]' : isHigh ? 'border-[#d68a1f]' : 'border-[#3a352d]'} space-y-3 shadow-dossier`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#ece7de] font-serif flex items-center gap-1.5">
            <ShieldAlert className={`w-4 h-4 ${isCritical ? 'text-[#e27d75]' : 'text-[#d68a1f]'}`} />
            <span>Recidivism & Repeat Victim Assessment</span>
          </span>
          <span className={isCritical ? 'seal-badge-critical' : isHigh ? 'seal-badge-high' : 'seal-badge-medium'}>
            {safetyReport.recidivism_score}/100 • {safetyReport.risk_level}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
          <div className="p-2.5 rounded-xl bg-[#1c1a17] border border-[#3a352d]">
            <span className="text-[10px] text-[#8a8478] block">KNOWN VICTIMS</span>
            <strong className="text-sm text-[#ece7de]">{safetyReport.total_distinct_victims}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1c1a17] border border-[#3a352d]">
            <span className="text-[10px] text-[#8a8478] block">LINKED CASES</span>
            <strong className="text-sm text-[#ece7de]">{safetyReport.total_linked_cases}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1c1a17] border border-[#3a352d]">
            <span className="text-[10px] text-[#8a8478] block">AVG GAP</span>
            <strong className="text-sm text-[#d68a1f]">{safetyReport.average_gap_days ? `${safetyReport.average_gap_days}d` : 'N/A'}</strong>
          </div>
        </div>

        {/* Trajectory Badge */}
        <div className="p-2.5 rounded-xl bg-[#1c1a17] border border-[#2a2620] flex items-center justify-between text-xs font-mono">
          <span className="text-[#8a8478] text-[11px]">Escalation Trajectory:</span>
          <span className={`font-bold ${safetyReport.escalation_trajectory === 'ESCALATING_SEVERITY' ? 'text-[#e27d75]' : 'text-[#f5c074]'}`}>
            {safetyReport.escalation_trajectory.replace('_', ' ')}
          </span>
        </div>

        {/* Priority Action Advisory Note */}
        <p className="text-xs text-[#ece7de] font-serif italic bg-[#1c1a17] p-3 rounded-xl border border-[#a5342a]/40 leading-relaxed">
          "{safetyReport.priority_action_note}"
        </p>
      </div>

      {/* 2. Chronological Incident Escalation Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#8a8478] uppercase font-mono tracking-wider px-1">
          <span>Cross-Case Victim Incidents Timeline</span>
        </div>

        {safetyReport.incidents_timeline && safetyReport.incidents_timeline.length > 0 ? (
          <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#3a352d]">
            {safetyReport.incidents_timeline.map((inc, idx) => (
              <div key={idx} className="relative space-y-1.5">
                {/* Timeline Dot */}
                <div className={`absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 ${inc.severity_tier >= 4 ? 'bg-[#a5342a] border-[#e27d75]' : 'bg-[#d68a1f] border-[#f5c074]'}`}></div>

                <div className="p-3.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-2">
                  <div className="flex items-start justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#ece7de] font-serif">{inc.fir_number}</span>
                      <div className="text-[11px] text-[#8a8478] font-mono">{inc.date_recorded} • {inc.jurisdiction}</div>
                    </div>
                    <span className="seal-badge-high">
                      Tier {inc.severity_tier} Severity
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[#2a2620]">
                    <span className="text-[#8a8478]">Victim Code: <strong className="text-[#f5c074]">{inc.victim_identifier}</strong></span>
                    <span className="text-[#5c7a5c]">{inc.court_protection_status}</span>
                  </div>

                  <p className="text-[11px] text-[#ece7de] font-serif bg-[#1c1a17] p-2 rounded-lg border border-[#2a2620]">
                    {inc.offense_summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#8a8478] font-serif">
            No multiple registered victim incidents logged.
          </div>
        )}
      </div>

      {/* 3. Protective Recommendations */}
      <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-2.5">
        <span className="text-xs font-bold text-[#8a8478] uppercase font-mono tracking-wider">
          Statutory Victim Protection Directives (Sec 398 BNSS 2023)
        </span>
        <ul className="space-y-1.5 text-xs text-[#ece7de] font-serif list-disc pl-4">
          {safetyReport.protective_recommendations?.map((rec, rIdx) => (
            <li key={rIdx}>{rec}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}



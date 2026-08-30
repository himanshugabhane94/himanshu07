import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, ShieldAlert, AlertTriangle, 
  CheckCircle2, Crown, GitMerge, Users, Network, 
  FileCheck, ArrowRight, ExternalLink, HelpCircle, 
  Scale, FileText, Activity
} from 'lucide-react';
import { api } from '../../services/api';

export default function RiskExplanationPanel({ nodeId, caseId, onSelectNode }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers', 'evidence', 'centrality'

  useEffect(() => {
    if (!nodeId) return;
    setLoading(true);
    api.getRiskExplanation(nodeId, caseId)
      .then(data => {
        setExplanation(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load explanation:", err);
        setLoading(false);
      });
  }, [nodeId, caseId]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 text-[#8a8478]">
        <div className="w-8 h-8 border-2 border-[#d68a1f] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Synthesizing Explainable AI (XAI) risk reasoning...</span>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top XAI Badge & Confidence Score Bar */}
      <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] shadow-dossier space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1c1a17] text-[#f5c074] border border-[#d68a1f]/40 text-[10px] font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-[#d68a1f]" />
              SUTRA XAI Forensic Engine
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#8a8478] font-mono">Evidence Confidence</span>
            <div className="font-mono font-bold text-sm text-[#f5c074]">
              {explanation.confidence_score}%
            </div>
          </div>
        </div>

        {/* Confidence Progress Meter */}
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-[#1c1a17] rounded-full overflow-hidden border border-[#3a352d]">
            <div 
              className="h-full bg-[#d68a1f] rounded-full"
              style={{ width: `${explanation.confidence_score}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[9px] font-mono text-[#8a8478]">
            <span>Deterministic Heuristic Base (55%)</span>
            <span>Multi-Factor Risk Peak (98%)</span>
          </div>
        </div>
      </div>

      {/* Case Officer Intelligence Briefing Callout */}
      <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-2 relative overflow-hidden shadow-dossier dossier-header-accent pl-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#ece7de]">
          <FileText className="w-3.5 h-3.5 text-[#d68a1f]" />
          <span className="font-serif">Case Officer Executive Summary Note</span>
        </div>
        <p className="text-xs text-[#ece7de] leading-relaxed font-serif italic">
          "{explanation.investigative_briefing}"
        </p>
      </div>

      {/* Inner Sub-Tabs: Risk Drivers, Evidence Trail, Centrality Percentiles */}
      <div className="space-y-3">
        <div className="flex border-b border-[#3a352d] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'drivers'
                ? 'border-[#d68a1f] text-[#f5c074]'
                : 'border-transparent text-[#8a8478] hover:text-[#ece7de]'
            }`}
          >
            Risk Drivers ({explanation.risk_drivers?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'evidence'
                ? 'border-[#d68a1f] text-[#f5c074]'
                : 'border-transparent text-[#8a8478] hover:text-[#ece7de]'
            }`}
          >
            Evidence Items ({explanation.evidence_items?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('centrality')}
            className={`pb-2 px-3 border-b-2 transition-all ${
              activeTab === 'centrality'
                ? 'border-[#d68a1f] text-[#f5c074]'
                : 'border-transparent text-[#8a8478] hover:text-[#ece7de]'
            }`}
          >
            Network Centrality Stats
          </button>
        </div>

        {/* SUB-TAB 1: RISK DRIVERS */}
        {activeTab === 'drivers' && (
          <div className="space-y-2.5">
            {explanation.risk_drivers?.map((driver, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#ece7de] font-serif">
                    <span className="text-[#d68a1f]">▪</span>
                    <span>{driver.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    driver.impact === 'HIGH' ? 'seal-badge-critical' :
                    driver.impact === 'MEDIUM' ? 'seal-badge-high' : 'seal-badge-medium'
                  }`}>
                    {driver.impact} IMPACT (+{driver.weight_score} pts)
                  </span>
                </div>
                <p className="text-xs text-[#8a8478] font-serif leading-relaxed">
                  {driver.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SUB-TAB 2: EVIDENCE CHAIN */}
        {activeTab === 'evidence' && (
          <div className="space-y-2.5">
            {explanation.evidence_items?.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#f5c074] font-mono">{item.source}</span>
                  <span className="text-[10px] text-[#8a8478] font-mono">{item.reference_id}</span>
                </div>
                <p className="text-xs text-[#ece7de] font-serif">
                  {item.summary}
                </p>
                <div className="text-[11px] text-[#8a8478] font-mono">
                  Timestamp: {item.timestamp} • SHA-256 Digest Anchored
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUB-TAB 3: CENTRALITY PERCENTILES */}
        {activeTab === 'centrality' && (
          <div className="space-y-2.5">
            {explanation.centrality_stats?.map((stat, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#ece7de] font-serif">{stat.metric}</span>
                  <span className="font-mono text-[#d68a1f] font-bold">Top {100 - stat.percentile_rank}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1c1a17] rounded-full overflow-hidden border border-[#3a352d]">
                  <div 
                    className="h-full bg-[#d68a1f] rounded-full"
                    style={{ width: `${stat.percentile_rank}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[#8a8478] font-serif">
                  {stat.interpretation}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

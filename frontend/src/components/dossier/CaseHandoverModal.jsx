import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, Download, X, ExternalLink, ShieldCheck, 
  AlertTriangle, ArrowRight, UserCheck, CheckCircle2, Clock, 
  MapPin, Scale, Landmark, Layers, Copy, Check, Sparkles, Send
} from 'lucide-react';
import { api } from '../../services/api';
import SutraEmblem from '../layout/SutraEmblem';

export default function CaseHandoverModal({ caseId, onClose, onSelectNode }) {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [incomingOfficer, setIncomingOfficer] = useState('Inspector Amit Deshmukh (MHA-SP-9941)');
  const [viewMode, setViewMode] = useState('structured'); // 'structured' | 'official_print'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBriefing();
  }, [caseId]);

  const loadBriefing = async () => {
    setLoading(true);
    try {
      const data = await api.generateHandover(caseId || "CASE-HAWALA-2024", incomingOfficer);
      setBriefing(data);
    } catch (err) {
      console.error("Failed to generate case handover briefing:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIncoming = async () => {
    setLoading(true);
    try {
      const data = await api.generateHandover(caseId || "CASE-HAWALA-2024", incomingOfficer);
      setBriefing(data);
    } catch (err) {
      console.error("Failed to update handover:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printUrl = api.getHandoverHtmlUrl(caseId || "CASE-HAWALA-2024", incomingOfficer);
    window.open(printUrl, '_blank');
  };

  const handleCopySummary = () => {
    if (!briefing) return;
    const text = `SUTRA OFFICIAL CASE HANDOVER BRIEFING\nFIR: ${briefing.fir_number}\nTitle: ${briefing.case_title}\nOutgoing IO: ${briefing.outgoing_investigator}\nIncoming IO: ${briefing.incoming_investigator}\nDate: ${briefing.handover_date}\n\nEXECUTIVE SUMMARY:\n${briefing.executive_summary}\n\nKEY TARGETS:\n${briefing.top_targets.map(t => `- ${t.label} (${t.risk_level}) - ${t.role} [Status: ${t.status}]`).join('\n')}\n\nIMMEDIATE 48-HR ACTIONS:\n${briefing.open_leads.filter(l => l.priority.includes('48')).map(l => `* ${l.title}: ${l.recommended_action}`).join('\n')}\n\nEVIDENCE INTEGRITY: SHA-256 Verified (${briefing.total_evidence_blocks} Blocks, Merkle: ${briefing.merkle_root.slice(0, 16)}...)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const printUrl = api.getHandoverHtmlUrl(caseId || "CASE-HAWALA-2024", incomingOfficer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[92vh] bg-[#1c1a17] border border-[#3a352d] rounded-3xl shadow-dossier flex flex-col overflow-hidden relative">
        <div className="stamp-watermark">CASE HANDOVER DOSSIER</div>

        {/* Modal Header */}
        <div className="p-5 bg-[#0f0e0d] border-b border-[#3a352d] flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1c1a17] border border-[#3a352d] flex items-center justify-center text-[#d68a1f] shadow-sm">
              <UserCheck className="w-5 h-5 text-[#d68a1f]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-base sm:text-lg text-[#ece7de] font-serif">
                  Statutory Case Handover & Relieving Briefing
                </h3>
                <span className="seal-badge-critical">
                  Officer Transfer Briefing
                </span>
              </div>
              <p className="text-xs text-[#8a8478] font-serif italic">
                AI-synthesized institutional memory dossier preventing context loss during investigator transfers.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-[#0f0e0d] border border-[#3a352d] p-0.5 text-xs font-mono">
              <button
                onClick={() => setViewMode('structured')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                  viewMode === 'structured'
                    ? 'bg-[#d68a1f] text-[#0f0e0d]'
                    : 'text-[#8a8478] hover:text-[#ece7de]'
                }`}
              >
                Interactive View
              </button>
              <button
                onClick={() => setViewMode('official_print')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                  viewMode === 'official_print'
                    ? 'bg-[#d68a1f] text-[#0f0e0d]'
                    : 'text-[#8a8478] hover:text-[#ece7de]'
                }`}
              >
                Print Preview (Govt Format)
              </button>
            </div>

            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-[#24211d] hover:bg-[#2d2924] border border-[#3a352d] text-[#ece7de] text-xs font-bold font-mono transition-all flex items-center gap-1.5"
              title="Copy executive handover brief to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#5c7a5c]" /> : <Copy className="w-3.5 h-3.5 text-[#d68a1f]" />}
              <span>{copied ? 'Copied Brief!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF Export</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#8a8478] hover:text-[#ece7de] transition-all border border-[#3a352d]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#d68a1f] p-12">
            <div className="w-8 h-8 border-2 border-[#d68a1f] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-mono text-xs">Compiling Case Intelligence & Evidence Trails for Handover...</span>
          </div>
        ) : viewMode === 'official_print' ? (
          <div className="flex-1 w-full bg-white">
            <iframe
              src={printUrl}
              title="Official Case Handover Dossier"
              className="w-full h-full border-0"
            />
          </div>
        ) : briefing ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
            
            {/* Officer Handover Designation Bar */}
            <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] shadow-dossier grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-[10px] text-[#666157] uppercase">FIR Number & Case ID</div>
                <div className="font-bold text-[#f5c074] text-sm">{briefing.fir_number}</div>
                <div className="text-[11px] text-[#8a8478] truncate">{briefing.police_station}, {briefing.state}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-[#666157] uppercase">Relieving / Outgoing IO</div>
                <div className="font-bold text-[#ece7de] text-sm">{briefing.outgoing_investigator}</div>
                <div className="text-[11px] text-[#5c7a5c]">Badge: {briefing.outgoing_badge}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-[#666157] uppercase">Incoming IO (Assumption of Charge)</div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={incomingOfficer}
                    onChange={(e) => setIncomingOfficer(e.target.value)}
                    onBlur={handleUpdateIncoming}
                    className="w-full p-1 rounded-lg bg-[#1c1a17] border border-[#3a352d] text-xs text-[#ece7de] font-mono"
                    placeholder="Enter incoming officer..."
                  />
                </div>
                <div className="text-[10px] text-[#666157]">Click outside to update dossier</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-[#666157] uppercase">Handover Timestamp</div>
                <div className="font-bold text-[#ece7de]">{briefing.handover_date}</div>
                <div className="text-[10px] text-[#5c7a5c] font-bold">SEC 65B CERTIFIED</div>
              </div>
            </div>

            {/* Section 1: Executive Case Synthesis */}
            <div className="p-5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-2 shadow-dossier">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#d68a1f] uppercase tracking-wider">
                <Scale className="w-4 h-4 text-[#d68a1f]" />
                <span>1. Executive Case Synthesis & Theory of Crime</span>
              </div>
              <p className="text-xs text-[#ece7de] leading-relaxed font-serif text-justify pt-1">
                {briefing.executive_summary}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                <span className="text-[#8a8478]">Statutory IPC / Act Sections:</span>
                {briefing.ipc_sections.map((sec, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#1c1a17] text-[#f5c074] border border-[#3a352d]">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 2: Top Persons of Interest & Syndicate Hierarchy */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#d68a1f] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#d68a1f]" />
                  <span>2. Primary Persons of Interest & Syndicate Hierarchy ({briefing.top_targets.length} Targets)</span>
                </div>
                <span className="text-[10px] text-[#8a8478] lowercase">ranked by PageRank authority</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {briefing.top_targets.map((target) => (
                  <div 
                    key={target.id}
                    className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-2 hover:border-[#d68a1f]/60 transition-all shadow-dossier"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-[#ece7de] font-serif">{target.label}</div>
                        <div className="text-[11px] text-[#8a8478] font-mono">{target.role}</div>
                      </div>
                      <span className={target.risk_level === 'Critical' ? 'seal-badge-critical' : 'seal-badge-high'}>
                        {target.risk_level} (Rank #{target.centrality_rank})
                      </span>
                    </div>

                    <div className="text-[11px] text-[#f5c074] font-mono">
                      Status: <span className="font-bold">{target.status}</span> • Centrality: {target.centrality_score}
                    </div>

                    {/* Risk Drivers */}
                    <div className="space-y-1 pt-1 border-t border-[#2a2620] text-[11px] font-serif text-[#8a8478]">
                      {target.key_risk_drivers.map((driver, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-1.5">
                          <span className="text-[#d68a1f]">▪</span>
                          <span>{driver}</span>
                        </div>
                      ))}
                    </div>

                    {target.critical_connections?.length > 0 && (
                      <div className="text-[10px] font-mono text-[#666157] pt-1">
                        Direct Associates: {target.critical_connections.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Cross-Jurisdiction Intelligence Alerts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#d68a1f] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#d68a1f]" />
                <span>3. Inter-State Police & Inter-Agency Cross-Case Intelligence</span>
              </div>

              {briefing.cross_case_alerts?.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#8a8478] font-mono text-center">
                  No cross-jurisdiction links flagged.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {briefing.cross_case_alerts.map((alert, aIdx) => (
                    <div key={aIdx} className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-1.5 shadow-dossier">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#f5c074] font-mono">{alert.linked_case_fir}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1a17] text-[#8a8478] border border-[#3a352d]">
                          {alert.linked_state}
                        </span>
                      </div>
                      <div className="text-xs font-serif text-[#ece7de]">
                        Shared Link: <strong>{alert.shared_entity_label}</strong> ({alert.shared_entity_type})
                      </div>
                      <p className="text-[11px] text-[#8a8478] font-serif italic">
                        {alert.intelligence_note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Actionable Open Leads & 14-Day Roadmap */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#d68a1f] uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#d68a1f]" />
                <span>4. Actionable Open Leads & Priority 14-Day Action Plan for Incoming Officer</span>
              </div>

              <div className="space-y-2.5">
                {briefing.open_leads.map((lead, lIdx) => {
                  const isImmediate = lead.priority.includes('48');
                  return (
                    <div 
                      key={lIdx} 
                      className={`p-4 rounded-2xl border space-y-1.5 shadow-dossier ${
                        isImmediate 
                          ? 'bg-[#0f0e0d] border-[#a5342a]/60' 
                          : 'bg-[#0f0e0d] border-[#3a352d]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={isImmediate ? 'seal-badge-critical' : 'seal-badge-high'}>
                            {lead.priority.replace(/_/g, ' ')}
                          </span>
                          <strong className="text-[#ece7de] font-serif text-sm">{lead.title}</strong>
                        </div>
                        {lead.target_entity && (
                          <span className="text-[11px] font-mono text-[#8a8478]">Target: {lead.target_entity}</span>
                        )}
                      </div>

                      <p className="text-xs text-[#8a8478] font-serif">{lead.description}</p>
                      
                      <div className="text-xs text-[#f5c074] font-mono flex items-center gap-1.5 pt-1">
                        <ArrowRight className="w-3.5 h-3.5 text-[#d68a1f]" />
                        <span>Recommended Action: {lead.recommended_action}</span>
                        {lead.statutory_provision && (
                          <span className="text-[#666157]">({lead.statutory_provision})</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Evidence Chain of Custody Seal */}
            <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#5c7a5c]/50 space-y-2 text-xs font-mono shadow-dossier">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5c7a5c]" />
                  <span className="font-bold text-[#8eb38e] uppercase">
                    5. Cryptographic Evidence Chain of Custody Seal
                  </span>
                </div>
                <span className="seal-badge-low">
                  {briefing.blockchain_audit_status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-[#8a8478]">
                <div>Total Immutable Blocks: <strong className="text-[#ece7de]">{briefing.total_evidence_blocks} Blocks</strong></div>
                <div className="truncate">Merkle Root Digest: <strong className="text-[#f5c074]">{briefing.merkle_root}</strong></div>
              </div>

              <p className="text-[11px] text-[#8a8478] font-serif italic pt-1 border-t border-[#2a2620]">
                {briefing.statutory_handover_declaration}
              </p>
            </div>

            {/* Official Signature Endorsement Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-2 shadow-dossier">
                <div className="text-[10px] text-[#666157] font-mono uppercase font-bold">Relieving Investigating Officer</div>
                <div className="font-bold text-sm text-[#ece7de] font-serif">{briefing.outgoing_investigator}</div>
                <div className="text-xs text-[#8a8478] font-mono">Investigating Officer, {briefing.outgoing_badge}</div>
                <div className="h-12 border border-dashed border-[#3a352d] rounded-xl flex items-center justify-center text-[10px] font-mono text-[#5c7a5c] bg-[#1c1a17]">
                  [ SIGNED & RELIEVED ON CHARGE ]
                </div>
                <div className="text-[10px] text-[#666157] font-mono">Timestamp: {briefing.handover_date}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] space-y-2 shadow-dossier">
                <div className="text-[10px] text-[#666157] font-mono uppercase font-bold">Incoming Investigating Officer</div>
                <div className="font-bold text-sm text-[#ece7de] font-serif">{briefing.incoming_investigator}</div>
                <div className="text-xs text-[#8a8478] font-mono">Investigating Officer (Assumes Custody of Case Diary)</div>
                <div className="h-12 border border-dashed border-[#3a352d] rounded-xl flex items-center justify-center text-[10px] font-mono text-[#f5c074] bg-[#1c1a17]">
                  [ OFFICIAL SEAL & CHARGE ACCEPTANCE ]
                </div>
                <div className="text-[10px] text-[#666157] font-mono">Charge assumed under Police Act / CrPC</div>
              </div>
            </div>

          </div>
        ) : null}

        {/* Modal Footer */}
        <div className="p-4 bg-[#0f0e0d] border-t border-[#3a352d] flex items-center justify-between text-xs relative z-10">
          <div className="text-[#8a8478] flex items-center gap-1.5 font-serif italic">
            <Scale className="w-3.5 h-3.5 text-[#d68a1f]" />
            <span>Ministry of Home Affairs Case Handover Protocol • SIH26189 Standard Format</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] text-xs font-mono font-semibold border border-[#3a352d]"
            >
              Close Briefing
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all shadow-sm active:scale-95"
            >
              Print Official Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, Layers, AlertTriangle, CheckCircle2, 
  MapPin, Building2, Phone, Landmark, Truck, 
  Users, Globe, ArrowRight, RefreshCw, Sparkles, 
  Network, Eye, ShieldAlert, Filter, Search, ArrowUpRight
} from 'lucide-react';
import { api } from '../../services/api';

export default function CrossCaseInsights({
  onSelectNode,
  onLoadMergedGraph
}) {
  const [links, setLinks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('links'); // 'links', 'alerts', 'overlap'

  // Multi-Case Overlap View state
  const [case1, setCase1] = useState('CASE-HAWALA-2024');
  const [case2, setCase2] = useState('CASE-NARCO-2024');
  const [overlapResult, setOverlapResult] = useState(null);
  const [overlapLoading, setOverlapLoading] = useState(false);

  useEffect(() => {
    loadCrossCaseData();
  }, [selectedState, selectedType]);

  const loadCrossCaseData = async () => {
    setLoading(true);
    try {
      const l = await api.getCrossCaseLinks({ state: selectedState, entityType: selectedType });
      const a = await api.getCrossCaseAlerts();
      setLinks(l);
      setAlerts(a);
    } catch (err) {
      console.error("Failed to load cross-case data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanNow = async () => {
    setScanning(true);
    try {
      const res = await api.triggerCrossCaseScan();
      await loadCrossCaseData();
      alert(`CROSS-CASE SCAN COMPLETE: ${res.message}`);
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  const handleFetchOverlap = async () => {
    if (!case1 || !case2 || case1 === case2) return;
    setOverlapLoading(true);
    try {
      const res = await api.getCaseOverlap(case1, case2);
      setOverlapResult(res);
    } catch (err) {
      console.error("Failed to fetch overlap:", err);
    } finally {
      setOverlapLoading(false);
    }
  };

  const handleMergeToMainGraph = (overlap) => {
    if (overlap && onLoadMergedGraph) {
      onLoadMergedGraph(overlap.merged_graph, overlap.shared_node_ids);
    }
  };

  const confirmedLinksCount = links.filter(l => l.match_type === 'CONFIRMED_EXACT').length;
  const fuzzyLinksCount = links.filter(l => l.match_type === 'POSSIBLE_FUZZY').length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner with Cross-Case Stats */}
      <div className="p-6 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier space-y-4 relative overflow-hidden">
        <div className="stamp-watermark">INTER-STATE GRID</div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#24211d] border border-[#3a352d] flex items-center justify-center text-[#d68a1f]">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#ece7de] tracking-tight font-serif">
                Cross-Case Intelligence Linker & Inter-State Nexus
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/30 uppercase">
                Inter-Jurisdictional AI
              </span>
            </div>
            <p className="text-xs text-[#8a8478] max-w-3xl font-serif">
              Breaks departmental data silos by cross-referencing entities (phone numbers, mule accounts, logistics plates, crypto wallets) across disparate police stations and state jurisdictions.
            </p>
          </div>

          {/* Trigger Full Inter-State Scan Button */}
          <button
            onClick={handleScanNow}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] disabled:opacity-50 text-[#0f0e0d] text-xs font-bold font-mono shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning Inter-State Databases...' : 'Run Inter-State Graph Scan'}</span>
          </button>
        </div>

        {/* Intelligence Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#2a2620] relative z-10">
          <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
            <div className="text-[10px] text-[#8a8478] font-mono uppercase">Confirmed Exact Matches</div>
            <div className="text-xl font-bold text-[#5c7a5c] font-mono mt-0.5">{confirmedLinksCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
            <div className="text-[10px] text-[#8a8478] font-mono uppercase">Fuzzy Identity Matches</div>
            <div className="text-xl font-bold text-[#f5c074] font-mono mt-0.5">{fuzzyLinksCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
            <div className="text-[10px] text-[#8a8478] font-mono uppercase">Inter-State High Alerts</div>
            <div className="text-xl font-bold text-[#a5342a] font-mono mt-0.5">{alerts.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d]">
            <div className="text-[10px] text-[#8a8478] font-mono uppercase">Active Jurisdictions</div>
            <div className="text-xl font-bold text-[#ece7de] font-mono mt-0.5">4 States</div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3a352d] pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'links', label: `Discovered Entity Links (${links.length})` },
            { id: 'alerts', label: `Priority Inter-State Alerts (${alerts.length})` },
            { id: 'overlap', label: 'Cross-Case Graph Fusion' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50'
                  : 'text-[#8a8478] hover:text-[#ece7de] hover:bg-[#24211d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* State / Entity Filter Controls */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedState || ''}
            onChange={(e) => setSelectedState(e.target.value || null)}
            className="bg-[#1c1a17] border border-[#3a352d] rounded-xl px-2.5 py-1 text-xs text-[#ece7de] font-mono focus:outline-none focus:border-[#d68a1f]"
          >
            <option value="">All States / Jurisdictions</option>
            <option value="Delhi">Delhi Special Cell</option>
            <option value="Punjab">Punjab Police (Attari)</option>
            <option value="Maharashtra">Mumbai Crime Branch</option>
            <option value="Jammu & Kashmir">J&K Counter Intelligence</option>
          </select>
        </div>
      </div>

      {/* ==========================================
          SUB-TAB 1: DISCOVERED CROSS-CASE LINKS
          ========================================== */}
      {activeSubTab === 'links' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-[#8a8478] font-mono text-xs">
              <div className="w-6 h-6 border-2 border-[#d68a1f] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Aggregating inter-state graph records...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link) => (
                <div
                  key={link.link_id}
                  className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f]/50 shadow-dossier transition-all space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {link.entity_type === 'Person' ? '👤' :
                         link.entity_type === 'Phone' ? '📞' :
                         link.entity_type === 'BankAccount' ? '🏦' :
                         link.entity_type === 'Vehicle' ? '🚗' : '🌐'}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-[#ece7de] font-serif">{link.entity_label}</div>
                        <div className="text-[10px] text-[#8a8478] font-mono">{link.entity_type}</div>
                      </div>
                    </div>

                    <span className={
                      link.match_type === 'CONFIRMED_EXACT' ? 'seal-badge-low' : 'seal-badge-high'
                    }>
                      {link.match_type.replace('_', ' ')} ({Math.round(link.confidence * 100)}%)
                    </span>
                  </div>

                  <p className="text-xs text-[#8a8478] font-serif italic leading-relaxed">
                    "{link.significance_explanation}"
                  </p>

                  {/* Connected Cases & States Tags */}
                  <div className="space-y-1.5 pt-2 border-t border-[#2a2620]">
                    <div className="text-[10px] font-bold text-[#8a8478] uppercase font-mono">
                      Intersecting Jurisdictions & FIRs:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {link.matched_cases?.map((mc, idx) => (
                        <div key={idx} className="px-2 py-0.5 rounded-lg bg-[#0f0e0d] border border-[#3a352d] text-[10px] font-mono flex items-center gap-1.5 text-[#ece7de]">
                          <MapPin className="w-2.5 h-2.5 text-[#d68a1f]" />
                          <span>{mc.state}</span>
                          <span className="text-[#8a8478]">({mc.fir_number})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-[#8a8478] font-mono">
                      Matched Key: <strong className="text-[#f5c074]">{link.matched_attribute}</strong>
                    </span>
                    <button
                      onClick={() => onSelectNode(link.node_ids?.[0])}
                      className="px-2.5 py-1 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] border border-[#3a352d] text-[10px] font-mono flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3 h-3 text-[#d68a1f]" />
                      <span>Inspect Entity</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          SUB-TAB 2: PRIORITY INTER-STATE ALERTS
          ========================================== */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((al, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#1c1a17] border border-[#a5342a]/40 shadow-dossier space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#e27d75] font-bold font-serif">
                    <ShieldAlert className="w-4 h-4 text-[#a5342a]" />
                    <span>{al.title}</span>
                  </div>
                  <span className="seal-badge-critical">
                    {al.urgency || 'HIGH'}
                  </span>
                </div>

                <p className="text-xs text-[#ece7de] font-serif leading-relaxed">
                  {al.summary}
                </p>

                <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] space-y-1 text-xs font-mono">
                  <div className="text-[#8a8478]">Recommended Action:</div>
                  <div className="text-[#f5c074] font-bold">{al.action_recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          SUB-TAB 3: CROSS-CASE GRAPH FUSION
          ========================================== */}
      {activeSubTab === 'overlap' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d68a1f]" />
              <h3 className="font-bold text-sm text-[#ece7de] font-serif">
                Multi-Case Graph Topology Fusion Engine
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8a8478] font-mono uppercase">Investigation #1</label>
                <select
                  value={case1}
                  onChange={(e) => setCase1(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] font-mono focus:border-[#d68a1f] outline-none"
                >
                  <option value="CASE-HAWALA-2024">FIR 882/2024 — NCR Hawala & Money Laundering</option>
                  <option value="CASE-NARCO-2024">FIR 104/2024 — Western Border Narcotics Syndicate</option>
                  <option value="CASE-TERROR-FIN-2024">FIR 45/2024 — Cross-Border Terror Financing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8a8478] font-mono uppercase">Investigation #2</label>
                <select
                  value={case2}
                  onChange={(e) => setCase2(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] font-mono focus:border-[#d68a1f] outline-none"
                >
                  <option value="CASE-NARCO-2024">FIR 104/2024 — Western Border Narcotics Syndicate</option>
                  <option value="CASE-HAWALA-2024">FIR 882/2024 — NCR Hawala & Money Laundering</option>
                  <option value="CASE-TERROR-FIN-2024">FIR 45/2024 — Cross-Border Terror Financing</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleFetchOverlap}
              disabled={overlapLoading || case1 === case2}
              className="px-4 py-2.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            >
              {overlapLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Network className="w-3.5 h-3.5" />}
              <span>Compute Case Overlap & Intersecting Subgraphs</span>
            </button>
          </div>

          {overlapResult && (
            <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] space-y-4 shadow-dossier animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#2a2620] pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5c7a5c]" />
                  <h4 className="font-bold text-sm text-[#ece7de] font-serif">
                    Fusion Topology: {overlapResult.shared_node_ids?.length || 0} Shared Inter-Case Nodes
                  </h4>
                </div>
                <button
                  onClick={() => handleMergeToMainGraph(overlapResult)}
                  className="px-3 py-1.5 rounded-xl bg-[#5c7a5c] hover:bg-[#3d523d] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Load Merged Subgraph into Canvas</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {overlapResult.shared_node_details?.map((sn, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs space-y-1">
                    <div className="font-bold text-[#ece7de] font-serif">{sn.label}</div>
                    <div className="text-[10px] text-[#8a8478] font-mono">{sn.type} • Shared ID: {sn.id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

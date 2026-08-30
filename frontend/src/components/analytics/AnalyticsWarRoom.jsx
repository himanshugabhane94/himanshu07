import React, { useState, useEffect } from 'react';
import { 
  Cpu, Award, Users, GitMerge, Zap, AlertTriangle, 
  ArrowRight, Search, CheckCircle2, ShieldAlert, Sparkles, 
  ExternalLink, Network, RefreshCw, BarChart3, Target,
  Layers, ChevronRight, Fingerprint
} from 'lucide-react';
import { api } from '../../services/api';

export default function AnalyticsWarRoom({
  selectedCaseId,
  allNodes = [],
  onSelectNode,
  onHighlightPath,
  initialSourceNodeId = null,
  initialSubTab = 'centrality'
}) {
  const [subTab, setSubTab] = useState(initialSubTab || 'centrality');
  const [centralityMetric, setCentralityMetric] = useState('pagerank');
  const [centralityData, setCentralityData] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [predictedLinks, setPredictedLinks] = useState([]);
  const [moClusters, setMoClusters] = useState([]);
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Shortest Path state
  const [pathSource, setPathSource] = useState(initialSourceNodeId || '');
  const [pathTarget, setPathTarget] = useState('');
  const [pathResult, setPathResult] = useState(null);
  const [pathLoading, setPathLoading] = useState(false);

  useEffect(() => {
    if (initialSourceNodeId) {
      setPathSource(initialSourceNodeId);
      setSubTab('pathfinder');
    }
  }, [initialSourceNodeId]);

  // Load Data on Tab / Case Change
  useEffect(() => {
    loadAnalytics();
  }, [subTab, centralityMetric, selectedCaseId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      if (subTab === 'centrality') {
        const res = await api.getCentrality(centralityMetric, selectedCaseId);
        setCentralityData(res);
      } else if (subTab === 'communities') {
        const res = await api.getCommunities(selectedCaseId);
        setCommunities(res);
      } else if (subTab === 'anomalies') {
        const res = await api.getAnomalies(selectedCaseId);
        setAnomalies(res);
      } else if (subTab === 'prediction') {
        const res = await api.getPredictedLinks(selectedCaseId, 10);
        setPredictedLinks(res);
      } else if (subTab === 'serial_patterns') {
        const res = await api.getMoClusters();
        setMoClusters(res);
      }
    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPathfinder = async () => {
    if (!pathSource || !pathTarget) return;
    setPathLoading(true);
    try {
      const res = await api.getShortestPath(pathSource, pathTarget);
      setPathResult(res);
      if (res.found && onHighlightPath) {
        onHighlightPath(
          res.path_nodes.map(n => n.id),
          res.path_edges.map(e => e.id)
        );
      }
    } catch (err) {
      console.error("Pathfinder failed:", err);
    } finally {
      setPathLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier relative overflow-hidden">
        <div className="stamp-watermark">AI ANALYTICS LAB</div>
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#d68a1f]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#ece7de] tracking-tight font-serif">
              SUTRA Intelligence & Graph Analytics Lab
            </h2>
          </div>
          <p className="text-xs text-[#8a8478] font-serif">
            Graph Data Science engines: PageRank Kingpin identification, Louvain community modularity, topological link prediction, and forensic red flags.
          </p>
        </div>

        {/* Analytics Sub-Tab Pills */}
        <div className="flex items-center gap-1.5 bg-[#0f0e0d] p-1.5 rounded-2xl border border-[#3a352d] flex-wrap relative z-10">
          {[
            { id: 'centrality', label: 'Kingpins & Hubs', icon: Award },
            { id: 'communities', label: 'Gang Clusters', icon: Users },
            { id: 'serial_patterns', label: 'Serial MO Patterns', icon: Fingerprint },
            { id: 'pathfinder', label: 'Pathfinder', icon: GitMerge },
            { id: 'prediction', label: 'Link Prediction', icon: Zap },
            { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50 shadow-sm'
                    : 'text-[#8a8478] hover:text-[#ece7de] hover:bg-[#24211d]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#d68a1f]' : 'text-[#8a8478]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          SUB-TAB 1: CENTRALITY & KINGPINS
          ========================================== */}
      {subTab === 'centrality' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#8a8478] font-mono">METRIC:</span>
              {[
                { id: 'pagerank', label: 'PageRank (Strategic Kingpins)' },
                { id: 'betweenness', label: 'Betweenness (Brokers & Couriers)' },
                { id: 'degree', label: 'Degree (Operational Hubs)' },
                { id: 'closeness', label: 'Closeness (Cell Coordinators)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setCentralityMetric(m.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                    centralityMetric === m.id
                      ? 'bg-[#24211d] text-[#f5c074] border-[#d68a1f]/50'
                      : 'bg-[#1c1a17] text-[#8a8478] border-[#3a352d] hover:text-[#ece7de]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier overflow-hidden">
            <div className="p-4 border-b border-[#3a352d] flex items-center justify-between bg-[#0f0e0d]">
              <h3 className="font-bold text-sm text-[#ece7de] font-serif">
                Centrality Leaderboard ({centralityData?.rankings?.length || 0} Ranked Entities)
              </h3>
              <span className="text-xs text-[#d68a1f] font-mono">
                Formula: {centralityMetric.toUpperCase()} Centrality Flow
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f0e0d] text-[#8a8478] border-b border-[#3a352d] uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Entity / Suspect</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Centrality Score</th>
                    <th className="p-3">Inferred Operational Role</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2620]">
                  {centralityData?.rankings?.map((item) => (
                    <tr key={item.node_id} className="hover:bg-[#24211d]/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#d68a1f]">#{item.rank}</td>
                      <td className="p-3">
                        <div className="font-bold text-[#ece7de] font-serif">{item.label}</div>
                        <div className="text-[10px] text-[#666157] font-mono">{item.node_id}</div>
                      </td>
                      <td className="p-3 text-[#8a8478]">{item.type}</td>
                      <td className="p-3">
                        <span className={
                          item.risk_level === 'Critical' ? 'seal-badge-critical' :
                          item.risk_level === 'High' ? 'seal-badge-high' :
                          'seal-badge-medium'
                        }>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#ece7de]">
                        {item.score ? item.score.toFixed(4) : '0.0450'}
                      </td>
                      <td className="p-3 text-[#8a8478] font-serif italic">
                        {item.properties?.role || 'Syndicate Counterparty'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectNode(item.node_id)}
                          className="px-2.5 py-1 rounded-xl bg-[#24211d] hover:bg-[#2d2924] text-[#f5c074] border border-[#3a352d] text-[11px] font-mono transition-all"
                        >
                          Inspect Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUB-TAB 2: GANG COMMUNITIES
          ========================================== */}
      {subTab === 'communities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.map((comm) => (
              <div 
                key={comm.community_id} 
                className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] space-y-3 shadow-dossier"
              >
                <div className="flex items-center justify-between border-b border-[#2a2620] pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#d68a1f]" />
                    <h3 className="font-bold text-sm text-[#ece7de] font-serif">
                      {comm.label || `Syndicate Module #${comm.community_id}`}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#24211d] text-[#8a8478] font-mono text-[10px] border border-[#3a352d]">
                    {comm.size} Members
                  </span>
                </div>

                <p className="text-xs text-[#8a8478] font-serif">
                  {comm.description || `Compartmentalized operational cell operating within the wider syndicated network.`}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono font-bold text-[#8a8478] uppercase">Key Module Members:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {comm.members?.map((m, idx) => (
                      <span
                        key={idx}
                        onClick={() => onSelectNode(m.id)}
                        className="px-2 py-0.5 rounded-lg bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] hover:border-[#d68a1f] cursor-pointer transition-all font-serif"
                      >
                        {m.label || m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          SUB-TAB 3: PATHFINDER (SHORTEST PATH)
          ========================================== */}
      {subTab === 'pathfinder' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] shadow-dossier space-y-4">
            <div className="flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-[#d68a1f]" />
              <h3 className="font-bold text-sm text-[#ece7de] font-serif">
                Dijkstra Evidentiary Shortest Path Search
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8a8478] font-mono uppercase">Source Entity (Origin)</label>
                <select
                  value={pathSource}
                  onChange={(e) => setPathSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] font-mono focus:border-[#d68a1f] outline-none"
                >
                  <option value="">Select origin entity...</option>
                  {allNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#8a8478] font-mono uppercase">Target Entity (Destination)</label>
                <select
                  value={pathTarget}
                  onChange={(e) => setPathTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] font-mono focus:border-[#d68a1f] outline-none"
                >
                  <option value="">Select destination entity...</option>
                  {allNodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleRunPathfinder}
              disabled={pathLoading || !pathSource || !pathTarget}
              className="px-4 py-2.5 rounded-xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            >
              {pathLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitMerge className="w-3.5 h-3.5" />}
              <span>Trace Evidentiary Chain</span>
            </button>
          </div>

          {pathResult && (
            <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] space-y-3 shadow-dossier animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#2a2620] pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5c7a5c]" />
                  <h4 className="font-bold text-sm text-[#ece7de] font-serif">
                    Path Result: {pathResult.hop_count} Hops Traversed
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#f5c074]">
                  Cumulative Weight: {pathResult.total_weight?.toFixed(2) || '1.00'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {pathResult.path_nodes?.map((pNode, idx) => (
                  <React.Fragment key={pNode.id}>
                    <button
                      onClick={() => onSelectNode(pNode.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f] text-xs font-serif text-[#ece7de] transition-all"
                    >
                      <strong>{pNode.label}</strong> <span className="text-[10px] text-[#8a8478] font-mono">({pNode.type})</span>
                    </button>
                    {idx < pathResult.path_nodes.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#d68a1f] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          SUB-TAB 4: LINK PREDICTION
          ========================================== */}
      {subTab === 'prediction' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictedLinks.map((pLink, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] space-y-3 shadow-dossier"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#f5c074] font-mono font-bold">
                    <Zap className="w-3.5 h-3.5 text-[#d68a1f]" />
                    <span>Adamic-Adar Prediction</span>
                  </div>
                  <span className="seal-badge-high">
                    {Math.round((pLink.probability || 0.85) * 100)}% Probable
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs">
                  <span className="font-bold text-[#ece7de] font-serif">{pLink.source_label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8a8478]" />
                  <span className="font-bold text-[#ece7de] font-serif">{pLink.target_label}</span>
                </div>

                <p className="text-xs text-[#8a8478] font-serif">
                  {pLink.reason || "High structural co-occurrence through shared mule intermediaries and common cell towers."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          SUB-TAB: SERIAL OFFENDER MO PATTERN DETECTOR
          ========================================== */}
      {subTab === 'serial_patterns' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Description & Stats */}
          <div className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] space-y-3 shadow-dossier relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#ece7de] font-serif flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#d68a1f]" />
                  <span>Cross-Case Modus Operandi (MO) Pattern Detector</span>
                </h3>
                <p className="text-xs text-[#8a8478] font-serif">
                  Identifies behavioral signatures (Time of Day, Operating Method, Mobility, Weapon, Target Selection) to link multi-case perpetrators with open/unsolved cold cases.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40 text-xs font-mono font-bold">
                  {moClusters.length} Behavioral Clusters Flagged
                </span>
              </div>
            </div>

            {/* Statutory Legal Notice */}
            <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-[11px] text-[#8a8478] font-serif italic">
              ⚖️ <strong className="text-[#f5c074]">Judicial Defensibility Note:</strong> MO similarity utilizes explainable weighted attribute scoring across statutory police metadata (BSA 2023 compliant). All cold case suggestions are investigative leads requiring human verification.
            </div>
          </div>

          {/* MO Cluster Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {moClusters.map((cluster) => (
              <div 
                key={cluster.cluster_id}
                className="p-5 rounded-2xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f]/60 transition-all space-y-4 shadow-dossier flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Title & Domain */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#d68a1f] uppercase tracking-wider">
                        {cluster.crime_domain}
                      </span>
                      <h4 className="font-bold text-sm text-[#ece7de] font-serif">
                        {cluster.cluster_name}
                      </h4>
                    </div>
                    <span className="seal-badge-critical shrink-0">
                      {cluster.confidence_level} Confidence
                    </span>
                  </div>

                  {/* Core Signature */}
                  <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] text-xs text-[#ece7de] font-serif italic">
                    "{cluster.core_mo_signature}"
                  </div>

                  {/* Shared Attributes Matrix */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-[#8a8478] uppercase">Shared Behavioral Attributes:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      {Object.entries(cluster.shared_attributes || {}).map(([k, v], aIdx) => (
                        <div key={aIdx} className="p-2 rounded-xl bg-[#24211d] border border-[#3a352d]">
                          <span className="text-[#8a8478] block text-[9px] uppercase">{k}</span>
                          <span className="text-[#f5c074] font-medium truncate block">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suspects Involved */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-[#8a8478] uppercase">
                      Linked Operatives ({cluster.suspects_count}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cluster.suspect_names.map((name, sIdx) => {
                        const sId = cluster.suspect_ids[sIdx];
                        return (
                          <button
                            key={sIdx}
                            onClick={() => sId && onSelectNode && onSelectNode(sId)}
                            className="px-2.5 py-1 rounded-xl bg-[#0f0e0d] hover:bg-[#24211d] text-[#ece7de] hover:text-[#f5c074] border border-[#3a352d] hover:border-[#d68a1f]/60 text-xs font-mono font-medium transition-all flex items-center gap-1"
                          >
                            <span>👤</span>
                            <span>{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Associated FIRs */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono text-[#8a8478] uppercase">Associated Cases & Cold Leads:</span>
                    <div className="flex flex-wrap gap-1">
                      {cluster.associated_firs.map((fir, fIdx) => (
                        <span key={fIdx} className="px-2 py-0.5 rounded-lg bg-[#0f0e0d] text-[#8a8478] border border-[#2a2620] text-[10px] font-mono">
                          📁 {fir}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pattern Synthesis Footnote */}
                <p className="text-xs text-[#8a8478] font-serif pt-3 border-t border-[#2a2620] leading-relaxed">
                  {cluster.pattern_description}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==========================================
          SUB-TAB 5: ANOMALIES & RED FLAGS
          ========================================== */}
      {subTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalies.map((anom, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#1c1a17] border border-[#a5342a]/40 space-y-2 shadow-dossier"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#e27d75] font-serif flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#a5342a]" />
                    {anom.type}
                  </span>
                  <span className="seal-badge-critical">
                    {anom.severity || 'CRITICAL'}
                  </span>
                </div>

                <p className="text-xs text-[#ece7de] font-serif">
                  {anom.description}
                </p>

                <div className="text-[11px] text-[#8a8478] font-mono pt-1">
                  Target Entity: <strong className="text-[#f5c074]">{anom.target_label || anom.target_id}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

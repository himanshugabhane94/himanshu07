import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Network, Cpu, Fingerprint, 
  GitPullRequest, MapPin, ShieldAlert, Scale, 
  Flame, Database, ArrowRight, ShieldCheck, 
  AlertTriangle, Sparkles, Activity, Clock, 
  Layers, ExternalLink, ChevronRight, Eye, RefreshCw,
  TrendingUp, Users, Radio, Shield
} from 'lucide-react';
import { api } from '../../services/api';

export default function CommandCenter({
  onNavigateToTab,
  onSelectCase,
  onOpenPriorityQueue,
  onOpenScenarios,
  onOpenReport,
  onStartGuidedDemo,
  demoLanguage = 'hi',
  onLanguageToggle,
  currentUser
}) {
  const [priorityData, setPriorityData] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [moClusters, setMoClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [pQueue, ledger, geo, mo] = await Promise.allSettled([
        api.getPriorityQueue(),
        api.getBlockchainLedger(),
        api.getGeoClusters({ radius_km: 15 }),
        api.getMoClusters()
      ]);

      if (pQueue.status === 'fulfilled') setPriorityData(pQueue.value);
      if (ledger.status === 'fulfilled') setLedgerData(ledger.value);
      if (geo.status === 'fulfilled') setGeoData(geo.value);
      if (mo.status === 'fulfilled') setMoClusters(mo.value);
    } catch (err) {
      console.error('Failed to load command center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const topPriorityCases = priorityData?.cases_queue?.slice(0, 5) || [];
  const recentLedgerBlocks = ledgerData?.blocks?.slice(-4).reverse() || [];
  const topGeoHotspots = geoData?.clusters?.filter(c => c.location_count >= 2) || [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0e0d] text-[#ece7de] p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#3a352d]">
      
      {/* Top Banner & Operational Status */}
      <div className="p-6 rounded-3xl bg-[#141210] border border-[#3a352d] shadow-dossier flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        
        {/* Background Subtle Accent Watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#d68a1f]/10 to-transparent pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#1c1a17] text-[#f5c074] border border-[#d68a1f]/40">
              MHA SIH26189 Live Command Center
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-[#5c7a5c]">
              <span className="w-2 h-2 rounded-full bg-[#5c7a5c] animate-pulse" />
              All Intelligence Nodes Operational
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold font-cinzel text-[#ece7de] tracking-wide">
            Federal Criminal Intelligence & Judicial Custody Grid
          </h1>

          <p className="text-xs text-[#8a8478] font-serif italic">
            Welcome, <strong>{currentUser?.full_name || 'Inspector'}</strong> ({currentUser?.role || 'Investigator'}) • Multi-Agency Task Force Active
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 z-10 flex-wrap">
          {/* Language Toggle Pill */}
          <button
            onClick={onLanguageToggle}
            className="px-3 py-2 rounded-xl bg-[#1c1a17] hover:bg-[#24211d] border border-[#3a352d] hover:border-[#d68a1f]/60 text-[#f5c074] text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Toggle Demo Narration Language"
          >
            <span>{demoLanguage === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}</span>
          </button>

          <button
            onClick={onStartGuidedDemo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#241a18] border border-[#a5342a]/60 hover:border-[#e27d75] text-[#e27d75] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
            title="Start Self-Playing Technical Demo with Voice Narration"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e27d75]" />
            <span>{demoLanguage === 'hi' ? '🎬 गाइडेड डेमो (3-4 मिनट)' : '🎬 Run Guided Demo (3-4 Min)'}</span>
          </button>

          <button
            onClick={onOpenScenarios}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#24211d] border border-[#d68a1f]/60 hover:border-[#d68a1f] text-[#f5c074] text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d68a1f]" />
            <span>⭐ Flagship Scenarios</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] text-[#8a8478] hover:text-[#ece7de] transition-all"
            title="Refresh Intelligence Grid"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#d68a1f]' : ''}`} />
          </button>
        </div>

      </div>

      {/* KPI Cards Strip (5 Core Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        
        {/* Card 1: Active Cases */}
        <div 
          onClick={() => onOpenPriorityQueue?.()}
          className="p-4 rounded-2xl bg-[#141210] border border-[#3a352d] hover:border-[#d68a1f]/60 transition-all cursor-pointer space-y-1.5 shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#8a8478]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Active FIRs</span>
            <Layers className="w-4 h-4 text-[#d68a1f]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#ece7de] group-hover:text-[#f5c074] transition-colors">
            {priorityData?.total_cases_analyzed || 12}
          </div>
          <div className="text-[10px] text-[#8a8478] font-serif truncate">
            Across 7 States & UTs
          </div>
        </div>

        {/* Card 2: Tracked Entities */}
        <div 
          onClick={() => onNavigateToTab?.('graph')}
          className="p-4 rounded-2xl bg-[#141210] border border-[#3a352d] hover:border-[#d68a1f]/60 transition-all cursor-pointer space-y-1.5 shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#8a8478]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Graph Entities</span>
            <Network className="w-4 h-4 text-[#d68a1f]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#ece7de] group-hover:text-[#f5c074] transition-colors">
            88 Nodes
          </div>
          <div className="text-[10px] text-[#8a8478] font-serif truncate">
            87 Strategic Relationships
          </div>
        </div>

        {/* Card 3: Critical Triage */}
        <div 
          onClick={() => onOpenPriorityQueue?.()}
          className="p-4 rounded-2xl bg-[#241a18] border border-[#a5342a]/60 hover:border-[#e27d75] transition-all cursor-pointer space-y-1.5 shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#e27d75]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Critical Triage</span>
            <Flame className="w-4 h-4 text-[#e27d75] animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#e27d75] group-hover:text-white transition-colors">
            {priorityData?.critical_urgent_count || 5}
          </div>
          <div className="text-[10px] text-[#e27d75]/80 font-serif truncate">
            Priority Score ≥ 80 / 100
          </div>
        </div>

        {/* Card 4: Repeat Serial Predators */}
        <div 
          onClick={() => onNavigateToTab?.('analytics')}
          className="p-4 rounded-2xl bg-[#141210] border border-[#3a352d] hover:border-[#a5342a] transition-all cursor-pointer space-y-1.5 shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#8a8478]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Serial Repeaters</span>
            <ShieldAlert className="w-4 h-4 text-[#e27d75]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#ece7de] group-hover:text-[#e27d75] transition-colors">
            2 Flagged
          </div>
          <div className="text-[10px] text-[#8a8478] font-serif truncate">
            Sec 398 BNSS Protection
          </div>
        </div>

        {/* Card 5: Blockchain Ledger */}
        <div 
          onClick={() => onNavigateToTab?.('blockchain')}
          className="p-4 rounded-2xl bg-[#141210] border border-[#3a352d] hover:border-[#5c7a5c] transition-all cursor-pointer space-y-1.5 shadow-sm group"
        >
          <div className="flex items-center justify-between text-[#8a8478]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Sec 65B Vault</span>
            <Database className="w-4 h-4 text-[#5c7a5c]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#ece7de] group-hover:text-[#9fc49f] transition-colors">
            {ledgerData?.total_blocks || 10} Blocks
          </div>
          <div className="text-[10px] text-[#5c7a5c] font-mono truncate">
            Anchored to Polygon L2
          </div>
        </div>

      </div>

      {/* Main Command Dashboard Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): AI Recommendations & Top Priority Cases */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Widget 1: AI Tactical Recommendations & Active Alerts */}
          <div className="p-5 rounded-3xl bg-[#141210] border border-[#3a352d] space-y-4 shadow-dossier">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d68a1f]" />
                <h3 className="font-bold text-sm text-[#ece7de] font-serif uppercase tracking-wider">
                  AI Tactical Recommendations & Pattern Alerts
                </h3>
              </div>
              <span className="seal-badge-high">High Confidence</span>
            </div>

            <div className="space-y-3">
              
              {/* Alert 1: Serial MO Match (Kuldeep Yadav) */}
              <div 
                onClick={() => onNavigateToTab?.('analytics')}
                className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#a5342a]/60 hover:border-[#e27d75] transition-all cursor-pointer space-y-1.5 shadow-sm group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#241a18] text-[#e27d75] border border-[#a5342a]/50">
                      100% MO MATCH
                    </span>
                    <strong className="text-xs text-[#ece7de] group-hover:text-[#f5c074] transition-colors font-serif">
                      Suspect Kuldeep Yadav (Alias KD) Matched to Unsolved Cold Cases
                    </strong>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8a8478] group-hover:text-[#ece7de]" />
                </div>
                <p className="text-xs text-[#8a8478] font-serif leading-relaxed">
                  Behavioral pattern detector matches MO signatures (Night, Group of 3+, Used Vehicle, Firearm) linking him to Cold Case FIR 55/2024 and Kidnapping FIR 104/2024. Neutralization predicted to disrupt 4 cases.
                </p>
              </div>

              {/* Alert 2: Victim Safety Escalation (Satish Verma) */}
              <div 
                onClick={() => onNavigateToTab?.('analytics')}
                className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#a5342a]/60 hover:border-[#e27d75] transition-all cursor-pointer space-y-1.5 shadow-sm group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#241a18] text-[#e27d75] border border-[#a5342a]/50">
                      90% RECIDIVISM
                    </span>
                    <strong className="text-xs text-[#ece7de] group-hover:text-[#f5c074] transition-colors font-serif">
                      Critical Predatory Escalation: Satish 'Chhotu' Verma
                    </strong>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8a8478] group-hover:text-[#ece7de]" />
                </div>
                <p className="text-xs text-[#8a8478] font-serif leading-relaxed">
                  Rapid escalation from cyberstalking in Dwarka (FIR 62/2024) to physical assault in Gurugram (FIR 89/2024) in 5 days. Recommend immediate witness protection under Sec 398 BNSS 2023.
                </p>
              </div>

              {/* Alert 3: Cross-Case Inter-State Conduit (Scorpio DL-4C-NA-8821) */}
              <div 
                onClick={() => onNavigateToTab?.('crosscase')}
                className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#d68a1f]/60 hover:border-[#f5c074] transition-all cursor-pointer space-y-1.5 shadow-sm group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/50">
                      MULTI-JURISDICTION
                    </span>
                    <strong className="text-xs text-[#ece7de] group-hover:text-[#f5c074] transition-colors font-serif">
                      Shared Getaway Hardware Links Armed Robbery & Kidnapping
                    </strong>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8a8478] group-hover:text-[#ece7de]" />
                </div>
                <p className="text-xs text-[#8a8478] font-serif leading-relaxed">
                  ANPR telemetry confirms White Mahindra Scorpio DL-4C-NA-8821 and countrymade pistol link the Janakpuri Ring Road Cash Heist (FIR 415/2024) directly to Operation Amber Shield (FIR 104/2024).
                </p>
              </div>

            </div>
          </div>

          {/* Widget 2: Recent High-Priority Cases (Priority Queue) */}
          <div className="p-5 rounded-3xl bg-[#141210] border border-[#3a352d] space-y-4 shadow-dossier">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#e27d75]" />
                <h3 className="font-bold text-sm text-[#ece7de] font-serif uppercase tracking-wider">
                  Urgent Case Priority Triage (Top Ranked Investigations)
                </h3>
              </div>
              <button
                onClick={onOpenPriorityQueue}
                className="text-xs font-mono text-[#f5c074] hover:text-[#ece7de] flex items-center gap-1 transition-colors"
              >
                <span>View Full Queue ({priorityData?.total_cases_analyzed || 12})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topPriorityCases.map((c, idx) => {
                const isCritical = c.priority_score >= 80;
                return (
                  <div
                    key={c.case_id}
                    className={`p-3 rounded-2xl bg-[#0f0e0d] border transition-all flex items-center justify-between gap-3 ${
                      isCritical
                        ? 'border-[#a5342a]/60 hover:border-[#e27d75]'
                        : 'border-[#3a352d] hover:border-[#d68a1f]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Priority Score Circle */}
                      <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl border shrink-0 ${
                        isCritical 
                          ? 'bg-[#241a18] border-[#a5342a] text-[#e27d75]' 
                          : 'bg-[#242018] border-[#d68a1f] text-[#f5c074]'
                      }`}>
                        <span className="text-sm font-bold font-mono leading-none">{c.priority_score}</span>
                        <span className="text-[8px] font-mono uppercase mt-0.5">PTS</span>
                      </div>

                      {/* Case Metadata */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-xs font-bold text-[#f5c074]">{c.fir_number}</span>
                          <span className="text-xs font-bold text-[#ece7de] font-serif truncate">— {c.title}</span>
                        </div>
                        <div className="text-[10px] text-[#8a8478] font-mono mt-0.5 flex items-center gap-2 truncate">
                          <span className="text-[#ece7de]">{c.crime_category}</span>
                          <span>•</span>
                          <span>{c.agency}</span>
                          <span>•</span>
                          <span className="text-[#d68a1f]">{c.cross_case_links_count} Syndicate Links</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      <button
                        onClick={() => {
                          onSelectCase(c.case_id);
                          onNavigateToTab?.('graph');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24211d] border border-[#d68a1f]/60 hover:border-[#d68a1f] text-[#f5c074] text-xs font-mono font-bold transition-all active:scale-95 shadow-sm"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols): Geo Hotspots & Live Blockchain Stream */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Widget 3: Geo-Spatial Operational Corridors */}
          <div className="p-5 rounded-3xl bg-[#141210] border border-[#3a352d] space-y-4 shadow-dossier">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d68a1f]" />
                <h3 className="font-bold text-sm text-[#ece7de] font-serif uppercase tracking-wider">
                  Geo-Spatial Hotspots & Corridors
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab?.('geomap')}
                className="text-xs font-mono text-[#f5c074] hover:text-[#ece7de] flex items-center gap-1 transition-colors"
              >
                <span>Interactive Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topGeoHotspots.length > 0 ? (
                topGeoHotspots.map((hotspot, hIdx) => (
                  <div
                    key={hIdx}
                    onClick={() => onNavigateToTab?.('geomap')}
                    className="p-3 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f] transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#ece7de] font-serif group-hover:text-[#f5c074] transition-colors">
                        {hotspot.cluster_title}
                      </strong>
                      <span className={hotspot.risk_severity === 'CRITICAL' ? 'seal-badge-critical' : 'seal-badge-high'}>
                        {hotspot.dominant_crime_category}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#8a8478] font-mono flex items-center justify-between">
                      <span>{hotspot.location_count} Incident Scenes • Radius: {hotspot.radius_km} km</span>
                      <span className="text-[#d68a1f] font-bold">Focus GIS →</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#8a8478] font-mono">
                  Loading geographic clusters...
                </div>
              )}
            </div>
          </div>

          {/* Widget 4: Live Activity & Blockchain Audit Stream */}
          <div className="p-5 rounded-3xl bg-[#141210] border border-[#3a352d] space-y-4 shadow-dossier">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5c7a5c]" />
                <h3 className="font-bold text-sm text-[#ece7de] font-serif uppercase tracking-wider">
                  Live Activity & Custody Audit Stream
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab?.('blockchain')}
                className="text-xs font-mono text-[#5c7a5c] hover:text-[#9fc49f] flex items-center gap-1 transition-colors"
              >
                <span>Full Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentLedgerBlocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  className="p-3 rounded-2xl bg-[#0f0e0d] border border-[#2a2620] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#f5c074]">Block #{block.index}: {block.action}</span>
                    <span className="text-[10px] text-[#8a8478]">{block.timestamp?.slice(11, 19)} UTC</span>
                  </div>
                  <div className="text-[11px] text-[#ece7de] font-serif">
                    Investigator: {block.investigator}
                  </div>
                  <div className="text-[10px] text-[#8a8478] font-mono truncate">
                    Hash: {block.hash?.slice(0, 24)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Quick Launchers Command Deck */}
      <div className="p-6 rounded-3xl bg-[#141210] border border-[#3a352d] shadow-dossier space-y-3">
        <div className="text-xs font-bold text-[#8a8478] uppercase font-mono tracking-wider">
          Quick Intelligence Command Launchers
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateToTab?.('graph')}
            className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f] transition-all text-left space-y-1 group"
          >
            <Network className="w-5 h-5 text-[#d68a1f] group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-[#ece7de] font-serif">Interactive Graph</div>
            <div className="text-[10px] text-[#8a8478] font-mono">Multi-hop canvas</div>
          </button>

          <button
            onClick={() => onNavigateToTab?.('crosscase')}
            className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f] transition-all text-left space-y-1 group"
          >
            <GitPullRequest className="w-5 h-5 text-[#d68a1f] group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-[#ece7de] font-serif">Cross-Case Linker</div>
            <div className="text-[10px] text-[#8a8478] font-mono">Inter-state alerts</div>
          </button>

          <button
            onClick={() => onNavigateToTab?.('geomap')}
            className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f] transition-all text-left space-y-1 group"
          >
            <MapPin className="w-5 h-5 text-[#d68a1f] group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-[#ece7de] font-serif">Geo-Spatial Map</div>
            <div className="text-[10px] text-[#8a8478] font-mono">Territory clusters</div>
          </button>

          <button
            onClick={() => onNavigateToTab?.('analytics')}
            className="p-3.5 rounded-2xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f] transition-all text-left space-y-1 group"
          >
            <Cpu className="w-5 h-5 text-[#d68a1f] group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs text-[#ece7de] font-serif">AI Analytics Lab</div>
            <div className="text-[10px] text-[#8a8478] font-mono">What-If & centrality</div>
          </button>
        </div>
      </div>

      {/* Hero Guided Demo Banner (Self-Playing Sequence) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1c1a17] via-[#241a18] to-[#1c1a17] border border-[#d68a1f]/50 shadow-dossier flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-[#d68a1f] text-[#0f0e0d]">
              AUTONOMOUS PRESENTATION MODE
            </span>
            <span className="text-xs font-mono text-[#f5c074]">11 Synced Chapters • ~3-4 Minutes</span>
          </div>

          <h3 className="text-base md:text-lg font-bold font-cinzel text-[#ece7de]">
            Self-Playing Guided Demo with Voice Narration
          </h3>

          <p className="text-xs text-[#8a8478] font-serif leading-relaxed">
            Sit back and watch SUTRA autonomously showcase raw evidence ingestion, multi-hop knowledge graphs, PageRank kingpin centrality, inter-state cross-case linking, serial offender MO matching, what-if disruption simulation, and Section 65B blockchain verification with synchronized voice narration.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <button
            onClick={onStartGuidedDemo}
            className="px-6 py-3 rounded-2xl bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] font-mono font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
            <span>Launch Autonomous Demo</span>
          </button>
        </div>
      </div>

    </div>
  );
}

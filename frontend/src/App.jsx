import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import NlSearchBar from './components/layout/NlSearchBar';
import GraphFilterBar from './components/graph/GraphFilterBar';
import GraphCanvas from './components/graph/GraphCanvas';
import SuspectDossierDrawer from './components/dossier/SuspectDossierDrawer';
import AnalyticsWarRoom from './components/analytics/AnalyticsWarRoom';
import CrossCaseInsights from './components/crosscase/CrossCaseInsights';
import IngestionStudio from './components/ingestion/IngestionStudio';
import BlockchainVault from './components/blockchain/BlockchainVault';
import IntegrityVerificationPanel from './components/blockchain/IntegrityVerificationPanel';
import TimelineScrubber from './components/timeline/TimelineScrubber';
import CourtReportModal from './components/reports/CourtReportModal';
import ScenarioSelectorModal from './components/scenarios/ScenarioSelectorModal';
import CaseHandoverModal from './components/dossier/CaseHandoverModal';
import LoginView from './components/auth/LoginView';
import GeoIntelligenceMap from './components/geo/GeoIntelligenceMap';
import { api } from './services/api';

export default function App() {
  // Authentication & RBAC State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sutra_auth') !== 'false';
  });

  // Navigation & User State
  const [activeTab, setActiveTab] = useState('graph');
  const [currentUser, setCurrentUser] = useState({
    id: "USR-INV-001",
    full_name: "Inspector Rajesh Kumar (Mehra)",
    role: "Investigator",
    badge_number: "MHA-SP-8821",
    agency: "Ministry of Home Affairs — Special Cyber & Crime Cell"
  });

  // Cases State
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('CASE-HAWALA-2024');

  // Graph Data State
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], stats: {} });
  const [loadingGraph, setLoadingGraph] = useState(true);

  // Graph Filters & Layout State
  const [selectedNodeTypes, setSelectedNodeTypes] = useState([
    'Person', 'Phone', 'BankAccount', 'Organization', 'Vehicle', 'Location', 'DigitalID'
  ]);
  const [minRisk, setMinRisk] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nodeSizingMetric, setNodeSizingMetric] = useState('pagerank');
  const [layoutMode, setLayoutMode] = useState('force');
  const [timelineState, setTimelineState] = useState({
    timelineDate: null,
    activeNodeIds: null,
    activeEdgeIds: null,
    activeMilestone: null
  });

  // Interactive Selection State
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [highlightedPathNodeIds, setHighlightedPathNodeIds] = useState([]);
  const [highlightedPathEdgeIds, setHighlightedPathEdgeIds] = useState([]);

  // Modals & Blockchain State
  const [blockchainValid, setBlockchainValid] = useState(true);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [isIntegrityModalOpen, setIsIntegrityModalOpen] = useState(false);

  // Initial Load: Cases & User
  useEffect(() => {
    api.getCases().then(data => {
      setCases(data);
      if (data.length > 0 && !selectedCaseId) {
        setSelectedCaseId(data[0].id);
      }
    }).catch(console.error);

    api.getMe().then(setCurrentUser).catch(console.error);
    api.verifyBlockchain().then(v => setBlockchainValid(v.is_valid)).catch(console.error);
  }, []);

  // Fetch Graph on Filter / Case Change
  useEffect(() => {
    loadGraph();
  }, [selectedCaseId, selectedNodeTypes, minRisk]);

  const loadGraph = async () => {
    setLoadingGraph(true);
    try {
      const data = await api.getGraph({
        caseId: selectedCaseId,
        nodeTypes: selectedNodeTypes,
        minRisk: minRisk
      });
      setGraphData(data);
    } catch (err) {
      console.error("Failed to load graph:", err);
    } finally {
      setLoadingGraph(false);
    }
  };

  const handleToggleNodeType = (type) => {
    setSelectedNodeTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('sutra_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('sutra_auth', 'false');
  };

  const handleSwitchRole = async (newRole) => {
    try {
      const res = await api.switchRole(newRole);
      setCurrentUser(res.user);
    } catch (err) {
      console.error("Switch role failed:", err);
      // Fallback local switch
      setCurrentUser(prev => ({
        ...prev,
        role: newRole,
        full_name: newRole === 'Investigator' ? 'Inspector Rajesh Kumar (Mehra)' : (newRole === 'Admin' ? 'DIG Vikramaditya Singh' : 'Pooja Iyer (Senior Analyst)')
      }));
    }
  };

  const handleNlQueryResults = (res) => {
    if (res.matching_nodes && res.matching_nodes.length > 0) {
      const nodeIds = res.matching_nodes.map(n => n.id);
      const edgeIds = (res.matching_edges || []).map(e => e.id);
      setHighlightedPathNodeIds(nodeIds);
      setHighlightedPathEdgeIds(edgeIds);
      setSelectedNodeId(nodeIds[0]);
    }
  };

  const handleClearQuery = () => {
    setHighlightedPathNodeIds([]);
    setHighlightedPathEdgeIds([]);
  };

  // Pathfinder Source pre-fill
  const [pathSourceNodeId, setPathSourceNodeId] = useState(null);

  const handleHighlightPath = (nodeIds, edgeIds) => {
    setHighlightedPathNodeIds(nodeIds);
    setHighlightedPathEdgeIds(edgeIds);
    setActiveTab('graph');
  };

  const handleFindPathFromNode = (nodeId) => {
    setPathSourceNodeId(nodeId);
    setActiveTab('analytics');
  };

  const handleExpandNeighborhood = async (nodeId) => {
    try {
      const expanded = await api.expandNode(nodeId, 2);
      // Merge expanded nodes into graphData
      setGraphData(prev => {
        const existingNodeIds = new Set(prev.nodes.map(n => n.id));
        const newNodes = [...prev.nodes];
        for (let n of expanded.nodes) {
          if (!existingNodeIds.has(n.id)) {
            newNodes.push(n);
            existingNodeIds.add(n.id);
          }
        }
        return { ...prev, nodes: newNodes, edges: [...prev.edges, ...expanded.edges] };
      });
      // Highlight the expanded neighborhood on graph canvas
      setHighlightedPathNodeIds(expanded.nodes.map(n => n.id));
      setActiveTab('graph');
    } catch (err) {
      console.error("Expand neighborhood failed:", err);
    }
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-[#ece7de] flex flex-col font-sans bg-dossier-grid antialiased">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cases={cases}
        selectedCaseId={selectedCaseId}
        onSelectCase={setSelectedCaseId}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        blockchainValid={blockchainValid}
        onOpenScenarios={() => setShowScenarioModal(true)}
        onOpenReport={() => setShowReportModal(true)}
        onOpenHandover={() => setShowHandoverModal(true)}
        onOpenIntegrityModal={() => setIsIntegrityModalOpen(true)}
        stats={graphData.stats}
      />

      {/* Natural Language AI Search Bar (Visible on Graph and Analytics Tabs) */}
      {(activeTab === 'graph' || activeTab === 'analytics') && (
        <NlSearchBar
          selectedCaseId={selectedCaseId}
          onQueryResults={handleNlQueryResults}
          onClearQuery={handleClearQuery}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* VIEW 1: INTERACTIVE GRAPH CANVAS */}
        {activeTab === 'graph' && (
          <div className="flex-1 flex flex-col relative">
            <GraphFilterBar
              selectedNodeTypes={selectedNodeTypes}
              onToggleNodeType={handleToggleNodeType}
              minRisk={minRisk}
              onSelectMinRisk={setMinRisk}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              nodeSizingMetric={nodeSizingMetric}
              onSelectNodeSizing={setNodeSizingMetric}
              layoutMode={layoutMode}
              onSelectLayout={setLayoutMode}
              onResetView={loadGraph}
              stats={graphData.stats}
            />

            <div className="flex-1 relative min-h-[600px]">
              {loadingGraph && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#141618]/70 backdrop-blur-sm text-[#e5c970] font-mono text-xs gap-3">
                  <div className="w-6 h-6 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin"></div>
                  <span>Synthesizing Sovereign Knowledge Graph...</span>
                </div>
              )}

              <GraphCanvas
                nodes={graphData.nodes}
                edges={graphData.edges}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onExpandNode={handleExpandNeighborhood}
                highlightedPathNodeIds={highlightedPathNodeIds}
                highlightedPathEdgeIds={highlightedPathEdgeIds}
                nodeSizingMetric={nodeSizingMetric}
                layoutMode={layoutMode}
                stats={graphData.stats}
                activeNodeIds={timelineState.activeNodeIds}
                activeEdgeIds={timelineState.activeEdgeIds}
                activeMilestone={timelineState.activeMilestone}
                timelineDate={timelineState.timelineDate}
              />
            </div>

            {/* Investigation Timeline Scrubber */}
            <TimelineScrubber
              caseId={selectedCaseId}
              onTimelineChange={setTimelineState}
              onSelectNode={setSelectedNodeId}
            />
          </div>
        )}

        {/* VIEW 1.5: GEOSPATIAL INTELLIGENCE MAP */}
        {activeTab === 'geomap' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <GeoIntelligenceMap
              cases={cases}
              onSelectCase={(caseId) => {
                setSelectedCaseId(caseId);
                loadGraph();
              }}
              onSelectNode={(nodeId) => {
                setSelectedNodeId(nodeId);
              }}
            />
          </div>
        )}

        {/* VIEW 2: AI GRAPH ANALYTICS LAB */}
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto">
            <AnalyticsWarRoom
              selectedCaseId={selectedCaseId}
              allNodes={graphData.nodes}
              onSelectNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveTab('graph');
              }}
              onHighlightPath={handleHighlightPath}
              initialSourceNodeId={pathSourceNodeId}
            />
          </div>
        )}

        {/* VIEW 2.5: CROSS-CASE INTELLIGENCE LINKER */}
        {activeTab === 'crosscase' && (
          <div className="flex-1 overflow-y-auto">
            <CrossCaseInsights
              onSelectNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveTab('graph');
              }}
              onLoadMergedGraph={(mergedGraph, sharedNodeIds) => {
                setGraphData(mergedGraph);
                setHighlightedPathNodeIds(sharedNodeIds);
                setActiveTab('graph');
              }}
            />
          </div>
        )}

        {/* VIEW 3: DATA INGESTION & NLP STUDIO */}
        {activeTab === 'ingestion' && (
          <div className="flex-1 overflow-y-auto">
            <IngestionStudio
              selectedCaseId={selectedCaseId}
              onDataIngested={loadGraph}
              currentUser={currentUser}
            />
          </div>
        )}

        {/* VIEW 4: BLOCKCHAIN AUDIT VAULT */}
        {activeTab === 'blockchain' && (
          <div className="flex-1 overflow-y-auto">
            <BlockchainVault
              selectedCaseId={selectedCaseId}
              onChainStatusChanged={setBlockchainValid}
              currentUser={currentUser}
            />
          </div>
        )}

      </main>

      {/* Suspect / Entity Dossier Drawer */}
      {selectedNodeId && (
        <SuspectDossierDrawer
          nodeId={selectedNodeId}
          caseId={selectedCaseId}
          onClose={() => setSelectedNodeId(null)}
          onSelectNode={setSelectedNodeId}
          onFindPathFromNode={handleFindPathFromNode}
          onExpandNeighborhood={handleExpandNeighborhood}
        />
      )}

      {/* SIH Judge Demo Scenarios Modal */}
      {showScenarioModal && (
        <ScenarioSelectorModal
          onSelectScenario={(caseId) => {
            setSelectedCaseId(caseId);
            loadGraph();
          }}
          onClose={() => setShowScenarioModal(false)}
        />
      )}

      {/* Court Dossier PDF Export Modal */}
      {showReportModal && (
        <CourtReportModal
          caseId={selectedCaseId}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Case Handover & Relieving Briefing Modal */}
      {showHandoverModal && (
        <CaseHandoverModal
          caseId={selectedCaseId}
          onClose={() => setShowHandoverModal(false)}
          onSelectNode={(nodeId) => {
            setSelectedNodeId(nodeId);
            setShowHandoverModal(false);
            setActiveTab('graph');
          }}
        />
      )}

      {/* Real-Time Blockchain Evidence Integrity Audit Modal */}
      <IntegrityVerificationPanel
        isOpen={isIntegrityModalOpen}
        onClose={() => setIsIntegrityModalOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/layout/LeftSidebar';
import TopHeader from './components/layout/TopHeader';
import CommandCenter from './components/dashboard/CommandCenter';
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
import CasePriorityQueueModal from './components/triage/CasePriorityQueueModal';
import { DEMO_STEPS, speechController } from './services/guidedDemoService';
import GuidedDemoController from './components/demo/GuidedDemoController';
import { api } from './services/api';

export default function App() {
  // Authentication & RBAC State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sutra_auth') !== 'false';
  });

  // Navigation & User State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "USR-INV-001",
    full_name: "Inspector Rajesh Kumar (Mehra)",
    role: "Investigator",
    badge_number: "MHA-SP-8821",
    agency: "Ministry of Home Affairs — Special Cyber & Crime Cell"
  });

  // Autonomous Guided Demo State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [isDemoPaused, setIsDemoPaused] = useState(false);
  const [isDemoMuted, setIsDemoMuted] = useState(false);

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
  const [showPriorityQueueModal, setShowPriorityQueueModal] = useState(false);
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

  // Autonomous Guided Demo Execution Handlers
  const executeDemoStep = (stepIdx) => {
    if (stepIdx < 0 || stepIdx >= DEMO_STEPS.length) {
      stopGuidedDemo();
      return;
    }

    setDemoStepIndex(stepIdx);
    setIsDemoPaused(false);
    const step = DEMO_STEPS[stepIdx];

    if (step.caseId) {
      setSelectedCaseId(step.caseId);
    }
    if (step.tab) {
      setActiveTab(step.tab);
    }
    if (step.nodeId) {
      setSelectedNodeId(step.nodeId);
    } else {
      setSelectedNodeId(null);
    }

    loadGraph();

    // Speak narration and auto-advance on completion
    speechController.speak(step.narration, () => {
      if (stepIdx < DEMO_STEPS.length - 1) {
        executeDemoStep(stepIdx + 1);
      } else {
        stopGuidedDemo();
      }
    });
  };

  const startGuidedDemo = () => {
    setIsDemoRunning(true);
    executeDemoStep(0);
  };

  const stopGuidedDemo = () => {
    speechController.stop();
    setIsDemoRunning(false);
    setActiveTab('overview');
    setSelectedNodeId(null);
  };

  const togglePauseDemo = () => {
    if (isDemoPaused) {
      speechController.resume();
      setIsDemoPaused(false);
    } else {
      speechController.pause();
      setIsDemoPaused(true);
    }
  };

  const toggleMuteDemo = () => {
    const nextMuted = !isDemoMuted;
    setIsDemoMuted(nextMuted);
    speechController.setMuted(nextMuted);
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#0f0e0d] text-[#ece7de] font-sans antialiased overflow-hidden select-none">
      
      {/* PERSISTENT LEFT SIDEBAR */}
      <LeftSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        onOpenPriorityQueue={() => setShowPriorityQueueModal(true)}
        onOpenScenarios={() => setShowScenarioModal(true)}
        onOpenReport={() => setShowReportModal(true)}
        onOpenHandover={() => setShowHandoverModal(true)}
        crossCaseAlertsCount={5}
        criticalTriageCount={3}
      />

      {/* MAIN APPLICATION CONTAINER (TopHeader + Content Viewport) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* SLIM TOP HEADER */}
        <TopHeader
          cases={cases}
          selectedCaseId={selectedCaseId}
          onSelectCase={(caseId) => {
            setSelectedCaseId(caseId);
            loadGraph();
          }}
          blockchainValid={blockchainValid}
          onOpenScenarios={() => setShowScenarioModal(true)}
          onOpenPriorityQueue={() => setShowPriorityQueueModal(true)}
          onOpenIntegrityModal={() => setIsIntegrityModalOpen(true)}
          onNavigateToTab={setActiveTab}
          crossCaseAlertsCount={5}
          criticalTriageCount={3}
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
          
          {/* VIEW 0: COMMAND CENTER OVERVIEW */}
          {activeTab === 'overview' && (
            <CommandCenter
              onNavigateToTab={setActiveTab}
              onSelectCase={(caseId) => {
                setSelectedCaseId(caseId);
                loadGraph();
              }}
              onOpenPriorityQueue={() => setShowPriorityQueueModal(true)}
              onOpenScenarios={() => setShowScenarioModal(true)}
              onOpenReport={() => setShowReportModal(true)}
              onStartGuidedDemo={startGuidedDemo}
              currentUser={currentUser}
            />
          )}

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

            <div className="flex-1 relative min-h-0 w-full overflow-hidden">
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
          onSelectScenario={(caseId, targetTab, highlightNodeId) => {
            if (caseId) setSelectedCaseId(caseId);
            if (targetTab === 'priority_queue') {
              setShowPriorityQueueModal(true);
            } else if (targetTab) {
              setActiveTab(targetTab);
            }
            if (highlightNodeId) {
              setSelectedNodeId(highlightNodeId);
            }
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

      {/* Automated Case Priority & Triage Queue Modal */}
      <CasePriorityQueueModal
        isOpen={showPriorityQueueModal}
        onClose={() => setShowPriorityQueueModal(false)}
        onSelectCase={(caseId) => {
          setSelectedCaseId(caseId);
          loadGraph();
        }}
      />

      {/* Autonomous Guided Demo Floating HUD Overlay */}
      {isDemoRunning && (
        <GuidedDemoController
          currentStep={demoStepIndex + 1}
          totalSteps={DEMO_STEPS.length}
          stepData={DEMO_STEPS[demoStepIndex]}
          isPaused={isDemoPaused}
          isMuted={isDemoMuted}
          onPauseToggle={togglePauseDemo}
          onMuteToggle={toggleMuteDemo}
          onNext={() => executeDemoStep(demoStepIndex + 1)}
          onPrev={() => executeDemoStep(demoStepIndex - 1)}
          onExit={stopGuidedDemo}
        />
      )}

      </div>
    </div>
  );
}

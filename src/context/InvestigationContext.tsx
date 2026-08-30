'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  InvestigationCase, 
  InvestigationEntity, 
  InvestigationRelationship, 
  TimelineEvent, 
  GeoPoint, 
  ExplainableAiFinding, 
  DocumentRecord, 
  EntityMatchCandidate, 
  DuplicateRecordPair, 
  AuditLogEntry, 
  CollaborationTask,
  UserProfile,
  UserRole
} from '@/types/synapx';
import { 
  DEMO_USERS, 
  INITIAL_CASES, 
  INITIAL_ENTITIES, 
  INITIAL_RELATIONSHIPS, 
  INITIAL_TIMELINE_EVENTS, 
  INITIAL_GEO_POINTS, 
  INITIAL_AI_FINDINGS, 
  INITIAL_ENTITY_MATCH_CANDIDATES, 
  INITIAL_DUPLICATE_RECORDS, 
  INITIAL_DOCUMENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_COLLABORATION_TASKS 
} from '@/lib/demo-data';

interface InvestigationContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchUserRole: (role: UserRole) => void;
  
  cases: InvestigationCase[];
  activeCaseId: string;
  activeCase: InvestigationCase;
  setActiveCaseId: (id: string) => void;
  
  entities: InvestigationEntity[];
  relationships: InvestigationRelationship[];
  timelineEvents: TimelineEvent[];
  geoPoints: GeoPoint[];
  aiFindings: ExplainableAiFinding[];
  matchCandidates: EntityMatchCandidate[];
  duplicateRecords: DuplicateRecordPair[];
  documents: DocumentRecord[];
  auditLogs: AuditLogEntry[];
  tasks: CollaborationTask[];
  
  // Actions
  addCase: (newCase: InvestigationCase) => void;
  updateCase: (id: string, updates: Partial<InvestigationCase>) => void;
  updateEntityVerification: (entityId: string, status: InvestigationEntity['verificationStatus']) => void;
  acceptEntityMatch: (candidateId: string) => void;
  rejectEntityMatch: (candidateId: string) => void;
  mergeDuplicateRecords: (pairId: string) => void;
  dismissDuplicateRecord: (pairId: string) => void;
  reviewAiFinding: (findingId: string, status: ExplainableAiFinding['reviewStatus']) => void;
  addTask: (task: CollaborationTask) => void;
  toggleTaskStatus: (taskId: string) => void;
  addDocument: (doc: DocumentRecord) => void;
  
  // Privacy & Redaction
  isRedactionEnabled: boolean;
  toggleRedaction: () => void;
  
  // Time Machine
  timeMachineYear: number;
  setTimeMachineYear: (year: number) => void;
  isTimeMachinePlaying: boolean;
  setIsTimeMachinePlaying: (playing: boolean) => void;
  
  // AI Copilot & Graph Highlighting
  isAiCopilotOpen: boolean;
  setIsAiCopilotOpen: (open: boolean) => void;
  toggleAiCopilot: () => void;
  highlightedEntityIds: string[];
  highlightEntitiesOnGraph: (entityIds: string[]) => void;
  clearHighlightedEntities: () => void;
  
  // Judge Mode
  isJudgeModeActive: boolean;
  judgeModeStep: number;
  startJudgeMode: () => void;
  stopJudgeMode: () => void;
  nextJudgeStep: () => void;
  prevJudgeStep: () => void;
  setJudgeModeStep: (step: number) => void;
  
  // Reset
  resetDemoData: () => void;
  loadScenario: (caseId: string) => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export function InvestigationProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]); // Default: Investigator
  const [cases, setCases] = useState<InvestigationCase[]>(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>('CASE-2026-FALCON');
  
  const [entities, setEntities] = useState<InvestigationEntity[]>(INITIAL_ENTITIES);
  const [relationships, setRelationships] = useState<InvestigationRelationship[]>(INITIAL_RELATIONSHIPS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>(INITIAL_GEO_POINTS);
  const [aiFindings, setAiFindings] = useState<ExplainableAiFinding[]>(INITIAL_AI_FINDINGS);
  const [matchCandidates, setMatchCandidates] = useState<EntityMatchCandidate[]>(INITIAL_ENTITY_MATCH_CANDIDATES);
  const [duplicateRecords, setDuplicateRecords] = useState<DuplicateRecordPair[]>(INITIAL_DUPLICATE_RECORDS);
  const [documents, setDocuments] = useState<DocumentRecord[]>(INITIAL_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [tasks, setTasks] = useState<CollaborationTask[]>(INITIAL_COLLABORATION_TASKS);
  
  // Privacy & Redaction
  const [isRedactionEnabled, setIsRedactionEnabled] = useState<boolean>(true);
  
  // Time Machine
  const [timeMachineYear, setTimeMachineYear] = useState<number>(2026);
  const [isTimeMachinePlaying, setIsTimeMachinePlaying] = useState<boolean>(false);
  
  // AI Copilot & Graph Highlights
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [highlightedEntityIds, setHighlightedEntityIds] = useState<string[]>([]);
  
  // Judge Mode
  const [isJudgeModeActive, setIsJudgeModeActive] = useState<boolean>(false);
  const [judgeModeStep, setJudgeModeStep] = useState<number>(0);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  const switchUserRole = (role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    addAuditLog(`Switched active profile to ${user.name} (${user.role})`, 'SECURITY');
  };

  const addAuditLog = (details: string, category: AuditLogEntry['category'] = 'CASE_MODIFICATION') => {
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: currentUser.name,
      userRole: currentUser.role,
      action: details.slice(0, 30).toUpperCase().replace(/\s+/g, '_'),
      category,
      caseNumber: activeCase.caseNumber,
      details,
      ipAddress: '10.14.88.19',
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const toggleRedaction = () => {
    setIsRedactionEnabled(prev => {
      const next = !prev;
      addAuditLog(`Data Privacy Redaction ${next ? 'ENABLED' : 'DISABLED with authorization'}`, 'REDACTION_TOGGLE');
      return next;
    });
  };

  const updateEntityVerification = (entityId: string, status: InvestigationEntity['verificationStatus']) => {
    setEntities(prev => prev.map(ent => {
      if (ent.id === entityId) {
        return { ...ent, verificationStatus: status };
      }
      return ent;
    }));
    addAuditLog(`Updated verification status of Entity ${entityId} to ${status}`, 'ENTITY_RESOLUTION');
  };

  const acceptEntityMatch = (candidateId: string) => {
    const candidate = matchCandidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // Update candidate status
    setMatchCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'ACCEPTED_MERGED' } : c));
    
    // Add alias to primary entity
    setEntities(prev => prev.map(ent => {
      if (ent.id === candidate.primaryEntity.id) {
        const newAliases = Array.from(new Set([...ent.aliases, candidate.candidateEntity.name]));
        return { 
          ...ent, 
          aliases: newAliases,
          verificationStatus: 'VERIFIED',
          confidenceScore: Math.min(99, ent.confidenceScore + 3)
        };
      }
      return ent;
    }));

    addAuditLog(
      `Accepted and merged alias "${candidate.candidateEntity.name}" into primary entity "${candidate.primaryEntity.name}" (Score: ${candidate.matchScore}%)`,
      'ENTITY_RESOLUTION'
    );
  };

  const rejectEntityMatch = (candidateId: string) => {
    const candidate = matchCandidates.find(c => c.id === candidateId);
    if (!candidate) return;
    setMatchCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'REJECTED_SEPARATE' } : c));
    addAuditLog(
      `Human investigator rejected entity match candidate between "${candidate.primaryEntity.name}" and "${candidate.candidateEntity.name}"`,
      'ENTITY_RESOLUTION'
    );
  };

  const mergeDuplicateRecords = (pairId: string) => {
    setDuplicateRecords(prev => prev.map(p => p.id === pairId ? { ...p, status: 'MERGED' } : p));
    addAuditLog(`Merged duplicate records under pair ID ${pairId} after human verification. Audit provenance preserved.`, 'RECORD_MERGE');
  };

  const dismissDuplicateRecord = (pairId: string) => {
    setDuplicateRecords(prev => prev.map(p => p.id === pairId ? { ...p, status: 'DISMISSED' } : p));
    addAuditLog(`Dismissed duplicate candidate pair ${pairId}. Marked records as distinct sources.`, 'RECORD_MERGE');
  };

  const reviewAiFinding = (findingId: string, status: ExplainableAiFinding['reviewStatus']) => {
    setAiFindings(prev => prev.map(f => f.id === findingId ? { ...f, reviewStatus: status } : f));
    addAuditLog(`AI Finding ${findingId} marked as ${status} by ${currentUser.name}`, 'CASE_MODIFICATION');
  };

  const addTask = (task: CollaborationTask) => {
    setTasks(prev => [task, ...prev]);
    addAuditLog(`Created new investigation task: "${task.title}"`, 'CASE_MODIFICATION');
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
        addAuditLog(`Task "${t.title}" status updated to ${nextStatus}`, 'CASE_MODIFICATION');
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const addDocument = (doc: DocumentRecord) => {
    setDocuments(prev => [doc, ...prev]);
    addAuditLog(`Ingested document "${doc.title}" via Document Intelligence OCR pipeline`, 'EVIDENCE_ACCESS');
  };

  const addCase = (newCase: InvestigationCase) => {
    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(newCase.id);
    addAuditLog(`Initiated new investigation case ${newCase.caseNumber}: ${newCase.title}`, 'CASE_MODIFICATION');
  };

  const updateCase = (id: string, updates: Partial<InvestigationCase>) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addAuditLog(`Updated case parameters for ${id}`, 'CASE_MODIFICATION');
  };

  const highlightEntitiesOnGraph = (entityIds: string[]) => {
    setHighlightedEntityIds(entityIds);
  };

  const clearHighlightedEntities = () => {
    setHighlightedEntityIds([]);
  };

  const toggleAiCopilot = () => {
    setIsAiCopilotOpen(prev => !prev);
  };

  // Time Machine Playback Effect
  useEffect(() => {
    let interval: any;
    if (isTimeMachinePlaying) {
      interval = setInterval(() => {
        setTimeMachineYear(prev => {
          if (prev >= 2026) {
            setIsTimeMachinePlaying(false);
            return 2026;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isTimeMachinePlaying]);

  // Judge Mode Functions
  const startJudgeMode = () => {
    setIsJudgeModeActive(true);
    setJudgeModeStep(0);
    addAuditLog('Initiated Judge Mode 15-step interactive guided evaluation tour', 'CASE_BRIEF');
  };

  const stopJudgeMode = () => {
    setIsJudgeModeActive(false);
    setJudgeModeStep(0);
  };

  const nextJudgeStep = () => {
    setJudgeModeStep(prev => Math.min(14, prev + 1));
  };

  const prevJudgeStep = () => {
    setJudgeModeStep(prev => Math.max(0, prev - 1));
  };

  const resetDemoData = () => {
    setCases(INITIAL_CASES);
    setActiveCaseId('CASE-2026-FALCON');
    setEntities(INITIAL_ENTITIES);
    setRelationships(INITIAL_RELATIONSHIPS);
    setTimelineEvents(INITIAL_TIMELINE_EVENTS);
    setGeoPoints(INITIAL_GEO_POINTS);
    setAiFindings(INITIAL_AI_FINDINGS);
    setMatchCandidates(INITIAL_ENTITY_MATCH_CANDIDATES);
    setDuplicateRecords(INITIAL_DUPLICATE_RECORDS);
    setDocuments(INITIAL_DOCUMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setTasks(INITIAL_COLLABORATION_TASKS);
    setTimeMachineYear(2026);
    setIsTimeMachinePlaying(false);
    setHighlightedEntityIds([]);
    addAuditLog('Investigation workspace reset to baseline synthetic dataset', 'SECURITY');
  };

  const loadScenario = (caseId: string) => {
    setActiveCaseId(caseId);
    setHighlightedEntityIds([]);
    addAuditLog(`Loaded investigation scenario ${caseId}`, 'CASE_MODIFICATION');
  };

  return (
    <InvestigationContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        cases,
        activeCaseId,
        activeCase,
        setActiveCaseId,
        entities,
        relationships,
        timelineEvents,
        geoPoints,
        aiFindings,
        matchCandidates,
        duplicateRecords,
        documents,
        auditLogs,
        tasks,
        addCase,
        updateCase,
        updateEntityVerification,
        acceptEntityMatch,
        rejectEntityMatch,
        mergeDuplicateRecords,
        dismissDuplicateRecord,
        reviewAiFinding,
        addTask,
        toggleTaskStatus,
        addDocument,
        isRedactionEnabled,
        toggleRedaction,
        timeMachineYear,
        setTimeMachineYear,
        isTimeMachinePlaying,
        setIsTimeMachinePlaying,
        isAiCopilotOpen,
        setIsAiCopilotOpen,
        toggleAiCopilot,
        highlightedEntityIds,
        highlightEntitiesOnGraph,
        clearHighlightedEntities,
        isJudgeModeActive,
        judgeModeStep,
        startJudgeMode,
        stopJudgeMode,
        nextJudgeStep,
        prevJudgeStep,
        setJudgeModeStep,
        resetDemoData,
        loadScenario,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigation() {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
}

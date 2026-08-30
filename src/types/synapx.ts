export type EntityType = 
  | 'PERSON' 
  | 'ORGANIZATION' 
  | 'EVENT' 
  | 'LOCATION' 
  | 'DIGITAL_ENTITY' 
  | 'DOCUMENT';

export type CaseStatus = 'OPEN' | 'UNDER_REVIEW' | 'VERIFIED' | 'ARCHIVED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'NEEDS_REVIEW' | 'DUPLICATE_CANDIDATE';

export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'ANALYST';

export interface UserProfile {
  id: string;
  name: string;
  badgeId: string;
  email: string;
  role: UserRole;
  agency: string;
  clearanceLevel: string;
  avatarUrl?: string;
}

export interface EntityMetadata {
  phone?: string;
  email?: string;
  taxIdOrAadhaar?: string;
  bankAccount?: string;
  ipAddress?: string;
  cryptoWallet?: string;
  vehicleRegistration?: string;
  registrationNumber?: string;
  incorporationDate?: string;
  jurisdiction?: string;
  severity?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  [key: string]: any;
}

export interface InvestigationEntity {
  id: string;
  name: string;
  type: EntityType;
  aliases: string[];
  roleOrDesignation: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceScore: number; // 0 - 100
  verificationStatus: VerificationStatus;
  caseIds: string[];
  clusterId?: string;
  isBridgeCandidate?: boolean;
  firstSeen: string;
  lastSeen: string;
  metadata: EntityMetadata;
  notes: string[];
  evidenceIds: string[];
  qualityScore: number; // 0 - 100
  sourceProvenance: string;
}

export interface InvestigationRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string; // e.g. 'FUNDS_TRANSFERRED', 'MEETING_ATTENDEE', 'CALL_LOG', 'DIRECTOR_OF', 'SHARED_IP', 'CONTRABAND_ROUTE'
  label: string;
  confidenceScore: number; // 0 - 100
  weight: number; // 1 - 10
  verificationStatus: VerificationStatus;
  firstObserved: string;
  lastObserved: string;
  transactionAmount?: string;
  evidenceIds: string[];
  sourceProvenance: string;
  notes?: string;
  isFlaggedAnomaly?: boolean;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  title: string;
  date: string;
  year: number;
  category: 'FINANCIAL' | 'MEETING' | 'COMMUNICATION' | 'LOGISTICS' | 'ENFORCEMENT' | 'CYBER';
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  entityIds: string[];
  documentIds: string[];
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  sourceProvenance: string;
}

export interface GeoPoint {
  id: string;
  name: string;
  type: 'SAFEHOUSE' | 'PORT' | 'SHELL_HQ' | 'TRANSIT_HUB' | 'INCIDENT_SITE' | 'MEETING_POINT';
  caseId: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  entityIds: string[];
  associatedEvents: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  leadInvestigator: string;
  assignedUnit: string;
  tags: string[];
  createdDate: string;
  lastUpdated: string;
  entityIds: string[];
  relationshipIds: string[];
  documentIds: string[];
  anomalyIds: string[];
  timelineEventIds: string[];
  qualityCompletenessScore: number; // 0 - 100
  verificationPercentage: number; // 0 - 100
  summaryNotes: string;
  suggestedRelatedCaseIds: { caseId: string; similarityScore: number; matchRationale: string }[];
}

export interface ExplainableAiFinding {
  id: string;
  caseId: string;
  title: string;
  findingType: 'HIDDEN_BRIDGE' | 'UNUSUAL_EXPANSION' | 'CYCLIC_TRANSFER' | 'IDENTITY_DUPLICATE' | 'CROSS_CASE_LINK' | 'DATA_GAP';
  finding: string;
  whyFlagged: string;
  evidence: string[];
  confidence: number; // 0 - 100
  reviewStatus: 'NEEDS_REVIEW' | 'REVIEWED' | 'DISMISSED' | 'CONFIRMED';
  affectedEntityIds: string[];
  affectedRelationshipIds?: string[];
  suggestedAction: string;
  timestamp: string;
}

export interface DocumentRecord {
  id: string;
  caseId: string;
  title: string;
  documentType: 'FIR' | 'BANK_STATEMENT' | 'CUSTOMS_MANIFEST' | 'SURVEILLANCE_LOG' | 'INTERCEPT_TRANSCRIPT' | 'REGISTRY_EXTRACT';
  source: string;
  uploadDate: string;
  verificationStatus: VerificationStatus;
  rawTextPreview: string;
  ocrConfidence: number;
  extractedEntities: {
    name: string;
    type: EntityType;
    confidence: number;
    matchedEntityId?: string;
  }[];
  extractedRelationships: {
    source: string;
    target: string;
    relation: string;
    confidence: number;
  }[];
  extractedDates: string[];
  extractedLocations: string[];
  fileSize: string;
  sha256Checksum: string;
  qualityScore: number;
}

export interface EntityMatchCandidate {
  id: string;
  primaryEntity: {
    id: string;
    name: string;
    type: EntityType;
    role: string;
    phone?: string;
    taxIdOrAadhaar?: string;
    orgAffiliation?: string;
  };
  candidateEntity: {
    id: string;
    name: string;
    type: EntityType;
    role: string;
    phone?: string;
    taxIdOrAadhaar?: string;
    orgAffiliation?: string;
  };
  matchScore: number; // 0 - 100
  nameSimilarity: number;
  orgSimilarity: number;
  timelineOverlap: number;
  metadataSimilarity: number;
  matchReasons: string[];
  status: 'PENDING_HUMAN_REVIEW' | 'ACCEPTED_MERGED' | 'REJECTED_SEPARATE' | 'DEFERRED';
}

export interface DuplicateRecordPair {
  id: string;
  recordA: {
    id: string;
    title: string;
    source: string;
    date: string;
    entitiesCount: number;
    summary: string;
  };
  recordB: {
    id: string;
    title: string;
    source: string;
    date: string;
    entitiesCount: number;
    summary: string;
  };
  similarityScore: number; // 0 - 100
  overlappingAttributes: string[];
  status: 'PENDING_REVIEW' | 'MERGED' | 'KEPT_SEPARATE' | 'DISMISSED';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: UserRole;
  action: string;
  category: 'ENTITY_RESOLUTION' | 'RECORD_MERGE' | 'CASE_BRIEF' | 'CASE_MODIFICATION' | 'REDACTION_TOGGLE' | 'EVIDENCE_ACCESS' | 'REPORT_EXPORT' | 'SECURITY';
  caseNumber?: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FLAGGED' | 'AUTHENTICATED';
}

export interface CollaborationTask {
  id: string;
  caseId: string;
  title: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
  notesCount: number;
}

export interface CaseDNAMetrics {
  peopleCount: number;
  orgCount: number;
  eventCount: number;
  locationCount: number;
  documentCount: number;
  digitalEntitiesCount: number;
  relatedCasesCount: number;
  timelineSpanYears: number;
  verificationPercentage: number;
  recordCompletenessPercentage: number;
  riskIndex: number;
}

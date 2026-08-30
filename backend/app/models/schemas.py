from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime

class NodeType(str, Enum):
    PERSON = "Person"
    ORGANIZATION = "Organization"
    LOCATION = "Location"
    PHONE = "Phone"
    BANK_ACCOUNT = "BankAccount"
    VEHICLE = "Vehicle"
    DIGITAL_ID = "DigitalID"
    INCIDENT = "Incident"

class EdgeType(str, Enum):
    CALLED = "called"
    TRANSACTED_WITH = "transacted_with"
    CO_ACCUSED = "co_accused"
    MEMBER_OF = "member_of"
    FAMILY_OF = "family_of"
    MET_AT = "met_at"
    ASSOCIATED_WITH = "associated_with"
    OWNS_DEVICE = "owns_device"
    OPERATES_ACCOUNT = "operates_account"
    DRIVES_VEHICLE = "drives_vehicle"
    INVOLVED_IN = "involved_in"

class RiskLevel(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class UserRole(str, Enum):
    INVESTIGATOR = "Investigator"
    ANALYST = "Analyst"
    ADMIN = "Admin"

class User(BaseModel):
    id: str
    username: str
    full_name: str
    email: str
    role: UserRole
    badge_number: str
    agency: str = "Central Intelligence & Law Enforcement Agency"
    created_at: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

# Graph Models
class Node(BaseModel):
    id: str
    label: str
    type: NodeType
    risk_level: RiskLevel = RiskLevel.MEDIUM
    properties: Dict[str, Any] = Field(default_factory=dict)
    case_ids: List[str] = Field(default_factory=list)
    centrality_score: Optional[float] = 0.0
    community_id: Optional[int] = 0
    discovered_date: Optional[str] = None
    milestone_note: Optional[str] = None

class Edge(BaseModel):
    id: str
    source: str
    target: str
    type: EdgeType
    weight: float = 1.0
    properties: Dict[str, Any] = Field(default_factory=dict)
    timestamp: Optional[str] = None
    discovered_date: Optional[str] = None
    milestone_note: Optional[str] = None
    evidence_ref: Optional[str] = None
    case_id: Optional[str] = None

class GraphData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    stats: Optional[Dict[str, Any]] = None

# Case Model
class Case(BaseModel):
    id: str
    fir_number: str
    title: str
    description: str
    status: str = "Active" # Active, Under Investigation, Chargesheet Filed, Closed
    lead_investigator: str
    agency: str = "MHA Special Cell / NCB"
    state: str = "Delhi"
    police_station: str = "Special Cell PS Lodhi Colony"
    date_filed: str = "2024-01-15"
    case_type: str = "Financial Fraud & Hawala"
    created_at: str
    ipc_sections: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    node_count: int = 0
    edge_count: int = 0

class CaseCreate(BaseModel):
    fir_number: str
    title: str
    description: str
    lead_investigator: str
    state: Optional[str] = "Delhi"
    police_station: Optional[str] = "Special Cell PS Lodhi Colony"
    case_type: Optional[str] = "Organized Crime"
    ipc_sections: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)

# Cross-Case Intelligence Linker Models
class CaseSummaryRef(BaseModel):
    case_id: str
    fir_number: str
    title: str
    state: str
    police_station: str
    agency: str
    lead_investigator: str

class CrossCaseLink(BaseModel):
    link_id: str
    entity_id: str
    entity_label: str
    entity_type: NodeType
    risk_level: RiskLevel
    match_type: str # "CONFIRMED_EXACT" or "POSSIBLE_FUZZY"
    confidence_score: float # 0.0 - 1.0 (1.0 for exact, 0.80+ for fuzzy)
    cases_involved: List[CaseSummaryRef]
    states_involved: List[str]
    police_stations_involved: List[str]
    investigative_insight: str
    shared_properties: Dict[str, Any] = Field(default_factory=dict)

class CaseOverlapResult(BaseModel):
    case_1: CaseSummaryRef
    case_2: CaseSummaryRef
    shared_nodes: List[Node]
    shared_node_ids: List[str]
    merged_graph: GraphData
    overlap_count: int
    inter_state_summary: str

class CrossCaseAlert(BaseModel):
    alert_id: str
    timestamp: str
    severity: RiskLevel
    title: str
    description: str
    entity_id: str
    entity_label: str
    entity_type: NodeType
    cases: List[str]
    states: List[str]
    is_read: bool = False

# Blockchain & Evidence Integrity Ledger Models
class LedgerBlock(BaseModel):
    block_id: int
    timestamp: str
    investigator_id: str
    investigator_name: str
    action_type: str # "CREATE", "UPDATE", "DELETE", "INGEST", "INTERCEPT", "QUERY"
    entity_id: str
    case_id: Optional[str] = None
    data_snapshot_hash: str # SHA-256 of the record JSON
    data_snapshot: Dict[str, Any]
    previous_block_hash: str
    current_block_hash: str
    signature: str # Simulated Ed25519 signature
    is_verified: bool = True
    l2_anchored: bool = False
    l2_tx_hash: Optional[str] = None

class IntegrityReport(BaseModel):
    is_valid: bool
    total_blocks_checked: int
    verified_at: str
    genesis_hash: str
    terminal_hash: str
    merkle_root: str
    tampered_block_id: Optional[int] = None
    tampered_block_index: Optional[int] = None
    tampered_field: Optional[str] = None
    status_message: str
    message: Optional[str] = None
    l2_checkpoint_tx: Optional[str] = None

class L2Checkpoint(BaseModel):
    checkpoint_id: str
    timestamp: str
    network: str = "Polygon PoS / Ethereum L2"
    contract_address: str = "0x892a0194827F38E22b5129849281a8b192839912"
    merkle_root: str
    tx_hash: str
    block_range: str
    status: str = "CONFIRMED_ON_CHAIN"

class BlockchainBlock(BaseModel):
    index: int
    timestamp: str
    action: str
    investigator: str
    case_id: Optional[str] = None
    details_hash: str
    data_payload: Dict[str, Any]
    previous_hash: str
    block_hash: str
    signature: str

class BlockchainVerificationResult(BaseModel):
    is_valid: bool
    total_blocks: int
    verified_at: str
    genesis_hash: str
    latest_hash: str
    tampered_block_index: Optional[int] = None
    message: str

# Analytics Models
class CentralityLeaderboard(BaseModel):
    metric: str
    rankings: List[Dict[str, Any]]

class CommunityCluster(BaseModel):
    community_id: int
    name: str
    dominant_type: str
    member_count: int
    members: List[Node]
    high_risk_count: int
    cohesion_score: float

class ShortestPathResult(BaseModel):
    found: bool
    source_id: str
    target_id: str
    path_length: int
    path_nodes: List[Node]
    path_edges: List[Edge]
    explanation: List[str]

class PredictedLink(BaseModel):
    source_id: str
    source_label: str
    source_type: str
    target_id: str
    target_label: str
    target_type: str
    predicted_type: str
    confidence_score: float
    common_neighbors: List[str]
    rationale: str

class NetworkAnomaly(BaseModel):
    anomaly_type: str # "COMMUNICATION_SPIKE", "CUT_VERTEX_BROKER", "LAUNDERING_CYCLE", "BURNER_CLUSTER"
    severity: RiskLevel
    title: str
    description: str
    involved_nodes: List[str]
    involved_edges: List[str]
    metrics: Dict[str, Any]

# Explainable AI (XAI) Models
class RiskDriver(BaseModel):
    category: str # "CENTRALITY_HIERARCHY", "ASSOCIATIONAL_THREAT", "BEHAVIORAL_ANOMALY", "SYNDICATE_AFFILIATION"
    title: str
    description: str
    severity: RiskLevel
    metric_value: Optional[str] = None
    icon: Optional[str] = "alert"

class EvidenceItem(BaseModel):
    evidence_id: str
    type: str # "WIRETAP_CDR", "BANKING_STR", "SURVEILLANCE_CCTV", "CORPORATE_FILING", "SEIZURE_MEMO"
    description: str
    source_ref: str
    timestamp: Optional[str] = None

class CentralityStat(BaseModel):
    metric: str
    score: float
    percentile_rank: float
    interpretation: str

class NodeExplanation(BaseModel):
    node_id: str
    node_label: str
    node_type: NodeType
    risk_level: RiskLevel
    confidence_score: int # 0 - 100%
    investigative_briefing: str
    risk_drivers: List[RiskDriver]
    top_connections: List[Dict[str, Any]]
    centrality_stats: List[CentralityStat]
    anomalies_flagged: List[str]
    community_info: Dict[str, Any]
    evidence_trail: List[EvidenceItem]
    is_traceable: bool = True
    compliance_note: str = "100% deterministically verifiable from empirical graph evidence. Section 65B Indian Evidence Act compliant."

# Ingestion & NLP Models
class NLPAutoExtractionRequest(BaseModel):
    text: str
    case_id: Optional[str] = "CASE-HAWALA-2024"
    source_type: str = "FIR" # FIR, Chat_Log, Interrogation_Report, CDR_Transcript

class ExtractedEntity(BaseModel):
    id: str
    text: str
    label: str
    type: NodeType
    risk_level: RiskLevel
    properties: Dict[str, Any] = Field(default_factory=dict)

class ExtractedRelationship(BaseModel):
    source_text: str
    target_text: str
    type: EdgeType
    confidence: float
    evidence_snippet: str
    weight: float = 1.0

class NLPAutoExtractionResponse(BaseModel):
    case_id: str
    source_type: str
    extracted_entities: List[ExtractedEntity]
    extracted_relationships: List[ExtractedRelationship]
    summary: str
    total_entities_found: int
    total_relationships_found: int

class ManualNodeCreate(BaseModel):
    label: str
    type: NodeType
    risk_level: RiskLevel = RiskLevel.MEDIUM
    properties: Dict[str, Any] = Field(default_factory=dict)
    case_id: str

class ManualEdgeCreate(BaseModel):
    source: str
    target: str
    type: EdgeType
    weight: float = 1.0
    properties: Dict[str, Any] = Field(default_factory=dict)
    timestamp: Optional[str] = None
    evidence_ref: Optional[str] = None
    case_id: str

class NaturalLanguageQueryRequest(BaseModel):
    query: str
    case_id: Optional[str] = None

class NaturalLanguageQueryResponse(BaseModel):
    interpretation: str
    cypher_equivalent: str
    matching_nodes: List[Node]
    matching_edges: List[Edge]
    insights: List[str]

# Investigation Timeline Scrubber Models
class TimelineMilestone(BaseModel):
    date: str
    title: str
    description: str
    entity_id: Optional[str] = None
    node_label: Optional[str] = None
    significance: Optional[str] = "Key Investigation Breakthrough"

class TimelineStep(BaseModel):
    step_index: int
    date: str
    event_type: str # "NODE_DISCOVERED" | "RELATION_ESTABLISHED" | "MILESTONE_UNLOCKED"
    item_id: str
    label: str
    details: str
    milestone: Optional[TimelineMilestone] = None
    total_nodes_so_far: int
    total_edges_so_far: int

class TimelineResponse(BaseModel):
    case_id: str
    fir_number: str
    case_title: str
    start_date: str
    end_date: str
    total_nodes: int
    total_edges: int
    milestones: List[TimelineMilestone]
    steps: List[TimelineStep]
    nodes: List[Node]
    edges: List[Edge]

# Case Handover Briefing Models
class HandoverTargetInfo(BaseModel):
    id: str
    label: str
    type: str
    risk_level: str
    role: str
    status: str
    centrality_score: float
    centrality_rank: int
    key_risk_drivers: List[str]
    critical_connections: List[str]

class HandoverOpenLead(BaseModel):
    priority: str # "IMMEDIATE_48_HOURS" | "HIGH_PRIORITY_7_DAYS" | "STRATEGIC_14_DAYS"
    title: str
    description: str
    target_entity: Optional[str] = None
    target_entity_id: Optional[str] = None
    recommended_action: str
    statutory_provision: Optional[str] = None

class HandoverCrossCaseAlert(BaseModel):
    linked_case_id: str
    linked_case_fir: str
    linked_agency: str
    linked_state: str
    shared_entity_label: str
    shared_entity_type: str
    intelligence_note: str

class CaseHandoverBriefing(BaseModel):
    case_id: str
    fir_number: str
    case_title: str
    case_type: str
    police_station: str
    agency: str
    state: str
    date_filed: str
    handover_date: str
    outgoing_investigator: str
    outgoing_badge: str
    incoming_investigator: str
    executive_summary: str
    ipc_sections: List[str]
    total_nodes: int
    total_edges: int
    top_targets: List[HandoverTargetInfo]
    network_structure_summary: str
    syndicate_hubs: List[str]
    financial_layering_anomalies: List[str]
    blockchain_audit_status: str
    total_evidence_blocks: int
    merkle_root: str
    is_chain_verified: bool
    cross_case_alerts: List[HandoverCrossCaseAlert]
    open_leads: List[HandoverOpenLead]
    recommended_next_steps: List[str]
    statutory_handover_declaration: str
    html_dossier: Optional[str] = None


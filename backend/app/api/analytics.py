from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from app.models.schemas import (
    CentralityLeaderboard, CommunityCluster, ShortestPathResult,
    PredictedLink, NetworkAnomaly, NaturalLanguageQueryRequest,
    NaturalLanguageQueryResponse, NodeExplanation, User
)
from app.core.security import get_current_user
from app.services.graph_engine import graph_engine
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/analytics", tags=["AI & Graph Analytics Engine"])

@router.get("/centrality", response_model=CentralityLeaderboard)
def get_centrality_rankings(
    metric: str = Query("pagerank", description="Centrality metric: pagerank, betweenness, degree, closeness"),
    case_id: Optional[str] = Query(None, description="Optional case ID")
):
    return graph_engine.calculate_centrality(case_id=case_id, metric=metric)

@router.get("/communities", response_model=List[CommunityCluster])
def get_community_clusters(case_id: Optional[str] = Query(None, description="Optional case ID")):
    return graph_engine.detect_communities(case_id=case_id)

@router.get("/shortest-path", response_model=ShortestPathResult)
def find_shortest_path(
    source_id: Optional[str] = Query(None, description="Source node ID"),
    target_id: Optional[str] = Query(None, description="Target node ID"),
    source: Optional[str] = Query(None, description="Source node ID alias"),
    target: Optional[str] = Query(None, description="Target node ID alias")
):
    src = source_id or source
    tgt = target_id or target
    if not src or not tgt:
        raise HTTPException(status_code=422, detail="Both source and target node IDs are required")
    return graph_engine.find_shortest_path(source_id=src, target_id=tgt)

@router.get("/link-prediction", response_model=List[PredictedLink])
@router.get("/predicted-links", response_model=List[PredictedLink])
def get_predicted_links(
    case_id: Optional[str] = Query(None, description="Optional case ID"),
    top_k: int = Query(8, description="Number of predictions to return")
):
    return graph_engine.predict_links(case_id=case_id, top_k=top_k)

@router.get("/anomalies", response_model=List[NetworkAnomaly])
def detect_network_anomalies(case_id: Optional[str] = Query(None, description="Optional case ID")):
    return graph_engine.detect_anomalies(case_id=case_id)

@router.get("/explain/{node_id}", response_model=NodeExplanation)
@router.get("/xai-explanation/{node_id}", response_model=NodeExplanation)
def explain_node_risk(
    node_id: str,
    case_id: Optional[str] = Query(None, description="Optional case ID")
):
    """
    Explainable AI (XAI) Endpoint:
    Generates human-readable, evidence-traceable explanation of why an entity is flagged as suspicious.
    """
    try:
        from app.services.explainability_engine import explainability_engine
        return explainability_engine.generate_explanation(node_id=node_id, case_id=case_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/nl-query", response_model=NaturalLanguageQueryResponse)
def execute_natural_language_query(
    req: NaturalLanguageQueryRequest,
    current_user: User = Depends(get_current_user)
):
    result = graph_engine.natural_language_query(query=req.query, case_id=req.case_id)
    
    # Audit log to Blockchain
    blockchain_service.add_block(
        action="NL_INTELLIGENCE_QUERY",
        investigator=f"{current_user.full_name} ({current_user.badge_number})",
        case_id=req.case_id,
        data_payload={"raw_query": req.query, "matched_nodes_count": len(result.matching_nodes)}
    )

    return result

@router.get("/mo-pattern/{person_id}")
def get_suspect_mo_pattern(person_id: str):
    """
    Serial Offender Pattern Detector:
    Aggregates behavioral signatures across cases, computes explainable similarity scores
    against unsolved cold cases, and generates investigative leads.
    """
    from app.services.mo_service import serial_pattern_detector
    return serial_pattern_detector.aggregate_person_mo(person_id=person_id)

@router.get("/mo-clusters")
def get_mo_clusters(case_type: Optional[str] = Query(None, description="Optional case type filter")):
    """
    Returns global behavioral MO clusters across all cases to spot unrecognized serial offender rings.
    """
    from app.services.mo_service import serial_pattern_detector
    return serial_pattern_detector.get_mo_clusters(case_type=case_type)

@router.get("/repeat-offense/{suspect_id}")
def get_repeat_offense_report(suspect_id: str):
    """
    Victim Safety Network:
    Finds all cases where this suspect has an associated victim, detects escalation velocity,
    calculates Recidivism Risk Score, and recommends protective measures under Sec 398 BNSS 2023.
    """
    from app.services.victim_safety_service import victim_safety_service
    return victim_safety_service.get_suspect_repeat_offense_report(suspect_id=suspect_id)

@router.get("/victim-safety-overview")
def get_victim_safety_overview():
    """
    Returns system-wide overview of all flagged repeat offenders with multiple distinct victims.
    """
    from app.services.victim_safety_service import victim_safety_service
    return victim_safety_service.get_victim_safety_overview()

@router.get("/geo-clusters")
def get_geo_crime_clusters(
    radius_km: float = Query(15.0, description="Spatial clustering radius threshold in km"),
    crime_category: Optional[str] = Query(None, description="Optional crime type filter"),
    case_id: Optional[str] = Query(None, description="Optional case filter"),
    risk_level: Optional[str] = Query(None, description="Optional risk level filter")
):
    """
    Geo Intelligence Map:
    Returns all mapped crime scene and infrastructure locations across India,
    with proximity-based spatial clustering to highlight geographic hotspots and gang operational territories.
    """
    from app.services.geo_service import geo_service
    return geo_service.get_geo_clusters(
        radius_km=radius_km,
        crime_category=crime_category,
        case_id=case_id,
        risk_level=risk_level
    )




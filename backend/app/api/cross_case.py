from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from app.models.schemas import CrossCaseLink, CaseOverlapResult, CrossCaseAlert, User
from app.core.security import get_current_user
from app.services.cross_case_linker import cross_case_linker
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/cross-case", tags=["Cross-Case Intelligence Linker"])

@router.get("/links", response_model=List[CrossCaseLink])
def get_cross_case_links(
    state: Optional[str] = Query(None, description="Filter by state (e.g. Delhi, Punjab, Maharashtra)"),
    entity_type: Optional[str] = Query(None, description="Filter by entity type (Phone, BankAccount, Person, Vehicle)")
):
    """
    Returns all exact and fuzzy cross-case entity links detected across multiple FIRs and jurisdictions.
    """
    all_links = cross_case_linker.find_cross_case_matches()
    
    filtered = all_links
    if state:
        filtered = [l for l in filtered if any(state.lower() in s.lower() for s in l.states_involved)]
    if entity_type:
        filtered = [l for l in filtered if l.entity_type.value.lower() == entity_type.lower()]
        
    return filtered

@router.get("/overlap", response_model=CaseOverlapResult)
def get_case_overlap(
    case_1: Optional[str] = Query(None, description="First Case ID"),
    case_2: Optional[str] = Query(None, description="Second Case ID"),
    case1: Optional[str] = Query(None, description="First Case ID alias"),
    case2: Optional[str] = Query(None, description="Second Case ID alias")
):
    """
    Fuses two case networks into a single multi-jurisdictional graph, highlighting shared bridge nodes.
    """
    c1 = case_1 or case1
    c2 = case_2 or case2
    if not c1 or not c2:
        raise HTTPException(status_code=422, detail="Both case1 and case2 IDs are required")
    try:
        return cross_case_linker.get_case_network_overlap(c1, c2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts", response_model=List[CrossCaseAlert])
def get_cross_case_alerts():
    """
    Returns high-priority inter-jurisdictional alerts generated when entities cross state/case boundaries.
    """
    return cross_case_linker.generate_inter_state_alerts()

@router.post("/scan")
def trigger_cross_case_scan(current_user: User = Depends(get_current_user)):
    """
    Manually triggers a full knowledge-graph cross-case scan and commits an audit event to the blockchain.
    """
    links = cross_case_linker.find_cross_case_matches()
    alerts = cross_case_linker.generate_inter_state_alerts()

    # Log to Blockchain
    blockchain_service.add_block(
        action="CROSS_CASE_INTELLIGENCE_SCAN",
        investigator=f"{current_user.full_name} ({current_user.badge_number})",
        case_id="MHA-MULTI-JURISDICTION",
        data_payload={
            "total_cross_case_links": len(links),
            "exact_matches": sum(1 for l in links if l.match_type == "CONFIRMED_EXACT"),
            "fuzzy_matches": sum(1 for l in links if l.match_type == "POSSIBLE_FUZZY"),
            "alerts_generated": len(alerts)
        }
    )

    return {
        "status": "SCAN_COMPLETE",
        "total_links_found": len(links),
        "alerts_generated": len(alerts),
        "message": f"Discovered {len(links)} cross-case links across multiple state jurisdictions."
    }

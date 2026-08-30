from fastapi import APIRouter, HTTPException, Depends, Query, Body
from fastapi.responses import HTMLResponse
from typing import List, Optional
from datetime import datetime
from app.models.schemas import Case, CaseCreate, User, CaseHandoverBriefing
from app.core.security import get_current_user
from app.services.seed_data import DEMO_CASES
from app.services.blockchain_service import blockchain_service
from app.services.handover_service import handover_service

router = APIRouter(prefix="/cases", tags=["Case Management & FIRs"])

@router.get("", response_model=List[Case])
def list_cases():
    return DEMO_CASES

@router.get("/priority-queue")
def get_cases_priority_queue():
    """
    Automated Case Priority Scoring & Triage Queue:
    Ranks all cases by operational urgency based on crime severity, cross-case syndicate links,
    victim vulnerability, evidence strength, and time recency.
    """
    from app.services.priority_service import case_priority_service
    return case_priority_service.get_priority_queue()

@router.get("/{case_id}", response_model=Case)
def get_case(case_id: str):
    case = next((c for c in DEMO_CASES if c.id == case_id), None)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.post("", response_model=Case)
def create_case(case_in: CaseCreate, current_user: User = Depends(get_current_user)):
    case_id = f"CASE-{len(DEMO_CASES)+1:03d}-{datetime.now().year}"
    new_case = Case(
        id=case_id,
        fir_number=case_in.fir_number,
        title=case_in.title,
        description=case_in.description,
        status="Active Investigation",
        lead_investigator=case_in.lead_investigator or current_user.full_name,
        agency=current_user.agency,
        created_at=datetime.now().isoformat() + "Z",
        ipc_sections=case_in.ipc_sections,
        tags=case_in.tags,
        node_count=0,
        edge_count=0
    )
    DEMO_CASES.append(new_case)

    # Log to Blockchain
    blockchain_service.add_block(
        action="NEW_CASE_REGISTERED",
        investigator=f"{current_user.full_name} ({current_user.badge_number})",
        case_id=case_id,
        data_payload={"fir_number": new_case.fir_number, "title": new_case.title, "sections": new_case.ipc_sections}
    )

    return new_case

@router.post("/{case_id}/generate-handover", response_model=CaseHandoverBriefing)
def generate_case_handover(
    case_id: str,
    incoming_officer: Optional[str] = Body(None, embed=True, description="Name and designation of incoming IO")
):
    """
    Generates a comprehensive, AI-assisted Case Handover Briefing for an Investigating Officer (IO)
    transfer, preserving institutional memory and synthesizing evidence, targets, and open leads.
    """
    return handover_service.generate_handover(case_id=case_id, incoming_officer=incoming_officer)

@router.get("/{case_id}/handover", response_model=CaseHandoverBriefing)
def get_case_handover(
    case_id: str,
    incoming_officer: Optional[str] = Query(None, description="Incoming IO designation")
):
    """
    Retrieves the generated Case Handover Briefing JSON for the specified case.
    """
    return handover_service.generate_handover(case_id=case_id, incoming_officer=incoming_officer)

@router.get("/{case_id}/handover/html", response_class=HTMLResponse)
def get_case_handover_html(
    case_id: str,
    incoming_officer: Optional[str] = Query(None, description="Incoming IO designation")
):
    """
    Renders an official government printable HTML Case Handover Document with signature blocks and seals.
    """
    briefing = handover_service.generate_handover(case_id=case_id, incoming_officer=incoming_officer)
    return HTMLResponse(content=briefing.html_dossier)

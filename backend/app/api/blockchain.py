from fastapi import APIRouter, HTTPException, Query, Body, Depends
from typing import List, Dict, Any, Optional
from app.models.schemas import LedgerBlock, IntegrityReport, L2Checkpoint, User
from app.core.security import get_current_user
from app.services.blockchain_ledger import blockchain_ledger
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/blockchain", tags=["Blockchain Evidence Ledger & Chain of Custody"])

@router.get("/ledger", response_model=List[Dict[str, Any]])
def get_blockchain_ledger(
    case_id: Optional[str] = Query(None, description="Filter by Case ID"),
    entity_id: Optional[str] = Query(None, description="Filter by Entity ID"),
    action_type: Optional[str] = Query(None, description="Filter by Action Type (CREATE, UPDATE, DELETE, INGEST, INTERCEPT)")
):
    """
    Returns the complete append-only cryptographic hash-chain ledger.
    """
    return blockchain_ledger.get_ledger(case_id=case_id, entity_id=entity_id, action_type=action_type)

@router.get("/verify-chain", response_model=IntegrityReport)
def verify_blockchain_integrity():
    """
    Performs real-time cryptographic audit across all blocks in the ledger,
    recalculating all SHA-256 digests and pointer continuity.
    """
    return blockchain_ledger.verify_chain_integrity()

@router.post("/tamper-demo")
def simulate_database_tampering(
    block_id: int = Body(..., embed=True),
    malicious_data: Dict[str, Any] = Body(default={"unauthorized_edit": "Record Modified Outside CrimeNet Application", "tampered_amount": "₹ 999 Crore"}, embed=True)
):
    """
    Hackathon Live Demonstration Tool:
    Alters a block's underlying data snapshot directly in the database to showcase instant cryptographic tamper detection.
    """
    try:
        return blockchain_ledger.simulate_database_tamper(block_id=block_id, malicious_data=malicious_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/restore")
def restore_blockchain_consensus():
    """
    Restores the blockchain ledger to verified consensus state.
    """
    return blockchain_ledger.restore_ledger()

@router.post("/l2-anchor", response_model=L2Checkpoint)
def anchor_checkpoint_to_l2(current_user: User = Depends(get_current_user)):
    """
    Anchors the current ledger Merkle root to Polygon Layer-2 for external proof of immutability.
    """
    return blockchain_ledger.anchor_checkpoint_to_l2()

@router.get("/entity-history/{entity_id}", response_model=List[Dict[str, Any]])
def get_entity_chain_of_custody(entity_id: str):
    """
    Returns the complete chronological audit trail and hash chain for a specific criminal entity.
    """
    return blockchain_ledger.get_entity_chain_of_custody(entity_id)

@router.get("/certificate/{case_id}")
def get_custody_certificate(case_id: str):
    """
    Generates Section 65B Electronic Evidence Integrity Certificate for legal filing.
    """
    return blockchain_service.get_custody_certificate(case_id=case_id)

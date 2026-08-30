from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from app.models.schemas import (
    NLPAutoExtractionRequest, NLPAutoExtractionResponse,
    Node, Edge, User
)
from app.core.security import get_current_user
from app.services.nlp_extractor import nlp_extractor
from app.services.graph_engine import graph_engine
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/ingest", tags=["Data Ingestion & NLP Studio"])

@router.post("/nlp-extract", response_model=NLPAutoExtractionResponse)
def auto_extract_from_text(
    req: NLPAutoExtractionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Parses unstructured text (FIR narrative, chat log, CDR notes) and extracts entities and relationships with confidence.
    """
    return nlp_extractor.extract_from_text(
        text=req.text,
        case_id=req.case_id or "CASE-HAWALA-2024",
        source_type=req.source_type
    )

@router.post("/nlp-commit")
@router.post("/commit-extraction")
def commit_extracted_data(
    extraction_result: NLPAutoExtractionResponse,
    current_user: User = Depends(get_current_user)
):
    """
    Commits approved NLP extracted entities and edges directly into the criminal knowledge graph and appends to blockchain ledger.
    """
    added_nodes = 0
    added_edges = 0

    # 1. Add Entities
    for ent in extraction_result.extracted_entities:
        node = Node(
            id=ent.id,
            label=ent.label,
            type=ent.type,
            risk_level=ent.risk_level,
            properties=ent.properties,
            case_ids=[extraction_result.case_id]
        )
        graph_engine.add_node(node)
        added_nodes += 1

    # 2. Add Relationships
    for idx, rel in enumerate(extraction_result.extracted_relationships):
        # Match source and target entity IDs
        src_id = next((e.id for e in extraction_result.extracted_entities if e.text == rel.source_text), None)
        tgt_id = next((e.id for e in extraction_result.extracted_entities if e.text == rel.target_text), None)
        
        if src_id and tgt_id and src_id != tgt_id:
            edge = Edge(
                id=f"EDG_NLP_{len(graph_engine.edges_dict)+1:04d}_{idx}",
                source=src_id,
                target=tgt_id,
                type=rel.type,
                weight=rel.weight,
                properties={"confidence": rel.confidence, "evidence_snippet": rel.evidence_snippet},
                timestamp=None,
                evidence_ref=f"NLP Extracted ({extraction_result.source_type})",
                case_id=extraction_result.case_id
            )
            graph_engine.add_edge(edge)
            added_edges += 1

    # Log to Sovereign Blockchain Ledger
    from app.services.blockchain_ledger import blockchain_ledger
    blockchain_ledger.add_block(
        action_type="INGEST_NLP",
        entity_id=f"NLP_BATCH_{extraction_result.case_id}",
        data_snapshot={
            "source_type": extraction_result.source_type,
            "entities_committed": added_nodes,
            "relationships_committed": added_edges,
            "summary": extraction_result.summary
        },
        investigator_id=current_user.id,
        investigator_name=f"{current_user.full_name} ({current_user.badge_number})",
        case_id=extraction_result.case_id
    )

    # Log to Blockchain Service for legacy compatibility
    blockchain_service.add_block(
        action=f"NLP_INGESTION_COMMIT_{extraction_result.source_type.upper()}",
        investigator=f"{current_user.full_name} ({current_user.badge_number})",
        case_id=extraction_result.case_id,
        data_payload={
            "source_type": extraction_result.source_type,
            "entities_committed": added_nodes,
            "relationships_committed": added_edges,
            "summary": extraction_result.summary
        }
    )

    return {
        "status": "SUCCESS",
        "message": f"Successfully ingested {added_nodes} entities and {added_edges} relationships into knowledge graph.",
        "case_id": extraction_result.case_id,
        "nodes_added": added_nodes,
        "edges_added": added_edges
    }


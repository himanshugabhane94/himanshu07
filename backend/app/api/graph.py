from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional, Dict, Any
from app.models.schemas import GraphData, Node, Edge, ManualNodeCreate, ManualEdgeCreate, User, TimelineResponse
from app.core.security import get_current_user
from app.services.graph_engine import graph_engine
from app.services.blockchain_service import blockchain_service

router = APIRouter(prefix="/graph", tags=["Knowledge Graph Engine"])

@router.get("/timeline", response_model=TimelineResponse)
def get_investigation_timeline(
    case_id: Optional[str] = Query(None, description="Case ID to generate chronological evolution timeline for")
):
    """
    Returns the chronological evolution timeline of the criminal network investigation,
    including staggered entity discovery dates, relation establishment sequence,
    and key investigative breakthrough milestones.
    """
    return graph_engine.get_timeline_data(case_id=case_id)

@router.get("", response_model=GraphData)
def get_graph(
    case_id: Optional[str] = Query(None, description="Filter by case ID"),
    node_types: Optional[List[str]] = Query(None, description="Filter by node types"),
    min_risk: Optional[str] = Query(None, description="Minimum risk level: Low, Medium, High, Critical"),
    start_date: Optional[str] = Query(None, description="Start date ISO string"),
    end_date: Optional[str] = Query(None, description="End date ISO string")
):
    return graph_engine.get_graph_data(
        case_id=case_id,
        node_types=node_types,
        min_risk=min_risk,
        start_date=start_date,
        end_date=end_date
    )

@router.get("/node/{node_id}")
def get_node_dossier(node_id: str):
    if node_id not in graph_engine.nodes_dict:
        raise HTTPException(status_code=404, detail="Node not found")
    
    node = graph_engine.nodes_dict[node_id]
    # Find all connected edges
    connected_edges = [
        e for e in graph_engine.edges_dict.values()
        if e.source == node_id or e.target == node_id
    ]
    
    # Find neighbor nodes
    neighbor_ids = set()
    for e in connected_edges:
        neighbor_ids.add(e.source if e.source != node_id else e.target)
    
    neighbor_nodes = [graph_engine.nodes_dict[nid] for nid in neighbor_ids if nid in graph_engine.nodes_dict]

    return {
        "node": node,
        "connected_edges": connected_edges,
        "neighbors": neighbor_nodes,
        "degree": len(connected_edges),
        "in_degree": sum(1 for e in connected_edges if e.target == node_id),
        "out_degree": sum(1 for e in connected_edges if e.source == node_id)
    }

@router.get("/node/{node_id}/expand")
def expand_node_neighborhood(node_id: str, depth: int = 1):
    if node_id not in graph_engine.nodes_dict:
        raise HTTPException(status_code=404, detail="Node not found")
    
    G = graph_engine.get_simple_undirected_graph()
    expanded_ids = set([node_id])
    
    current_level = set([node_id])
    for _ in range(min(depth, 3)):
        next_level = set()
        for nid in current_level:
            for neighbor in G.neighbors(nid):
                next_level.add(neighbor)
        expanded_ids.update(next_level)
        current_level = next_level

    nodes = [graph_engine.nodes_dict[nid] for nid in expanded_ids if nid in graph_engine.nodes_dict]
    edges = [e for e in graph_engine.edges_dict.values() if e.source in expanded_ids and e.target in expanded_ids]

    return {
        "nodes": nodes,
        "edges": edges,
        "root_node_id": node_id,
        "total_nodes": len(nodes),
        "total_edges": len(edges)
    }

@router.post("/node", response_model=Node)
def create_node(node_in: ManualNodeCreate, current_user: User = Depends(get_current_user)):
    node_id = f"{node_in.type.value[:3].upper()}_{node_in.label.replace(' ', '_').upper()}"
    new_node = Node(
        id=node_id,
        label=node_in.label,
        type=node_in.type,
        risk_level=node_in.risk_level,
        properties=node_in.properties,
        case_ids=[node_in.case_id]
    )
    graph_engine.add_node(new_node)

    # Log to Blockchain
    blockchain_service.add_block(
        action="MANUAL_ENTITY_INSERTION",
        investigator=f"{current_user.full_name} ({current_user.badge_number})",
        case_id=node_in.case_id,
        data_payload={"node_id": node_id, "label": new_node.label, "type": new_node.type.value, "risk": new_node.risk_level.value}
    )

    return new_node

@router.post("/edge", response_model=Edge)
def create_edge(edge_in: ManualEdgeCreate, current_user: User = Depends(get_current_user)):
    edge_id = f"EDG_MANUAL_{len(graph_engine.edges_dict)+1:04d}"
    new_edge = Edge(
        id=edge_id,
        source=edge_in.source,
        target=edge_in.target,
        type=edge_in.type,
        weight=edge_in.weight,
        properties=edge_in.properties,
        timestamp=edge_in.timestamp,
        evidence_ref=edge_in.evidence_ref,
        case_id=edge_in.case_id
    )
    graph_engine.add_edge(new_edge)

    # Log to Blockchain
    blockchain_service.add_block(
        action="MANUAL_RELATIONSHIP_LINK",
        investigator=f"{current_user.full_name} ({current_user.badge_number})",
        case_id=edge_in.case_id,
        data_payload={"edge_id": edge_id, "source": edge_in.source, "target": edge_in.target, "type": edge_in.type.value}
    )

    return new_edge

import os
import json
import logging
from typing import List, Dict, Any, Optional
from neo4j import GraphDatabase, Driver, Session
from app.config import settings
from app.models.schemas import Node, Edge, NodeType, EdgeType, RiskLevel

logger = logging.getLogger("sutra.neo4j")

class Neo4jAuraService:
    """
    Enterprise Neo4j AuraDB Cloud Integration Service for SUTRA.
    Manages secure TLS connection (neo4j+s://), Cypher schema constraints,
    batch ingestion, and graph synchronization.
    """
    def __init__(self):
        self.driver: Optional[Driver] = None
        self._initialize_driver()

    def _initialize_driver(self):
        uri = settings.NEO4J_URI
        user = settings.NEO4J_USER
        password = settings.NEO4J_PASSWORD

        if not uri or not password or "localhost" in uri and not settings.USE_NEO4J:
            logger.info("[Neo4j AuraDB] No cloud URI/password configured. Defaulting to in-memory GraphEngine.")
            return

        try:
            self.driver = GraphDatabase.driver(
                uri,
                auth=(user, password),
                max_connection_lifetime=30 * 60,
                max_connection_pool_size=50,
                connection_acquisition_timeout=15.0
            )
            logger.info(f"[Neo4j AuraDB] Driver configured for URI: {uri}")
        except Exception as e:
            logger.warning(f"[Neo4j AuraDB] Failed to initialize driver: {e}")
            self.driver = None

    def verify_connectivity(self) -> Dict[str, Any]:
        """Tests the connection to the Neo4j AuraDB cloud instance."""
        if not self.driver:
            self._initialize_driver()
        if not self.driver:
            return {"status": "DISCONNECTED", "error": "Neo4j driver is not initialized or credentials missing."}

        try:
            with self.driver.session() as session:
                result = session.run("RETURN 1 AS connected, datetime() AS server_time")
                record = result.single()
                return {
                    "status": "CONNECTED",
                    "uri": settings.NEO4J_URI,
                    "user": settings.NEO4J_USER,
                    "connected": record["connected"] == 1,
                    "server_time": str(record["server_time"])
                }
        except Exception as e:
            return {"status": "ERROR", "error": str(e), "uri": settings.NEO4J_URI}

    def close(self):
        if self.driver:
            self.driver.close()
            self.driver = None

    def create_constraints_and_indexes(self, session: Session):
        """Creates unique constraints and search indexes for optimal query speed."""
        try:
            session.run("""
                CREATE CONSTRAINT unique_entity_id IF NOT EXISTS
                FOR (e:Entity) REQUIRE e.id IS UNIQUE
            """)
            session.run("""
                CREATE INDEX entity_case_idx IF NOT EXISTS
                FOR (e:Entity) ON (e.case_id)
            """)
            session.run("""
                CREATE INDEX entity_risk_idx IF NOT EXISTS
                FOR (e:Entity) ON (e.risk_level)
            """)
        except Exception as e:
            logger.warning(f"[Neo4j AuraDB] Index/Constraint creation notice: {e}")

    def seed_graph_data(self, nodes: List[Node], edges: List[Edge], clear_existing: bool = True) -> Dict[str, Any]:
        """
        Seeds all nodes and relationships into Neo4j AuraDB using optimized Cypher batch transactions.
        """
        if not self.driver:
            self._initialize_driver()
        if not self.driver:
            raise RuntimeError(
                f"Cannot seed to Neo4j AuraDB: Driver is not initialized. Please verify NEO4J_URI and NEO4J_PASSWORD in .env."
            )

        with self.driver.session() as session:
            if clear_existing:
                logger.info("[Neo4j AuraDB] Clearing existing demo nodes and relationships...")
                session.run("MATCH (n) DETACH DELETE n")

            self.create_constraints_and_indexes(session)

            # 1. Batch Insert Nodes
            node_payloads = []
            for n in nodes:
                primary_label = n.type.value.capitalize().replace("_", "") if hasattr(n.type, 'value') else str(n.type)
                node_payloads.append({
                    "id": n.id,
                    "label": n.label,
                    "type": n.type.value if hasattr(n.type, 'value') else str(n.type),
                    "primary_label": primary_label,
                    "risk_level": n.risk_level.value if hasattr(n.risk_level, 'value') else str(n.risk_level),
                    "case_ids": n.case_ids,
                    "discovered_date": n.discovered_date or "2024-01-10T10:00:00Z",
                    "milestone_note": n.milestone_note or "",
                    "properties": json.dumps(n.properties or {})
                })

            cypher_nodes = """
            UNWIND $batch AS item
            MERGE (e:Entity {id: item.id})
            SET e.label = item.label,
                e.type = item.type,
                e.risk_level = item.risk_level,
                e.case_ids = item.case_ids,
                e.discovered_date = item.discovered_date,
                e.milestone_note = item.milestone_note,
                e.properties_json = item.properties
            WITH e, item
            CALL apoc.create.addLabels(e, [item.primary_label]) YIELD node
            RETURN count(node)
            """

            # Fallback Cypher without APOC (pure Cypher for AuraDB Free Tier)
            cypher_nodes_pure = """
            UNWIND $batch AS item
            MERGE (e:Entity {id: item.id})
            SET e.label = item.label,
                e.type = item.type,
                e.risk_level = item.risk_level,
                e.case_ids = item.case_ids,
                e.discovered_date = item.discovered_date,
                e.milestone_note = item.milestone_note,
                e.properties_json = item.properties
            """
            session.run(cypher_nodes_pure, batch=node_payloads)
            logger.info(f"[Neo4j AuraDB] Successfully ingested {len(node_payloads)} nodes.")

            # 2. Batch Insert Relationships
            edge_payloads = []
            for e in edges:
                rel_type = e.type.value.upper().replace(" ", "_") if hasattr(e.type, 'value') else str(e.type).upper()
                edge_payloads.append({
                    "id": e.id,
                    "source": e.source,
                    "target": e.target,
                    "type": rel_type,
                    "weight": float(e.weight),
                    "timestamp": e.timestamp or "2024-01-15T12:00:00Z",
                    "evidence_ref": e.evidence_ref or "",
                    "case_id": e.case_id or "CASE-HAWALA-2024",
                    "properties": json.dumps(e.properties or {})
                })

            cypher_edges = """
            UNWIND $batch AS rel
            MATCH (s:Entity {id: rel.source})
            MATCH (t:Entity {id: rel.target})
            MERGE (s)-[r:CONNECTED_TO {id: rel.id}]->(t)
            SET r.relationship_type = rel.type,
                r.weight = rel.weight,
                r.timestamp = rel.timestamp,
                r.evidence_ref = rel.evidence_ref,
                r.case_id = rel.case_id,
                r.properties_json = rel.properties
            """
            session.run(cypher_edges, batch=edge_payloads)
            logger.info(f"[Neo4j AuraDB] Successfully ingested {len(edge_payloads)} relationships.")

            # Verify count
            count_result = session.run("MATCH (n:Entity) RETURN count(n) AS node_count, size([(n)-[r]->() | r]) AS edge_count")
            record = count_result.single()
            node_count = record["node_count"] if record else len(nodes)

            return {
                "status": "SUCCESS",
                "nodes_ingested": len(nodes),
                "edges_ingested": len(edges),
                "auradb_node_count": node_count,
                "uri": settings.NEO4J_URI
            }

    def fetch_all_nodes_and_edges(self) -> Dict[str, Any]:
        """Fetches the full graph topology from Neo4j AuraDB."""
        if not self.driver:
            return {"nodes": [], "edges": []}

        with self.driver.session() as session:
            result = session.run("""
                MATCH (n:Entity)
                OPTIONAL MATCH (n)-[r]->(m:Entity)
                RETURN n, r, m
            """)
            nodes_map = {}
            edges_list = []

            for record in result:
                n = record["n"]
                if n and n["id"] not in nodes_map:
                    props = json.loads(n.get("properties_json", "{}")) if n.get("properties_json") else {}
                    nodes_map[n["id"]] = {
                        "id": n["id"],
                        "label": n.get("label", n["id"]),
                        "type": n.get("type", "Entity"),
                        "risk_level": n.get("risk_level", "Medium"),
                        "case_ids": n.get("case_ids", []),
                        "discovered_date": n.get("discovered_date"),
                        "milestone_note": n.get("milestone_note"),
                        "properties": props
                    }
                r = record["r"]
                m = record["m"]
                if r and m:
                    rel_props = json.loads(r.get("properties_json", "{}")) if r.get("properties_json") else {}
                    edges_list.append({
                        "id": r.get("id", f"{n['id']}->{m['id']}"),
                        "source": n["id"],
                        "target": m["id"],
                        "type": r.get("relationship_type", "CONNECTED_TO"),
                        "weight": float(r.get("weight", 1.0)),
                        "timestamp": r.get("timestamp"),
                        "evidence_ref": r.get("evidence_ref"),
                        "case_id": r.get("case_id"),
                        "properties": rel_props
                    })

            return {"nodes": list(nodes_map.values()), "edges": edges_list}

neo4j_service = Neo4jAuraService()

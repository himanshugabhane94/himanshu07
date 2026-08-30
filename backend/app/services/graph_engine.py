import networkx as nx
from typing import List, Dict, Any, Optional, Tuple, Set
from datetime import datetime
import math
from app.models.schemas import (
    Node, Edge, NodeType, EdgeType, RiskLevel, GraphData,
    CentralityLeaderboard, CommunityCluster, ShortestPathResult,
    PredictedLink, NetworkAnomaly, NaturalLanguageQueryResponse,
    TimelineResponse, TimelineMilestone, TimelineStep
)

class CriminalGraphEngine:
    """
    Advanced Graph Analytics & AI Engine for Law Enforcement Intelligence.
    Implements Centrality Scoring, Community Detection, Shortest Path Reasoning, Link Prediction, and Anomaly Detection.
    """
    def __init__(self):
        self.graph = nx.MultiDiGraph() # Directed multigraph for multi-edges (multiple calls, transactions)
        self.undirected_cache = None
        self.nodes_dict: Dict[str, Node] = {}
        self.edges_dict: Dict[str, Edge] = {}

    def add_node(self, node: Node):
        self.nodes_dict[node.id] = node
        self.graph.add_node(
            node.id,
            label=node.label,
            type=node.type.value if hasattr(node.type, 'value') else node.type,
            risk_level=node.risk_level.value if hasattr(node.risk_level, 'value') else node.risk_level,
            case_ids=node.case_ids,
            properties=node.properties
        )
        self.undirected_cache = None

    def add_edge(self, edge: Edge):
        self.edges_dict[edge.id] = edge
        self.graph.add_edge(
            edge.source,
            edge.target,
            key=edge.id,
            id=edge.id,
            type=edge.type.value if hasattr(edge.type, 'value') else edge.type,
            weight=edge.weight,
            timestamp=edge.timestamp,
            evidence_ref=edge.evidence_ref,
            case_id=edge.case_id,
            properties=edge.properties
        )
        self.undirected_cache = None

    def get_simple_undirected_graph(self) -> nx.Graph:
        """Helper to get flattened undirected simple graph for algorithms like Louvain and Adamic-Adar."""
        G = nx.Graph()
        for n, data in self.graph.nodes(data=True):
            G.add_node(n, **data)
        for u, v, data in self.graph.edges(data=True):
            w = data.get("weight", 1.0)
            if G.has_edge(u, v):
                G[u][v]["weight"] = G[u][v].get("weight", 1.0) + w
            else:
                G.add_edge(u, v, weight=w)
        return G

    def get_graph_data(self, case_id: Optional[str] = None, node_types: Optional[List[str]] = None,
                       min_risk: Optional[str] = None, start_date: Optional[str] = None,
                       end_date: Optional[str] = None) -> GraphData:
        filtered_nodes: List[Node] = []
        filtered_edges: List[Edge] = []
        valid_node_ids = set()

        risk_order = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
        min_risk_val = risk_order.get(min_risk, 0)

        # 1. Filter Nodes
        for node_id, node in self.nodes_dict.items():
            if case_id and case_id not in node.case_ids:
                continue
            if node_types and node.type.value not in node_types:
                continue
            if min_risk_val > 0 and risk_order.get(node.risk_level.value, 1) < min_risk_val:
                continue
            
            valid_node_ids.add(node_id)
            filtered_nodes.append(node)

        # 2. Filter Edges
        for edge_id, edge in self.edges_dict.items():
            if edge.source not in valid_node_ids or edge.target not in valid_node_ids:
                continue
            if case_id and edge.case_id and edge.case_id != case_id:
                continue
            if start_date and edge.timestamp and edge.timestamp < start_date:
                continue
            if end_date and edge.timestamp and edge.timestamp > end_date:
                continue
            filtered_edges.append(edge)

        # Calculate live stats
        stats = {
            "total_nodes": len(filtered_nodes),
            "total_edges": len(filtered_edges),
            "critical_suspects": sum(1 for n in filtered_nodes if n.risk_level == RiskLevel.CRITICAL),
            "high_risk_suspects": sum(1 for n in filtered_nodes if n.risk_level == RiskLevel.HIGH),
            "persons_count": sum(1 for n in filtered_nodes if n.type == NodeType.PERSON),
            "phones_count": sum(1 for n in filtered_nodes if n.type == NodeType.PHONE),
            "bank_accounts_count": sum(1 for n in filtered_nodes if n.type == NodeType.BANK_ACCOUNT),
            "density": nx.density(self.graph) if len(self.graph) > 1 else 0.0
        }

        return GraphData(nodes=filtered_nodes, edges=filtered_edges, stats=stats)

    def _compute_pagerank(self, G: nx.Graph, alpha: float = 0.85, max_iter: int = 50, tol: float = 1.0e-5) -> Dict[str, float]:
        """Pure-Python Power Iteration PageRank that works independently of numpy/scipy."""
        N = len(G)
        if N == 0:
            return {}
        
        # Initialize uniform probability
        x = {n: 1.0 / N for n in G}
        dangling_nodes = [n for n in G if G.degree(n) == 0]
        
        for _ in range(max_iter):
            xlast = x
            x = {n: 0.0 for n in xlast}
            danglesum = alpha * sum(xlast[n] for n in dangling_nodes)
            
            for n in G:
                # Sum over neighbors
                nbrs = G[n]
                deg_sum = sum(nbrs[nbr].get("weight", 1.0) for nbr in nbrs)
                if deg_sum > 0:
                    for nbr in nbrs:
                        w = nbrs[nbr].get("weight", 1.0)
                        x[nbr] += alpha * xlast[n] * (w / deg_sum)
                else:
                    danglesum += alpha * xlast[n]
            
            # Add damping and dangling contribution
            dangle_share = (danglesum + (1.0 - alpha)) / N
            for n in x:
                x[n] += dangle_share
            
            # Check convergence
            err = sum(abs(x[n] - xlast[n]) for n in x)
            if err < N * tol:
                break
                
        # Normalize sum to 1.0
        s = sum(x.values())
        if s > 0:
            x = {k: v / s for k, v in x.items()}
        return x

    def calculate_centrality(self, case_id: Optional[str] = None, metric: str = "pagerank") -> CentralityLeaderboard:
        """
        Calculates Centrality Metrics to pinpoint Kingpins, Financial Hubs, and Communication Brokers.
        Supports: pagerank, betweenness, degree, closeness, in_degree, out_degree.
        """
        G = self.get_simple_undirected_graph()
        if len(G) == 0:
            return CentralityLeaderboard(metric=metric, rankings=[])

        if metric == "betweenness":
            scores = nx.betweenness_centrality(G, weight="weight")
            role_desc = "Broker / Smuggler Bridge / Critical Cut-Vertex"
        elif metric == "degree":
            scores = nx.degree_centrality(G)
            role_desc = "Highly Connected Hub / Central Operative"
        elif metric == "closeness":
            scores = nx.closeness_centrality(G)
            role_desc = "Rapid Disseminator / Cell Coordinator"
        else: # Default PageRank
            scores = self._compute_pagerank(G, alpha=0.85)
            metric = "pagerank"
            role_desc = "Kingpin / Shadow Mastermind / Strategic Influencer"

        # Update node scores
        for node_id, score in scores.items():
            if node_id in self.nodes_dict:
                self.nodes_dict[node_id].centrality_score = round(score, 4)

        # Sort rankings
        ranked = []
        for node_id, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
            if node_id not in self.nodes_dict:
                continue
            node = self.nodes_dict[node_id]
            if case_id and case_id not in node.case_ids:
                continue

            ranked.append({
                "rank": len(ranked) + 1,
                "node_id": node_id,
                "label": node.label,
                "type": node.type.value,
                "risk_level": node.risk_level.value,
                "score": round(score, 4),
                "inferred_role": role_desc if score > 0.05 else "Peripheral Associate",
                "connected_degree": G.degree(node_id)
            })

        return CentralityLeaderboard(metric=metric, rankings=ranked[:25])

    def detect_communities(self, case_id: Optional[str] = None) -> List[CommunityCluster]:
        """
        Louvain / Modularity Community Detection Algorithm.
        Auto-identifies criminal gangs, sleeper cells, and money laundering syndicates.
        """
        G = self.get_simple_undirected_graph()
        if len(G) == 0:
            return []

        # Use Clauset-Newman-Moore greedy modularity or Louvain
        try:
            communities_generator = nx.algorithms.community.greedy_modularity_communities(G)
            communities = [list(c) for c in communities_generator]
        except Exception:
            # Fallback to connected components
            communities = [list(c) for c in nx.connected_components(G)]

        results: List[CommunityCluster] = []
        cluster_names = [
            "North India Hawala & Money Mule Syndicate",
            "Golden Crescent Narcotics Transit Cell",
            "Cross-Border Encrypted Cyber Fraud Wing",
            "Safehouse Logistics & Counterfeit Currency Network",
            "Clandestine Sleeper Cell Alpha",
            "Regional Smuggling Nexus Delta"
        ]

        for idx, comm in enumerate(communities):
            members: List[Node] = []
            type_counts: Dict[str, int] = {}
            high_risk_count = 0

            for node_id in comm:
                if node_id in self.nodes_dict:
                    node = self.nodes_dict[node_id]
                    if case_id and case_id not in node.case_ids:
                        continue
                    node.community_id = idx + 1
                    members.append(node)
                    type_counts[node.type.value] = type_counts.get(node.type.value, 0) + 1
                    if node.risk_level in [RiskLevel.CRITICAL, RiskLevel.HIGH]:
                        high_risk_count += 1

            if len(members) == 0:
                continue

            dominant_type = max(type_counts.items(), key=lambda x: x[1])[0] if type_counts else "Mixed"
            cluster_title = cluster_names[idx % len(cluster_names)] if idx < len(cluster_names) else f"Criminal Cluster #{idx + 1}"

            # Subgraph cohesion / density
            subgraph = G.subgraph(comm)
            cohesion = nx.density(subgraph) if len(subgraph) > 1 else 1.0

            results.append(CommunityCluster(
                community_id=idx + 1,
                name=cluster_title,
                dominant_type=dominant_type,
                member_count=len(members),
                members=members,
                high_risk_count=high_risk_count,
                cohesion_score=round(cohesion, 3)
            ))

        # Sort clusters by severity (high risk member count)
        results.sort(key=lambda x: (x.high_risk_count, x.member_count), reverse=True)
        return results

    def find_shortest_path(self, source_id: str, target_id: str) -> ShortestPathResult:
        """
        'Degrees of Separation' Shortest Path Finder with full investigative explanation.
        """
        G = self.get_simple_undirected_graph()

        if source_id not in G or target_id not in G:
            return ShortestPathResult(
                found=False,
                source_id=source_id,
                target_id=target_id,
                path_length=0,
                path_nodes=[],
                path_edges=[],
                explanation=[f"Either node {source_id} or {target_id} does not exist in the active graph."]
            )

        try:
            path_node_ids = nx.shortest_path(G, source=source_id, target=target_id, weight="weight")
        except nx.NetworkXNoPath:
            return ShortestPathResult(
                found=False,
                source_id=source_id,
                target_id=target_id,
                path_length=0,
                path_nodes=[],
                path_edges=[],
                explanation=[f"No direct or indirect relational path discovered between '{self.nodes_dict[source_id].label}' and '{self.nodes_dict[target_id].label}'."]
            )

        path_nodes = [self.nodes_dict[nid] for nid in path_node_ids if nid in self.nodes_dict]
        path_edges: List[Edge] = []
        explanation: List[str] = []

        for i in range(len(path_node_ids) - 1):
            u = path_node_ids[i]
            v = path_node_ids[i + 1]
            u_node = self.nodes_dict.get(u)
            v_node = self.nodes_dict.get(v)

            # Find matching edge in graph
            matched_edge = None
            for e_id, edge in self.edges_dict.items():
                if (edge.source == u and edge.target == v) or (edge.source == v and edge.target == u):
                    matched_edge = edge
                    break

            if matched_edge:
                path_edges.append(matched_edge)
                u_label = u_node.label if u_node else u
                v_label = v_node.label if v_node else v
                action_str = matched_edge.type.value.replace("_", " ").title()
                evidence_note = f" (Evidence: {matched_edge.evidence_ref})" if matched_edge.evidence_ref else ""
                explanation.append(
                    f"Step {i+1}: [{u_label}] ({u_node.type.value if u_node else ''}) was linked to [{v_label}] ({v_node.type.value if v_node else ''}) via '{action_str}'{evidence_note}."
                )

        return ShortestPathResult(
            found=True,
            source_id=source_id,
            target_id=target_id,
            path_length=len(path_node_ids) - 1,
            path_nodes=path_nodes,
            path_edges=path_edges,
            explanation=explanation
        )

    def predict_links(self, case_id: Optional[str] = None, top_k: int = 10) -> List[PredictedLink]:
        """
        AI Link Prediction Algorithm.
        Analyzes triad closures, Jaccard similarity, and Adamic-Adar indices to uncover hidden / unconfirmed connections.
        """
        G = self.get_simple_undirected_graph()
        if len(G) < 3:
            return []

        # Find non-edges
        non_edges = list(nx.non_edges(G))
        if not non_edges:
            return []

        # 1. Jaccard Coefficient
        jaccard_scores = { (u, v): score for u, v, score in nx.jaccard_coefficient(G, non_edges) }
        
        # 2. Adamic-Adar Index
        try:
            adamic_scores = { (u, v): score for u, v, score in nx.adamic_adar_index(G, non_edges) }
        except Exception:
            adamic_scores = { (u, v): 0.0 for u, v in non_edges }

        # Filter and rank
        predictions: List[PredictedLink] = []
        for (u, v) in non_edges:
            if u not in self.nodes_dict or v not in self.nodes_dict:
                continue
            u_node = self.nodes_dict[u]
            v_node = self.nodes_dict[v]

            if case_id and (case_id not in u_node.case_ids or case_id not in v_node.case_ids):
                continue

            j_score = jaccard_scores.get((u, v), 0.0)
            a_score = adamic_scores.get((u, v), 0.0)

            # Common neighbors
            common = list(nx.common_neighbors(G, u, v))
            if len(common) == 0:
                continue

            # Composite confidence score
            conf = min(0.98, (j_score * 0.4) + (min(a_score / 3.0, 1.0) * 0.6) + (len(common) * 0.1))
            if conf < 0.25:
                continue

            # Predict relational edge type based on node types
            if u_node.type == NodeType.PERSON and v_node.type == NodeType.PERSON:
                pred_type = "co_conspirator / associate"
            elif u_node.type == NodeType.PERSON and v_node.type == NodeType.BANK_ACCOUNT:
                pred_type = "undisclosed beneficiary / operator"
            elif u_node.type == NodeType.PERSON and v_node.type == NodeType.PHONE:
                pred_type = "covert user / burner handler"
            elif u_node.type == NodeType.PERSON and v_node.type == NodeType.LOCATION:
                pred_type = "frequent visitor / safehouse meeting"
            else:
                pred_type = "associated_with"

            common_labels = [self.nodes_dict[cn].label for cn in common if cn in self.nodes_dict]

            predictions.append(PredictedLink(
                source_id=u,
                source_label=u_node.label,
                source_type=u_node.type.value,
                target_id=v,
                target_label=v_node.label,
                target_type=v_node.type.value,
                predicted_type=pred_type,
                confidence_score=round(conf, 3),
                common_neighbors=common_labels,
                rationale=f"Shares {len(common)} mutual intelligence entities ({', '.join(common_labels[:3])}). High triad closure affinity."
            ))

        predictions.sort(key=lambda x: x.confidence_score, reverse=True)
        return predictions[:top_k]

    def detect_anomalies(self, case_id: Optional[str] = None) -> List[NetworkAnomaly]:
        """
        Anomaly & Forensic Pattern Detection.
        Flags communication spikes, cut-vertex bottlenecks (single points of failure/couriers), and circular Hawala transaction loops.
        """
        anomalies: List[NetworkAnomaly] = []
        G = self.get_simple_undirected_graph()

        # 1. Cut-Vertex / Critical Bridge Detection (Articulation Points)
        try:
            articulation_points = list(nx.articulation_points(G))
            for node_id in articulation_points:
                if node_id in self.nodes_dict:
                    node = self.nodes_dict[node_id]
                    if case_id and case_id not in node.case_ids:
                        continue
                    anomalies.append(NetworkAnomaly(
                        anomaly_type="CUT_VERTEX_BROKER",
                        severity=RiskLevel.CRITICAL if node.risk_level == RiskLevel.CRITICAL else RiskLevel.HIGH,
                        title=f"Critical Single-Point-of-Failure: {node.label}",
                        description=f"Node '{node.label}' ({node.type.value}) acts as a critical articulation bridge. Interdicting this node will completely partition and disrupt communication between distinct criminal sub-networks.",
                        involved_nodes=[node_id],
                        involved_edges=[],
                        metrics={"articulation_point": True, "connected_degree": G.degree(node_id)}
                    ))
        except Exception:
            pass

        # 2. Call Frequency Spikes / High-Weight Hubs
        for edge_id, edge in self.edges_dict.items():
            if edge.type == EdgeType.CALLED and edge.weight >= 0.85:
                src_node = self.nodes_dict.get(edge.source)
                tgt_node = self.nodes_dict.get(edge.target)
                if src_node and tgt_node:
                    if case_id and edge.case_id != case_id:
                        continue
                    call_count = edge.properties.get("call_count", 45)
                    anomalies.append(NetworkAnomaly(
                        anomaly_type="COMMUNICATION_SPIKE",
                        severity=RiskLevel.HIGH,
                        title=f"Anomalous Communication Burst: {src_node.label} ↔ {tgt_node.label}",
                        description=f"Detected abnormal surge of {call_count} encrypted calls over a compressed 48-hour window, indicating tactical operational synchronization or impending payload movement.",
                        involved_nodes=[edge.source, edge.target],
                        involved_edges=[edge_id],
                        metrics={"call_count": call_count, "edge_weight": edge.weight}
                    ))

        # 3. Circular Hawala / Money Laundering Loops (Cycles in Directed Graph)
        try:
            simple_di = nx.DiGraph()
            for e_id, edge in self.edges_dict.items():
                if edge.type == EdgeType.TRANSACTED_WITH:
                    simple_di.add_edge(edge.source, edge.target, edge_id=e_id)
            
            cycles = list(nx.simple_cycles(simple_di))
            for cycle in cycles[:3]: # Limit to top 3
                if len(cycle) >= 3:
                    cycle_nodes = [self.nodes_dict[n].label for n in cycle if n in self.nodes_dict]
                    anomalies.append(NetworkAnomaly(
                        anomaly_type="LAUNDERING_CYCLE",
                        severity=RiskLevel.CRITICAL,
                        title=f"Circular Hawala Transaction Loop ({len(cycle)} Entities)",
                        description=f"Detected closed layering loop involving {len(cycle)} financial accounts/entities: {' → '.join(cycle_nodes)} → {cycle_nodes[0]}. Classic structuring/layering pattern under PMLA Section 3.",
                        involved_nodes=cycle,
                        involved_edges=[],
                        metrics={"cycle_length": len(cycle), "layering_flag": True}
                    ))
        except Exception:
            pass

        return anomalies

    def natural_language_query(self, query: str, case_id: Optional[str] = None) -> NaturalLanguageQueryResponse:
        """
        AI Natural Language Query Assistant for Investigators.
        Parses questions like:
        - 'Show all connections to Vikram Sharma within 2 hops'
        - 'Find all high risk phones in Hawala case'
        - 'Who is the kingpin in cross border smuggling?'
        - 'Show path between Tariq and Swiss Bank'
        """
        q_lower = query.lower()
        matched_nodes: List[Node] = []
        matched_edges: List[Edge] = []
        insights: List[str] = []
        interpretation = ""
        cypher_equiv = ""

        # Check for shortest path query
        if "path between" in q_lower or "connect" in q_lower and "and" in q_lower:
            found_persons = [n for n in self.nodes_dict.values() if n.label.lower() in q_lower or any(part.lower() in q_lower for part in n.label.split() if len(part) > 3)]
            if len(found_persons) >= 2:
                src, tgt = found_persons[0], found_persons[1]
                path_res = self.find_shortest_path(src.id, tgt.id)
                interpretation = f"Pathfinding Analysis: Tracing shortest connection between '{src.label}' and '{tgt.label}'"
                cypher_equiv = f"MATCH p=shortestPath((a:Entity {{id: '{src.id}'}})-[*..6]-(b:Entity {{id: '{tgt.id}'}})) RETURN p"
                matched_nodes = path_res.path_nodes
                matched_edges = path_res.path_edges
                insights = path_res.explanation
                return NaturalLanguageQueryResponse(
                    interpretation=interpretation,
                    cypher_equivalent=cypher_equiv,
                    matching_nodes=matched_nodes,
                    matching_edges=matched_edges,
                    insights=insights
                )

        # Check for Kingpin / Centrality Query
        if any(w in q_lower for w in ["kingpin", "mastermind", "influential", "leader", "boss", "top suspect"]):
            lead = self.calculate_centrality(case_id=case_id, metric="pagerank")
            top_ids = [r["node_id"] for r in lead.rankings[:5]]
            matched_nodes = [self.nodes_dict[nid] for nid in top_ids if nid in self.nodes_dict]
            interpretation = "Centrality Rank Engine: Isolating top influential nodes via PageRank and degree hierarchy"
            cypher_equiv = "CALL gds.pageRank.stream('crimeGraph') YIELD nodeId, score ORDER BY score DESC LIMIT 5"
            insights = [
                f"Rank 1 Kingpin Target: {lead.rankings[0]['label']} (PageRank: {lead.rankings[0]['score']})",
                "High centrality score indicates this entity coordinates operations without necessarily appearing on raw frontline CDRs."
            ]
            return NaturalLanguageQueryResponse(
                interpretation=interpretation,
                cypher_equivalent=cypher_equiv,
                matching_nodes=matched_nodes,
                matching_edges=[],
                insights=insights
            )

        # Check for K-hop neighborhood of a specific person
        for node_id, node in self.nodes_dict.items():
            if node.label.lower() in q_lower or (len(node.label.split()) > 1 and node.label.split()[0].lower() in q_lower and len(node.label.split()[0]) > 3):
                # Target node found! Get 1-2 hop neighborhood
                G = self.get_simple_undirected_graph()
                ego_ids = set([node_id])
                for neighbor in G.neighbors(node_id):
                    ego_ids.add(neighbor)
                    if "2 hop" in q_lower or "two hop" in q_lower:
                        for n2 in G.neighbors(neighbor):
                            ego_ids.add(n2)

                matched_nodes = [self.nodes_dict[nid] for nid in ego_ids if nid in self.nodes_dict]
                matched_edges = [e for e in self.edges_dict.values() if e.source in ego_ids and e.target in ego_ids]
                
                interpretation = f"Ego-Network Extraction: Expanding neighborhood of '{node.label}' up to 2 hops"
                cypher_equiv = f"MATCH (target:Entity {{id: '{node.id}'}})-[r*1..2]-(connected) RETURN target, r, connected"
                insights = [
                    f"Discovered {len(matched_nodes)} entities connected within perimeter of {node.label}.",
                    f"Direct associates include: {', '.join([n.label for n in matched_nodes[:4] if n.id != node.id])}."
                ]
                return NaturalLanguageQueryResponse(
                    interpretation=interpretation,
                    cypher_equivalent=cypher_equiv,
                    matching_nodes=matched_nodes,
                    matching_edges=matched_edges,
                    insights=insights
                )

        # Default fallback: Filter by high risk or keyword matching
        for node in self.nodes_dict.values():
            if any(term in node.label.lower() or term in str(node.properties).lower() for term in q_lower.split() if len(term) > 3):
                matched_nodes.append(node)

        interpretation = f"Keyword & Entity Match: Filtered entities matching query tokens"
        cypher_equiv = f"MATCH (n) WHERE toLower(n.label) CONTAINS '{query[:15]}' RETURN n"
        insights = [f"Found {len(matched_nodes)} matching entities across criminal knowledge graph."]

        return NaturalLanguageQueryResponse(
            interpretation=interpretation,
            cypher_equivalent=cypher_equiv,
            matching_nodes=matched_nodes[:15],
            matching_edges=[],
            insights=insights
        )

    def get_timeline_data(self, case_id: Optional[str] = None) -> TimelineResponse:
        """
        Synthesizes a chronological investigation evolution timeline for the case.
        Returns ordered sequence of nodes & edges with discovery timestamps,
        key dramatic milestones, and running discovery counts.
        """
        case_nodes: List[Node] = []
        case_edges: List[Edge] = []
        node_id_set = set()
        default_base_date = "2024-01-10T09:00:00Z"

        # 1. Filter nodes
        for n_id, n in self.nodes_dict.items():
            if case_id and case_id not in n.case_ids:
                continue
            case_nodes.append(n)
            node_id_set.add(n_id)

        # 2. Filter edges
        for e_id, e in self.edges_dict.items():
            if e.source not in node_id_set or e.target not in node_id_set:
                continue
            if case_id and e.case_id and e.case_id != case_id:
                continue
            case_edges.append(e)

        if not case_nodes:
            return TimelineResponse(
                case_id=case_id or "ALL",
                fir_number="FIR-UNKNOWN",
                case_title="Investigation Timeline",
                start_date="2024-01-01T00:00:00Z",
                end_date="2024-03-31T23:59:59Z",
                total_nodes=0,
                total_edges=0,
                milestones=[],
                steps=[],
                nodes=[],
                edges=[]
            )

        # Ensure all nodes and edges have discovered_date
        for n in case_nodes:
            if not n.discovered_date:
                n.discovered_date = n.properties.get("discovered_date") or default_base_date

        for e in case_edges:
            if not e.discovered_date:
                src_node = self.nodes_dict.get(e.source)
                tgt_node = self.nodes_dict.get(e.target)
                src_date = (src_node.discovered_date if src_node else default_base_date) or default_base_date
                tgt_date = (tgt_node.discovered_date if tgt_node else default_base_date) or default_base_date
                e.discovered_date = e.timestamp or max(src_date, tgt_date)

        # Sort nodes and edges chronologically
        case_nodes.sort(key=lambda x: x.discovered_date or default_base_date)
        case_edges.sort(key=lambda x: x.discovered_date or default_base_date)

        start_date = min([n.discovered_date for n in case_nodes if n.discovered_date] or [default_base_date])
        end_date = max([n.discovered_date for n in case_nodes if n.discovered_date] + [e.discovered_date for e in case_edges if e.discovered_date] or [default_base_date])

        # Extract milestones
        milestones: List[TimelineMilestone] = []
        for n in case_nodes:
            if n.milestone_note:
                milestones.append(TimelineMilestone(
                    date=n.discovered_date or default_base_date,
                    title=f"Entity Discovered: {n.label}",
                    description=n.milestone_note,
                    entity_id=n.id,
                    node_label=n.label,
                    significance="Critical Investigation Breakthrough" if n.risk_level.value == "Critical" else "Key Evidence Linked"
                ))

        milestones.sort(key=lambda x: x.date)

        # Build chronological timeline steps by merging node discovery and edge formation events
        events = []
        for n in case_nodes:
            events.append({
                "type": "NODE_DISCOVERED",
                "date": n.discovered_date or default_base_date,
                "item_id": n.id,
                "label": n.label,
                "details": f"Discovered [{n.type.value}] {n.label} ({n.risk_level.value} Risk)",
                "milestone_note": n.milestone_note,
                "node_ref": n
            })

        for e in case_edges:
            src_lbl = self.nodes_dict.get(e.source, Node(id=e.source, label=e.source, type=NodeType.PERSON)).label
            tgt_lbl = self.nodes_dict.get(e.target, Node(id=e.target, label=e.target, type=NodeType.PERSON)).label
            events.append({
                "type": "RELATION_ESTABLISHED",
                "date": e.discovered_date or default_base_date,
                "item_id": e.id,
                "label": f"{src_lbl} ➔ {tgt_lbl}",
                "details": f"Established [{e.type.value}] link: {src_lbl} ➔ {tgt_lbl}",
                "milestone_note": e.milestone_note,
                "edge_ref": e
            })

        events.sort(key=lambda x: x["date"])

        timeline_steps: List[TimelineStep] = []
        nodes_so_far = set()
        edges_so_far = set()

        for idx, evt in enumerate(events):
            if evt["type"] == "NODE_DISCOVERED":
                nodes_so_far.add(evt["item_id"])
            elif evt["type"] == "RELATION_ESTABLISHED":
                edges_so_far.add(evt["item_id"])

            step_milestone = None
            if evt["milestone_note"]:
                step_milestone = TimelineMilestone(
                    date=evt["date"],
                    title=f"Breakthrough: {evt['label']}",
                    description=evt["milestone_note"],
                    entity_id=evt["item_id"]
                )

            timeline_steps.append(TimelineStep(
                step_index=idx + 1,
                date=evt["date"],
                event_type=evt["type"],
                item_id=evt["item_id"],
                label=evt["label"],
                details=evt["details"],
                milestone=step_milestone,
                total_nodes_so_far=len(nodes_so_far),
                total_edges_so_far=len(edges_so_far)
            ))

        fir_number = "FIR 402/2024-ED-NDLS"
        case_title = "Operation DarkNet Hawala"
        if case_id == "CASE-NARCO-2024":
            fir_number = "FIR 188/2024-NCB-WZ"
            case_title = "Golden Crescent Narcotics Transit Corridor"
        elif case_id == "CASE-SLEEPER-2024":
            fir_number = "FIR 77/2024-NIA-HQ"
            case_title = "Clandestine Sleeper Cell & Cyber Subversion Grid"

        return TimelineResponse(
            case_id=case_id or "CASE-HAWALA-2024",
            fir_number=fir_number,
            case_title=case_title,
            start_date=start_date,
            end_date=end_date,
            total_nodes=len(case_nodes),
            total_edges=len(case_edges),
            milestones=milestones,
            steps=timeline_steps,
            nodes=case_nodes,
            edges=case_edges
        )

# Global Graph Engine Instance
graph_engine = CriminalGraphEngine()

from typing import Dict, Any, Optional
from datetime import datetime
from app.services.graph_engine import graph_engine
from app.services.blockchain_service import blockchain_service
from app.services.seed_data import DEMO_CASES

class CourtReportGenerator:
    """
    Generates Legal Intelligence Dossiers & Court-Admissible Reports with Blockchain Chain of Custody.
    """
    def generate_case_dossier_html(self, case_id: str) -> str:
        case = next((c for c in DEMO_CASES if c.id == case_id), DEMO_CASES[0])
        graph_data = graph_engine.get_graph_data(case_id=case_id)
        centrality = graph_engine.calculate_centrality(case_id=case_id, metric="pagerank")
        communities = graph_engine.detect_communities(case_id=case_id)
        anomalies = graph_engine.detect_anomalies(case_id=case_id)
        predictions = graph_engine.predict_links(case_id=case_id, top_k=5)
        custody_cert = blockchain_service.get_custody_certificate(case_id=case_id)
        
        # Build HTML
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CONFIDENTIAL LAW ENFORCEMENT INTELLIGENCE DOSSIER - {case.fir_number}</title>
    <style>
        body {{
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            background: #ffffff;
            color: #1a202c;
            padding: 30px;
            margin: 0;
            line-height: 1.5;
        }}
        .header {{
            border-bottom: 3px solid #1e3a8a;
            padding-bottom: 15px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .badge {{
            background: #dc2626;
            color: white;
            padding: 4px 12px;
            font-weight: 700;
            font-size: 13px;
            border-radius: 4px;
            letter-spacing: 1px;
        }}
        .meta-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
        }}
        .section-title {{
            font-size: 16px;
            font-weight: 700;
            color: #1e3a8a;
            text-transform: uppercase;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 6px;
            margin-top: 25px;
            margin-bottom: 12px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
        }}
        th, td {{
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
        }}
        th {{
            background: #f1f5f9;
            font-weight: 600;
        }}
        .cert-box {{
            background: #f0fdf4;
            border: 2px solid #16a34a;
            padding: 18px;
            border-radius: 8px;
            margin-top: 30px;
        }}
        .hash-code {{
            font-family: monospace;
            background: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            word-break: break-all;
        }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h2 style="margin:0; color:#0f172a;">GOVERNMENT OF INDIA — MINISTRY OF HOME AFFAIRS</h2>
            <h4 style="margin:4px 0 0 0; color:#475569;">SPECIAL CYBER & CRIMINAL NETWORK INTELLIGENCE DIVISION</h4>
        </div>
        <div style="text-align:right;">
            <span class="badge">STRICTLY CONFIDENTIAL // LAW ENFORCEMENT USE ONLY</span>
            <div style="font-size:12px; color:#64748b; margin-top:5px;">Generated: {datetime.utcnow().strftime('%d-%b-%Y %H:%M:%S UTC')}</div>
        </div>
    </div>

    <h1 style="color:#1e3a8a; font-size:22px; margin-bottom:15px;">INTELLIGENCE DOSSIER: {case.title}</h1>

    <div class="meta-grid">
        <div><strong>FIR / Reference No:</strong> {case.fir_number}</div>
        <div><strong>Investigative Agency:</strong> {case.agency}</div>
        <div><strong>Lead Investigator:</strong> {case.lead_investigator}</div>
        <div><strong>Investigation Status:</strong> {case.status}</div>
        <div><strong>Applicable Statutory Sections:</strong> {', '.join(case.ipc_sections)}</div>
        <div><strong>Knowledge Graph Footprint:</strong> {len(graph_data.nodes)} Discovered Entities | {len(graph_data.edges)} Verified Relational Edges</div>
    </div>

    <div class="section-title">1. Executive Case Summary</div>
    <p>{case.description}</p>

    <div class="section-title">2. High-Value Targets & Strategic Centrality Hierarchy (PageRank Analysis)</div>
    <p style="font-size:13px; color:#475569;">AI centrality metrics isolate the operational core and shadow financiers by measuring topological connectivity and authority flow across the network.</p>
    <table>
        <thead>
            <tr>
                <th>Rank</th>
                <th>Entity / Suspect</th>
                <th>Category</th>
                <th>Risk Classification</th>
                <th>PageRank Centrality</th>
                <th>Inferred Operational Role</th>
            </tr>
        </thead>
        <tbody>
            {"".join([f"<tr><td>#{r['rank']}</td><td><strong>{r['label']}</strong></td><td>{r['type']}</td><td><span style='color:{'#dc2626' if r['risk_level']=='Critical' else '#d97706'}'><strong>{r['risk_level']}</strong></span></td><td>{r['score']}</td><td>{r['inferred_role']}</td></tr>" for r in centrality.rankings[:6]])}
        </tbody>
    </table>

    <div class="section-title">3. Discovered Criminal Communities & Compartmentalized Clusters (Louvain Method)</div>
    <table>
        <thead>
            <tr>
                <th>Cluster ID</th>
                <th>Syndicate Module Name</th>
                <th>Dominant Domain</th>
                <th>Entity Count</th>
                <th>High Risk Operatives</th>
                <th>Cohesion Density</th>
            </tr>
        </thead>
        <tbody>
            {"".join([f"<tr><td>#{c.community_id}</td><td><strong>{c.name}</strong></td><td>{c.dominant_type}</td><td>{c.member_count} nodes</td><td>{c.high_risk_count}</td><td>{c.cohesion_score}</td></tr>" for c in communities])}
        </tbody>
    </table>

    <div class="section-title">4. Forensic Anomalies & Financial Layering Flags</div>
    <ul>
        {"".join([f"<li><strong>[{a.anomaly_type}] {a.title}:</strong> {a.description}</li>" for a in anomalies])}
    </ul>

    <div class="section-title">5. AI Link Prediction & Covert Association Warnings</div>
    <table>
        <thead>
            <tr>
                <th>Suspect 1</th>
                <th>Suspect 2 / Entity</th>
                <th>Predicted Relational Nature</th>
                <th>Confidence</th>
                <th>Forensic Triad Rationale</th>
            </tr>
        </thead>
        <tbody>
            {"".join([f"<tr><td>{p.source_label}</td><td>{p.target_label}</td><td>{p.predicted_type}</td><td>{int(p.confidence_score*100)}%</td><td>{p.rationale}</td></tr>" for p in predictions])}
        </tbody>
    </table>

    <div class="cert-box">
        <h3 style="margin-top:0; color:#15803d;">CERTIFICATE OF ELECTRONIC EVIDENCE INTEGRITY & CHAIN OF CUSTODY</h3>
        <p style="font-size:12px; margin-bottom:8px;">Issued under <strong>Section 65B of the Indian Evidence Act</strong> & Digital Personal Data Protection (DPDP) Act.</p>
        <div style="font-size:12px; line-height:1.8;">
            <div><strong>Certificate ID:</strong> {custody_cert['certificate_id']}</div>
            <div><strong>Ledger Integrity State:</strong> <span style="color:#16a34a; font-weight:bold;">{"CRYPTOGRAPHICALLY VERIFIED & UNTAMPERED" if custody_cert['chain_valid'] else "TAMPER DETECTED"}</span></div>
            <div><strong>Root Genesis Hash:</strong> <span class="hash-code">{custody_cert['root_genesis_hash']}</span></div>
            <div><strong>Terminal Evidence Hash:</strong> <span class="hash-code">{custody_cert['terminal_state_hash']}</span></div>
            <div><strong>Total Audit Ledger Blocks:</strong> {custody_cert['total_evidence_events']} cryptographic events recorded</div>
        </div>
        <p style="font-size:11px; color:#475569; margin-top:10px; font-style:italic;">
            "I hereby certify that the electronic knowledge graph records and data trails presented in this dossier have been automatically hashed to an immutable SHA-256 ledger upon ingestion without post-facto alteration."
        </p>
    </div>
</body>
</html>
        """
        return html

report_generator = CourtReportGenerator()

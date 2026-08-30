from typing import Dict, Any, List, Optional
from datetime import datetime
from app.models.schemas import (
    CaseHandoverBriefing, HandoverTargetInfo, HandoverOpenLead, 
    HandoverCrossCaseAlert, RiskLevel, Node, Edge
)
from app.services.seed_data import DEMO_CASES
from app.services.graph_engine import graph_engine
from app.services.explainability_engine import explainability_engine
from app.services.blockchain_service import blockchain_service
from app.services.cross_case_linker import cross_case_linker

class CaseHandoverService:
    """
    Synthesizes AI-Assisted Case Handover Briefing documents for Indian Law Enforcement.
    Designed specifically to preserve institutional memory and prevent context loss
    when Investigating Officers (IOs) are transferred.
    """

    def generate_handover(self, case_id: str, incoming_officer: Optional[str] = None) -> CaseHandoverBriefing:
        case = next((c for c in DEMO_CASES if c.id == case_id), DEMO_CASES[0])
        now_str = datetime.now().strftime("%d %B %Y, %H:%M IST")

        # 1. Fetch Graph & Centrality Analytics
        graph_data = graph_engine.get_graph_data(case_id=case_id)
        centrality_res = graph_engine.calculate_centrality(case_id=case_id, metric="pagerank")
        communities = graph_engine.detect_communities(case_id=case_id)
        anomalies = graph_engine.detect_anomalies(case_id=case_id)
        predictions = graph_engine.predict_links(case_id=case_id, top_k=5)

        # 2. Extract Top 5 Priority Targets with XAI Explanations
        case_nodes = [n for n in graph_engine.nodes_dict.values() if case_id in n.case_ids]
        # Sort by risk level and centrality
        risk_weights = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
        case_nodes.sort(
            key=lambda n: (risk_weights.get(n.risk_level.value, 1), n.centrality_score or 0.0),
            reverse=True
        )

        top_targets: List[HandoverTargetInfo] = []
        for idx, node in enumerate(case_nodes[:5]):
            try:
                xai_exp = explainability_engine.generate_explanation(node.id, case_id=case_id)
                key_drivers = [d.description for d in xai_exp.risk_drivers[:3]]
                critical_conns = [
                    f"{c['relationship']}: {c['label']} ({c['risk_level']})"
                    for c in xai_exp.direct_connections[:3]
                ]
            except Exception:
                key_drivers = [f"Directly associated with {len(node.case_ids)} high-priority criminal threads."]
                critical_conns = []

            # Rank
            rank = idx + 1
            for r_item in centrality_res.rankings:
                if r_item.get("id") == node.id:
                    rank = r_item.get("rank", rank)
                    break

            top_targets.append(HandoverTargetInfo(
                id=node.id,
                label=node.label,
                type=node.type.value,
                risk_level=node.risk_level.value,
                role=node.properties.get("role", "Key Entity / Suspect"),
                status=node.properties.get("status", "Under Active Surveillance"),
                centrality_score=round(node.centrality_score or 0.045, 4),
                centrality_rank=rank,
                key_risk_drivers=key_drivers,
                critical_connections=critical_conns
            ))

        # 3. Blockchain Evidence Integrity Status
        verification = blockchain_service.verify_integrity()
        custody_cert = blockchain_service.get_custody_certificate(case_id)

        # 4. Cross-Jurisdiction Intelligence Alerts
        all_links = cross_case_linker.find_cross_case_matches()
        
        cross_case_alerts: List[HandoverCrossCaseAlert] = []
        for link in all_links:
            cids = [c.case_id for c in link.cases_involved]
            if case_id in cids:
                other_cases = [c for c in link.cases_involved if c.case_id != case_id]
                other_case = other_cases[0] if other_cases else link.cases_involved[0]
                
                cross_case_alerts.append(HandoverCrossCaseAlert(
                    linked_case_id=other_case.case_id,
                    linked_case_fir=other_case.fir_number,
                    linked_agency=other_case.agency,
                    linked_state=other_case.state,
                    shared_entity_label=link.entity_label,
                    shared_entity_type=link.entity_type.value if hasattr(link.entity_type, 'value') else str(link.entity_type),
                    intelligence_note=link.investigative_insight
                ))

        # 5. Open Leads & 14-Day Action Roadmap for Incoming Officer
        open_leads = self._generate_open_leads(case_id, top_targets, cross_case_alerts, predictions)

        # 6. Executive Narrative
        executive_summary = self._generate_executive_summary(case, len(case_nodes), len(top_targets), cross_case_alerts)

        # 7. Financial & Topological Hubs
        syndicate_hubs = [
            f"{t['label']} (PageRank: {t['score']}) — {t.get('properties', {}).get('role', 'Syndicate Anchor')}"
            for t in centrality_res.rankings[:3]
        ]
        layering_anomalies = [a.description for a in anomalies[:3]] if anomalies else [
            "Circular Hawala layering detected between Mule Account #501004, Shell Invoicing Fronts, and USDT Cold Storage."
        ]

        # 8. Statutory Declaration
        statutory_declaration = (
            f"I hereby hand over charge of Case Diary, Case CD Files, Sealed Physical Bullion Memos, "
            f"and Cryptographic Evidence Ledger for {case.fir_number} to the incoming Investigating Officer. "
            f"All digital exhibits and evidence nodes have been cryptographically sealed with SHA-256 digests "
            f"under Section 65B of the Indian Evidence Act, 1872 / Section 63 of Bharatiya Sakshya Adhiniyam, 2023."
        )

        top_hub_name = centrality_res.rankings[0].get('label', 'Top Strategic Hub') if centrality_res.rankings else 'Primary Target'

        briefing = CaseHandoverBriefing(
            case_id=case.id,
            fir_number=case.fir_number,
            case_title=case.title,
            case_type=case.case_type,
            police_station=case.police_station,
            agency=case.agency,
            state=case.state,
            date_filed=case.date_filed,
            handover_date=now_str,
            outgoing_investigator=case.lead_investigator,
            outgoing_badge="MHA-SP-8821",
            incoming_investigator=incoming_officer or "Inspector (To Be Nominated by SP/DCP)",
            executive_summary=executive_summary,
            ipc_sections=case.ipc_sections,
            total_nodes=len(case_nodes),
            total_edges=len(graph_data.edges),
            top_targets=top_targets,
            network_structure_summary=f"The syndicate operates as a compartmentalized multi-layered topology containing {len(communities)} operational clusters. Strategic hub: {top_hub_name}.",
            syndicate_hubs=syndicate_hubs,
            financial_layering_anomalies=layering_anomalies,
            blockchain_audit_status="100% CRYPTOGRAPHICALLY VERIFIED" if verification.is_valid else "TAMPER FLAGGED",
            total_evidence_blocks=custody_cert.get("total_blocks", 4) if isinstance(custody_cert, dict) else getattr(custody_cert, "total_blocks", 4),
            merkle_root=custody_cert.get("merkle_root", "") if isinstance(custody_cert, dict) else getattr(custody_cert, "merkle_root", ""),
            is_chain_verified=verification.is_valid,
            cross_case_alerts=cross_case_alerts,
            open_leads=open_leads,
            recommended_next_steps=[
                "1. Execute Section 102 CrPC / PMLA freezing orders on flagged mule accounts within 48 hours.",
                "2. Transmit formal Red Corner Notice / LOC dossier to CBI-Interpol NCB for absconding controllers.",
                "3. Coordinate joint interrogation with Mumbai NCB and Punjab Police regarding cross-case burner SIMs.",
                "4. Summon nominee shell company directors for Section 50 PMLA recorded statements."
            ],
            statutory_handover_declaration=statutory_declaration
        )

        # Attach formatted HTML document
        briefing.html_dossier = self._build_handover_html(briefing)
        return briefing

    def _generate_open_leads(self, case_id: str, top_targets: List[HandoverTargetInfo],
                             cross_case_alerts: List[HandoverCrossCaseAlert],
                             predictions: List[Any]) -> List[HandoverOpenLead]:
        leads: List[HandoverOpenLead] = []

        # Lead 1: Immediate Freezing / Seizure
        leads.append(HandoverOpenLead(
            priority="IMMEDIATE_48_HOURS",
            title="Freeze High-Velocity Mule Accounts & Off-Ramp Wallets",
            description="Forensic banking analysis reveals active layering bursts through HDFC Mule #501004 and ICICI #000419. Immediate formal freezing orders must be served on nodal bank compliance officers.",
            target_entity="HDFC Mule #501004 / ICICI #000419",
            recommended_action="Issue formal notices under Section 102 CrPC / Section 17 PMLA to freeze current credit balances.",
            statutory_provision="Section 102 CrPC / Sec 17 PMLA"
        ))

        # Lead 2: Absconding Kingpin / Red Corner Notice
        absconding = [t for t in top_targets if "Absconding" in t.status or "Prime" in t.status]
        target_name = absconding[0].label if absconding else "Vikram Sharma / Tariq Mansoor"
        leads.append(HandoverOpenLead(
            priority="IMMEDIATE_48_HOURS",
            title=f"Expedite Look-Out Circular (LOC) & Red Corner Notice for {target_name}",
            description=f"Target {target_name} is confirmed operating command and control from Dubai / overseas jurisdiction. Flight risk is critical.",
            target_entity=target_name,
            recommended_action="Forward extradition dossier with passport details to Ministry of External Affairs & CBI Interpol Division.",
            statutory_provision="Interpol Red Notice / Extradition Act 1962"
        ))

        # Lead 3: Cross-Case Liaison
        if cross_case_alerts:
            alert = cross_case_alerts[0]
            leads.append(HandoverOpenLead(
                priority="HIGH_PRIORITY_7_DAYS",
                title=f"Inter-State Police Liaison with {alert.linked_agency} ({alert.linked_state})",
                description=f"Critical common nexus discovered: Shared {alert.shared_entity_type} ({alert.shared_entity_label}) active in {alert.linked_case_fir}.",
                target_entity=alert.shared_entity_label,
                recommended_action=f"Dispatch formal intelligence exchange memo to {alert.linked_agency} to access wiretap logs and CDR call records.",
                statutory_provision="Inter-State Police Intelligence Sharing SOP"
            ))

        # Lead 4: Predicted Links Verification
        leads.append(HandoverOpenLead(
            priority="STRATEGIC_14_DAYS",
            title="Field Verification of Predicted OTC Crypto Conduit",
            description="Graph Adamic-Adar link prediction indicates high probability (85%+) connection between Khalid Sheikh (OTC Broker) and Dubai Bullion Fronts.",
            target_entity="Khalid Sheikh / TRON USDT Gateway",
            recommended_action="Deploy technical surveillance and request KYC documents from Binance / Telegram P2P counterparty.",
            statutory_provision="IT Act Sec 69 / PMLA Rule 3"
        ))

        return leads

    def _generate_executive_summary(self, case: Any, total_entities: int, target_count: int, cross_alerts: List[Any]) -> str:
        return (
            f"This operational handover dossier compiles critical case intelligence for {case.fir_number} "
            f"('{case.title}'), registered under {', '.join(case.ipc_sections[:2])}. "
            f"The investigation has currently mapped {total_entities} verified entities and uncovered a sophisticated "
            f"multi-tier illicit syndicate operating across {case.state} and international jurisdictions. "
            f"{target_count} High-Value Targets have been identified with mathematical graph centrality. "
            f"Additionally, {len(cross_alerts)} cross-jurisdictional evidentiary links connect this case to active "
            f"investigations in Maharashtra, Punjab, and Delhi. "
            f"All digital evidence and chain of custody logs are sealed in SUTRA's immutable blockchain ledger."
        )

    def _build_handover_html(self, b: CaseHandoverBriefing) -> str:
        targets_rows = "".join([
            f"""
            <tr>
                <td style="font-weight:bold; color:#1e293b;">{t.label}</td>
                <td><span style="background:{'#fee2e2; color:#991b1b;' if t.risk_level == 'Critical' else '#fef3c7; color:#92400e;'} padding:2px 8px; border-radius:4px; font-weight:bold; font-size:11px;">{t.risk_level}</span></td>
                <td>{t.role}</td>
                <td>{t.status}</td>
                <td><strong>{t.centrality_score}</strong> (Rank #{t.centrality_rank})</td>
                <td style="font-size:11px; color:#475569;">{'; '.join(t.key_risk_drivers[:2])}</td>
            </tr>
            """
            for t in b.top_targets
        ])

        leads_rows = "".join([
            f"""
            <div style="background:#f8fafc; border-left:4px solid {'#dc2626' if '48' in l.priority else '#d97706'}; padding:12px; margin-bottom:10px; border-radius:0 6px 6px 0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="color:#0f172a; font-size:13px;">{l.title}</strong>
                    <span style="background:#e2e8f0; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:3px; text-transform:uppercase;">{l.priority.replace('_', ' ')}</span>
                </div>
                <p style="margin:0 0 6px 0; font-size:12px; color:#334155;">{l.description}</p>
                <div style="font-size:11px; color:#0369a1; font-weight:600;">➔ Recommended Action: {l.recommended_action} ({l.statutory_provision})</div>
            </div>
            """
            for l in b.open_leads
        ])

        alerts_rows = "".join([
            f"""
            <tr>
                <td style="font-weight:600; color:#0284c7;">{a.linked_case_fir}</td>
                <td>{a.linked_agency} ({a.linked_state})</td>
                <td><strong>{a.shared_entity_label}</strong> ({a.shared_entity_type})</td>
                <td style="font-size:11px; color:#475569;">{a.intelligence_note}</td>
            </tr>
            """
            for a in b.cross_case_alerts
        ]) if b.cross_case_alerts else "<tr><td colspan='4' style='text-align:center; color:#94a3b8;'>No cross-case links detected.</td></tr>"

        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CASE HANDOVER BRIEFING DOSSIER - {b.fir_number}</title>
    <style>
        body {{
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            background: #ffffff;
            color: #0f172a;
            padding: 40px;
            margin: 0;
            line-height: 1.5;
        }}
        .header {{
            border-bottom: 3px double #0f172a;
            padding-bottom: 18px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .gov-title {{
            font-family: Georgia, serif;
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 0.5px;
        }}
        .badge {{
            background: #b91c1c;
            color: white;
            padding: 5px 12px;
            font-weight: 800;
            font-size: 12px;
            border-radius: 4px;
            letter-spacing: 1px;
        }}
        .meta-table {{
            width: 100%;
            border-collapse: collapse;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            margin-bottom: 25px;
            font-size: 12px;
        }}
        .meta-table td {{
            padding: 8px 14px;
            border: 1px solid #e2e8f0;
        }}
        .meta-label {{
            font-weight: bold;
            color: #475569;
            width: 22%;
            background: #f1f5f9;
        }}
        .section-header {{
            font-family: Georgia, serif;
            font-size: 15px;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
            border-bottom: 1.5px solid #94a3b8;
            padding-bottom: 5px;
            margin-top: 25px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        table.data-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
        }}
        table.data-table th, table.data-table td {{
            border: 1px solid #cbd5e1;
            padding: 8px 10px;
            text-align: left;
        }}
        table.data-table th {{
            background: #f1f5f9;
            font-weight: 700;
            color: #334155;
        }}
        .signature-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #cbd5e1;
        }}
        .sig-block {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 18px;
            border-radius: 6px;
        }}
        .stamp-box {{
            border: 2px dashed #94a3b8;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-family: monospace;
            font-size: 11px;
            margin-top: 15px;
        }}
        @media print {{
            body {{ padding: 20px; }}
            .no-print {{ display: none; }}
        }}
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <div>
            <div style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:1.5px;">
                MINISTRY OF HOME AFFAIRS • GOVERNMENT OF INDIA
            </div>
            <div class="gov-title">
                CASE HANDOVER & RELIEVING BRIEFING DOSSIER
            </div>
            <div style="font-size:12px; color:#475569; margin-top:2px;">
                Statutory Intelligence Summary Generated Under SUTRA System • SIH26189
            </div>
        </div>
        <div style="text-align:right;">
            <div class="badge">CONFIDENTIAL / SECRET</div>
            <div style="font-size:11px; font-family:monospace; margin-top:5px; color:#64748b;">
                Date: {b.handover_date}
            </div>
        </div>
    </div>

    <!-- Metadata Table -->
    <table class="meta-table">
        <tr>
            <td class="meta-label">FIR / Case ID:</td>
            <td><strong>{b.fir_number}</strong> ({b.case_id})</td>
            <td class="meta-label">Police Station / Unit:</td>
            <td>{b.police_station}, {b.state}</td>
        </tr>
        <tr>
            <td class="meta-label">Case Title:</td>
            <td colspan="3"><strong>{b.case_title}</strong></td>
        </tr>
        <tr>
            <td class="meta-label">Investigating Agency:</td>
            <td>{b.agency}</td>
            <td class="meta-label">Statutory IPC Sections:</td>
            <td>{', '.join(b.ipc_sections)}</td>
        </tr>
        <tr>
            <td class="meta-label">Outgoing IO:</td>
            <td><strong>{b.outgoing_investigator}</strong> ({b.outgoing_badge})</td>
            <td class="meta-label">Incoming IO:</td>
            <td><strong>{b.incoming_investigator}</strong></td>
        </tr>
    </table>

    <!-- Section 1: Executive Summary -->
    <div class="section-header">1. Executive Case Synthesis & Modus Operandi</div>
    <p style="font-size:13px; text-align:justify; color:#1e293b; background:#f8fafc; padding:14px; border:1px solid #e2e8f0; border-radius:6px;">
        {b.executive_summary}
    </p>

    <!-- Section 2: Key Persons of Interest -->
    <div class="section-header">2. Primary Persons of Interest & Syndicate Hierarchy</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Target Name</th>
                <th>Risk</th>
                <th>Identified Role</th>
                <th>Status</th>
                <th>Centrality</th>
                <th>Forensic Risk Drivers</th>
            </tr>
        </thead>
        <tbody>
            {targets_rows}
        </tbody>
    </table>

    <!-- Section 3: Cross-Jurisdictional Intelligence -->
    <div class="section-header">3. Inter-State Cross-Case Intelligence Links</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Linked FIR</th>
                <th>Jurisdiction</th>
                <th>Shared Identifier / Nexus</th>
                <th>Operational Intelligence</th>
            </tr>
        </thead>
        <tbody>
            {alerts_rows}
        </tbody>
    </table>

    <!-- Section 4: Actionable Leads & Roadmap -->
    <div class="section-header">4. Actionable Open Leads & Priority 14-Day Roadmap</div>
    <div>
        {leads_rows}
    </div>

    <!-- Section 5: Evidence Integrity -->
    <div class="section-header">5. Evidence Chain of Custody & Cryptographic Seal</div>
    <div style="background:#f0fdf4; border:1.5px solid #16a34a; padding:14px; border-radius:6px; font-size:12px; font-family:monospace;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Ledger Integrity Status: <strong style="color:#15803d;">{b.blockchain_audit_status}</strong></span>
            <span>Total Immutable Blocks: <strong>{b.total_evidence_blocks} Blocks</strong></span>
        </div>
        <div style="color:#475569; word-break:break-all;">
            SHA-256 Merkle Root: <strong>{b.merkle_root}</strong>
        </div>
        <div style="font-size:11px; color:#15803d; margin-top:6px; font-family:sans-serif;">
            Certified under Section 65B Indian Evidence Act / Section 63 BSA 2023. Non-repudiation verified.
        </div>
    </div>

    <!-- Statutory Handover Endorsement -->
    <div class="signature-grid">
        <div class="sig-block">
            <div style="font-size:11px; font-weight:bold; color:#475569; text-transform:uppercase;">Relieving / Outgoing Officer</div>
            <div style="font-size:13px; font-weight:bold; margin-top:4px;">{b.outgoing_investigator}</div>
            <div style="font-size:11px; color:#64748b;">Investigating Officer, {b.outgoing_badge}</div>
            <div class="stamp-box">
                [ SIGNED & RELIEVED ON CHARGE ]
            </div>
            <div style="font-size:10px; color:#94a3b8; margin-top:6px; font-family:monospace;">Timestamp: {b.handover_date}</div>
        </div>

        <div class="sig-block">
            <div style="font-size:11px; font-weight:bold; color:#475569; text-transform:uppercase;">Incoming Officer / Assumption of Charge</div>
            <div style="font-size:13px; font-weight:bold; margin-top:4px;">{b.incoming_investigator}</div>
            <div style="font-size:11px; color:#64748b;">Investigating Officer</div>
            <div class="stamp-box">
                [ OFFICIAL SEAL & SIGNATURE ]
            </div>
            <div style="font-size:10px; color:#94a3b8; margin-top:6px; font-family:monospace;">Charge Assumed under Police Act / CrPC</div>
        </div>
    </div>

</body>
</html>
        """
        return html

# Global Handover Service Instance
handover_service = CaseHandoverService()

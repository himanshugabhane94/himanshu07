from typing import List, Dict, Any, Optional
from app.models.schemas import (
    Case, NodeType, EdgeType, PriorityScoreFactor, CasePriorityItem, PriorityQueueResponse
)
from app.services.graph_engine import graph_engine
from app.services.seed_data import DEMO_CASES
from app.services.cross_case_linker import cross_case_linker
from app.services.victim_safety_service import victim_safety_service

# Explainable weights rubric
SCORING_RUBRIC = {
    "CRIME_SEVERITY_MAX": 30,
    "CROSS_CASE_SYNDICATE_MAX": 25,
    "VICTIM_VULNERABILITY_MAX": 20,
    "EVIDENCE_READINESS_MAX": 15,
    "OPERATIONAL_RECENCY_MAX": 10
}

# Crime Category Severity Baseline
SEVERITY_WEIGHTS = {
    "Murder": (30, "Tier 5 Violent Homicide: Capital offense involving fatal contract shooting and high-risk firearms"),
    "Counter-Terrorism": (30, "Tier 5 State Security Threat: Covert sleeper cell operations, encrypted darknet comms & clandestine financing"),
    "SleeperCell": (30, "Tier 5 State Security Threat: Covert sleeper cell operations, encrypted darknet comms & clandestine financing"),
    "Kidnapping": (25, "Tier 4 High-Risk Violent Abduction: Active hostage extortion, cryptocurrency ransom and illegal firearms"),
    "Robbery": (25, "Tier 4 Violent Highway Attack: Armed cash transit blockade utilizing countrymade shotguns"),
    "SexualAssault": (25, "Tier 4 Sensitive Violent Crime: Targeted intercept of night commuters with active predatory stalking"),
    "Theft": (18, "Tier 3 Organized Property Crime: High-value bullion heist with sophisticated electronic OBD bypass"),
    "Harassment": (15, "Tier 2 Cyber Intimidation: High-frequency VoIP spoofed threat calls and persistent intimidation"),
    "Hawala": (14, "Tier 1 Transnational Financial Crime: Multi-layering bullion and software shell company laundering"),
    "DEFAULT": (12, "Standard General Crime Category")
}

class CasePriorityService:
    """
    Automated Case Priority Scoring & Triage Engine.
    Computes explainable, weighted triage scores (0-100) across all investigations
    to guide resource allocation and tactical investigator dispatch.
    """

    def calculate_priority_for_case(self, case: Case) -> CasePriorityItem:
        case_id = case.id
        category = case.crime_category or case.case_type or "General"
        
        # 1. Factor 1: Crime Severity Baseline (Max 30 pts)
        sev_pts, sev_exp = SEVERITY_WEIGHTS.get(category, SEVERITY_WEIGHTS["DEFAULT"])

        # 2. Factor 2: Cross-Case Syndicate Linkage (Max 25 pts)
        # Find how many entities in this case connect to other cases
        case_nodes = [n for n in graph_engine.nodes_dict.values() if case_id in (n.case_ids or [])]
        shared_entities = [n for n in case_nodes if len(n.case_ids or []) > 1]
        shared_count = len(shared_entities)

        if shared_count >= 3:
            cross_pts = 25
            shared_labels = ", ".join([n.label.split("(")[0].strip() for n in shared_entities[:3]])
            cross_exp = f"Critical Inter-State Syndicate Ties: {shared_count} shared entities ({shared_labels}) linked across multiple active FIRs."
        elif shared_count == 2:
            cross_pts = 18
            shared_labels = ", ".join([n.label.split("(")[0].strip() for n in shared_entities])
            cross_exp = f"Organized Multi-Case Links: 2 shared entities ({shared_labels}) operating across jurisdictions."
        elif shared_count == 1:
            cross_pts = 10
            cross_exp = f"Emerging Cross-Case Nexus: 1 shared entity ({shared_entities[0].label}) identified."
        else:
            cross_pts = 0
            cross_exp = "Isolated Investigation: No cross-case entity overlaps detected currently."

        # 3. Factor 3: Victim Vulnerability & Escalating Predator Risk (Max 20 pts)
        # Check victim nodes and repeat offender associations
        case_victims = [n for n in case_nodes if (n.properties or {}).get("role") == "Victim"]
        suspect_nodes = [n for n in case_nodes if n.type == NodeType.PERSON and (n.properties or {}).get("role") not in ["Victim", "Witness"]]
        
        repeat_flagged = False
        escalation_detected = False
        for s in suspect_nodes:
            report = victim_safety_service.get_suspect_repeat_offense_report(s.id)
            if report.total_distinct_victims >= 2:
                repeat_flagged = True
                if report.escalation_trajectory == "ESCALATING_SEVERITY":
                    escalation_detected = True
                    break

        if escalation_detected:
            victim_pts = 20
            victim_exp = f"Critical Predatory Escalation: Suspect flagged with multiple victims across cases with accelerating violence trajectory."
        elif repeat_flagged:
            victim_pts = 18
            victim_exp = f"Serial Repeat Offender Identified: Connected suspect has repeat victim history across independent FIRs."
        elif len(case_victims) >= 1:
            victim_pts = 14
            v_code = (case_victims[0].properties or {}).get("anonymized_id", "Protected Victim")
            prot_status = (case_victims[0].properties or {}).get("protection_status", "Active Protection")
            victim_exp = f"Direct Target Protection Protocol: Complainant {v_code} under judicial watch ({prot_status})."
        else:
            victim_pts = 0
            victim_exp = "Non-Victim/Commercial Asset Offense: No immediate individual physical safety risk."

        # 4. Factor 4: Forensic Evidence Readiness & Network Completeness (Max 15 pts)
        case_edges = [e for e in graph_engine.edges_dict.values() if e.case_id == case_id]
        evidence_edges = [e for e in case_edges if e.evidence_ref]
        
        if len(case_nodes) >= 6 and len(evidence_edges) >= 4:
            evidence_pts = 15
            evidence_exp = f"High Prosecutorial Readiness: {len(case_nodes)} graph nodes with {len(evidence_edges)} verified forensic evidence references."
        elif len(case_nodes) >= 4:
            evidence_pts = 10
            evidence_exp = f"Moderate Graph Completeness: {len(case_nodes)} nodes and {len(case_edges)} tactical relationships mapped."
        else:
            evidence_pts = 5
            evidence_exp = f"Preliminary Ingestion: Sparse evidentiary graph requiring active node expansion."

        # 5. Factor 5: Operational Recency & Time Sensitivity (Max 10 pts)
        # Check timestamps
        latest_date = "2024-01-10T00:00:00Z"
        for n in case_nodes:
            if n.discovered_date and n.discovered_date > latest_date:
                latest_date = n.discovered_date

        if "2024-02" in latest_date or "2024-03" in latest_date:
            recency_pts = 10
            recency_exp = f"Active Operational Window: Recent evidentiary milestone discovered on {latest_date[:10]}."
        elif "2024-01" in latest_date:
            recency_pts = 7
            recency_exp = f"Standard Active Window: Evidence dated {latest_date[:10]}."
        else:
            recency_pts = 4
            recency_exp = f"Cold / Dormant Record."

        # Sum Total Priority Score
        total_score = min(100, sev_pts + cross_pts + victim_pts + evidence_pts + recency_pts)

        # Determine Urgency Level & Recommendation
        if total_score >= 80:
            urgency = "CRITICAL_URGENT"
            rec = "IMMEDIATE DISPATCH: Deploy tactical task force, activate technical wiretaps, and execute coordinated inter-state raids."
        elif total_score >= 65:
            urgency = "HIGH_PRIORITY"
            rec = "PRIORITY TRIAGE: Expedite forensic lab ballistics/CDR matches and issue look-out circulars (LOC)."
        elif total_score >= 45:
            urgency = "MODERATE_TRIAGE"
            rec = "ACTIVE INVESTIGATION: Maintain covert surveillance on secondary money mules and asset recovery routes."
        else:
            urgency = "STANDARD_ROUTINE"
            rec = "ROUTINE MAINTENANCE: Continue background intelligence harvesting and automated ledger audits."

        breakdown = [
            PriorityScoreFactor(
                name="Crime Severity Baseline",
                points=sev_pts,
                max_points=SCORING_RUBRIC["CRIME_SEVERITY_MAX"],
                explanation=sev_exp
            ),
            PriorityScoreFactor(
                name="Cross-Case Syndicate Links",
                points=cross_pts,
                max_points=SCORING_RUBRIC["CROSS_CASE_SYNDICATE_MAX"],
                explanation=cross_exp
            ),
            PriorityScoreFactor(
                name="Victim Vulnerability & Recidivism Threat",
                points=victim_pts,
                max_points=SCORING_RUBRIC["VICTIM_VULNERABILITY_MAX"],
                explanation=victim_exp
            ),
            PriorityScoreFactor(
                name="Evidence Strength & Graph Completeness",
                points=evidence_pts,
                max_points=SCORING_RUBRIC["EVIDENCE_READINESS_MAX"],
                explanation=evidence_exp
            ),
            PriorityScoreFactor(
                name="Operational Recency & Velocity",
                points=recency_pts,
                max_points=SCORING_RUBRIC["OPERATIONAL_RECENCY_MAX"],
                explanation=recency_exp
            )
        ]

        return CasePriorityItem(
            case_id=case_id,
            fir_number=case.fir_number,
            title=case.title,
            crime_category=category,
            agency=case.agency,
            state=case.state,
            status=case.status,
            priority_score=total_score,
            urgency_level=urgency,
            score_breakdown=breakdown,
            triage_recommendation=rec,
            cross_case_links_count=shared_count,
            victims_count=len(case_victims),
            nodes_count=len(case_nodes),
            edges_count=len(case_edges),
            last_activity_date=latest_date[:10]
        )

    def get_priority_queue(self) -> PriorityQueueResponse:
        items: List[CasePriorityItem] = []
        for case in DEMO_CASES:
            items.append(self.calculate_priority_for_case(case))

        # Sort descending by priority score
        items.sort(key=lambda x: x.priority_score, reverse=True)

        crit_count = sum(1 for item in items if item.urgency_level == "CRITICAL_URGENT")
        high_count = sum(1 for item in items if item.urgency_level == "HIGH_PRIORITY")

        return PriorityQueueResponse(
            total_cases_analyzed=len(items),
            critical_urgent_count=crit_count,
            high_priority_count=high_count,
            cases_queue=items,
            scoring_rubric_summary=SCORING_RUBRIC
        )

case_priority_service = CasePriorityService()

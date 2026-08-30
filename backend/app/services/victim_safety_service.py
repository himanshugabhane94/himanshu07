from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.schemas import (
    Node, Edge, NodeType, EdgeType, Case,
    VictimIncidentRecord, RecidivismRiskReport,
    VictimSafetyOffenderSummary, VictimSafetyOverview
)
from app.services.graph_engine import graph_engine
from app.services.seed_data import DEMO_CASES

SEVERITY_MAP = {
    "murder": 5,
    "homicide": 5,
    "kidnapping": 4,
    "robbery": 4,
    "sexualassault": 4,
    "assault": 4,
    "theft": 3,
    "harassment": 2,
    "cyberstalking": 2,
    "extortion": 2,
    "hawala/financial": 1,
    "counter-terrorism": 5,
}

class VictimSafetyService:
    """
    Victim Safety Network & Repeat Offender Recidivism Engine.
    Detects cross-case repeat offenses against separate victims, evaluates escalation velocity,
    and generates proactive victim protection protocols under Sec 398 BNSS 2023.
    """

    def _get_severity(self, category: str) -> int:
        cat_lower = (category or "").lower()
        for k, v in SEVERITY_MAP.items():
            if k in cat_lower:
                return v
        return 2

    def get_suspect_repeat_offense_report(self, suspect_id: str) -> RecidivismRiskReport:
        suspect_node = graph_engine.nodes_dict.get(suspect_id)
        suspect_name = suspect_node.label if suspect_node else suspect_id

        # 1. Discover all victim connections for this suspect across graph edges
        incident_records: List[VictimIncidentRecord] = []
        visited_victim_ids = set()

        for edge in graph_engine.edges_dict.values():
            v_node = None
            case_id = edge.case_id or (suspect_node.case_ids[0] if suspect_node and suspect_node.case_ids else "CASE-HAWALA-2024")

            # Check victim_of relationship
            if edge.type == EdgeType.VICTIM_OF:
                if edge.target == suspect_id:
                    v_node = graph_engine.nodes_dict.get(edge.source)
                elif edge.source == suspect_id:
                    v_node = graph_engine.nodes_dict.get(edge.target)

            # Check person role == Victim
            if not v_node:
                src_n = graph_engine.nodes_dict.get(edge.source)
                tgt_n = graph_engine.nodes_dict.get(edge.target)
                if edge.source == suspect_id and tgt_n and tgt_n.properties.get("role") == "Victim":
                    v_node = tgt_n
                elif edge.target == suspect_id and src_n and src_n.properties.get("role") == "Victim":
                    v_node = src_n

            if v_node and v_node.id not in visited_victim_ids:
                visited_victim_ids.add(v_node.id)

                # Look up case metadata
                case_obj = next((c for c in DEMO_CASES if c.id == case_id), None)
                cat = case_obj.crime_category if case_obj else (v_node.properties.get("crime_category") or "General Crime")
                fir = case_obj.fir_number if case_obj else (v_node.properties.get("fir_number") or f"FIR-REF-{case_id}")
                date_str = edge.timestamp or v_node.discovered_date or (case_obj.date_filed if case_obj else "2024-01-15")
                date_iso = date_str[:10]
                sev = self._get_severity(cat)

                # Use anonymized metadata identifier
                v_anon_code = v_node.properties.get("anonymized_id") or f"VIC-{v_node.id}"
                prot_status = v_node.properties.get("protection_status") or "Witness Protection Protocol Pending"

                incident_records.append(VictimIncidentRecord(
                    case_id=case_id,
                    fir_number=fir,
                    date_recorded=date_iso,
                    crime_category=cat,
                    severity_tier=sev,
                    victim_identifier=v_anon_code,
                    victim_node_id=v_node.id,
                    jurisdiction=case_obj.state if case_obj else "Delhi NCR",
                    police_station=case_obj.police_station if case_obj else "Special Crime PS",
                    court_protection_status=prot_status,
                    offense_summary=v_node.properties.get("case_summary") or f"{cat} incident recorded under {fir}"
                ))

        # 2. Sort incidents chronologically
        incident_records.sort(key=lambda x: x.date_recorded)

        # 3. Calculate Recidivism Score, Escalation Trajectory, and Gaps
        total_victims = len(incident_records)
        unique_cases = len(set(r.case_id for r in incident_records))

        if total_victims == 0:
            return RecidivismRiskReport(
                suspect_id=suspect_id,
                suspect_name=suspect_name,
                total_distinct_victims=0,
                total_linked_cases=len(suspect_node.case_ids) if suspect_node else 0,
                recidivism_score=15,
                risk_level="LOW",
                escalation_trajectory="SINGLE_OFFENSE",
                average_gap_days=None,
                incidents_timeline=[],
                protective_recommendations=["Standard monitoring of case proceedings."],
                priority_action_note="No multiple victim repeat-offense pattern detected."
            )

        # Base score by victim count
        base_score = 40 if total_victims == 2 else (65 if total_victims >= 3 else 25)
        
        # Calculate time gaps
        gaps = []
        for i in range(1, len(incident_records)):
            try:
                d1 = datetime.strptime(incident_records[i-1].date_recorded, "%Y-%m-%d")
                d2 = datetime.strptime(incident_records[i].date_recorded, "%Y-%m-%d")
                gaps.append(abs((d2 - d1).days))
            except Exception:
                gaps.append(30)

        avg_gap = int(sum(gaps) / len(gaps)) if gaps else 45

        # Velocity points
        velocity_score = 0
        if avg_gap <= 20:
            velocity_score = 25
        elif avg_gap <= 45:
            velocity_score = 15
        elif avg_gap <= 90:
            velocity_score = 8

        # Escalation points
        is_escalating = False
        if len(incident_records) >= 2:
            if incident_records[-1].severity_tier > incident_records[0].severity_tier:
                is_escalating = True

        escalation_score = 25 if is_escalating else (10 if total_victims >= 2 else 0)
        final_score = min(98, base_score + velocity_score + escalation_score)

        if final_score >= 80:
            risk_lvl = "CRITICAL"
        elif final_score >= 60:
            risk_lvl = "HIGH"
        elif final_score >= 40:
            risk_lvl = "MODERATE"
        else:
            risk_lvl = "LOW"

        if is_escalating:
            trajectory = "ESCALATING_SEVERITY"
        elif total_victims >= 2:
            trajectory = "CHRONIC_REPEAT"
        else:
            trajectory = "STABLE"

        # Formulate Recommendations
        recommendations = []
        if is_escalating or risk_lvl == "CRITICAL":
            recommendations.append("Issue urgent judicial restraining order & geographical exclusionary perimeter (Sec 398 BNSS).")
            recommendations.append("Deploy active SOS distress telemetry for previous and current complainants.")
            recommendations.append("Flag suspect vehicle & mobile telemetry across ANPR / PCR intercept grid.")
            recommendations.append("Apply for cancellation of bail / oppose pre-arrest bail citing multi-victim escalation.")
            action_note = "CRITICAL ADVISORY: Pattern indicates rapid escalation in violence/severity across separate victims. High probability of additional target identification without immediate intervention."
        else:
            recommendations.append("Maintain periodic telephonic welfare checks with registered complainants.")
            recommendations.append("Cross-reference suspect's known routes with unresolved local station complaints.")
            action_note = "ACTIVE MONITORING: Repeat pattern flagged across multiple FIR registrations. Proactive victim safety protocols advised."

        return RecidivismRiskReport(
            suspect_id=suspect_id,
            suspect_name=suspect_name,
            total_distinct_victims=total_victims,
            total_linked_cases=unique_cases,
            recidivism_score=final_score,
            risk_level=risk_lvl,
            escalation_trajectory=trajectory,
            average_gap_days=avg_gap if gaps else None,
            incidents_timeline=incident_records,
            protective_recommendations=recommendations,
            priority_action_note=action_note
        )

    def get_victim_safety_overview(self) -> VictimSafetyOverview:
        """
        Global overview of repeat offenders across the entire database to power dashboard alerts.
        """
        flagged = []
        # Check all Person nodes in graph
        for node in graph_engine.nodes_dict.values():
            if node.type == NodeType.PERSON and node.properties.get("role") != "Victim":
                report = self.get_suspect_repeat_offense_report(node.id)
                if report.total_distinct_victims >= 2:
                    latest_d = report.incidents_timeline[-1].date_recorded if report.incidents_timeline else "2024-02-24"
                    cats = list(set(r.crime_category for r in report.incidents_timeline))
                    flagged.append(VictimSafetyOffenderSummary(
                        suspect_id=report.suspect_id,
                        suspect_name=report.suspect_name,
                        total_victims=report.total_distinct_victims,
                        recidivism_score=report.recidivism_score,
                        risk_level=report.risk_level,
                        escalation_trajectory=report.escalation_trajectory,
                        latest_incident_date=latest_d,
                        primary_crime_categories=cats,
                        priority_alert=report.priority_action_note
                    ))

        flagged.sort(key=lambda x: x.recidivism_score, reverse=True)
        crit_count = len([f for f in flagged if f.risk_level == "CRITICAL"])
        total_vic = sum(f.total_victims for f in flagged)

        return VictimSafetyOverview(
            total_repeat_offenders_flagged=len(flagged),
            total_protected_victims_tracked=total_vic,
            critical_escalation_count=crit_count,
            flagged_offenders=flagged,
            system_advisory=(
                f"Active alert: {len(flagged)} serial offenders detected across {total_vic} distinct victims. "
                f"{crit_count} offenders exhibit critical behavioral escalation requiring immediate protective action."
            )
        )

victim_safety_service = VictimSafetyService()

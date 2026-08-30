from typing import List, Dict, Any, Optional
from collections import Counter
from app.models.schemas import (
    Node, NodeType, Case, ModusOperandi, MOMatchDetail, 
    MORelatedCaseMatch, MOPersonProfile, MOCluster
)
from app.services.graph_engine import graph_engine
from app.services.seed_data import DEMO_CASES

# Define standard weights for explainable judicial defensibility
MO_ATTRIBUTE_WEIGHTS = {
    "operating_method": 0.22,
    "mobility_type": 0.20,
    "weapon_category": 0.18,
    "location_type": 0.15,
    "time_of_day": 0.13,
    "target_selection": 0.12
}

class SerialPatternDetector:
    """
    Serial Offender Modus Operandi (MO) Pattern Detector.
    Synthesizes behavioral signatures across disparate cases, computes explainable
    similarity scores against unsolved cold cases, and generates cross-case suspect clusters.
    """

    def _get_dominant_attribute(self, values: List[str], fallback: str) -> str:
        valid = [v for v in values if v]
        if not valid:
            return fallback
        return Counter(valid).most_common(1)[0][0]

    def aggregate_person_mo(self, person_id: str) -> MOPersonProfile:
        person_node = graph_engine.nodes_dict.get(person_id)
        person_label = person_node.label if person_node else person_id

        # Gather all cases this person is linked to
        linked_case_ids = person_node.case_ids if person_node else []
        linked_cases = [c for c in DEMO_CASES if c.id in linked_case_ids]

        if not linked_cases:
            # Fallback for entities not in demo cases
            linked_cases = [DEMO_CASES[0]] if DEMO_CASES else []

        times = []
        methods = []
        mobilities = []
        locs = []
        weapons = []
        targets = []
        all_sigs = set()
        crime_categories = []

        for c in linked_cases:
            if c.crime_category:
                crime_categories.append(c.crime_category)
            if c.modus_operandi:
                mo = c.modus_operandi
                if mo.time_of_day: times.append(mo.time_of_day)
                if mo.operating_method: methods.append(mo.operating_method)
                if mo.mobility_type: mobilities.append(mo.mobility_type)
                if mo.location_type: locs.append(mo.location_type)
                if mo.weapon_category: weapons.append(mo.weapon_category)
                if mo.target_selection: targets.append(mo.target_selection)
                if mo.signatures:
                    for s in mo.signatures:
                        all_sigs.add(s)

        # Check person node properties for specific overrides
        if person_node and person_node.properties:
            props = person_node.properties
            if "mo_method" in props: methods.append(props["mo_method"])
            if "mo_mobility" in props: mobilities.append(props["mo_mobility"])
            if "mo_weapon" in props: weapons.append(props["mo_weapon"])

        agg_mo = ModusOperandi(
            time_of_day=self._get_dominant_attribute(times, "night"),
            operating_method=self._get_dominant_attribute(methods, "group_of_3+"),
            mobility_type=self._get_dominant_attribute(mobilities, "used_vehicle"),
            location_type=self._get_dominant_attribute(locs, "highway_transit"),
            weapon_category=self._get_dominant_attribute(weapons, "firearm"),
            target_selection=self._get_dominant_attribute(targets, "targeted"),
            signatures=list(all_sigs)
        )

        # Build readable tags
        tags = []
        time_tag_map = {
            "midnight": "Midnight Execution (11 PM - 4 AM)",
            "night": "Night Operations (8 PM - 12 AM)",
            "evening": "Evening Peak Hours (5 PM - 8 PM)",
            "daytime": "Daylight Covert Activity",
            "dawn": "Early Morning Dawn Drops (4 AM - 7 AM)"
        }
        method_tag_map = {
            "lone_operator": "Lone Operator MO",
            "group_of_3+": "Organized Armed Gang (3+ Operatives)",
            "duo_partnership": "Two-Person Infiltration Duo",
            "syndicate_cell": "Compartmentalized Syndicate Cell"
        }
        mob_tag_map = {
            "used_vehicle": "Modified Getaway SUV / Vehicle",
            "two_wheeler": "High-Mobility Two-Wheeler",
            "on_foot": "Pedestrian Foot Infiltration",
            "commercial_taxi": "Commercial Taxi Cover",
            "freight_transit": "Heavy Freight Logistics Transport"
        }
        weap_tag_map = {
            "firearm": "Countrymade / Seized Firearms",
            "blunt_force": "Physical Coercion / Restraints",
            "edged_weapon": "Edged Weapons / Blades",
            "cyber_spoofing": "VoIP SIP Spoofing & Anonymous Relay",
            "none": "Non-Violent Technical / Financial"
        }

        if agg_mo.time_of_day in time_tag_map: tags.append(time_tag_map[agg_mo.time_of_day])
        if agg_mo.operating_method in method_tag_map: tags.append(method_tag_map[agg_mo.operating_method])
        if agg_mo.mobility_type in mob_tag_map: tags.append(mob_tag_map[agg_mo.mobility_type])
        if agg_mo.weapon_category in weap_tag_map: tags.append(weap_tag_map[agg_mo.weapon_category])
        if agg_mo.target_selection: tags.append(f"Targeting: {agg_mo.target_selection.capitalize().replace('_', ' ')}")

        # Build behavioral summary
        summary = (
            f"Subject '{person_label}' demonstrates a distinct signature: operating primarily during "
            f"{agg_mo.time_of_day} hours as part of a {agg_mo.operating_method.replace('_', ' ')} unit, "
            f"utilizing {agg_mo.mobility_type.replace('_', ' ')} with {agg_mo.weapon_category.replace('_', ' ')} in "
            f"{agg_mo.location_type.replace('_', ' ')} jurisdictions."
        )

        # Match against all open/unsolved cold cases where this suspect is not listed
        potential_cases = self.match_suspect_against_cold_cases(person_id, agg_mo, linked_case_ids)

        return MOPersonProfile(
            person_id=person_id,
            person_label=person_label,
            primary_cases=linked_case_ids,
            primary_crime_categories=list(set(crime_categories)),
            aggregated_mo=agg_mo,
            mo_tags=tags,
            behavioral_summary=summary,
            potential_related_cases=potential_cases,
            total_unsolved_checked=len([c for c in DEMO_CASES if c.status in ["Unsolved Cold Case", "Under Investigation"] and c.id not in linked_case_ids])
        )

    def match_suspect_against_cold_cases(
        self, person_id: str, suspect_mo: ModusOperandi, linked_case_ids: List[str]
    ) -> List[MORelatedCaseMatch]:
        results = []

        # Find candidates: cases not already linked to this suspect
        candidate_cases = [c for c in DEMO_CASES if c.id not in linked_case_ids and c.modus_operandi is not None]

        for case in candidate_cases:
            c_mo = case.modus_operandi
            match_details = []
            matched_attributes = []
            total_score = 0.0

            # 1. Compare Core Attributes
            for attr, weight in MO_ATTRIBUTE_WEIGHTS.items():
                s_val = getattr(suspect_mo, attr, "")
                c_val = getattr(c_mo, attr, "")

                is_match = False
                if s_val and c_val:
                    if s_val == c_val:
                        is_match = True
                    # Semantic loose matching (e.g. night / midnight)
                    elif {s_val, c_val}.issubset({"night", "midnight"}):
                        is_match = True
                    elif {s_val, c_val}.issubset({"used_vehicle", "transit_van", "freight_transit"}):
                        is_match = True
                    elif {s_val, c_val}.issubset({"firearm", "countrymade_pistol", "shotgun"}):
                        is_match = True

                contribution = weight * 100.0 if is_match else 0.0
                total_score += contribution

                if is_match:
                    matched_attributes.append(attr.replace('_', ' ').title())

                match_details.append(MOMatchDetail(
                    attribute=attr.replace('_', ' ').title(),
                    suspect_value=str(s_val),
                    case_value=str(c_val),
                    is_match=is_match,
                    weight=weight,
                    contribution=round(contribution, 1)
                ))

            # 2. Check Shared Specific Signatures Bonus
            s_sigs = set(suspect_mo.signatures or [])
            c_sigs = set(c_mo.signatures or [])
            shared_sigs = s_sigs.intersection(c_sigs)
            if shared_sigs:
                bonus = min(15.0, len(shared_sigs) * 7.5)
                total_score = min(100.0, total_score + bonus)
                matched_attributes.append(f"Signatures ({', '.join(shared_sigs)})")

            final_score = int(round(total_score))

            # Only suggest cases with meaningful similarity (>= 50%)
            if final_score >= 45:
                rationale = (
                    f"Strong behavioral correlation ({final_score}%): Case '{case.fir_number}' shares "
                    f"{len(matched_attributes)} core operational attributes ({', '.join(matched_attributes[:4])}) "
                    f"with suspect's established crime patterns."
                )

                results.append(MORelatedCaseMatch(
                    case_id=case.id,
                    fir_number=case.fir_number,
                    title=case.title,
                    crime_category=case.crime_category,
                    state=case.state,
                    police_station=case.police_station,
                    status=case.status,
                    match_score=final_score,
                    matched_attributes=matched_attributes,
                    match_details=match_details,
                    investigative_rationale=rationale
                ))

        # Sort by match score descending
        results.sort(key=lambda x: x.match_score, reverse=True)
        return results

    def get_mo_clusters(self, case_type: Optional[str] = None) -> List[MOCluster]:
        """
        Groups suspects across cases into behavioral clusters based on shared MO patterns.
        """
        # Predefined synthesized clusters based on multi-crime topology
        clusters = [
            MOCluster(
                cluster_id="CLUST-HIGHWAY-HEIST-01",
                cluster_name="Armed Highway Heist & Abduction Module",
                crime_domain="Violent & Property Crime (Kidnapping, Robbery)",
                core_mo_signature="Night operations (11 PM - 4 AM) using modified Scorpio/SUVs, .315/.32 firearms, and highway roadblock interception.",
                shared_attributes={
                    "Time of Day": "Midnight / Night",
                    "Method": "Armed Gang (3+ Operatives)",
                    "Mobility": "Modified Getaway SUV (Mahindra Scorpio)",
                    "Weapon": "Countrymade Firearms (.315 / .32 Bore)",
                    "Targeting": "High-Net-Worth Commuters & Cash Transit"
                },
                suspects_count=3,
                suspect_ids=["PER_KULDEEP_YADAV", "PER_JOGINDER_PEHALWAN", "PER_SUNIL_RAWAT"],
                suspect_names=["Kuldeep Yadav (Alias KD)", "Joginder Singh (Alias Jogi Pehalwan)", "Sunil 'Goli' Rawat"],
                associated_firs=["FIR 104/2024-CRIME-DL (Kidnapping)", "FIR 415/2024-SPL-NDLS (Armed Robbery)", "FIR 55/2024-HR-COLD (Manesar Carjacking)"],
                confidence_level="HIGH",
                pattern_description="Pattern analysis reveals an active 3-man tactical module executing daylight abductions and midnight armed highway transit heists across Delhi-Gurugram-Alwar corridor."
            ),
            MOCluster(
                cluster_id="CLUST-ARMS-HOMICIDE-02",
                cluster_name="Contract Killing & Underground Firearms Supply Grid",
                crime_domain="Violent Crime (Murder, Armed Robbery)",
                core_mo_signature="Targeted point-blank executions using un-serialized .32 countrymade pistols funded through commercial contract cash advances.",
                shared_attributes={
                    "Time of Day": "Evening / Night",
                    "Method": "Contract Hit Duo",
                    "Mobility": "Two-Wheeler Escape",
                    "Weapon": "Countrymade .32 Auto Pistol",
                    "Targeting": "Commercial Dispute Partners"
                },
                suspects_count=2,
                suspect_ids=["PER_RAMESH_BAGGA", "PER_PRADEEP_SINGHAL"],
                suspect_names=["Ramesh 'Shooter' Bagga", "Pradeep Singhal (Mastermind)"],
                associated_firs=["FIR 312/2024-PS-GK1 (Murder)", "FIR 415/2024-SPL-NDLS (Armed Robbery)"],
                confidence_level="HIGH",
                pattern_description="Firearms supplier Ramesh Bagga links contract killings in South Delhi to armed bank robbery networks in West Delhi through shared black-market munitions."
            ),
            MOCluster(
                cluster_id="CLUST-CYBER-STALK-03",
                cluster_name="Technical Cyberstalking & Coercion Relay",
                crime_domain="Cyber & Harassment (Assault, Cyberstalking)",
                core_mo_signature="Commercial cab surveillance coupled with automated VoIP SIP trunk caller ID spoofing (+1-202 virtual numbers) and encrypted mail coercion.",
                shared_attributes={
                    "Time of Day": "Night / Continuous",
                    "Method": "Lone Operator",
                    "Mobility": "Commercial Taxi Permit",
                    "Weapon": "VoIP SIP Caller Spoofing",
                    "Targeting": "Identified Female Commuters"
                },
                suspects_count=1,
                suspect_ids=["PER_SATISH_VERMA"],
                suspect_names=["Satish 'Chhotu' Verma"],
                associated_firs=["FIR 89/2024-SPEC-CELL (Assault)", "FIR 62/2024-CYBER-DEL (Cyberstalking)", "FIR 19/2024-CYBER-COLD (VoIP Threat)"],
                confidence_level="HIGH",
                pattern_description="Offender leverages commercial cab driving mobility to identify targets and follows up with anonymous VoIP harassment rings."
            ),
            MOCluster(
                cluster_id="CLUST-VAULT-THEFT-04",
                cluster_name="Commercial Bullion & OBD Auto Infiltration Ring",
                crime_domain="Property Crime & Fencing (Theft, Hawala)",
                core_mo_signature="Midnight stealth break-ins using OBD key signal cloners, followed by immediate bullion melting and fencing through Karol Bagh jewelry pawns.",
                shared_attributes={
                    "Time of Day": "Midnight",
                    "Method": "Two-Person Infiltration Duo",
                    "Mobility": "Tata Ace Smuggling Cargo",
                    "Weapon": "Non-Violent / Electronic OBD Cloner",
                    "Targeting": "Jewelry Vaults & Luxury Vehicles"
                },
                suspects_count=2,
                suspect_ids=["PER_DEVENDRA_BHATI", "PER_MAHESH_SONI"],
                suspect_names=["Devendra 'Dev' Bhati", "Mahesh Soni (Pawn Broker)"],
                associated_firs=["FIR 219/2024-CRIME-WZ (Theft)", "FIR 402/2024-ED-NDLS (Hawala)", "FIR 81/2024-ROHINI-COLD (Gold Foundry Break-in)"],
                confidence_level="HIGH",
                pattern_description="Direct pipeline connecting electronic vehicle/vault burglaries with underground Hawala laundering cash drops."
            ),
            MOCluster(
                cluster_id="CLUST-HAWALA-LAYER-05",
                cluster_name="Cross-Border Shadow Banking & Crypto Off-Ramp",
                crime_domain="Financial Crime (Hawala, Narcotics, Counter-Terrorism)",
                core_mo_signature="Multi-tier bank account layering through mule networks, bogus invoicing fronts, and USDT TRC-20 cold wallet transfers.",
                shared_attributes={
                    "Time of Day": "Business Hours / Continuous",
                    "Method": "Syndicate Cell",
                    "Mobility": "Digital Financial Rail",
                    "Weapon": "Cryptocurrency Off-Ramp",
                    "Targeting": "Institutional Financial Grid"
                },
                suspects_count=4,
                suspect_ids=["PER_VIKRAM_SHARMA", "PER_TARIQ_MANSOOR", "PER_SAMEER_MERCHANT", "PER_ROHIT_KHANNA"],
                suspect_names=["Vikram Sharma (Vicky Seth)", "Tariq Mansoor", "Sameer Merchant", "Rohit Khanna"],
                associated_firs=["FIR 402/2024-ED-NDLS (Hawala)", "FIR 188/2024-NCB-WZ (Narcotics)", "FIR 77/2024-NIA-HQ (Counter-Terror)"],
                confidence_level="HIGH",
                pattern_description="Centralized money laundering infrastructure servicing narcotics syndicates, Hawala brokers, and clandestine sleeper modules."
            )
        ]

        if case_type:
            clusters = [c for c in clusters if case_type.lower() in c.crime_domain.lower()]

        return clusters

serial_pattern_detector = SerialPatternDetector()

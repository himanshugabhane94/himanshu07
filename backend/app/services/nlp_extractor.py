import re
from typing import List, Dict, Any, Tuple
from app.models.schemas import (
    NodeType, RiskLevel, EdgeType, 
    ExtractedEntity, ExtractedRelationship, NLPAutoExtractionResponse
)

class NLPEntityExtractor:
    """
    Law Enforcement Domain-Specific NLP Pipeline.
    Extracts criminal entities, digital artifacts, financial markers, and inferred relationships from unstructured text (FIRs, CDRs, Chat Logs).
    """
    def __init__(self):
        # Compiled Regular Expression Patterns for Law Enforcement Entities
        self.phone_pattern = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')
        self.imei_pattern = re.compile(r'\b\d{15}\b')
        self.bank_pattern = re.compile(r'\b(?:A/C|Account|Acc|A/c)\s*(?:No\.?|Number)?\s*[:\-]?\s*([0-9]{9,18})\b', re.IGNORECASE)
        self.ifsc_pattern = re.compile(r'\b[A-Z]{4}0[A-Z0-9]{6}\b')
        self.vehicle_pattern = re.compile(r'\b(?:[A-Z]{2}[-\s]?[0-9]{1,2}[-\s]?[A-Z]{1,3}[-\s]?[0-9]{4})\b')
        self.crypto_pattern = re.compile(r'\b0x[a-fA-F0-9]{40}\b|\b(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b')
        self.ip_pattern = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
        self.telegram_pattern = re.compile(r'@([a-zA-Z0-9_]{4,32})\b')
        self.amount_pattern = re.compile(r'(?:₹|INR|Rs\.?|USD|\$)\s*([0-9,]+(?:\.[0-9]+)?(?:\s*(?:Lakh|Crore|Cr|L|Million|k|K))?)', re.IGNORECASE)
        self.ipc_pattern = re.compile(r'\b(?:IPC\s*(?:Section|Sec)?\s*([0-9]{3}[A-Z]?)|NDPS\s*(?:Act)?\s*(?:Sec)?\s*([0-9]+)|UAPA\s*(?:Sec)?\s*([0-9]+)|PMLA\s*(?:Sec)?\s*([0-9]+))\b', re.IGNORECASE)

        # Contextual keywords for Indian criminal records
        self.known_org_suffixes = ["Enterprises", "Traders", "Pvt Ltd", "Corporation", "Exports", "Logistics", "Syndicate", "Cartel", "Cell", "Foundation", "Trust"]
        self.known_location_types = ["Safehouse", "Warehouse", "Apartment", "Hotel", "Border", "Airport", "Port", "Docks", "Hideout", "Godown", "Resort", "Farmhouse"]

    def extract_from_text(self, text: str, case_id: str = "CASE-HAWALA-2024", source_type: str = "FIR") -> NLPAutoExtractionResponse:
        entities: List[ExtractedEntity] = []
        relationships: List[ExtractedRelationship] = []
        seen_entity_ids = set()

        # Helper to add entity uniquely
        def add_entity(entity_id: str, text_val: str, label: str, node_type: NodeType, risk: RiskLevel, props: Dict[str, Any]):
            if entity_id not in seen_entity_ids:
                seen_entity_ids.add(entity_id)
                entities.append(ExtractedEntity(
                    id=entity_id,
                    text=text_val,
                    label=label,
                    type=node_type,
                    risk_level=risk,
                    properties=props
                ))

        # 1. Extract Phone Numbers
        for match in self.phone_pattern.finditer(text):
            num = match.group(0).replace(" ", "").replace("-", "")
            ent_id = f"PHONE_{num}"
            add_entity(
                entity_id=ent_id,
                text_val=match.group(0),
                label=f"Phone ({num[-4:]})",
                node_type=NodeType.PHONE,
                risk=RiskLevel.MEDIUM,
                props={"number": num, "carrier": "Suspected Burner SIM", "country": "India"}
            )

        # 2. Extract Bank Accounts & IFSC
        for match in self.bank_pattern.finditer(text):
            acc_no = match.group(1)
            ent_id = f"BANK_{acc_no}"
            add_entity(
                entity_id=ent_id,
                text_val=acc_no,
                label=f"Account ending {acc_no[-4:]}",
                node_type=NodeType.BANK_ACCOUNT,
                risk=RiskLevel.HIGH,
                props={"account_number": acc_no, "type": "Hawala / Mule Transit Account"}
            )
        
        # 3. Extract Vehicles
        for match in self.vehicle_pattern.finditer(text):
            plate = match.group(0).replace(" ", "-").upper()
            ent_id = f"VEH_{plate.replace('-', '')}"
            add_entity(
                entity_id=ent_id,
                text_val=plate,
                label=f"Vehicle [{plate}]",
                node_type=NodeType.VEHICLE,
                risk=RiskLevel.MEDIUM,
                props={"plate_number": plate, "category": "Logistics / Transport"}
            )

        # 4. Extract Digital IDs (Telegram, Crypto, IP)
        for match in self.telegram_pattern.finditer(text):
            handle = match.group(0)
            ent_id = f"DIG_{handle.replace('@', '')}"
            add_entity(
                entity_id=ent_id,
                text_val=handle,
                label=f"Telegram ({handle})",
                node_type=NodeType.DIGITAL_ID,
                risk=RiskLevel.HIGH,
                props={"platform": "Telegram", "handle": handle, "encrypted": True}
            )

        for match in self.crypto_pattern.finditer(text):
            wallet = match.group(0)
            ent_id = f"DIG_{wallet[:10]}"
            add_entity(
                entity_id=ent_id,
                text_val=wallet,
                label=f"Crypto Wallet ({wallet[:6]}...{wallet[-4:]})",
                node_type=NodeType.DIGITAL_ID,
                risk=RiskLevel.CRITICAL,
                props={"platform": "Blockchain Crypto", "address": wallet}
            )

        for match in self.ip_pattern.finditer(text):
            ip = match.group(0)
            if not ip.startswith("127.") and not ip.startswith("0."):
                ent_id = f"DIG_IP_{ip.replace('.', '_')}"
                add_entity(
                    entity_id=ent_id,
                    text_val=ip,
                    label=f"IP Address ({ip})",
                    node_type=NodeType.DIGITAL_ID,
                    risk=RiskLevel.MEDIUM,
                    props={"platform": "Network IP", "ip_address": ip}
                )

        # 5. Extract Suspect Persons via Contextual Name Patterns
        name_patterns = [
            r'(?:accused|suspect|arrested|identified as|interrogated|kingpin|handler|courier|mule)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})',
            r'\b(?:Shri|Mr\.|Mastermind|Operator)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})',
            r'\b([A-Z][a-z]+\s+[A-Z][a-z]+)\s*(?:\(alias\s+[\'"]?([^\'")]+)[\'"]?\))'
        ]
        
        for pat in name_patterns:
            for match in re.finditer(pat, text):
                name = match.group(1).strip()
                # Exclude common false positive uppercase words
                if name.lower() not in ["new delhi", "central jail", "special cell", "police station", "high court", "supreme court", "state bank"]:
                    ent_id = f"PER_{name.replace(' ', '_').upper()}"
                    alias = match.group(2) if len(match.groups()) > 1 and match.group(2) else ""
                    add_entity(
                        entity_id=ent_id,
                        text_val=name,
                        label=f"{name}" + (f" ({alias})" if alias else ""),
                        node_type=NodeType.PERSON,
                        risk=RiskLevel.HIGH,
                        props={"full_name": name, "alias": alias, "status": "Under Investigation"}
                    )

        # 6. Extract Organizations
        for suffix in self.known_org_suffixes:
            org_pattern = rf'\b([A-Z][a-zA-Z0-9\s&-]{{2,25}}\s+{suffix})\b'
            for match in re.finditer(org_pattern, text):
                org_name = match.group(1).strip()
                ent_id = f"ORG_{org_name.replace(' ', '_').upper()}"
                add_entity(
                    entity_id=ent_id,
                    text_val=org_name,
                    label=org_name,
                    node_type=NodeType.ORGANIZATION,
                    risk=RiskLevel.HIGH,
                    props={"org_name": org_name, "category": "Front Entity / Syndicate"}
                )

        # 7. Extract Strategic Locations
        for loc_type in self.known_location_types:
            loc_pattern = rf'\b([A-Z][a-zA-Z\s]{{2,20}}\s+{loc_type})\b'
            for match in re.finditer(loc_pattern, text):
                loc_name = match.group(1).strip()
                ent_id = f"LOC_{loc_name.replace(' ', '_').upper()}"
                add_entity(
                    entity_id=ent_id,
                    text_val=loc_name,
                    label=loc_name,
                    node_type=NodeType.LOCATION,
                    risk=RiskLevel.MEDIUM,
                    props={"location_name": loc_name, "facility_type": loc_type}
                )

        # 8. Infer Contextual Relationships across extracted entities
        sentences = re.split(r'[\.\n;]+', text)
        for sent in sentences:
            sent_clean = sent.strip()
            if not sent_clean:
                continue

            # Find all entities mentioned in this sentence
            present_entities = []
            for ent in entities:
                if ent.text.lower() in sent_clean.lower():
                    present_entities.append(ent)

            # Check for keyword-driven relationships between pairs
            if len(present_entities) >= 2:
                for i in range(len(present_entities)):
                    for j in range(i + 1, len(present_entities)):
                        e1 = present_entities[i]
                        e2 = present_entities[j]
                        
                        sent_lower = sent_clean.lower()
                        rel_type = None
                        confidence = 0.85
                        
                        if any(w in sent_lower for w in ["called", "contacted", "spoke to", "dialed", "cdr", "frequent communication"]):
                            rel_type = EdgeType.CALLED
                        elif any(w in sent_lower for w in ["transferred", "paid", "hawala", "sent amount", "deposited", "remitted", "transaction"]):
                            rel_type = EdgeType.TRANSACTED_WITH
                        elif any(w in sent_lower for w in ["co-accused", "accomplice", "conspired with", "jointly"]):
                            rel_type = EdgeType.CO_ACCUSED
                        elif any(w in sent_lower for w in ["member of", "operates for", "directed by", "belongs to", "runs"]):
                            rel_type = EdgeType.MEMBER_OF
                        elif any(w in sent_lower for w in ["met at", "seen at", "visited", "rendezvous", "raid conducted at"]):
                            rel_type = EdgeType.MET_AT
                        elif any(w in sent_lower for w in ["owns", "registered owner", "driving", "possessing"]):
                            if e2.type == NodeType.VEHICLE:
                                rel_type = EdgeType.DRIVES_VEHICLE
                            elif e2.type == NodeType.PHONE:
                                rel_type = EdgeType.OWNS_DEVICE
                            elif e2.type == NodeType.BANK_ACCOUNT:
                                rel_type = EdgeType.OPERATES_ACCOUNT
                            else:
                                rel_type = EdgeType.ASSOCIATED_WITH
                        else:
                            rel_type = EdgeType.ASSOCIATED_WITH
                            confidence = 0.70

                        relationships.append(ExtractedRelationship(
                            source_text=e1.text,
                            target_text=e2.text,
                            type=rel_type,
                            confidence=confidence,
                            evidence_snippet=sent_clean[:180],
                            weight=0.85
                        ))

        # Generate summary
        summary = (
            f"Automated Law-Enforcement NLP Extraction completed for {source_type}. "
            f"Identified {len(entities)} discrete entities ({sum(1 for e in entities if e.type == NodeType.PERSON)} Persons, "
            f"{sum(1 for e in entities if e.type == NodeType.PHONE)} Phones, "
            f"{sum(1 for e in entities if e.type == NodeType.BANK_ACCOUNT)} Bank Accounts, "
            f"{sum(1 for e in entities if e.type == NodeType.ORGANIZATION)} Orgs) "
            f"and established {len(relationships)} actionable relational links."
        )

        return NLPAutoExtractionResponse(
            case_id=case_id,
            source_type=source_type,
            extracted_entities=entities,
            extracted_relationships=relationships,
            summary=summary,
            total_entities_found=len(entities),
            total_relationships_found=len(relationships)
        )

nlp_extractor = NLPEntityExtractor()

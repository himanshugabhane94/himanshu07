from typing import List, Dict, Any
from app.models.schemas import Node, Edge, Case, NodeType, EdgeType, RiskLevel
from app.services.graph_engine import graph_engine
from app.services.blockchain_service import blockchain_service

# Pre-defined Master Cases with Multi-Jurisdiction Metadata
DEMO_CASES: List[Case] = [
    Case(
        id="CASE-HAWALA-2024",
        fir_number="FIR 402/2024-ED-NDLS",
        title="Operation DarkNet Hawala: Cross-Border Shadow Banking Syndicate",
        description="Investigation into illicit multi-crore international Hawala operations, shell corporation layering, and cryptocurrency laundering via Dubai-Mumbai-Zurich financial corridor.",
        status="Active Investigation",
        lead_investigator="Inspector Rajesh Mehra",
        agency="Enforcement Directorate / MHA Financial Intelligence Unit",
        state="Delhi",
        police_station="Special Cell PS Lodhi Colony, New Delhi",
        date_filed="2024-01-10",
        case_type="Cross-Border Hawala & Money Laundering",
        created_at="2024-01-10T10:00:00Z",
        ipc_sections=["IPC 120B (Criminal Conspiracy)", "IPC 420 (Cheating)", "PMLA Sec 3 & 4 (Money Laundering)", "FEMA Sec 13"],
        tags=["Hawala", "Cryptocurrency", "Shell Companies", "High Value", "Cross-Border"],
        node_count=36,
        edge_count=58
    ),
    Case(
        id="CASE-NARCO-2024",
        fir_number="FIR 188/2024-NCB-WZ",
        title="Golden Crescent Narcotics Transit Corridor",
        description="Multi-state illicit psychotropic contraband and synthetic drug trafficking nexus operating through border drop points, customized logistics fleets, and encrypted dead-drops.",
        status="Active Surveillance",
        lead_investigator="Dr. Ananya Sen",
        agency="Narcotics Control Bureau (NCB) — Special Operations Wing",
        state="Punjab & Maharashtra",
        police_station="NCB Western Zone HQ & Firozpur Cantt PS",
        date_filed="2024-02-01",
        case_type="Inter-State Narcotics Trafficking",
        created_at="2024-02-01T14:30:00Z",
        ipc_sections=["NDPS Act Sec 21 (Commercial Quantity)", "NDPS Act Sec 29 (Abetment & Conspiracy)", "IPC 468 (Forgery)"],
        tags=["Narcotics", "Border Infiltration", "Logistics Fleet", "Burner SIMs"],
        node_count=34,
        edge_count=52
    ),
    Case(
        id="CASE-SLEEPER-2024",
        fir_number="FIR 77/2024-NIA-HQ",
        title="Clandestine Sleeper Cell & Cyber Subversion Grid",
        description="Counter-terror intelligence grid tracking low-signature clandestine sleeper modules utilizing multi-layer compartmentalized cells, burner hardware, and encrypted darknet command nodes.",
        status="Under Continuous Interception",
        lead_investigator="DIG Vikramaditya Singh",
        agency="National Investigation Agency (NIA) / MHA Special Task Force",
        state="Jammu & Kashmir / Delhi",
        police_station="NIA Special Crime PS New Delhi",
        date_filed="2024-01-05",
        case_type="Counter-Terror & Cyber Subversion",
        created_at="2024-01-05T08:15:00Z",
        ipc_sections=["UAPA Sec 18 (Terrorist Conspiracy)", "UAPA Sec 20 (Member of Terror Org)", "IT Act Sec 66F (Cyber Terrorism)"],
        tags=["Counter-Terror", "Sleeper Cells", "Dark Web", "Encrypted Comms"],
        node_count=32,
        edge_count=48
    )
]

def seed_database():
    """Populates graph engine and blockchain ledger with synthetic datasets for all 3 demo scenarios."""
    print("[CrimeNet] Initializing Synthetic Intelligence Knowledge Graph...")

    # ==========================================
    # SCENARIO 1: OPERATION DARKNET HAWALA (Jan 10, 2024 - Mar 25, 2024)
    # ==========================================
    hawala_nodes = [
        # Early Phase (Jan 10 - Jan 18)
        Node(id="LOC_ZAVERI_BAZAAR", label="Zaveri Bazaar Secret Vault", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-10T10:00:00Z", milestone_note="Jan 10, 2024: Special Cell raids clandestine cash & bullion vault at Zaveri Bazaar", properties={"city": "Mumbai", "type": "Cash Stash & Bullion Vault", "coordinates": "18.9501, 72.8315"}),
        Node(id="PER_ROHIT_KHANNA", label="Rohit Khanna", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-10T11:30:00Z", milestone_note="Jan 10, 2024: Cash courier Rohit Khanna detained on site with ₹4.5 Cr unbooked bullion ledger", properties={"role": "Cash Courier & Bullion Mule Manager", "operating_zone": "Zaveri Bazaar, Mumbai", "status": "Detained"}),
        Node(id="VEH_MERC_MH01", label="Armored Mercedes [MH-01-EA-7777]", type=NodeType.VEHICLE, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-12T16:00:00Z", properties={"make": "Mercedes Benz S-Class", "reg_owner": "Zenith Exports", "color": "Obsidian Black"}),
        Node(id="PH_VIKRAM_BURNER", label="+91-98201-99881 (Burner Alpha)", type=NodeType.PHONE, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024", "CASE-NARCO-2024"], discovered_date="2024-01-14T14:00:00Z", milestone_note="Jan 14, 2024: Recovered burner phone +91-98201-99881 intercepted under technical surveillance", properties={"imei": "864920049182391", "registered_fake_id": "Ramesh Gupta", "carrier": "Airtel", "cross_jurisdiction": "Active in Delhi FIR 402/2024 & Mumbai FIR 188/2024"}),

        # Mid Phase (Jan 22 - Feb 15)
        Node(id="PER_SAMEER_MERCHANT", label="Sameer Merchant", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-22T09:30:00Z", properties={"role": "Chartered Accountant & Shell Architect", "practice": "Nariman Point, Mumbai", "status": "Under Interrogation"}),
        Node(id="ACC_HDFC_MULE_1", label="HDFC Mule Account #501004", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024", "CASE-NARCO-2024"], discovered_date="2024-01-28T16:00:00Z", milestone_note="Jan 28, 2024: FIU flags HDFC Mule Account receiving high-volume cash bursts", properties={"bank": "HDFC Bank", "ifsc": "HDFC0000060", "branch": "Fort Mumbai", "status": "Frozen by ED", "cross_jurisdiction": "Delhi ED & Mumbai NCB"}),
        Node(id="PER_AMIT_PATEL", label="Amit Patel", type=NodeType.PERSON, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-01T11:00:00Z", properties={"role": "Money Mule Operator", "location": "Surat, Gujarat", "status": "Surveillance"}),
        Node(id="ACC_ICICI_MULE_2", label="ICICI Layering Acc #000419", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-05T12:00:00Z", properties={"bank": "ICICI Bank", "ifsc": "ICIC0000004", "branch": "Bandra Kurla Complex", "status": "Active Surveillance"}),
        Node(id="ORG_ZENITH_EXPORTS", label="Zenith Import & Export Pvt Ltd", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-06T14:00:00Z", milestone_note="Feb 06, 2024: Shell company Zenith Import & Export identified routing fraudulent software invoices", properties={"cin": "U51909MH2019PTC329102", "reg_address": "Fort, Mumbai", "type": "Invoicing Front"}),
        Node(id="DIG_TG_SHADOW", label="Telegram @vicky_vault_dxb", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-12T15:30:00Z", properties={"platform": "Telegram", "handle": "@vicky_vault_dxb", "two_factor_auth": True}),
        Node(id="PH_TARIQ_DUBAI", label="+971-50-8841920 (Dubai Secure)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-15T18:00:00Z", properties={"carrier": "du Telecom", "signal_encrypted": True}),

        # Overseas & Crypto Gateway Phase (Feb 20 - Mar 05)
        Node(id="PER_TARIQ_MANSOOR", label="Tariq Mansoor", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-20T11:00:00Z", milestone_note="Feb 20, 2024: Overseas Hawala controller Tariq Mansoor unmasked in Dubai Freezone", properties={"role": "Hawala Broker & Dubai Conduit", "nationality": "Indian", "residence": "Deira, Dubai", "status": "Absconding"}),
        Node(id="ORG_APEX_OVERSEAS", label="Apex Global Overseas FZE", type=NodeType.ORGANIZATION, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-20T11:30:00Z", properties={"jurisdiction": "Dubai DMCC Freezone", "type": "Shell Company", "declared_business": "General Trading"}),
        Node(id="PER_PRIYA_NAIR", label="Priya Nair", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-22T10:00:00Z", properties={"role": "Nominee Director (Front Entity)", "company": "Apex Global", "status": "Witness / Unaware Co-signee"}),
        Node(id="ORG_AL_NOOR_BULLION", label="Al-Noor Bullion Traders", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-24T14:00:00Z", properties={"jurisdiction": "Sharjah Gold Souk", "type": "Bullion Front", "turnover_inr": "₹ 140 Crore"}),
        Node(id="DIG_CRYPTO_WALLET_1", label="USDT Cold Wallet (0x71cA...8b99)", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024", "CASE-SLEEPER-2024"], discovered_date="2024-02-28T17:00:00Z", milestone_note="Feb 28, 2024: Flow-through transactions traced into TRON Cold Wallet holding 2.4M USDT", properties={"blockchain": "TRON TRC-20", "holding": "2,400,000 USDT", "address": "0x71cA4918ef9bC81920aa1982bbfe098172918b99", "cross_jurisdiction": "Hawala Layering & Sleeper Funding"}),
        Node(id="PER_KHALID_SHEIKH", label="Khalid Sheikh", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-02T13:00:00Z", properties={"role": "Crypto OTC Desk Handler", "platform": "Binance / Telegram P2P", "status": "Under Watch"}),
        Node(id="ACC_EMIRATES_NBD", label="Emirates NBD Corporate #4489", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-05T09:00:00Z", properties={"bank": "Emirates NBD", "currency": "AED", "signatory": "Tariq Mansoor"}),
        Node(id="ACC_SWISS_9941", label="Swiss Private Bank #CH9941", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-08T10:30:00Z", properties={"bank": "Banque Cantonale de Genève", "account_no": "CH89-0024-9941-8812", "balance_usd": "$4,850,000"}),

        # Climax / Kingpin Unmasking (Mar 15 - Mar 25)
        Node(id="PER_VIKRAM_SHARMA", label="Vikram Sharma (Alias Vicky Seth)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-15T18:00:00Z", milestone_note="Mar 15, 2024: Vikram Sharma (alias 'Vicky Seth') unmasked as syndicate kingpin & beneficial controller", properties={"role": "Shadow Financier & Syndicate Head", "nationality": "Indian", "passport": "Z8912441", "aliases": ["Vicky Seth", "The Banker"], "status": "Prime High-Value Target"}),
        Node(id="LOC_DUBAI_MARINA", label="Dubai Marina Penthouse #4402", type=NodeType.LOCATION, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-18T12:00:00Z", properties={"city": "Dubai", "type": "Command Headquarters", "country": "UAE"}),
        Node(id="PER_VICKY_SHARMA_MUMBAI", label="Vicky Sharma (Alias Sethji)", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-22T14:00:00Z", properties={"role": "Hawala Facilitator (Western Corridor)", "alias": "Sethji", "residence": "Bandra West, Mumbai", "phonetic_similarity": "90% match to Vikram Sharma in Delhi ED Case"})
    ]

    hawala_edges = [
        # Early Phase Edges
        Edge(id="EDG_H16", source="PER_ROHIT_KHANNA", target="LOC_ZAVERI_BAZAAR", type=EdgeType.MET_AT, weight=0.88, evidence_ref="Physical Surveillance & CCTV Footage", case_id="CASE-HAWALA-2024", timestamp="2024-01-10T12:00:00Z", discovered_date="2024-01-10T12:00:00Z"),
        Edge(id="EDG_H17", source="PER_ROHIT_KHANNA", target="VEH_MERC_MH01", type=EdgeType.DRIVES_VEHICLE, weight=0.80, evidence_ref="Fastag Toll Plaza Records (Vashi Bridge)", case_id="CASE-HAWALA-2024", timestamp="2024-01-12T16:30:00Z", discovered_date="2024-01-12T16:30:00Z"),
        
        # Mid Phase Edges
        Edge(id="EDG_H15", source="PER_SAMEER_MERCHANT", target="ORG_ZENITH_EXPORTS", type=EdgeType.ASSOCIATED_WITH, weight=0.90, properties={"role": "Auditor & Incorporator"}, evidence_ref="MCA-21 Filings", case_id="CASE-HAWALA-2024", timestamp="2024-01-22T10:00:00Z", discovered_date="2024-01-22T10:00:00Z"),
        Edge(id="EDG_H18", source="PER_AMIT_PATEL", target="ACC_HDFC_MULE_1", type=EdgeType.OPERATES_ACCOUNT, weight=0.95, evidence_ref="ATM Withdrawal CCTV & Signature Card", case_id="CASE-HAWALA-2024", timestamp="2024-01-28T16:30:00Z", discovered_date="2024-01-28T16:30:00Z"),
        Edge(id="EDG_H08", source="ACC_HDFC_MULE_1", target="ACC_ICICI_MULE_2", type=EdgeType.TRANSACTED_WITH, weight=0.90, properties={"amount_inr": "₹ 4,50,00,000", "tx_count": 18}, evidence_ref="FIU STR/CTR Alert #88190", case_id="CASE-HAWALA-2024", timestamp="2024-02-05T11:20:00Z", discovered_date="2024-02-05T11:20:00Z"),
        Edge(id="EDG_H09", source="ACC_ICICI_MULE_2", target="ORG_ZENITH_EXPORTS", type=EdgeType.TRANSACTED_WITH, weight=0.85, properties={"amount_inr": "₹ 4,20,00,000", "memo": "Bogus Software Invoicing"}, evidence_ref="GST Fraud Audit & E-Way Bill Log", case_id="CASE-HAWALA-2024", timestamp="2024-02-06T15:45:00Z", discovered_date="2024-02-06T15:45:00Z"),
        Edge(id="EDG_H05", source="PH_VIKRAM_BURNER", target="PH_TARIQ_DUBAI", type=EdgeType.CALLED, weight=0.88, properties={"call_count": 64, "total_duration_mins": 380}, evidence_ref="International Interception Log 2024-Q1", case_id="CASE-HAWALA-2024", timestamp="2024-02-15T21:15:00Z", discovered_date="2024-02-15T21:15:00Z"),
        Edge(id="EDG_H06", source="PER_TARIQ_MANSOOR", target="PH_TARIQ_DUBAI", type=EdgeType.OWNS_DEVICE, weight=0.95, evidence_ref="Emirates Telecom KYC Records", case_id="CASE-HAWALA-2024", timestamp="2024-02-15T21:30:00Z", discovered_date="2024-02-15T21:30:00Z"),
        
        # Overseas & Crypto Edges
        Edge(id="EDG_H10", source="ORG_ZENITH_EXPORTS", target="ORG_APEX_OVERSEAS", type=EdgeType.TRANSACTED_WITH, weight=0.95, properties={"amount_usd": "$520,000", "memo": "Over-invoiced Diamond Import"}, evidence_ref="Customs ICEGATE Cross-Border Remittance", case_id="CASE-HAWALA-2024", timestamp="2024-02-20T16:00:00Z", discovered_date="2024-02-20T16:00:00Z"),
        Edge(id="EDG_H20", source="PER_PRIYA_NAIR", target="ORG_APEX_OVERSEAS", type=EdgeType.MEMBER_OF, weight=0.70, properties={"role": "Nominee Director"}, evidence_ref="Corporate Registry Documents", case_id="CASE-HAWALA-2024", timestamp="2024-02-22T10:30:00Z", discovered_date="2024-02-22T10:30:00Z"),
        Edge(id="EDG_H07", source="PER_TARIQ_MANSOOR", target="ORG_AL_NOOR_BULLION", type=EdgeType.MEMBER_OF, weight=0.90, properties={"role": "Managing Partner"}, evidence_ref="Sharjah Chamber of Commerce", case_id="CASE-HAWALA-2024", timestamp="2024-02-24T14:30:00Z", discovered_date="2024-02-24T14:30:00Z"),
        Edge(id="EDG_H12", source="ORG_APEX_OVERSEAS", target="DIG_CRYPTO_WALLET_1", type=EdgeType.TRANSACTED_WITH, weight=0.88, properties={"amount_usdt": "1,200,000 USDT"}, evidence_ref="TRON Blockchain Explorer Chainalysis", case_id="CASE-HAWALA-2024", timestamp="2024-02-28T20:10:00Z", discovered_date="2024-02-28T20:10:00Z"),
        Edge(id="EDG_H19", source="PER_KHALID_SHEIKH", target="DIG_CRYPTO_WALLET_1", type=EdgeType.ASSOCIATED_WITH, weight=0.92, evidence_ref="Telegram Intercept & Wallet Key Match", case_id="CASE-HAWALA-2024", timestamp="2024-03-02T13:30:00Z", discovered_date="2024-03-02T13:30:00Z"),
        Edge(id="EDG_H13", source="DIG_CRYPTO_WALLET_1", target="ACC_HDFC_MULE_1", type=EdgeType.TRANSACTED_WITH, weight=0.85, properties={"amount_inr": "₹ 1,00,00,000", "type": "P2P Off-Ramp Cash Deposit"}, evidence_ref="Crypto Off-ramp P2P Counterparty Match", case_id="CASE-HAWALA-2024", timestamp="2024-03-05T09:30:00Z", discovered_date="2024-03-05T09:30:00Z"),
        Edge(id="EDG_H11", source="ORG_APEX_OVERSEAS", target="ACC_SWISS_9941", type=EdgeType.TRANSACTED_WITH, weight=0.92, properties={"amount_usd": "$500,000"}, evidence_ref="Swift MT103 Wire Confirmation", case_id="CASE-HAWALA-2024", timestamp="2024-03-08T18:00:00Z", discovered_date="2024-03-08T18:00:00Z"),

        # Kingpin Climax Edges
        Edge(id="EDG_H01", source="PER_VIKRAM_SHARMA", target="PH_VIKRAM_BURNER", type=EdgeType.OWNS_DEVICE, weight=0.95, evidence_ref="CDR Cell Tower Triangulation & IMSI Catcher", case_id="CASE-HAWALA-2024", timestamp="2024-03-15T18:30:00Z", discovered_date="2024-03-15T18:30:00Z"),
        Edge(id="EDG_H02", source="PER_VIKRAM_SHARMA", target="DIG_TG_SHADOW", type=EdgeType.ASSOCIATED_WITH, weight=0.90, evidence_ref="Forensic Extraction from iPhone 15 Pro", case_id="CASE-HAWALA-2024", timestamp="2024-03-15T19:00:00Z", discovered_date="2024-03-15T19:00:00Z"),
        Edge(id="EDG_H03", source="PER_VIKRAM_SHARMA", target="ACC_SWISS_9941", type=EdgeType.OPERATES_ACCOUNT, weight=0.98, evidence_ref="FATCA / CRS International Banking Leak", case_id="CASE-HAWALA-2024", timestamp="2024-03-16T09:00:00Z", discovered_date="2024-03-16T09:00:00Z"),
        Edge(id="EDG_H04", source="PER_VIKRAM_SHARMA", target="ORG_APEX_OVERSEAS", type=EdgeType.MEMBER_OF, weight=0.92, properties={"role": "Beneficial Owner 100%"}, evidence_ref="Dubai Commercial Registry Filing", case_id="CASE-HAWALA-2024", timestamp="2024-03-16T11:00:00Z", discovered_date="2024-03-16T11:00:00Z"),
        Edge(id="EDG_H14", source="PER_SAMEER_MERCHANT", target="PER_VIKRAM_SHARMA", type=EdgeType.CO_ACCUSED, weight=0.85, evidence_ref="FIR 402/2024 Chargesheet Annexure D", case_id="CASE-HAWALA-2024", timestamp="2024-03-17T10:00:00Z", discovered_date="2024-03-17T10:00:00Z"),
        Edge(id="EDG_H17B", source="PER_ROHIT_KHANNA", target="PER_VIKRAM_SHARMA", type=EdgeType.ASSOCIATED_WITH, weight=0.88, properties={"role": "Trusted Cash Courier"}, evidence_ref="Interrogative Disclosure Statement", case_id="CASE-HAWALA-2024", timestamp="2024-03-17T14:00:00Z", discovered_date="2024-03-17T14:00:00Z")
    ]

    # ==========================================
    # SCENARIO 2: CROSS-BORDER NARCOTICS CORRIDOR (Feb 01, 2024 - Apr 15, 2024)
    # ==========================================
    narco_nodes = [
        Node(id="LOC_ATTARI_DROPOFF", label="Attari Border Concealment Point", type=NodeType.LOCATION, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-01T03:00:00Z", milestone_note="Feb 01, 2024: Night thermal drone surveillance intercepts border contraband drop point at Attari", properties={"coordinates": "31.6032, 74.6045", "type": "Drone Drop Zone & Field Cache"}),
        Node(id="PER_GURPREET_SINGH", label="Gurpreet Singh (Alias Laddi)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-05T08:00:00Z", milestone_note="Feb 05, 2024: Border runner Gurpreet Singh arrested with 12kg contraband and Thuraya satellite phone", properties={"role": "Border Infiltration Courier & Cut-Vertex Bridge", "operating_base": "Firozpur, Punjab", "status": "Arrested with 12kg Contraband"}),
        Node(id="PH_GURPREET_SAT", label="Thuraya Satellite Comms [XT-0918]", type=NodeType.PHONE, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-05T08:30:00Z", properties={"type": "Encrypted Satellite Link", "imei": "358910029381920"}),
        Node(id="PER_HARPREET_KAUR", label="Harpreet Kaur", type=NodeType.PERSON, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-08T11:00:00Z", properties={"role": "Cross-Border Money Collector", "location": "Amritsar", "status": "Under Watch"}),
        
        Node(id="PH_IQBAL_ENCRYPTED", label="+92-300-8812741 (Cross-Border)", type=NodeType.PHONE, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-15T19:00:00Z", properties={"country": "Pakistan", "carrier": "Jazz Telecom"}),
        Node(id="PER_IQBAL_MIR", label="Iqbal Mir (Alias Tiger)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-15T19:30:00Z", milestone_note="Feb 15, 2024: Trans-border cartel controller Iqbal Mir (alias 'Tiger') intercepted transmitting drop coordinates", properties={"role": "International Drug Cartel Controller", "operating_base": "Lahore / Peshawar", "status": "Red Corner Notice Pending"}),
        Node(id="DIG_THREEMA_IQBAL", label="Threema ID: #99KF88A1", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-16T12:00:00Z", properties={"protocol": "Threema End-to-End Encrypted", "key_id": "99KF88A1"}),
        
        Node(id="PER_RAKESH_YADAV", label="Rakesh Yadav", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-22T10:00:00Z", properties={"role": "Highway Logistics Fleet Coordinator", "fleet_size": "14 Heavy Trucks", "status": "Detained"}),
        Node(id="ORG_FALCON_LOGISTICS", label="Falcon Transways & Logistics", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-22T12:00:00Z", properties={"gstin": "03AABCF8891P1ZX", "hq": "Ludhiana", "cover": "Agricultural Produce Transport"}),
        Node(id="VEH_TRUCK_PB10", label="Tata 16-Wheeler [PB-10-CZ-4412]", type=NodeType.VEHICLE, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024", "CASE-SLEEPER-2024"], discovered_date="2024-02-23T14:00:00Z", properties={"make": "Tata LPT 1618", "secret_cavity": "False Fuel Tank", "status": "Seized in Punjab, flagged in Delhi NIA memo", "cross_jurisdiction": "Punjab & Delhi Highway Logistics"}),
        
        Node(id="LOC_MAYAPURI_GODOWN", label="Mayapuri Secret Chemical Godown", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-05T11:00:00Z", milestone_note="Mar 05, 2024: Mayapuri secret chemical godown raided, linking supply lines to metro distribution", properties={"city": "New Delhi", "coordinates": "28.6318, 77.1294"}),
        Node(id="PER_MANOJ_SHUKLA", label="Manoj Shukla", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-05T11:30:00Z", properties={"role": "North India Distribution Head", "operating_base": "Mayapuri, New Delhi", "status": "Under Interrogation"}),
        Node(id="PH_MANOJ_BURNER", label="+91-98102-44109 (Delhi Receiver)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-06T09:00:00Z", properties={"carrier": "Vodafone Idea", "sim_activated": "False KYC"}),
        
        Node(id="PER_SUNIL_KAPOOR", label="Sunil Kapoor", type=NodeType.PERSON, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-18T16:00:00Z", properties={"role": "Metro Chemical Blender / Pharmacist", "lab_location": "Bhiwadi, Rajasthan", "status": "Under Surveillance"}),
        Node(id="ORG_SHREE_PHARMA", label="Shree Biotech Chemical Labs", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-18T16:30:00Z", properties={"type": "Illicit Precursor Processing Lab", "location": "RIICO Industrial Area, Bhiwadi"}),
        Node(id="LOC_BHIWADI_LAB", label="Bhiwadi Underground Synthesis Lab", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-20T10:00:00Z", milestone_note="Mar 20, 2024: Bhiwadi clandestine synthesis lab seized with ephedrine processing equipment", properties={"state": "Rajasthan", "facility": "Ephedrine Extraction Unit"})
    ]

    narco_edges = [
        Edge(id="EDG_N04", source="PER_GURPREET_SINGH", target="PH_GURPREET_SAT", type=EdgeType.OWNS_DEVICE, weight=0.96, evidence_ref="Physical Recovery on Suspect Person", case_id="CASE-NARCO-2024", timestamp="2024-02-05T08:30:00Z", discovered_date="2024-02-05T08:30:00Z"),
        Edge(id="EDG_N05", source="PER_GURPREET_SINGH", target="LOC_ATTARI_DROPOFF", type=EdgeType.MET_AT, weight=0.94, evidence_ref="Thermal Drone Night Surveillance", case_id="CASE-NARCO-2024", timestamp="2024-02-05T09:00:00Z", discovered_date="2024-02-05T09:00:00Z"),
        Edge(id="EDG_N16", source="PER_HARPREET_KAUR", target="PER_GURPREET_SINGH", type=EdgeType.FAMILY_OF, weight=0.95, properties={"relation": "Spouse & Hawala Receiver"}, evidence_ref="Aadhaar Card Record", case_id="CASE-NARCO-2024", timestamp="2024-02-08T11:30:00Z", discovered_date="2024-02-08T11:30:00Z"),
        Edge(id="EDG_N01", source="PER_IQBAL_MIR", target="PH_IQBAL_ENCRYPTED", type=EdgeType.OWNS_DEVICE, weight=0.98, evidence_ref="NCB Intercept Dossier #440", case_id="CASE-NARCO-2024", timestamp="2024-02-15T19:30:00Z", discovered_date="2024-02-15T19:30:00Z"),
        Edge(id="EDG_N02", source="PER_IQBAL_MIR", target="DIG_THREEMA_IQBAL", type=EdgeType.ASSOCIATED_WITH, weight=0.95, evidence_ref="Signal Intercept Intelligence", case_id="CASE-NARCO-2024", timestamp="2024-02-16T12:30:00Z", discovered_date="2024-02-16T12:30:00Z"),
        Edge(id="EDG_N03", source="PH_IQBAL_ENCRYPTED", target="PH_GURPREET_SAT", type=EdgeType.CALLED, weight=0.92, properties={"call_count": 48, "drop_coordinates_transmitted": True}, evidence_ref="Border Security Electronic Warfare Intercept", case_id="CASE-NARCO-2024", timestamp="2024-02-18T22:30:00Z", discovered_date="2024-02-18T22:30:00Z"),
        
        Edge(id="EDG_N06", source="PER_GURPREET_SINGH", target="PER_RAKESH_YADAV", type=EdgeType.CO_ACCUSED, weight=0.90, evidence_ref="Confession Statement Sec 67 NDPS Act", case_id="CASE-NARCO-2024", timestamp="2024-02-22T10:30:00Z", discovered_date="2024-02-22T10:30:00Z"),
        Edge(id="EDG_N07", source="PER_RAKESH_YADAV", target="ORG_FALCON_LOGISTICS", type=EdgeType.MEMBER_OF, weight=0.92, properties={"role": "Fleet Dispatcher"}, evidence_ref="Company Employment & Dispatch Log", case_id="CASE-NARCO-2024", timestamp="2024-02-22T12:30:00Z", discovered_date="2024-02-22T12:30:00Z"),
        Edge(id="EDG_N08", source="PER_RAKESH_YADAV", target="VEH_TRUCK_PB10", type=EdgeType.DRIVES_VEHICLE, weight=0.88, evidence_ref="NH-44 Toll Plaza GPS Log", case_id="CASE-NARCO-2024", timestamp="2024-02-23T14:30:00Z", discovered_date="2024-02-23T14:30:00Z"),
        Edge(id="EDG_N09", source="VEH_TRUCK_PB10", target="LOC_MAYAPURI_GODOWN", type=EdgeType.MET_AT, weight=0.85, evidence_ref="CCTV Camera Timestamp 04:12 AM", case_id="CASE-NARCO-2024", timestamp="2024-03-05T04:12:00Z", discovered_date="2024-03-05T04:12:00Z"),
        Edge(id="EDG_N10", source="PER_MANOJ_SHUKLA", target="LOC_MAYAPURI_GODOWN", type=EdgeType.ASSOCIATED_WITH, weight=0.92, properties={"role": "Godown Leaseholder"}, evidence_ref="Rent Agreement & Electricity Meter", case_id="CASE-NARCO-2024", timestamp="2024-03-05T11:45:00Z", discovered_date="2024-03-05T11:45:00Z"),
        Edge(id="EDG_N11", source="PER_MANOJ_SHUKLA", target="PH_MANOJ_BURNER", type=EdgeType.OWNS_DEVICE, weight=0.90, evidence_ref="Tower Location Handover", case_id="CASE-NARCO-2024", timestamp="2024-03-06T09:30:00Z", discovered_date="2024-03-06T09:30:00Z"),
        Edge(id="EDG_N12", source="PH_MANOJ_BURNER", target="PH_GURPREET_SAT", type=EdgeType.CALLED, weight=0.82, properties={"call_count": 22}, evidence_ref="CDR Matching Analysis", case_id="CASE-NARCO-2024", timestamp="2024-03-08T16:20:00Z", discovered_date="2024-03-08T16:20:00Z"),
        
        Edge(id="EDG_N13", source="PER_MANOJ_SHUKLA", target="PER_SUNIL_KAPOOR", type=EdgeType.TRANSACTED_WITH, weight=0.86, properties={"amount_inr": "₹ 35,00,000", "purpose": "Chemical Precursor Supply"}, evidence_ref="Hawala Slip & UPI Transaction Records", case_id="CASE-NARCO-2024", timestamp="2024-03-18T16:15:00Z", discovered_date="2024-03-18T16:15:00Z"),
        Edge(id="EDG_N14", source="PER_SUNIL_KAPOOR", target="ORG_SHREE_PHARMA", type=EdgeType.MEMBER_OF, weight=0.95, properties={"role": "Chief Chemist"}, evidence_ref="Factory License & Chemical Inspection", case_id="CASE-NARCO-2024", timestamp="2024-03-18T16:45:00Z", discovered_date="2024-03-18T16:45:00Z"),
        Edge(id="EDG_N15", source="PER_SUNIL_KAPOOR", target="LOC_BHIWADI_LAB", type=EdgeType.MET_AT, weight=0.90, evidence_ref="NCB Search & Seizure Memo", case_id="CASE-NARCO-2024", timestamp="2024-03-20T10:30:00Z", discovered_date="2024-03-20T10:30:00Z")
    ]

    # ==========================================
    # SCENARIO 3: CLANDESTINE SLEEPER CELL GRID (Jan 05, 2024 - Mar 30, 2024)
    # ==========================================
    sleeper_nodes = [
        Node(id="DIG_MATRIX_SERVER", label="Matrix Node: [onion://subversion77.onion]", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-05T22:00:00Z", milestone_note="Jan 05, 2024: Cyber command flags encrypted Tor hidden service node coordinating covert cell communications", properties={"protocol": "Matrix / Tor Hidden Service", "encryption": "Olm/Megolm ratchet"}),
        Node(id="PER_ZUBER_FAROOQ", label="Zuber Farooq (Alias Commander Z)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-18T10:00:00Z", properties={"role": "Strategic Controller / Handler", "covert_channel": "Matrix Federated Server", "status": "High Value Watchlist"}),
        Node(id="PER_MOHD_REHAN", label="Mohd. Rehan", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-20T14:00:00Z", properties={"role": "Technical / Darknet Comms Specialist", "skill": "RF & Encrypted Mesh Networks"}),
        
        Node(id="DIG_BITCOIN_MIXER", label="ChipMixer CoinJoin Tx [1P7X...]", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-28T16:00:00Z", milestone_note="Jan 28, 2024: ₹60 Lakhs ChipMixer CoinJoin funding intercepted during physical courier cash handover", properties={"blockchain": "Bitcoin", "anonymized": True, "funding_inr": "₹ 60 Lakhs"}),
        Node(id="PER_BILAL_AHMED", label="Bilal Ahmed", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-28T16:30:00Z", properties={"role": "Logistics & Forged Document Fabricator", "location": "Old Delhi"}),
        Node(id="PH_BILAL_BURNER", label="+91-99580-12847 (Delhi Contact)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-30T10:00:00Z", properties={"carrier": "BSNL", "imei": "359102948291045"}),
        
        Node(id="PER_ASIF_NAZIR", label="Asif Nazir", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-08T12:00:00Z", properties={"role": "Operational Module Leader", "status": "Infiltration Suspect"}),
        Node(id="PH_ASIF_BURNER", label="+91-70061-00214 (Kashmir Burner)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-08T12:30:00Z", properties={"location": "Baramulla", "imei": "862910034928190"}),
        Node(id="LOC_ANANTNAG_FOREST", label="Pahalgam Ridge Dead-Drop Point", type=NodeType.LOCATION, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-14T18:00:00Z", properties={"type": "Physical Geocache Cache", "coordinates": "34.0150, 75.3120"}),
        
        Node(id="LOC_BATLA_HOUSE_SAFE", label="Okhla Jamia Safe Apartment", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-22T15:00:00Z", milestone_note="Feb 22, 2024: Safehouse rendezvous pinpointed at Okhla Jamia safe apartment", properties={"city": "New Delhi", "coordinates": "28.5603, 77.2918"}),
        Node(id="PER_NAVEED_KHAN", label="Naveed Khan", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-22T15:30:00Z", properties={"role": "Dead-Drop Recon & Safehouse Custodian"}),
        Node(id="VEH_BIKE_DL3S", label="Bajaj Pulsar 220F [DL-3S-CJ-9912]", type=NodeType.VEHICLE, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-25T17:30:00Z", properties={"owner": "Forged ID: Ramesh Babu", "color": "Matte Black"})
    ]

    sleeper_edges = [
        Edge(id="EDG_S01", source="PER_ZUBER_FAROOQ", target="DIG_MATRIX_SERVER", type=EdgeType.ASSOCIATED_WITH, weight=0.98, evidence_ref="Cyber Forensics Darknet Traffic Analysis", case_id="CASE-SLEEPER-2024", timestamp="2024-01-18T10:30:00Z", discovered_date="2024-01-18T10:30:00Z"),
        Edge(id="EDG_S02", source="PER_MOHD_REHAN", target="DIG_MATRIX_SERVER", type=EdgeType.ASSOCIATED_WITH, weight=0.95, evidence_ref="Server Syslog Keymatch", case_id="CASE-SLEEPER-2024", timestamp="2024-01-20T14:30:00Z", discovered_date="2024-01-20T14:30:00Z"),
        Edge(id="EDG_S03", source="PER_ZUBER_FAROOQ", target="DIG_BITCOIN_MIXER", type=EdgeType.TRANSACTED_WITH, weight=0.92, properties={"amount_btc": "1.45 BTC"}, evidence_ref="Blockchain Cluster Demixing", case_id="CASE-SLEEPER-2024", timestamp="2024-01-28T16:15:00Z", discovered_date="2024-01-28T16:15:00Z"),
        Edge(id="EDG_S04", source="DIG_BITCOIN_MIXER", target="PER_BILAL_AHMED", type=EdgeType.TRANSACTED_WITH, weight=0.88, properties={"p2p_cash_handover": "₹ 18,00,000"}, evidence_ref="Physical Interception & Cash Recovery", case_id="CASE-SLEEPER-2024", timestamp="2024-01-28T16:45:00Z", discovered_date="2024-01-28T16:45:00Z"),
        Edge(id="EDG_S06", source="PER_BILAL_AHMED", target="PH_BILAL_BURNER", type=EdgeType.OWNS_DEVICE, weight=0.92, evidence_ref="SIM Registration Verification", case_id="CASE-SLEEPER-2024", timestamp="2024-01-30T10:30:00Z", discovered_date="2024-01-30T10:30:00Z"),
        
        Edge(id="EDG_S05", source="PER_ASIF_NAZIR", target="PH_ASIF_BURNER", type=EdgeType.OWNS_DEVICE, weight=0.95, evidence_ref="Cell Tower CDR", case_id="CASE-SLEEPER-2024", timestamp="2024-02-08T12:45:00Z", discovered_date="2024-02-08T12:45:00Z"),
        Edge(id="EDG_S07", source="PH_ASIF_BURNER", target="PH_BILAL_BURNER", type=EdgeType.CALLED, weight=0.75, properties={"call_count": 8, "duration_secs": 120}, evidence_ref="Midnight Burst Call Intercept", case_id="CASE-SLEEPER-2024", timestamp="2024-02-10T02:15:00Z", discovered_date="2024-02-10T02:15:00Z"),
        Edge(id="EDG_S08", source="PER_ASIF_NAZIR", target="LOC_ANANTNAG_FOREST", type=EdgeType.MET_AT, weight=0.90, evidence_ref="GPS Log from Seized Handheld Device", case_id="CASE-SLEEPER-2024", timestamp="2024-02-14T18:30:00Z", discovered_date="2024-02-14T18:30:00Z"),
        
        Edge(id="EDG_S09", source="PER_BILAL_AHMED", target="LOC_BATLA_HOUSE_SAFE", type=EdgeType.MET_AT, weight=0.92, evidence_ref="Lease Verification & Key Discovery", case_id="CASE-SLEEPER-2024", timestamp="2024-02-22T15:15:00Z", discovered_date="2024-02-22T15:15:00Z"),
        Edge(id="EDG_S10", source="PER_NAVEED_KHAN", target="LOC_BATLA_HOUSE_SAFE", type=EdgeType.MET_AT, weight=0.88, evidence_ref="Neighbourhood Witness Identification", case_id="CASE-SLEEPER-2024", timestamp="2024-02-22T15:45:00Z", discovered_date="2024-02-22T15:45:00Z"),
        Edge(id="EDG_S11", source="PER_NAVEED_KHAN", target="VEH_BIKE_DL3S", type=EdgeType.DRIVES_VEHICLE, weight=0.85, evidence_ref="CCTV Camera Surveillance (Ring Road)", case_id="CASE-SLEEPER-2024", timestamp="2024-02-25T18:00:00Z", discovered_date="2024-02-25T18:00:00Z")
    ]

    # Ingest All Nodes & Edges into Engine
    all_nodes = hawala_nodes + narco_nodes + sleeper_nodes
    all_edges = hawala_edges + narco_edges + sleeper_edges

    for node in all_nodes:
        graph_engine.add_node(node)

    for edge in all_edges:
        graph_engine.add_edge(edge)

    # Ingest Blocks into Immutable Evidence Blockchain
    blockchain_service.add_block(
        action="CASE_INGESTION_HAWALA",
        investigator="Inspector Rajesh Mehra (MHA-SP-8821)",
        case_id="CASE-HAWALA-2024",
        data_payload={"nodes_ingested": len(hawala_nodes), "edges_ingested": len(hawala_edges), "status": "SYNTHETIC_DATASET_COMMITTED"}
    )
    blockchain_service.add_block(
        action="CASE_INGESTION_NARCOTIC_CORRIDOR",
        investigator="Dr. Ananya Sen (MHA-IA-3041)",
        case_id="CASE-NARCO-2024",
        data_payload={"nodes_ingested": len(narco_nodes), "edges_ingested": len(narco_edges), "status": "SYNTHETIC_DATASET_COMMITTED"}
    )
    blockchain_service.add_block(
        action="CASE_INGESTION_SLEEPER_GRID",
        investigator="DIG Vikramaditya Singh (MHA-HQ-0012)",
        case_id="CASE-SLEEPER-2024",
        data_payload={"nodes_ingested": len(sleeper_nodes), "edges_ingested": len(sleeper_edges), "status": "SYNTHETIC_DATASET_COMMITTED"}
    )

    print(f"[CrimeNet] Database seeded successfully: {len(all_nodes)} nodes, {len(all_edges)} edges across 3 high-impact cases.")

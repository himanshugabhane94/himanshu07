from typing import List, Dict, Any
from app.models.schemas import Node, Edge, Case, NodeType, EdgeType, RiskLevel, ModusOperandi
from app.services.graph_engine import graph_engine
from app.services.blockchain_service import blockchain_service

# Pre-defined Master Cases with Multi-Jurisdiction Metadata across 9 Diverse Crime Categories + Unsolved Cold Cases
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
        crime_category="Hawala/Financial",
        modus_operandi=ModusOperandi(
            time_of_day="daytime",
            operating_method="syndicate_cell",
            mobility_type="used_vehicle",
            location_type="commercial",
            weapon_category="none",
            target_selection="high_net_worth",
            signatures=["mule_account_burst", "bogus_invoicing_front", "usdt_trc20_cold_storage"]
        ),
        created_at="2024-01-10T10:00:00Z",
        ipc_sections=["IPC 120B (Criminal Conspiracy)", "IPC 420 (Cheating)", "PMLA Sec 3 & 4 (Money Laundering)", "FEMA Sec 13"],
        tags=["Hawala", "Cryptocurrency", "Shell Companies", "High Value", "Cross-Border"],
        node_count=21,
        edge_count=21
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
        crime_category="Narcotics",
        modus_operandi=ModusOperandi(
            time_of_day="dawn",
            operating_method="syndicate_cell",
            mobility_type="freight_transit",
            location_type="highway_transit",
            weapon_category="firearm",
            target_selection="opportunistic",
            signatures=["altered_fuel_tank", "thuraya_satellite_ping", "dead_drop_gps"]
        ),
        created_at="2024-02-01T14:30:00Z",
        ipc_sections=["NDPS Act Sec 21 (Commercial Quantity)", "NDPS Act Sec 29 (Abetment & Conspiracy)", "IPC 468 (Forgery)"],
        tags=["Narcotics", "Border Infiltration", "Logistics Fleet", "Burner SIMs"],
        node_count=17,
        edge_count=16
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
        crime_category="Counter-Terrorism",
        modus_operandi=ModusOperandi(
            time_of_day="midnight",
            operating_method="lone_operator",
            mobility_type="two_wheeler",
            location_type="isolated_area",
            weapon_category="cyber_spoofing",
            target_selection="targeted",
            signatures=["tor_hidden_service", "chipmixer_coinjoin", "physical_dead_drop"]
        ),
        created_at="2024-01-05T08:15:00Z",
        ipc_sections=["UAPA Sec 18 (Terrorist Conspiracy)", "UAPA Sec 20 (Member of Terror Org)", "IT Act Sec 66F (Cyber Terrorism)"],
        tags=["Counter-Terror", "Sleeper Cells", "Dark Web", "Encrypted Comms"],
        node_count=12,
        edge_count=11
    ),
    Case(
        id="CASE-KIDNAP-2024",
        fir_number="FIR 104/2024-CRIME-DL",
        title="Operation Amber Shield: Extortion & Ransom Kidnapping Syndicate",
        description="Armed abduction of college student from South Delhi followed by ₹2 Crore cryptocurrency/cash ransom demands routed via burner towers along Haryana-Rajasthan border.",
        status="Hostage Rescued / Investigation Ongoing",
        lead_investigator="Inspector Rajesh Mehra",
        agency="Delhi Police Crime Branch (Anti-Extortion Cell)",
        state="Delhi & Haryana",
        police_station="Crime Branch PS Kamla Market, Delhi",
        date_filed="2024-02-10",
        case_type="Armed Kidnapping & Extortion",
        crime_category="Kidnapping",
        modus_operandi=ModusOperandi(
            time_of_day="night",
            operating_method="group_of_3+",
            mobility_type="used_vehicle",
            location_type="highway_transit",
            weapon_category="firearm",
            target_selection="targeted",
            signatures=["highway_abduction", "tampered_scorpio_chassis", "ransom_call_from_moving_vehicle"]
        ),
        created_at="2024-02-10T11:00:00Z",
        ipc_sections=["IPC 364A (Kidnapping for Ransom)", "IPC 386 (Extortion by Grievous Hurt)", "Arms Act Sec 25"],
        tags=["Kidnapping", "Ransom", "Inter-State Gang", "Highway Tracking", "Armed Gang"],
        node_count=8,
        edge_count=8
    ),
    Case(
        id="CASE-MURDER-2024",
        fir_number="FIR 312/2024-PS-GK1",
        title="Greater Kailash Homicide & Contract Kill Syndicate",
        description="Targeted homicide of real estate developer Subhash Singhal inside GK-1 residence. Technical surveillance uncovered ₹25 Lakh contract kill funded by estranged business partner.",
        status="Prime Accused Arrested / Weapon Seized",
        lead_investigator="Inspector Amit Deshmukh",
        agency="Special Cell / South District Police",
        state="Delhi",
        police_station="Greater Kailash PS, South Delhi",
        date_filed="2024-02-18",
        case_type="Targeted Homicide & Contract Killing",
        crime_category="Murder",
        modus_operandi=ModusOperandi(
            time_of_day="evening",
            operating_method="duo_partnership",
            mobility_type="two_wheeler",
            location_type="residential",
            weapon_category="firearm",
            target_selection="targeted",
            signatures=["contract_advance_cash", "point_blank_discharge", "two_wheeler_getaway"]
        ),
        created_at="2024-02-18T20:30:00Z",
        ipc_sections=["IPC 302 (Murder)", "IPC 120B (Criminal Conspiracy)", "Arms Act Sec 27"],
        tags=["Homicide", "Contract Killing", "Firearm Forensics", "Financial Motive"],
        node_count=7,
        edge_count=7
    ),
    Case(
        id="CASE-ASSAULT-2024",
        fir_number="FIR 89/2024-SPEC-CELL",
        title="Technical Surveillance: Gurugram Metro Corridor Assault Nexus",
        description="Statutory law enforcement metadata log: Technical triangulation of commercial taxi driver operating on forged permits near IFFCO Chowk, tracked via ANPR tolls and cellular pings.",
        status="Chargesheet Submitted to Court",
        lead_investigator="ACP Neha Sharma",
        agency="Special Cell Cyber & Forensics Division",
        state="Haryana & Delhi",
        police_station="Women Safety Cell PS Gurugram Sector-29",
        date_filed="2024-01-25",
        case_type="Sensitive Metro Incident Surveillance",
        crime_category="SexualAssault",
        modus_operandi=ModusOperandi(
            time_of_day="night",
            operating_method="lone_operator",
            mobility_type="commercial_taxi",
            location_type="highway_transit",
            weapon_category="blunt_force",
            target_selection="vulnerable_commuter",
            signatures=["forged_taxi_permit", "anpr_toll_avoidance", "night_commuter_intercept"]
        ),
        created_at="2024-01-25T09:00:00Z",
        ipc_sections=["IPC 354A (Assault & Outraging Modesty)", "IPC 376 r/w 511", "Motor Vehicles Act Sec 192"],
        tags=["Surveillance", "ANPR Tracking", "GPS Telematics", "Forensic Chain"],
        node_count=5,
        edge_count=4
    ),
    Case(
        id="CASE-STALK-2024",
        fir_number="FIR 62/2024-CYBER-DEL",
        title="Cyberstalking & Coercion Grid via Virtual Numbers",
        description="Organized digital stalking network using spoofed VoIP SIP trunks, virtual US numbers, and anonymous encrypted mailboxes targeting high-profile victims across Delhi NCR.",
        status="Digital Forensics & Server Trace",
        lead_investigator="Dr. Ananya Sen",
        agency="IFSO Special Cell / Cyber Crime Unit",
        state="Delhi",
        police_station="IFSO Cyber PS Dwarka Sector-17",
        date_filed="2024-02-04",
        case_type="Digital Coercion & Cyberstalking",
        crime_category="Harassment",
        modus_operandi=ModusOperandi(
            time_of_day="night",
            operating_method="lone_operator",
            mobility_type="commercial_taxi",
            location_type="digital_cyberspace",
            weapon_category="cyber_spoofing",
            target_selection="vulnerable_commuter",
            signatures=["virtual_sip_relay", "spoofed_did", "proton_threat_dispatch"]
        ),
        created_at="2024-02-04T15:00:00Z",
        ipc_sections=["IPC 354D (Stalking)", "IPC 506 (Criminal Intimidation)", "IT Act Sec 66E & 67"],
        tags=["Cyberstalking", "VoIP Spoofing", "Virtual Numbers", "Digital Forensics"],
        node_count=5,
        edge_count=4
    ),
    Case(
        id="CASE-THEFT-2024",
        fir_number="FIR 219/2024-CRIME-WZ",
        title="Inter-State Luxury Vehicle & Stolen Bullion Smuggling Ring",
        description="Specialized syndicate employing electronic OBD port cloners and key signal boosters to steal luxury vehicles and high-value bullion, subsequently fenced through Karol Bagh pawn brokers.",
        status="Fencing Network Uncovered / 4 Vehicles Recovered",
        lead_investigator="Inspector Rajesh Mehra",
        agency="Delhi Police Crime Branch (Auto Theft Squad)",
        state="Delhi & Rajasthan",
        police_station="Crime Branch PS Sector-16 Rohini",
        date_filed="2024-01-20",
        case_type="Organized Grand Auto Theft & Fencing",
        crime_category="Theft",
        modus_operandi=ModusOperandi(
            time_of_day="midnight",
            operating_method="duo_partnership",
            mobility_type="used_vehicle",
            location_type="commercial",
            weapon_category="none",
            target_selection="high_net_worth",
            signatures=["obd_cloning", "keyless_booster", "bullion_melting_fence"]
        ),
        created_at="2024-01-20T12:00:00Z",
        ipc_sections=["IPC 379 (Theft)", "IPC 411 (Receiving Stolen Property)", "IPC 413 (Habitually Dealing in Stolen Property)"],
        tags=["Auto Theft", "OBD Cloning", "Bullion Fencing", "Pawn Brokers"],
        node_count=6,
        edge_count=5
    ),
    Case(
        id="CASE-ROBBERY-2024",
        fir_number="FIR 415/2024-SPL-NDLS",
        title="Armed Cash Transit Van & Gold Heist (Janakpuri Ring Road)",
        description="Daylight armed blockade and heist of private cash transit van carrying ₹1.8 Crore bank chest. Ballistics and getaway vehicle link perpetrators to kidnapping and homicide cases.",
        status="Mastermind Identified / High-Priority Interception",
        lead_investigator="Inspector Amit Deshmukh",
        agency="Special Cell / Western Range Special Task Force",
        state="Delhi & Haryana",
        police_station="Janakpuri PS, West Delhi",
        date_filed="2024-02-24",
        case_type="Armed Dacoity & Highway Cash Heist",
        crime_category="Robbery",
        modus_operandi=ModusOperandi(
            time_of_day="night",
            operating_method="group_of_3+",
            mobility_type="used_vehicle",
            location_type="highway_transit",
            weapon_category="firearm",
            target_selection="targeted",
            signatures=["highway_blockade", "tampered_scorpio_chassis", "transit_cash_box_loot"]
        ),
        created_at="2024-02-24T16:45:00Z",
        ipc_sections=["IPC 392 (Robbery)", "IPC 397 (Robbery with Attempt to Cause Death)", "Arms Act Sec 25/27"],
        tags=["Armed Robbery", "Cash Transit", "Highway Heist", "Firearms Network", "Multi-Crime Syndicate"],
        node_count=7,
        edge_count=6
    ),
    # =========================================================================
    # OPEN / UNSOLVED COLD CASES (For Serial Offender Pattern Matching Engine)
    # =========================================================================
    Case(
        id="CASE-COLD-CARJACK-2024",
        fir_number="FIR 55/2024-HR-COLD",
        title="Unsolved Midnight Highway Carjacking (Manesar Toll)",
        description="Open Cold Case: Armed 3-man module in a dark SUV blocked a luxury sedan near KMP Expressway, fired countrymade rounds in the air, and fled towards Alwar border.",
        status="Unsolved Cold Case",
        lead_investigator="Special Investigation Team (SIT)",
        agency="Haryana Police / Highway Patrol Unit",
        state="Haryana",
        police_station="Manesar PS, Gurugram",
        date_filed="2024-01-18",
        case_type="Highway Armed Carjacking",
        crime_category="Robbery",
        modus_operandi=ModusOperandi(
            time_of_day="night",
            operating_method="group_of_3+",
            mobility_type="used_vehicle",
            location_type="highway_transit",
            weapon_category="firearm",
            target_selection="targeted",
            signatures=["highway_blockade", "tampered_scorpio_chassis", "ransom_call_from_moving_vehicle"]
        ),
        created_at="2024-01-18T23:30:00Z",
        ipc_sections=["IPC 392", "IPC 397", "Arms Act 25"],
        tags=["Cold Case", "Highway Blockade", "Armed SUV", "Unsolved"],
        node_count=0,
        edge_count=0
    ),
    Case(
        id="CASE-COLD-EXTORTION-2024",
        fir_number="FIR 19/2024-CYBER-COLD",
        title="Unsolved Night VoIP Extortion & Cyber Coercion",
        description="Open Cold Case: High-frequency midnight threatening calls originating from spoofed international VoIP numbers (+1-202) demanding crypto payouts, targeting solo night commuters.",
        status="Unsolved Cold Case",
        lead_investigator="Cyber Forensics Cell",
        agency="Delhi Police IFSO",
        state="Delhi",
        police_station="Cyber PS South-West Delhi",
        date_filed="2024-01-28",
        case_type="Digital Coercion & VoIP Threat",
        crime_category="Harassment",
        modus_operandi=ModusOperandi(
            time_of_day="night",
            operating_method="lone_operator",
            mobility_type="commercial_taxi",
            location_type="digital_cyberspace",
            weapon_category="cyber_spoofing",
            target_selection="vulnerable_commuter",
            signatures=["virtual_sip_relay", "spoofed_did"]
        ),
        created_at="2024-01-28T02:15:00Z",
        ipc_sections=["IPC 384", "IT Act Sec 66D"],
        tags=["Cold Case", "VoIP Spoofing", "Unsolved"],
        node_count=0,
        edge_count=0
    ),
    Case(
        id="CASE-COLD-VAULT-2024",
        fir_number="FIR 81/2024-ROHINI-COLD",
        title="Unsolved Wazirpur Gold Foundry Vault Break-In",
        description="Open Cold Case: Stealth commercial burglary of industrial bullion foundry during midnight power shutdown. Electronic alarms bypassed without forced physical door damage.",
        status="Unsolved Cold Case",
        lead_investigator="Crime Branch Special Squad",
        agency="Delhi Police Crime Branch",
        state="Delhi",
        police_station="Wazirpur Industrial Area PS",
        date_filed="2024-01-14",
        case_type="Commercial Vault Infiltration",
        crime_category="Theft",
        modus_operandi=ModusOperandi(
            time_of_day="midnight",
            operating_method="duo_partnership",
            mobility_type="used_vehicle",
            location_type="commercial",
            weapon_category="none",
            target_selection="high_net_worth",
            signatures=["obd_cloning", "bullion_melting_fence"]
        ),
        created_at="2024-01-14T01:45:00Z",
        ipc_sections=["IPC 380", "IPC 457"],
        tags=["Cold Case", "Vault Break-in", "Bullion", "Unsolved"],
        node_count=0,
        edge_count=0
    )
]

def seed_database():
    """Populates graph engine and blockchain ledger with synthetic datasets for all 9 diverse crime categories."""
    print("[SUTRA] Initializing Multi-Crime Category Synthetic Intelligence Knowledge Graph...")

    # =========================================================================
    # SCENARIO 1: OPERATION DARKNET HAWALA (Hawala/Financial)
    # =========================================================================
    hawala_nodes = [
        Node(id="LOC_ZAVERI_BAZAAR", label="Zaveri Bazaar Secret Vault", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-10T10:00:00Z", milestone_note="Jan 10, 2024: Special Cell raids clandestine cash & bullion vault at Zaveri Bazaar", properties={"city": "Mumbai", "type": "Cash Stash & Bullion Vault", "coordinates": "18.9501, 72.8315"}),
        Node(id="PER_ROHIT_KHANNA", label="Rohit Khanna", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-10T11:30:00Z", milestone_note="Jan 10, 2024: Cash courier Rohit Khanna detained on site with ₹4.5 Cr unbooked bullion ledger", properties={"role": "Cash Courier & Bullion Mule Manager", "operating_zone": "Zaveri Bazaar, Mumbai", "status": "Detained"}),
        Node(id="VEH_MERC_MH01", label="Armored Mercedes [MH-01-EA-7777]", type=NodeType.VEHICLE, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-12T16:00:00Z", properties={"make": "Mercedes Benz S-Class", "reg_owner": "Zenith Exports", "color": "Obsidian Black"}),
        Node(id="PH_VIKRAM_BURNER", label="+91-98201-99881 (Burner Alpha)", type=NodeType.PHONE, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024", "CASE-NARCO-2024"], discovered_date="2024-01-14T14:00:00Z", milestone_note="Jan 14, 2024: Recovered burner phone +91-98201-99881 intercepted under technical surveillance", properties={"imei": "864920049182391", "registered_fake_id": "Ramesh Gupta", "carrier": "Airtel", "cross_jurisdiction": "Active in Delhi FIR 402/2024 & Mumbai FIR 188/2024"}),
        Node(id="PER_SAMEER_MERCHANT", label="Sameer Merchant", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-01-22T09:30:00Z", properties={"role": "Chartered Accountant & Shell Architect", "practice": "Nariman Point, Mumbai", "status": "Under Interrogation"}),
        Node(id="ACC_HDFC_MULE_1", label="HDFC Mule Account #501004", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024", "CASE-NARCO-2024"], discovered_date="2024-01-28T16:00:00Z", milestone_note="Jan 28, 2024: FIU flags HDFC Mule Account receiving high-volume cash bursts", properties={"bank": "HDFC Bank", "ifsc": "HDFC0000060", "branch": "Fort Mumbai", "status": "Frozen by ED", "cross_jurisdiction": "Delhi ED & Mumbai NCB"}),
        Node(id="PER_AMIT_PATEL", label="Amit Patel", type=NodeType.PERSON, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-01T11:00:00Z", properties={"role": "Money Mule Operator", "location": "Surat, Gujarat", "status": "Surveillance"}),
        Node(id="ACC_ICICI_MULE_2", label="ICICI Layering Acc #000419", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-05T12:00:00Z", properties={"bank": "ICICI Bank", "ifsc": "ICIC0000004", "branch": "Bandra Kurla Complex", "status": "Active Surveillance"}),
        Node(id="ORG_ZENITH_EXPORTS", label="Zenith Import & Export Pvt Ltd", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-06T14:00:00Z", milestone_note="Feb 06, 2024: Shell company Zenith Import & Export identified routing fraudulent software invoices", properties={"cin": "U51909MH2019PTC329102", "reg_address": "Fort, Mumbai", "type": "Invoicing Front"}),
        Node(id="DIG_TG_SHADOW", label="Telegram @vicky_vault_dxb", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-12T15:30:00Z", properties={"platform": "Telegram", "handle": "@vicky_vault_dxb", "two_factor_auth": True}),
        Node(id="PH_TARIQ_DUBAI", label="+971-50-8841920 (Dubai Secure)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-15T18:00:00Z", properties={"carrier": "du Telecom", "signal_encrypted": True}),
        Node(id="PER_TARIQ_MANSOOR", label="Tariq Mansoor", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-20T11:00:00Z", milestone_note="Feb 20, 2024: Overseas Hawala controller Tariq Mansoor unmasked in Dubai Freezone", properties={"role": "Hawala Broker & Dubai Conduit", "nationality": "Indian", "residence": "Deira, Dubai", "status": "Absconding"}),
        Node(id="ORG_APEX_OVERSEAS", label="Apex Global Overseas FZE", type=NodeType.ORGANIZATION, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-20T11:30:00Z", properties={"jurisdiction": "Dubai DMCC Freezone", "type": "Shell Company", "declared_business": "General Trading"}),
        Node(id="PER_PRIYA_NAIR", label="Priya Nair", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-22T10:00:00Z", properties={"role": "Nominee Director (Front Entity)", "company": "Apex Global", "status": "Witness / Unaware Co-signee"}),
        Node(id="ORG_AL_NOOR_BULLION", label="Al-Noor Bullion Traders", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-02-24T14:00:00Z", properties={"jurisdiction": "Sharjah Gold Souk", "type": "Bullion Front", "turnover_inr": "₹ 140 Crore"}),
        Node(id="DIG_CRYPTO_WALLET_1", label="USDT Cold Wallet (0x71cA...8b99)", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024", "CASE-SLEEPER-2024"], discovered_date="2024-02-28T17:00:00Z", milestone_note="Feb 28, 2024: Flow-through transactions traced into TRON Cold Wallet holding 2.4M USDT", properties={"blockchain": "TRON TRC-20", "holding": "2,400,000 USDT", "address": "0x71cA4918ef9bC81920aa1982bbfe098172918b99", "cross_jurisdiction": "Hawala Layering & Sleeper Funding"}),
        Node(id="PER_KHALID_SHEIKH", label="Khalid Sheikh", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-02T13:00:00Z", properties={"role": "Crypto OTC Desk Handler", "platform": "Binance / Telegram P2P", "status": "Under Watch"}),
        Node(id="ACC_EMIRATES_NBD", label="Emirates NBD Corporate #4489", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-05T09:00:00Z", properties={"bank": "Emirates NBD", "currency": "AED", "signatory": "Tariq Mansoor"}),
        Node(id="ACC_SWISS_9941", label="Swiss Private Bank #CH9941", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-08T10:30:00Z", properties={"bank": "Banque Cantonale de Genève", "account_no": "CH89-0024-9941-8812", "balance_usd": "$4,850,000"}),
        Node(id="PER_VIKRAM_SHARMA", label="Vikram Sharma (Alias Vicky Seth)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-15T18:00:00Z", milestone_note="Mar 15, 2024: Vikram Sharma (alias 'Vicky Seth') unmasked as syndicate kingpin & beneficial controller", properties={"role": "Shadow Financier & Syndicate Head", "nationality": "Indian", "passport": "Z8912441", "aliases": ["Vicky Seth", "The Banker"], "status": "Prime High-Value Target"}),
        Node(id="LOC_DUBAI_MARINA", label="Dubai Marina Penthouse #4402", type=NodeType.LOCATION, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-HAWALA-2024"], discovered_date="2024-03-18T12:00:00Z", properties={"city": "Dubai", "type": "Command Headquarters", "country": "UAE"})
    ]

    hawala_edges = [
        Edge(id="EDG_H16", source="PER_ROHIT_KHANNA", target="LOC_ZAVERI_BAZAAR", type=EdgeType.MET_AT, weight=0.88, evidence_ref="Physical Surveillance & CCTV Footage", case_id="CASE-HAWALA-2024", timestamp="2024-01-10T12:00:00Z", discovered_date="2024-01-10T12:00:00Z"),
        Edge(id="EDG_H17", source="PER_ROHIT_KHANNA", target="VEH_MERC_MH01", type=EdgeType.DRIVES_VEHICLE, weight=0.80, evidence_ref="Fastag Toll Plaza Records", case_id="CASE-HAWALA-2024", timestamp="2024-01-12T16:30:00Z", discovered_date="2024-01-12T16:30:00Z"),
        Edge(id="EDG_H15", source="PER_SAMEER_MERCHANT", target="ORG_ZENITH_EXPORTS", type=EdgeType.ASSOCIATED_WITH, weight=0.90, properties={"role": "Auditor & Incorporator"}, evidence_ref="MCA-21 Filings", case_id="CASE-HAWALA-2024", timestamp="2024-01-22T10:00:00Z", discovered_date="2024-01-22T10:00:00Z"),
        Edge(id="EDG_H18", source="PER_AMIT_PATEL", target="ACC_HDFC_MULE_1", type=EdgeType.OPERATES_ACCOUNT, weight=0.95, evidence_ref="ATM Withdrawal CCTV", case_id="CASE-HAWALA-2024", timestamp="2024-01-28T16:30:00Z", discovered_date="2024-01-28T16:30:00Z"),
        Edge(id="EDG_H08", source="ACC_HDFC_MULE_1", target="ACC_ICICI_MULE_2", type=EdgeType.TRANSACTED_WITH, weight=0.90, properties={"amount_inr": "₹ 4,50,00,000"}, evidence_ref="FIU STR/CTR Alert #88190", case_id="CASE-HAWALA-2024", timestamp="2024-02-05T11:20:00Z", discovered_date="2024-02-05T11:20:00Z"),
        Edge(id="EDG_H09", source="ACC_ICICI_MULE_2", target="ORG_ZENITH_EXPORTS", type=EdgeType.TRANSACTED_WITH, weight=0.85, properties={"amount_inr": "₹ 4,20,00,000"}, evidence_ref="GST Fraud Audit", case_id="CASE-HAWALA-2024", timestamp="2024-02-06T15:45:00Z", discovered_date="2024-02-06T15:45:00Z"),
        Edge(id="EDG_H05", source="PH_VIKRAM_BURNER", target="PH_TARIQ_DUBAI", type=EdgeType.CALLED, weight=0.88, properties={"call_count": 64}, evidence_ref="International Interception Log", case_id="CASE-HAWALA-2024", timestamp="2024-02-15T21:15:00Z", discovered_date="2024-02-15T21:15:00Z"),
        Edge(id="EDG_H06", source="PER_TARIQ_MANSOOR", target="PH_TARIQ_DUBAI", type=EdgeType.OWNS_DEVICE, weight=0.95, evidence_ref="Emirates Telecom KYC", case_id="CASE-HAWALA-2024", timestamp="2024-02-15T21:30:00Z", discovered_date="2024-02-15T21:30:00Z"),
        Edge(id="EDG_H10", source="ORG_ZENITH_EXPORTS", target="ORG_APEX_OVERSEAS", type=EdgeType.TRANSACTED_WITH, weight=0.95, properties={"amount_usd": "$520,000"}, evidence_ref="Customs ICEGATE Remittance", case_id="CASE-HAWALA-2024", timestamp="2024-02-20T16:00:00Z", discovered_date="2024-02-20T16:00:00Z"),
        Edge(id="EDG_H20", source="PER_PRIYA_NAIR", target="ORG_APEX_OVERSEAS", type=EdgeType.MEMBER_OF, weight=0.70, evidence_ref="Corporate Registry", case_id="CASE-HAWALA-2024", timestamp="2024-02-22T10:30:00Z", discovered_date="2024-02-22T10:30:00Z"),
        Edge(id="EDG_H07", source="PER_TARIQ_MANSOOR", target="ORG_AL_NOOR_BULLION", type=EdgeType.MEMBER_OF, weight=0.90, evidence_ref="Sharjah Chamber of Commerce", case_id="CASE-HAWALA-2024", timestamp="2024-02-24T14:30:00Z", discovered_date="2024-02-24T14:30:00Z"),
        Edge(id="EDG_H12", source="ORG_APEX_OVERSEAS", target="DIG_CRYPTO_WALLET_1", type=EdgeType.TRANSACTED_WITH, weight=0.88, properties={"amount_usdt": "1,200,000 USDT"}, evidence_ref="TRON Blockchain Explorer", case_id="CASE-HAWALA-2024", timestamp="2024-02-28T20:10:00Z", discovered_date="2024-02-28T20:10:00Z"),
        Edge(id="EDG_H19", source="PER_KHALID_SHEIKH", target="DIG_CRYPTO_WALLET_1", type=EdgeType.OPERATES_ACCOUNT, weight=0.92, evidence_ref="IP Login Hash Analysis", case_id="CASE-HAWALA-2024", timestamp="2024-03-02T13:30:00Z", discovered_date="2024-03-02T13:30:00Z"),
        Edge(id="EDG_H11", source="ORG_APEX_OVERSEAS", target="ACC_EMIRATES_NBD", type=EdgeType.OPERATES_ACCOUNT, weight=0.95, evidence_ref="Bank Account Mandate", case_id="CASE-HAWALA-2024", timestamp="2024-03-05T09:30:00Z", discovered_date="2024-03-05T09:30:00Z"),
        Edge(id="EDG_H14", source="ACC_EMIRATES_NBD", target="ACC_SWISS_9941", type=EdgeType.TRANSACTED_WITH, weight=0.92, properties={"amount_usd": "$2,100,000"}, evidence_ref="SWIFT Wire MT103 Trace", case_id="CASE-HAWALA-2024", timestamp="2024-03-08T11:00:00Z", discovered_date="2024-03-08T11:00:00Z"),
        Edge(id="EDG_H01", source="PER_VIKRAM_SHARMA", target="PER_ROHIT_KHANNA", type=EdgeType.ASSOCIATED_WITH, weight=0.95, evidence_ref="Witness Statement", case_id="CASE-HAWALA-2024", timestamp="2024-03-15T18:30:00Z", discovered_date="2024-03-15T18:30:00Z"),
        Edge(id="EDG_H02", source="PER_VIKRAM_SHARMA", target="PH_VIKRAM_BURNER", type=EdgeType.OWNS_DEVICE, weight=0.98, evidence_ref="Tower Triangulation", case_id="CASE-HAWALA-2024", timestamp="2024-03-15T19:00:00Z", discovered_date="2024-03-15T19:00:00Z"),
        Edge(id="EDG_H03", source="PER_VIKRAM_SHARMA", target="DIG_TG_SHADOW", type=EdgeType.OPERATES_ACCOUNT, weight=0.92, evidence_ref="Forensic Dump", case_id="CASE-HAWALA-2024", timestamp="2024-03-15T19:15:00Z", discovered_date="2024-03-15T19:15:00Z"),
        Edge(id="EDG_H04", source="PER_VIKRAM_SHARMA", target="ACC_SWISS_9941", type=EdgeType.OPERATES_ACCOUNT, weight=0.96, evidence_ref="Beneficial Ownership Declaration", case_id="CASE-HAWALA-2024", timestamp="2024-03-15T19:30:00Z", discovered_date="2024-03-15T19:30:00Z"),
        Edge(id="EDG_H13", source="PER_VIKRAM_SHARMA", target="LOC_DUBAI_MARINA", type=EdgeType.MET_AT, weight=0.90, evidence_ref="Immigration Travel Record", case_id="CASE-HAWALA-2024", timestamp="2024-03-18T13:00:00Z", discovered_date="2024-03-18T13:00:00Z"),
        Edge(id="EDG_H21", source="ORG_AL_NOOR_BULLION", target="ACC_EMIRATES_NBD", type=EdgeType.TRANSACTED_WITH, weight=0.88, properties={"amount_aed": "AED 3,800,000"}, evidence_ref="Sharjah Exchange Receipt", case_id="CASE-HAWALA-2024", timestamp="2024-03-18T14:30:00Z", discovered_date="2024-03-18T14:30:00Z")
    ]

    # =========================================================================
    # SCENARIO 2: NARCOTICS TRANSIT CORRIDOR (Narcotics)
    # =========================================================================
    narco_nodes = [
        Node(id="LOC_ATTARI_BORDER", label="Attari Border Concealment Point", type=NodeType.LOCATION, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-01T14:30:00Z", milestone_note="Feb 01, 2024: Border drop location identified along Attari-Wagah agricultural fields", properties={"state": "Punjab", "type": "Border Infiltration Point", "coordinates": "31.6042, 74.6041"}),
        Node(id="PER_GURPREET_SINGH", label="Gurpreet Singh (Alias Laddi)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-02T10:00:00Z", milestone_note="Feb 02, 2024: Courier Gurpreet Singh intercepted operating satellite telephone near border line", properties={"role": "Primary Border Courier & Transshipment Head", "alias": "Laddi", "status": "Arrested"}),
        Node(id="DEV_THURAYA_SAT", label="Thuraya Satellite Comms [XT-0918]", type=NodeType.PHONE, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-02T10:30:00Z", properties={"imei": "88216901829410", "type": "Satellite Transceiver"}),
        Node(id="PER_IQBAL_MIR", label="Iqbal Mir (Handler)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-05T16:00:00Z", properties={"role": "Cross-Border Cartel Handler", "location": "Lahore, Pakistan", "status": "Red Corner Notice"}),
        Node(id="PH_IQBAL_SAT", label="+92-300-8812741 (Cross-Border Link)", type=NodeType.PHONE, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-05T16:30:00Z", properties={"carrier": "Jazz Telecom", "location": "Lahore"}),
        Node(id="PER_RAKESH_YADAV", label="Rakesh Yadav", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-10T12:00:00Z", properties={"role": "Logistics Dispatcher", "firm": "Falcon Transways", "status": "Custody"}),
        Node(id="ORG_FALCON_TRANSWAYS", label="Falcon Transways & Logistics", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-10T14:00:00Z", milestone_note="Feb 10, 2024: Fleet operator Falcon Transways flagged using modified fuel tanks for drug transit", properties={"reg_office": "Ludhiana Transport Nagar", "fleet_size": 42}),
        Node(id="VEH_TRUCK_PB10", label="Tata 16-Wheeler [PB-10-CZ-4412]", type=NodeType.VEHICLE, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-12T09:00:00Z", properties={"chassis_modified": True, "route": "Amritsar -> Delhi -> Mumbai"}),
        Node(id="LOC_MAYAPURI_GODOWN", label="Mayapuri Secret Chemical Godown", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-16T15:00:00Z", properties={"city": "New Delhi", "state": "Delhi NCR", "type": "Synthetic Processing Lab", "coordinates": "28.6295, 77.1332"}),
        Node(id="PER_MANOJ_SHUKLA", label="Manoj Shukla", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-16T15:30:00Z", properties={"role": "Chemical Processing Chemist", "status": "Arrested"}),
        Node(id="ORG_SHREE_BIOTECH", label="Shree Biotech Chemical Labs", type=NodeType.ORGANIZATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-20T11:00:00Z", properties={"location": "Vapi GIDC, Gujarat", "type": "Precursor Chemical Supplier"}),
        Node(id="PER_HARPREET_SANDHU", label="Harpreet Sandhu", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-25T17:00:00Z", milestone_note="Feb 25, 2024: Wholesale distributor Harpreet Sandhu detained at Mumbai airport", properties={"role": "Western Metro Distributor", "status": "Arrested"}),
        Node(id="LOC_DHARAVI_DISPENSARY", label="Dharavi Street Distribution Hub", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-02-28T19:00:00Z", properties={"city": "Mumbai", "state": "Maharashtra", "type": "Retail Distribution Point", "coordinates": "19.0434, 72.8567"}),
        Node(id="ACC_SBI_NARCO_MULE", label="SBI Mule Account #392810", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-05T10:00:00Z", properties={"bank": "State Bank of India", "branch": "Jalandhar Cantt", "turnover_inr": "₹ 1.8 Crore"}),
        Node(id="PER_DEVINDER_GILL", label="Devinder Gill", type=NodeType.PERSON, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-08T12:00:00Z", properties={"role": "Hawala Cash Collector (Punjab)", "status": "Surveillance"}),
        Node(id="PH_PUNJAB_LOCAL", label="+91-98765-43210 (Field Phone)", type=NodeType.PHONE, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-10T14:00:00Z", properties={"carrier": "Jio", "imei": "358910294819201"}),
        Node(id="LOC_WAGAH_BORDER_POST", label="Wagah Outpost Point #4", type=NodeType.LOCATION, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-12T16:00:00Z", properties={"city": "Amritsar", "state": "Punjab", "type": "Night Drop Coordinate", "border_fence": "BOP 44/2", "coordinates": "31.6048, 74.5762"}),
        Node(id="PER_VICKY_SHARMA_MUMBAI", label="Vicky Sharma (Alias Sethji)", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-NARCO-2024"], discovered_date="2024-03-22T14:00:00Z", properties={"role": "Hawala Facilitator (Western Corridor)", "alias": "Sethji", "residence": "Bandra West, Mumbai", "phonetic_similarity": "90% match to Vikram Sharma in Delhi ED Case"})
    ]

    narco_edges = [
        Edge(id="EDG_N01", source="PER_GURPREET_SINGH", target="LOC_ATTARI_BORDER", type=EdgeType.MET_AT, weight=0.95, evidence_ref="Night-Vision Video Footage", case_id="CASE-NARCO-2024", timestamp="2024-02-01T15:00:00Z", discovered_date="2024-02-01T15:00:00Z"),
        Edge(id="EDG_N02", source="PER_GURPREET_SINGH", target="DEV_THURAYA_SAT", type=EdgeType.OWNS_DEVICE, weight=0.98, evidence_ref="Physical Seizure Memo", case_id="CASE-NARCO-2024", timestamp="2024-02-02T10:45:00Z", discovered_date="2024-02-02T10:45:00Z"),
        Edge(id="EDG_N03", source="DEV_THURAYA_SAT", target="PH_IQBAL_SAT", type=EdgeType.CALLED, weight=0.92, properties={"call_count": 22}, evidence_ref="Thuraya Satellite Telemetry", case_id="CASE-NARCO-2024", timestamp="2024-02-05T17:00:00Z", discovered_date="2024-02-05T17:00:00Z"),
        Edge(id="EDG_N04", source="PER_IQBAL_MIR", target="PH_IQBAL_SAT", type=EdgeType.OWNS_DEVICE, weight=0.95, evidence_ref="Intelligence Agency Intercept", case_id="CASE-NARCO-2024", timestamp="2024-02-05T17:15:00Z", discovered_date="2024-02-05T17:15:00Z"),
        Edge(id="EDG_N05", source="PER_GURPREET_SINGH", target="PER_RAKESH_YADAV", type=EdgeType.ASSOCIATED_WITH, weight=0.88, evidence_ref="Co-Accused Confession", case_id="CASE-NARCO-2024", timestamp="2024-02-10T12:30:00Z", discovered_date="2024-02-10T12:30:00Z"),
        Edge(id="EDG_N06", source="PER_RAKESH_YADAV", target="ORG_FALCON_TRANSWAYS", type=EdgeType.MEMBER_OF, weight=0.90, evidence_ref="Company Employment Registry", case_id="CASE-NARCO-2024", timestamp="2024-02-10T14:30:00Z", discovered_date="2024-02-10T14:30:00Z"),
        Edge(id="EDG_N07", source="ORG_FALCON_TRANSWAYS", target="VEH_TRUCK_PB10", type=EdgeType.OWNS_DEVICE, weight=0.95, evidence_ref="Transport Permit Records", case_id="CASE-NARCO-2024", timestamp="2024-02-12T09:30:00Z", discovered_date="2024-02-12T09:30:00Z"),
        Edge(id="EDG_N08", source="VEH_TRUCK_PB10", target="LOC_MAYAPURI_GODOWN", type=EdgeType.MET_AT, weight=0.85, evidence_ref="GPS Tracking & Fastag", case_id="CASE-NARCO-2024", timestamp="2024-02-16T15:30:00Z", discovered_date="2024-02-16T15:30:00Z"),
        Edge(id="EDG_N09", source="PER_MANOJ_SHUKLA", target="LOC_MAYAPURI_GODOWN", type=EdgeType.MET_AT, weight=0.92, evidence_ref="Raid & Seizure Memo", case_id="CASE-NARCO-2024", timestamp="2024-02-16T16:00:00Z", discovered_date="2024-02-16T16:00:00Z"),
        Edge(id="EDG_N10", source="PER_MANOJ_SHUKLA", target="ORG_SHREE_BIOTECH", type=EdgeType.TRANSACTED_WITH, weight=0.80, properties={"precursor_kg": "450 kg Acetic Anhydride"}, evidence_ref="Chemical Invoices", case_id="CASE-NARCO-2024", timestamp="2024-02-20T11:30:00Z", discovered_date="2024-02-20T11:30:00Z"),
        Edge(id="EDG_N11", source="PER_MANOJ_SHUKLA", target="PER_HARPREET_SANDHU", type=EdgeType.ASSOCIATED_WITH, weight=0.90, evidence_ref="CDR Call Frequency Analysis", case_id="CASE-NARCO-2024", timestamp="2024-02-25T17:30:00Z", discovered_date="2024-02-25T17:30:00Z"),
        Edge(id="EDG_N12", source="PER_HARPREET_SANDHU", target="LOC_DHARAVI_DISPENSARY", type=EdgeType.MET_AT, weight=0.88, evidence_ref="Undercover Narcotics Agent", case_id="CASE-NARCO-2024", timestamp="2024-02-28T19:30:00Z", discovered_date="2024-02-28T19:30:00Z"),
        Edge(id="EDG_N13", source="PER_HARPREET_SANDHU", target="ACC_SBI_NARCO_MULE", type=EdgeType.TRANSACTED_WITH, weight=0.85, properties={"amount_inr": "₹ 75,00,000"}, evidence_ref="Bank STR Flag", case_id="CASE-NARCO-2024", timestamp="2024-03-05T10:30:00Z", discovered_date="2024-03-05T10:30:00Z"),
        Edge(id="EDG_N14", source="PER_DEVINDER_GILL", target="ACC_SBI_NARCO_MULE", type=EdgeType.OPERATES_ACCOUNT, weight=0.92, evidence_ref="ATM Card Recovery", case_id="CASE-NARCO-2024", timestamp="2024-03-08T12:30:00Z", discovered_date="2024-03-08T12:30:00Z"),
        Edge(id="EDG_N15", source="PER_DEVINDER_GILL", target="PH_PUNJAB_LOCAL", type=EdgeType.OWNS_DEVICE, weight=0.95, evidence_ref="SIM Subscriber CAF Form", case_id="CASE-NARCO-2024", timestamp="2024-03-10T14:30:00Z", discovered_date="2024-03-10T14:30:00Z"),
        Edge(id="EDG_N16", source="PER_GURPREET_SINGH", target="LOC_WAGAH_BORDER_POST", type=EdgeType.MET_AT, weight=0.90, evidence_ref="BSF Patrol Incident Log", case_id="CASE-NARCO-2024", timestamp="2024-03-12T16:30:00Z", discovered_date="2024-03-12T16:30:00Z")
    ]

    # =========================================================================
    # SCENARIO 3: CLANDESTINE SLEEPER CELL (Counter-Terrorism)
    # =========================================================================
    sleeper_nodes = [
        Node(id="DIG_MATRIX_SERVER", label="Matrix Node: [onion://subversion77.onion]", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-05T22:00:00Z", milestone_note="Jan 05, 2024: Cyber command flags encrypted Tor hidden service node coordinating covert cell communications", properties={"protocol": "Matrix / Tor Hidden Service", "encryption": "Olm/Megolm ratchet"}),
        Node(id="PER_ZUBER_FAROOQ", label="Zuber Farooq (Alias Commander Z)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-18T10:00:00Z", properties={"role": "Strategic Controller / Handler", "covert_channel": "Matrix Federated Server", "status": "High Value Watchlist"}),
        Node(id="PER_MOHD_REHAN", label="Mohd. Rehan", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-20T14:00:00Z", properties={"role": "Technical / Darknet Comms Specialist", "skill": "RF & Encrypted Mesh Networks"}),
        Node(id="DIG_BITCOIN_MIXER", label="ChipMixer CoinJoin Tx [1P7X...]", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-28T16:00:00Z", milestone_note="Jan 28, 2024: ₹60 Lakhs ChipMixer CoinJoin funding intercepted during physical courier cash handover", properties={"blockchain": "Bitcoin", "anonymized": True, "funding_inr": "₹ 60 Lakhs"}),
        Node(id="PER_BILAL_AHMED", label="Bilal Ahmed", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-28T16:30:00Z", properties={"role": "Logistics & Forged Document Fabricator", "location": "Old Delhi"}),
        Node(id="PH_BILAL_BURNER", label="+91-99580-12847 (Delhi Contact)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-01-30T10:00:00Z", properties={"carrier": "BSNL", "imei": "359102948291045"}),
        Node(id="PER_ASIF_NAZIR", label="Asif Nazir", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-08T12:00:00Z", properties={"role": "Operational Module Leader", "status": "Infiltration Suspect"}),
        Node(id="PH_ASIF_BURNER", label="+91-70061-00214 (Kashmir Burner)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-08T12:30:00Z", properties={"location": "Baramulla", "imei": "862910034928190"}),
        Node(id="LOC_ANANTNAG_FOREST", label="Pahalgam Ridge Dead-Drop Point", type=NodeType.LOCATION, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-14T18:00:00Z", properties={"city": "Anantnag", "state": "Jammu & Kashmir", "type": "Physical Geocache Cache", "coordinates": "34.0150, 75.3120"}),
        Node(id="LOC_BATLA_HOUSE_SAFE", label="Okhla Jamia Safe Apartment", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-SLEEPER-2024"], discovered_date="2024-02-22T15:00:00Z", milestone_note="Feb 22, 2024: Safehouse rendezvous pinpointed at Okhla Jamia safe apartment", properties={"city": "New Delhi", "state": "Delhi NCR", "type": "Urban Safehouse", "coordinates": "28.5603, 77.2918"}),
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
        Edge(id="EDG_S07", source="PH_ASIF_BURNER", target="PH_BILAL_BURNER", type=EdgeType.CALLED, weight=0.75, properties={"call_count": 8}, evidence_ref="Midnight Burst Call Intercept", case_id="CASE-SLEEPER-2024", timestamp="2024-02-10T02:15:00Z", discovered_date="2024-02-10T02:15:00Z"),
        Edge(id="EDG_S08", source="PER_ASIF_NAZIR", target="LOC_ANANTNAG_FOREST", type=EdgeType.MET_AT, weight=0.90, evidence_ref="GPS Log from Seized Handheld Device", case_id="CASE-SLEEPER-2024", timestamp="2024-02-14T18:30:00Z", discovered_date="2024-02-14T18:30:00Z"),
        Edge(id="EDG_S09", source="PER_BILAL_AHMED", target="LOC_BATLA_HOUSE_SAFE", type=EdgeType.MET_AT, weight=0.92, evidence_ref="Lease Verification & Key Discovery", case_id="CASE-SLEEPER-2024", timestamp="2024-02-22T15:15:00Z", discovered_date="2024-02-22T15:15:00Z"),
        Edge(id="EDG_S10", source="PER_NAVEED_KHAN", target="LOC_BATLA_HOUSE_SAFE", type=EdgeType.MET_AT, weight=0.88, evidence_ref="Neighbourhood Witness Identification", case_id="CASE-SLEEPER-2024", timestamp="2024-02-22T15:45:00Z", discovered_date="2024-02-22T15:45:00Z"),
        Edge(id="EDG_S11", source="PER_NAVEED_KHAN", target="VEH_BIKE_DL3S", type=EdgeType.DRIVES_VEHICLE, weight=0.85, evidence_ref="CCTV Camera Surveillance (Ring Road)", case_id="CASE-SLEEPER-2024", timestamp="2024-02-25T18:00:00Z", discovered_date="2024-02-25T18:00:00Z")
    ]

    # =========================================================================
    # SCENARIO 4: OPERATION AMBER SHIELD (Kidnapping & Ransom Syndicate)
    # =========================================================================
    kidnap_nodes = [
        Node(id="PER_AARAV_MALHOTRA", label="Aarav Malhotra (Victim)", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-KIDNAP-2024"], discovered_date="2024-02-10T11:00:00Z", properties={"role": "Victim", "anonymized_id": "VIC-KIDNAP-104", "crime_category": "Kidnapping", "protection_status": "Special Police Escort", "case_summary": "Armed student abduction for crypto ransom", "status": "Rescued in Tactical Raid", "age": 21}),
        Node(id="PER_KULDEEP_YADAV", label="Kuldeep Yadav (Alias KD)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-THEFT-2024", "CASE-ROBBERY-2024", "CASE-KIDNAP-2024", "CASE-STALK-2024"], discovered_date="2024-02-10T11:30:00Z", properties={"role": "Syndicate Logistics, Driver & Armed Enforcer", "alias": "KD / Ustaad", "cross_jurisdiction": "Multi-Crime Linkage: Theft FIR 219/24, Robbery FIR 415/24, Stalking FIR 62/24 & Kidnapping FIR 104/24"}),
        Node(id="PER_SUNIL_RAWAT", label="Sunil 'Goli' Rawat", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-KIDNAP-2024"], discovered_date="2024-02-11T14:00:00Z", properties={"role": "Extortion Caller & Guard", "status": "Arrested"}),
        Node(id="PH_RANSOM_BURNER", label="+91-98110-33441 (Ransom Burner)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-KIDNAP-2024"], discovered_date="2024-02-11T14:30:00Z", properties={"carrier": "Vodafone Idea", "tower_location": "Alwar-Bhiwadi Highway"}),
        Node(id="VEH_SCORPIO_DL4C", label="White Mahindra Scorpio [DL-4C-NA-8821]", type=NodeType.VEHICLE, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-KIDNAP-2024", "CASE-ROBBERY-2024"], discovered_date="2024-02-12T10:00:00Z", properties={"make": "Mahindra Scorpio S11", "chassis_altered": True, "cross_jurisdiction": "Used in South Delhi Kidnapping & Janakpuri Cash Heist"}),
        Node(id="LOC_ALWAR_KILN", label="Abandoned Brick Kiln (Alwar Border)", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-KIDNAP-2024"], discovered_date="2024-02-13T16:00:00Z", properties={"city": "Alwar", "state": "Rajasthan", "type": "Hostage Confinement Safehouse", "coordinates": "27.5530, 76.6346"}),
        Node(id="WEP_DESI_KATTE_9MM", label="Countrymade .315 Katta #KD01", type=NodeType.WEAPON, risk_level=RiskLevel.HIGH, case_ids=["CASE-KIDNAP-2024"], discovered_date="2024-02-13T16:30:00Z", properties={"type": "Countrymade Firearm", "caliber": ".315 bore", "recovered_from": "Kuldeep Yadav"}),
        Node(id="LOC_SAKET_METRO", label="Saket PVR Parking Abduction Point", type=NodeType.LOCATION, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-KIDNAP-2024"], discovered_date="2024-02-10T11:15:00Z", properties={"city": "New Delhi", "state": "Delhi NCR", "type": "Abduction Scene", "coordinates": "28.5204, 77.2017"})
    ]

    kidnap_edges = [
        Edge(id="EDG_K01", source="PER_AARAV_MALHOTRA", target="PER_KULDEEP_YADAV", type=EdgeType.VICTIM_OF, weight=0.98, evidence_ref="CCTV Footage & Victim Statement", case_id="CASE-KIDNAP-2024", timestamp="2024-02-10T11:45:00Z", discovered_date="2024-02-10T11:45:00Z"),
        Edge(id="EDG_K02", source="PER_KULDEEP_YADAV", target="VEH_SCORPIO_DL4C", type=EdgeType.DRIVES_VEHICLE, weight=0.95, evidence_ref="Toll ANPR Camera Pings", case_id="CASE-KIDNAP-2024", timestamp="2024-02-10T12:30:00Z", discovered_date="2024-02-10T12:30:00Z"),
        Edge(id="EDG_K03", source="PER_AARAV_MALHOTRA", target="LOC_ALWAR_KILN", type=EdgeType.HELD_CAPTIVE_AT, weight=0.95, evidence_ref="Tactical Rescue Memo", case_id="CASE-KIDNAP-2024", timestamp="2024-02-10T14:00:00Z", discovered_date="2024-02-10T14:00:00Z"),
        Edge(id="EDG_K04", source="PER_SUNIL_RAWAT", target="LOC_ALWAR_KILN", type=EdgeType.MET_AT, weight=0.90, evidence_ref="Raid Arrest Log", case_id="CASE-KIDNAP-2024", timestamp="2024-02-11T15:00:00Z", discovered_date="2024-02-11T15:00:00Z"),
        Edge(id="EDG_K05", source="PER_SUNIL_RAWAT", target="PH_RANSOM_BURNER", type=EdgeType.OWNS_DEVICE, weight=0.92, evidence_ref="Tower Voice Sample Match", case_id="CASE-KIDNAP-2024", timestamp="2024-02-11T15:30:00Z", discovered_date="2024-02-11T15:30:00Z"),
        Edge(id="EDG_K06", source="PER_KULDEEP_YADAV", target="WEP_DESI_KATTE_9MM", type=EdgeType.USED_WEAPON, weight=0.92, evidence_ref="Physical Arms Recovery", case_id="CASE-KIDNAP-2024", timestamp="2024-02-13T17:00:00Z", discovered_date="2024-02-13T17:00:00Z"),
        Edge(id="EDG_K07", source="PER_KULDEEP_YADAV", target="PER_SUNIL_RAWAT", type=EdgeType.CO_ACCUSED, weight=0.88, evidence_ref="Crime Branch Chargesheet", case_id="CASE-KIDNAP-2024", timestamp="2024-02-13T17:30:00Z", discovered_date="2024-02-13T17:30:00Z"),
        Edge(id="EDG_K08", source="PER_AARAV_MALHOTRA", target="LOC_SAKET_METRO", type=EdgeType.LOCATED_AT, weight=0.90, evidence_ref="Initial PCR Distress Call", case_id="CASE-KIDNAP-2024", timestamp="2024-02-10T11:20:00Z", discovered_date="2024-02-10T11:20:00Z")
    ]

    # =========================================================================
    # SCENARIO 5: GREATER KAILASH HOMICIDE (Murder)
    # =========================================================================
    murder_nodes = [
        Node(id="PER_SUBHASH_SINGHAL", label="Subhash Singhal (Victim)", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-MURDER-2024"], discovered_date="2024-02-18T20:30:00Z", properties={"role": "Victim", "anonymized_id": "VIC-HOMICIDE-312", "crime_category": "Murder", "case_summary": "Fatal gunshot injury in commercial dispute", "motive": "Commercial Property Dispute ₹12 Cr"}),
        Node(id="PER_PRADEEP_SINGHAL", label="Pradeep Singhal (Mastermind)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-MURDER-2024"], discovered_date="2024-02-19T10:00:00Z", properties={"role": "Partner & Financial Beneficiary", "status": "Chargesheeted"}),
        Node(id="PER_RAMESH_BAGGA", label="Ramesh 'Shooter' Bagga", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-MURDER-2024", "CASE-ROBBERY-2024"], discovered_date="2024-02-20T14:00:00Z", properties={"role": "Contract Shooter & Arms Supplier", "alias": "Bagga Shooter", "cross_jurisdiction": "GK-1 Homicide FIR 312/2024 & Janakpuri Armed Robbery FIR 415/2024"}),
        Node(id="WEP_PISTOL_32", label="Countrymade .32 Pistol [SN: IND-7721]", type=NodeType.WEAPON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-MURDER-2024"], discovered_date="2024-02-21T16:00:00Z", properties={"caliber": ".32 Auto", "ballistics": "FSL Ballistic Match with Spent Cartridge"}),
        Node(id="LOC_GK1_PENTHOUSE", label="Singhal Enclave Penthouse (GK-1)", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-MURDER-2024"], discovered_date="2024-02-18T21:00:00Z", properties={"type": "Crime Scene Location", "city": "New Delhi", "state": "Delhi NCR", "coordinates": "28.5528, 77.2372"}),
        Node(id="PER_DINESH_JOSHI", label="Dinesh Joshi (Eyewitness)", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-MURDER-2024"], discovered_date="2024-02-18T22:00:00Z", properties={"role": "Witness", "testimony": "Identified shooter escaping on motorcycle"}),
        Node(id="ACC_CONTRACT_CASH", label="Pradeep Singhal Current Acc #1092", type=NodeType.BANK_ACCOUNT, risk_level=RiskLevel.HIGH, case_ids=["CASE-MURDER-2024"], discovered_date="2024-02-22T11:00:00Z", properties={"bank": "Kotak Mahindra Bank", "withdrawal": "₹ 25 Lakhs Cash Withdrawal prior to attack"})
    ]

    murder_edges = [
        Edge(id="EDG_M01", source="PER_PRADEEP_SINGHAL", target="PER_RAMESH_BAGGA", type=EdgeType.TRANSACTED_WITH, weight=0.95, properties={"contract_amount": "₹ 25,00,000"}, evidence_ref="Secret Meeting CCTV & Cash Trace", case_id="CASE-MURDER-2024", timestamp="2024-02-17T18:00:00Z", discovered_date="2024-02-17T18:00:00Z"),
        Edge(id="EDG_M02", source="PER_RAMESH_BAGGA", target="PER_SUBHASH_SINGHAL", type=EdgeType.USED_WEAPON, weight=0.98, evidence_ref="Forensic Autopsy & Ballistic Report", case_id="CASE-MURDER-2024", timestamp="2024-02-18T20:45:00Z", discovered_date="2024-02-18T20:45:00Z"),
        Edge(id="EDG_M03", source="PER_RAMESH_BAGGA", target="WEP_PISTOL_32", type=EdgeType.USED_WEAPON, weight=0.96, evidence_ref="FSL Rohini Ballistics Report", case_id="CASE-MURDER-2024", timestamp="2024-02-21T16:30:00Z", discovered_date="2024-02-21T16:30:00Z"),
        Edge(id="EDG_M04", source="PER_SUBHASH_SINGHAL", target="LOC_GK1_PENTHOUSE", type=EdgeType.LOCATED_AT, weight=0.90, evidence_ref="Residence Scene Memo", case_id="CASE-MURDER-2024", timestamp="2024-02-18T21:15:00Z", discovered_date="2024-02-18T21:15:00Z"),
        Edge(id="EDG_M05", source="PER_DINESH_JOSHI", target="PER_RAMESH_BAGGA", type=EdgeType.WITNESSED, weight=0.88, evidence_ref="Judicial Identification Parade TIP", case_id="CASE-MURDER-2024", timestamp="2024-02-22T14:00:00Z", discovered_date="2024-02-22T14:00:00Z"),
        Edge(id="EDG_M06", source="PER_SUBHASH_SINGHAL", target="PER_PRADEEP_SINGHAL", type=EdgeType.VICTIM_OF, weight=0.90, evidence_ref="Civil Court Arbitration Records", case_id="CASE-MURDER-2024", timestamp="2024-02-19T10:30:00Z", discovered_date="2024-02-19T10:30:00Z"),
        Edge(id="EDG_M07", source="PER_PRADEEP_SINGHAL", target="ACC_CONTRACT_CASH", type=EdgeType.OPERATES_ACCOUNT, weight=0.92, evidence_ref="Bank Statement Analysis", case_id="CASE-MURDER-2024", timestamp="2024-02-22T11:30:00Z", discovered_date="2024-02-22T11:30:00Z")
    ]

    # =========================================================================
    # SCENARIO 6: SENSITIVE METRO CORRIDOR CASE (SexualAssault - Professional Metadata)
    # =========================================================================
    assault_nodes = [
        Node(id="PER_SATISH_VERMA", label="Satish 'Chhotu' Verma", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-ASSAULT-2024", "CASE-STALK-2024"], discovered_date="2024-01-25T09:00:00Z", properties={"role": "Commercial Cab Driver & Serial Offender", "license": "DL-04-2018-91823", "cross_jurisdiction": "Assault FIR 89/2024 & Cyberstalking FIR 62/2024"}),
        Node(id="VIC_ASSAULT_COMPLAINANT", label="Complainant (Gurugram FIR 89/24)", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-ASSAULT-2024"], discovered_date="2024-01-25T09:00:00Z", properties={"role": "Victim", "anonymized_id": "VIC-GURUGRAM-89", "crime_category": "SexualAssault", "protection_status": "Active Judicial Protection Protocol", "case_summary": "Attempted physical intercept of night commuter near IFFCO Chowk"}),
        Node(id="PH_SATISH_BURNER", label="+91-98711-22990 (Active Burner)", type=NodeType.PHONE, risk_level=RiskLevel.HIGH, case_ids=["CASE-ASSAULT-2024", "CASE-STALK-2024"], discovered_date="2024-01-25T09:30:00Z", properties={"carrier": "Airtel", "imei": "864192039182049", "cross_jurisdiction": "Linked across Gurugram Assault & Dwarka Cyberstalking"}),
        Node(id="VEH_SWIFT_HR55", label="Maruti Swift Dzire Taxi [HR-55-AT-4019]", type=NodeType.VEHICLE, risk_level=RiskLevel.HIGH, case_ids=["CASE-ASSAULT-2024"], discovered_date="2024-01-26T12:00:00Z", properties={"permit": "All India Tourist Permit", "gps_device_id": "GPS-TRK-9901"}),
        Node(id="LOC_IFFCO_CHOWK", label="IFFCO Chowk Flyover CCTV Zone", type=NodeType.LOCATION, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-ASSAULT-2024"], discovered_date="2024-01-26T14:00:00Z", properties={"city": "Gurugram", "state": "Haryana", "type": "Technical Evidence Collection Grid", "coordinates": "28.4721, 77.0699"}),
        Node(id="DIG_CCTV_IFFCO", label="Smart City ANPR Camera #IFFCO-4", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-ASSAULT-2024"], discovered_date="2024-01-26T14:30:00Z", properties={"type": "High-Definition ANPR Camera", "optical_match": "Plate HR-55-AT-4019"})
    ]

    assault_edges = [
        Edge(id="EDG_A01", source="PER_SATISH_VERMA", target="VEH_SWIFT_HR55", type=EdgeType.DRIVES_VEHICLE, weight=0.95, evidence_ref="Fleet Operator Driver Manifest", case_id="CASE-ASSAULT-2024", timestamp="2024-01-25T10:00:00Z", discovered_date="2024-01-25T10:00:00Z"),
        Edge(id="EDG_A02", source="PER_SATISH_VERMA", target="PH_SATISH_BURNER", type=EdgeType.OWNS_DEVICE, weight=0.98, evidence_ref="Cellular Tower CDR Pings", case_id="CASE-ASSAULT-2024", timestamp="2024-01-25T10:30:00Z", discovered_date="2024-01-25T10:30:00Z"),
        Edge(id="EDG_A03", source="VEH_SWIFT_HR55", target="LOC_IFFCO_CHOWK", type=EdgeType.LOCATED_AT, weight=0.90, evidence_ref="Toll Fastag & GPS Log", case_id="CASE-ASSAULT-2024", timestamp="2024-01-26T14:15:00Z", discovered_date="2024-01-26T14:15:00Z"),
        Edge(id="EDG_A04", source="DIG_CCTV_IFFCO", target="LOC_IFFCO_CHOWK", type=EdgeType.LOCATED_AT, weight=0.95, evidence_ref="Gurugram Traffic Police Video Stream", case_id="CASE-ASSAULT-2024", timestamp="2024-01-26T14:45:00Z", discovered_date="2024-01-26T14:45:00Z"),
        Edge(id="EDG_A05", source="VIC_ASSAULT_COMPLAINANT", target="PER_SATISH_VERMA", type=EdgeType.VICTIM_OF, weight=0.98, evidence_ref="Station FIR & CCTV Forensic Match", case_id="CASE-ASSAULT-2024", timestamp="2024-01-25T09:30:00Z", discovered_date="2024-01-25T09:30:00Z")
    ]

    # =========================================================================
    # SCENARIO 7: CYBERSTALKING & HARASSMENT (Harassment)
    # =========================================================================
    stalk_nodes = [
        Node(id="PER_RITU_VERMA", label="Dr. Ritu Verma (Complainant)", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-STALK-2024"], discovered_date="2024-01-20T15:00:00Z", properties={"role": "Victim", "anonymized_id": "VIC-DWARKA-62", "crime_category": "Harassment", "protection_status": "Witness Protection Tier-1", "case_summary": "Persistent VoIP threat calls & virtual spoofing"}),
        Node(id="DIG_VOIP_GATEWAY", label="Virtual VoIP Gateway [US-DID +1-202-555-0193]", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.HIGH, case_ids=["CASE-STALK-2024"], discovered_date="2024-01-20T11:00:00Z", properties={"service": "Twilio / SkypeIn SIP Trunk", "spoofed_caller_id": True}),
        Node(id="DIG_PROTON_MAIL", label="Encrypted Mailbox [alpha_trace@proton.me]", type=NodeType.DIGITAL_ID, risk_level=RiskLevel.HIGH, case_ids=["CASE-STALK-2024"], discovered_date="2024-01-20T13:00:00Z", properties={"service": "Proton Technologies AG", "threat_count": 42}),
        Node(id="LOC_DWARKA_SECTOR17", label="Dwarka Cyber Cell Technical Unit", type=NodeType.LOCATION, risk_level=RiskLevel.LOW, case_ids=["CASE-STALK-2024"], discovered_date="2024-01-20T15:30:00Z", properties={"type": "Jurisdiction Office", "city": "New Delhi", "state": "Delhi NCR", "coordinates": "28.5921, 77.0392"}),
        Node(id="PH_COMPLAINANT_SECURE", label="+91-98100-55443 (Complainant)", type=NodeType.PHONE, risk_level=RiskLevel.LOW, case_ids=["CASE-STALK-2024"], discovered_date="2024-01-20T16:00:00Z", properties={"carrier": "Airtel", "status": "Logged for Harassment Intercept"})
    ]

    stalk_edges = [
        Edge(id="EDG_ST01", source="PER_SATISH_VERMA", target="DIG_VOIP_GATEWAY", type=EdgeType.OPERATES_ACCOUNT, weight=0.92, evidence_ref="Credit Card Billing Account Link", case_id="CASE-STALK-2024", timestamp="2024-01-20T11:30:00Z", discovered_date="2024-01-20T11:30:00Z"),
        Edge(id="EDG_ST02", source="DIG_VOIP_GATEWAY", target="PER_RITU_VERMA", type=EdgeType.THREATENED, weight=0.95, properties={"spoofed_calls": 42}, evidence_ref="Call Audio Recordings & CDR", case_id="CASE-STALK-2024", timestamp="2024-01-20T12:00:00Z", discovered_date="2024-01-20T12:00:00Z"),
        Edge(id="EDG_ST03", source="PER_SATISH_VERMA", target="PER_RITU_VERMA", type=EdgeType.STALKED, weight=0.96, evidence_ref="IFSO Cyber Investigation Memo", case_id="CASE-STALK-2024", timestamp="2024-01-20T14:00:00Z", discovered_date="2024-01-20T14:00:00Z"),
        Edge(id="EDG_ST04", source="PH_SATISH_BURNER", target="DIG_PROTON_MAIL", type=EdgeType.ASSOCIATED_WITH, weight=0.88, evidence_ref="2FA SMS Recovery Header Analysis", case_id="CASE-STALK-2024", timestamp="2024-01-20T14:30:00Z", discovered_date="2024-01-20T14:30:00Z"),
        Edge(id="EDG_ST05", source="PER_RITU_VERMA", target="PER_SATISH_VERMA", type=EdgeType.VICTIM_OF, weight=0.96, evidence_ref="Cyber Cell VoIP Billing Record", case_id="CASE-STALK-2024", timestamp="2024-01-20T15:30:00Z", discovered_date="2024-01-20T15:30:00Z"),
        Edge(id="EDG_ST06", source="PER_SATISH_VERMA", target="PER_KULDEEP_YADAV", type=EdgeType.ASSOCIATED_WITH, weight=0.90, properties={"role": "Intimidation Muscle & Tactical Burner Provider"}, evidence_ref="Shared Burner Phone Logs & Intercepts", case_id="CASE-STALK-2024", timestamp="2024-01-20T16:30:00Z", discovered_date="2024-01-20T16:30:00Z")
    ]

    # =========================================================================
    # SCENARIO 8: LUXURY VEHICLE & BULLION THEFT RING (Theft)
    # =========================================================================
    theft_nodes = [
        Node(id="PER_DEVENDRA_BHATI", label="Devendra 'Dev' Bhati", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-THEFT-2024"], discovered_date="2024-01-20T12:00:00Z", properties={"role": "Master Vehicle Hacker & Locksmith", "specialty": "OBD Signal Cloning", "status": "Arrested"}),
        Node(id="PER_MAHESH_SONI", label="Mahesh Soni (Pawn Broker)", type=NodeType.PERSON, risk_level=RiskLevel.HIGH, case_ids=["CASE-THEFT-2024", "CASE-HAWALA-2024"], discovered_date="2024-01-22T14:00:00Z", properties={"role": "Bullion Fence & Hawala Cash Receiver", "business": "Karol Bagh Jewellers", "cross_jurisdiction": "Theft Fence in Rohini FIR 219/2024 & Hawala Cash Stash in ED FIR 402/2024"}),
        Node(id="STP_GOLD_BULLION", label="Stolen Gold Bullion (₹85 Lakhs)", type=NodeType.STOLEN_PROPERTY, risk_level=RiskLevel.HIGH, case_ids=["CASE-THEFT-2024"], discovered_date="2024-01-22T14:30:00Z", properties={"weight_kg": "1.25 kg", "melted_bars": 4, "value_inr": "₹ 85,00,000"}),
        Node(id="LOC_KAROL_BAGH_PAWN", label="Karol Bagh Bullion & Pawn Vault", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-THEFT-2024", "CASE-HAWALA-2024"], discovered_date="2024-01-24T16:00:00Z", properties={"city": "New Delhi", "state": "Delhi NCR", "type": "Pawn Shop Underground Safe & Cash Drop", "coordinates": "28.6521, 77.1906"}),
        Node(id="VEH_TATA_ACE_DL1L", label="Tata Ace Delivery Van [DL-1L-AA-3321]", type=NodeType.VEHICLE, risk_level=RiskLevel.MEDIUM, case_ids=["CASE-THEFT-2024"], discovered_date="2024-01-25T11:00:00Z", properties={"make": "Tata Ace", "cargo_box": "Modified False Floor"}),
        Node(id="PER_SURESH_KUMAR_THEFT_VICTIM", label="Suresh Kumar (Complainant)", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-THEFT-2024"], discovered_date="2024-01-20T12:30:00Z", properties={"role": "Victim", "anonymized_id": "VIC-ROHINI-219", "crime_category": "Theft", "case_summary": "Vault break-in and bullion burglary"})
    ]

    theft_edges = [
        Edge(id="EDG_T01", source="PER_DEVENDRA_BHATI", target="STP_GOLD_BULLION", type=EdgeType.INVOLVED_IN, weight=0.95, evidence_ref="Safe Lock Manipulation Marks", case_id="CASE-THEFT-2024", timestamp="2024-01-20T13:00:00Z", discovered_date="2024-01-20T13:00:00Z"),
        Edge(id="EDG_T02", source="PER_DEVENDRA_BHATI", target="PER_MAHESH_SONI", type=EdgeType.SOLD_STOLEN_ITEM_TO, weight=0.92, properties={"fenced_amount": "₹ 34,00,000"}, evidence_ref="Pawn Ledger & WhatsApp Chats", case_id="CASE-THEFT-2024", timestamp="2024-01-22T15:00:00Z", discovered_date="2024-01-22T15:00:00Z"),
        Edge(id="EDG_T03", source="PER_MAHESH_SONI", target="LOC_KAROL_BAGH_PAWN", type=EdgeType.MET_AT, weight=0.95, evidence_ref="Shop Ownership License", case_id="CASE-THEFT-2024", timestamp="2024-01-24T16:30:00Z", discovered_date="2024-01-24T16:30:00Z"),
        Edge(id="EDG_T04", source="STP_GOLD_BULLION", target="LOC_KAROL_BAGH_PAWN", type=EdgeType.STASHED_AT, weight=0.96, evidence_ref="Police Recovery Memo", case_id="CASE-THEFT-2024", timestamp="2024-01-24T17:00:00Z", discovered_date="2024-01-24T17:00:00Z"),
        Edge(id="EDG_T05", source="PER_DEVENDRA_BHATI", target="VEH_TATA_ACE_DL1L", type=EdgeType.FLED_IN, weight=0.88, evidence_ref="CCTV Tracking across Ring Road", case_id="CASE-THEFT-2024", timestamp="2024-01-25T11:30:00Z", discovered_date="2024-01-25T11:30:00Z"),
        Edge(id="EDG_T06", source="PER_DEVENDRA_BHATI", target="PER_KULDEEP_YADAV", type=EdgeType.ASSOCIATED_WITH, weight=0.92, properties={"role": "Getaway Driver & Logistics Transit"}, evidence_ref="Ring Road Fastag Toll & ANPR Surveillance", case_id="CASE-THEFT-2024", timestamp="2024-01-21T14:00:00Z", discovered_date="2024-01-21T14:00:00Z")
    ]

    # =========================================================================
    # SCENARIO 9: ARMED CASH TRANSIT HEIST (Robbery)
    # =========================================================================
    robbery_nodes = [
        Node(id="PER_JOGINDER_PEHALWAN", label="Joginder Singh (Alias Jogi Pehalwan)", type=NodeType.PERSON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-ROBBERY-2024"], discovered_date="2024-02-24T16:45:00Z", properties={"role": "Armed Dacoity Syndicate Leader", "alias": "Jogi Pehalwan", "status": "Mastermind"}),
        Node(id="VIC_ROBBERY_TRANSIT_GUARD", label="Cash Van Security Officer (Janakpuri)", type=NodeType.PERSON, risk_level=RiskLevel.LOW, case_ids=["CASE-ROBBERY-2024"], discovered_date="2024-02-24T17:00:00Z", properties={"role": "Victim", "anonymized_id": "VIC-ROBBERY-415", "crime_category": "Robbery", "protection_status": "Hospital Medical & Witness Security", "case_summary": "Injured security crew member during daylight armed cash van heist"}),
        Node(id="STP_AXIS_CASH_BOX", label="Janakpuri Bank Cash Chest (₹1.8 Cr)", type=NodeType.STOLEN_PROPERTY, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-ROBBERY-2024"], discovered_date="2024-02-24T17:00:00Z", properties={"stolen_amount": "₹ 1,80,00,000", "currency": "INR 500 bundles"}),
        Node(id="LOC_JANAKPURI_HEIST", label="Janakpuri Outer Ring Road Flyover", type=NodeType.LOCATION, risk_level=RiskLevel.HIGH, case_ids=["CASE-ROBBERY-2024"], discovered_date="2024-02-24T17:15:00Z", properties={"type": "Armed Blockade & Attack Scene", "city": "New Delhi", "state": "Delhi NCR", "coordinates": "28.6219, 77.0878"}),
        Node(id="WEP_COUNTRY_SHOTGUN", label="12-Bore Countrymade Shotgun #ROB01", type=NodeType.WEAPON, risk_level=RiskLevel.CRITICAL, case_ids=["CASE-ROBBERY-2024"], discovered_date="2024-02-26T14:00:00Z", properties={"caliber": "12 Bore", "used_in_heist": True})
    ]

    robbery_edges = [
        Edge(id="EDG_R01", source="PER_JOGINDER_PEHALWAN", target="PER_KULDEEP_YADAV", type=EdgeType.CO_ACCUSED, weight=0.96, properties={"role": "Getaway Driver"}, evidence_ref="Heist Planning Intercepts & Surveillance", case_id="CASE-ROBBERY-2024", timestamp="2024-02-24T17:30:00Z", discovered_date="2024-02-24T17:30:00Z"),
        Edge(id="EDG_R02", source="PER_JOGINDER_PEHALWAN", target="PER_RAMESH_BAGGA", type=EdgeType.ASSOCIATED_WITH, weight=0.92, properties={"memo": "Arms Procurement for Cash Van Attack"}, evidence_ref="Call Records prior to Heist", case_id="CASE-ROBBERY-2024", timestamp="2024-02-24T17:45:00Z", discovered_date="2024-02-24T17:45:00Z"),
        Edge(id="EDG_R03", source="PER_KULDEEP_YADAV", target="VEH_SCORPIO_DL4C", type=EdgeType.FLED_IN, weight=0.98, evidence_ref="Janakpuri Flyover CCTV Video Feed", case_id="CASE-ROBBERY-2024", timestamp="2024-02-24T18:00:00Z", discovered_date="2024-02-24T18:00:00Z"),
        Edge(id="EDG_R04", source="PER_JOGINDER_PEHALWAN", target="STP_AXIS_CASH_BOX", type=EdgeType.INVOLVED_IN, weight=0.95, evidence_ref="Physical Loot Recovery", case_id="CASE-ROBBERY-2024", timestamp="2024-02-24T18:15:00Z", discovered_date="2024-02-24T18:15:00Z"),
        Edge(id="EDG_R05", source="PER_JOGINDER_PEHALWAN", target="LOC_JANAKPURI_HEIST", type=EdgeType.LOCATED_AT, weight=0.90, evidence_ref="Eyewitness Police Constables", case_id="CASE-ROBBERY-2024", timestamp="2024-02-24T18:30:00Z", discovered_date="2024-02-24T18:30:00Z"),
        Edge(id="EDG_R06", source="PER_JOGINDER_PEHALWAN", target="WEP_COUNTRY_SHOTGUN", type=EdgeType.USED_WEAPON, weight=0.95, evidence_ref="Ballistic Empty Shells", case_id="CASE-ROBBERY-2024", timestamp="2024-02-26T14:30:00Z", discovered_date="2024-02-26T14:30:00Z"),
        Edge(id="EDG_R07", source="VIC_ROBBERY_TRANSIT_GUARD", target="PER_KULDEEP_YADAV", type=EdgeType.VICTIM_OF, weight=0.94, evidence_ref="PCR Statement Memo", case_id="CASE-ROBBERY-2024", timestamp="2024-02-24T17:30:00Z", discovered_date="2024-02-24T17:30:00Z")
    ]

    # Ingest All Nodes & Edges into Engine
    all_nodes = hawala_nodes + narco_nodes + sleeper_nodes + kidnap_nodes + murder_nodes + assault_nodes + stalk_nodes + theft_nodes + robbery_nodes
    all_edges = hawala_edges + narco_edges + sleeper_edges + kidnap_edges + murder_edges + assault_edges + stalk_edges + theft_edges + robbery_edges

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
    blockchain_service.add_block(
        action="CASE_INGESTION_KIDNAP_EXTORTION",
        investigator="Inspector Rajesh Mehra (MHA-SP-8821)",
        case_id="CASE-KIDNAP-2024",
        data_payload={"nodes_ingested": len(kidnap_nodes), "edges_ingested": len(kidnap_edges), "crime_category": "Kidnapping"}
    )
    blockchain_service.add_block(
        action="CASE_INGESTION_HOMICIDE_GK1",
        investigator="Inspector Amit Deshmukh (MHA-SP-9941)",
        case_id="CASE-MURDER-2024",
        data_payload={"nodes_ingested": len(murder_nodes), "edges_ingested": len(murder_edges), "crime_category": "Murder"}
    )
    blockchain_service.add_block(
        action="CASE_INGESTION_ARMED_ROBBERY_JANAKPURI",
        investigator="Inspector Amit Deshmukh (MHA-SP-9941)",
        case_id="CASE-ROBBERY-2024",
        data_payload={"nodes_ingested": len(robbery_nodes), "edges_ingested": len(robbery_edges), "crime_category": "Robbery"}
    )

    print(f"[SUTRA] Multi-Crime Knowledge Graph seeded: {len(all_nodes)} nodes, {len(all_edges)} edges across 9 diverse crime categories.")

    # Neo4j AuraDB Cloud Seeding
    try:
        from app.config import settings
        from app.services.neo4j_service import neo4j_service
        if settings.USE_NEO4J or (settings.NEO4J_URI and settings.NEO4J_PASSWORD):
            print(f"[SUTRA Neo4j] Seeding multi-crime dataset to Neo4j AuraDB ({settings.NEO4J_URI})...")
            neo_res = neo4j_service.seed_graph_data(all_nodes, all_edges, clear_existing=True)
            print(f"[SUTRA Neo4j] AuraDB seeding complete: {neo_res.get('nodes_ingested')} nodes, {neo_res.get('edges_ingested')} edges.")
    except Exception as e:
        print(f"[SUTRA Neo4j] AuraDB cloud sync skipped / notice: {e}")

    return all_nodes, all_edges

if __name__ == "__main__":
    seed_database()

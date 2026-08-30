from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/scenarios", tags=["Hackathon Demo Scenarios"])

SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario_hawala",
        "case_id": "CASE-HAWALA-2024",
        "title": "Scenario 1: Operation DarkNet Hawala (Kingpin & Layering Detection)",
        "badge": "Financial Crime & Crypto",
        "fir_number": "FIR 402/2024-ED-NDLS",
        "description": "Cross-border shadow banking syndicate using front companies in Dubai/Mumbai, burner phones, and TRC-20 USDT crypto off-ramps.",
        "judge_focus": [
            "Run PageRank Centrality: Instantly reveals Vikram Sharma (Alias Vicky Seth) as top strategic kingpin.",
            "Run Anomaly Detection: Detects circular Hawala layering loop (HDFC Mule -> ICICI Layering -> Zenith Exports -> Apex Overseas -> Swiss Bank -> Crypto Wallet -> Mule).",
            "Pathfinding: Trace multi-hop connection between 'Rohit Khanna' (Cash Mule) and 'Banque Cantonale Swiss Bank'."
        ],
        "sample_nl_queries": [
            "Show all connections to Vikram Sharma within 2 hops",
            "Who is the kingpin in Hawala case?",
            "Find path between Rohit Khanna and Swiss Private Bank"
        ],
        "sample_fir_text": """CONFIDENTIAL SPECIAL CELL INTERCEPTION MEMO:
During technical surveillance of FIR 402/2024, suspect Vikram Sharma (alias 'Vicky Seth') was intercepted using phone +91-98201-99881. He instructed courier Rohit Khanna to collect cash at Zaveri Bazaar Secret Vault and meet with Sameer Merchant of Zenith Import & Export Pvt Ltd.
Funds amounting to ₹ 4,50,00,000 were transferred from HDFC Mule Account #501004 to ICICI Layering Acc #000419.
Subsequently, overseas remittance was routed to Apex Global Overseas FZE in Dubai via Telegram @vicky_vault_dxb.
Suspect Tariq Mansoor received funds into Emirates NBD Corporate #4489 and converted into USDT Cold Wallet 0x71cA4918ef9bC81920aa1982bbfe098172918b99."""
    },
    {
        "id": "scenario_narco",
        "case_id": "CASE-NARCO-2024",
        "title": "Scenario 2: Cross-Border Narcotics Corridor (Cut-Vertex Interdiction)",
        "badge": "Border Security & Logistics",
        "fir_number": "FIR 188/2024-NCB-WZ",
        "description": "Multi-tier drug trafficking pipeline moving contraband from international border drop points to metro distribution centers.",
        "judge_focus": [
            "Run Anomaly Detection: Flags courier Gurpreet Singh as critical Articulation Point / Cut-Vertex.",
            "Demonstrate Network Disruption: Interdicting this single node disconnects border supply from metro distribution.",
            "Degrees of Separation: Trace connection from cartel controller 'Iqbal Mir' in Lahore to 'Mayapuri Godown' in Delhi."
        ],
        "sample_nl_queries": [
            "Find path between Iqbal Mir and Mayapuri Godown",
            "Show high risk entities in Narcotics case",
            "Find 2 hop associates of Gurpreet Singh"
        ],
        "sample_fir_text": """NARCOTICS CONTROL BUREAU RAID REPORT:
Acting on electronic intelligence, operative Gurpreet Singh (alias 'Laddi') was intercepted operating Thuraya Satellite Comms XT-0918 near Attari Border Concealment Point.
Suspect Iqbal Mir operating +92-300-8812741 transmitted GPS coordinates for a 12kg consignment.
Gurpreet coordinated with fleet dispatcher Rakesh Yadav of Falcon Transways & Logistics to transport contraband in Tata 16-Wheeler PB-10-CZ-4412.
Consignment was delivered to Manoj Shukla at Mayapuri Secret Chemical Godown for processing with precursor chemicals from Shree Biotech Chemical Labs."""
    },
    {
        "id": "scenario_sleeper",
        "case_id": "CASE-SLEEPER-2024",
        "title": "Scenario 3: Clandestine Sleeper Cell Grid (Louvain Cluster Discovery)",
        "badge": "Counter-Terrorism & Cyber",
        "fir_number": "FIR 77/2024-NIA-HQ",
        "description": "Low-signature clandestine cells communicating via decentralized Matrix servers, burner SIMs, and dead-drop safehouses.",
        "judge_focus": [
            "Run Louvain Community Detection: Auto-segments the network into Operational Module, Logistics Cell, and Funding Hub.",
            "Link Prediction: AI model predicts unconfirmed covert link between Asif Nazir and Naveed Khan.",
            "Blockchain Audit Trail: Demonstrate immutable chain of custody for electronic evidence under Sec 65B Indian Evidence Act."
        ],
        "sample_nl_queries": [
            "Detect sleeper cell clusters",
            "Show connections to Matrix Node",
            "Find path between Zuber Farooq and Okhla Safe Apartment"
        ],
        "sample_fir_text": """NATIONAL INVESTIGATION AGENCY INTELLIGENCE BRIEF:
Technical signals analysis detected covert communications originating from Matrix Node onion://subversion77.onion. Controller Zuber Farooq routed funding via ChipMixer CoinJoin Tx to operative Bilal Ahmed for procuring forged IDs.
Operative Asif Nazir using burner +91-70061-00214 conducted reconnaissance at Pahalgam Ridge Dead-Drop Point and rendezvoused at Okhla Jamia Safe Apartment with Naveed Khan operating Bajaj Pulsar DL-3S-CJ-9912."""
    },
    {
        "id": "scenario_cross_crime",
        "case_id": "CASE-ROBBERY-2024",
        "title": "Scenario 4: Multi-Domain Cross-Crime Triangulation (Serial Offender & Shared Hardware Linkage)",
        "badge": "Cross-Domain Crime Linkage",
        "fir_number": "FIR 415/2024-SPL-NDLS",
        "description": "Demonstrates SUTRA's ability to instantly discover hidden bridges connecting an Armed Bank Robbery, Kidnapping Syndicate, and Contract Homicide via shared getaway vehicles, weapons, and operatives.",
        "judge_focus": [
            "Cross-Case Linker Fusion: Select 'CASE-ROBBERY-2024' and 'CASE-KIDNAP-2024' to reveal Kuldeep Yadav & Scorpio DL-4C-NA-8821 as the exact bridging conduit across crime types.",
            "Betweenness Centrality: Kuldeep Yadav and Ramesh Bagga show up as high-centrality bridge nodes linking disparate violent crime syndicates.",
            "Multi-FIR Firearms Forensics: Trace weapon flow from Contract Shooter Ramesh Bagga (.32 Pistol in GK-1 Homicide) to Armed Robbery gang in Janakpuri."
        ],
        "sample_nl_queries": [
            "Find cross-case links between Robbery and Kidnapping",
            "Show all cases involving Kuldeep Yadav",
            "Trace path from Joginder Pehalwan to Aarav Malhotra"
        ],
        "sample_fir_text": """SPECIAL CELL MULTI-JURISDICTIONAL INTELLIGENCE SYNTHESIS:
During investigation of Janakpuri Armed Cash Heist (FIR 415/2024), getaway driver Kuldeep Yadav (alias 'KD') was captured on ANPR CCTV operating white Mahindra Scorpio DL-4C-NA-8821.
Automated cross-case fusion matched this vehicle registration and suspect profile to ongoing Kidnapping FIR 104/2024 (Crime Branch) where student Aarav Malhotra was abducted in the same vehicle.
Further, firearms procured by gang leader Joginder Pehalwan originated from contract shooter Ramesh Bagga, prime accused in Greater Kailash Homicide (FIR 312/2024)."""
    }
]

@router.get("", response_model=List[Dict[str, Any]])
def list_scenarios():
    return SCENARIOS

@router.get("/{scenario_id}")
def get_scenario(scenario_id: str):
    return next((s for s in SCENARIOS if s["id"] == scenario_id), SCENARIOS[0])

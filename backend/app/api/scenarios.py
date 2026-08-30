from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/scenarios", tags=["Hackathon Demo Scenarios"])

SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario_hidden_network",
        "case_id": "CASE-THEFT-2024",
        "title": "Flagship Scenario: The Hidden Network — Cross-Domain Serial Syndicate Convergence",
        "badge": "⭐ Flagship Master Demo (2 Min)",
        "fir_number": "Multi-FIR: 219/24, 415/24, 62/24, 104/24",
        "description": "The ultimate 5-step demonstration of SUTRA's full intelligence stack. Reveals how an apparently minor transport driver in a local theft case (Kuldeep Yadav) is actually the keystone operative connecting an Armed Bank Robbery, Cyberstalking Ring, and Kidnapping Syndicate across 4 independent state jurisdictions.",
        "judge_focus": [
            "Step 1: The Deceptive Surface — Kuldeep Yadav appears as a minor logistics driver in local auto theft FIR 219/2024.",
            "Step 2: Cross-Case Linker — Automated triangulation exposes shared Scorpio DL-4C-NA-8821 & burner SIM connecting him to Armed Robbery FIR 415/2024 and Stalking FIR 62/2024.",
            "Step 3: Serial MO Pattern Detector — AI detects 100% behavioral MO match linking him to unsolved Kidnapping FIR 104/2024 & cold case FIR 55/2024.",
            "Step 4: What-If Disruption Simulator — Neutralizing Kuldeep Yadav produces an 88% Network Disruption Score, crippling 4 separate criminal syndicates simultaneously.",
            "Step 5: Automated Case Priority Score — His syndicate network scores 93/100 and 86/100 in the Priority Queue, establishing instant legal justification for inter-state SWAT dispatch."
        ],
        "guided_steps": [
            {
                "step": 1,
                "title": "Step 1: The Deceptive Surface (Isolated Theft Case)",
                "target_tab": "graph",
                "target_case_id": "CASE-THEFT-2024",
                "highlight_node_id": "PER_KULDEEP_YADAV",
                "narrative": "Open the Auto Theft & Fencing case (FIR 219/2024). Notice suspect 'Kuldeep Yadav (Alias KD)' appears at the periphery as a minor transport driver who moves stolen vehicles.",
                "action_prompt": "Observe Kuldeep Yadav on the Graph Canvas. In a traditional siloed police database, he would be treated as an isolated petty driver."
            },
            {
                "step": 2,
                "title": "Step 2: Cross-Case Intelligence Linker (Syndicate Unmasking)",
                "target_tab": "crosscase",
                "target_case_id": "CASE-THEFT-2024",
                "highlight_node_id": "PER_KULDEEP_YADAV",
                "narrative": "Switch to Cross-Case Intelligence Linker. The system automatically cross-references entities across Delhi, Haryana, and Rajasthan. SUTRA discovers that Kuldeep Yadav and his white Scorpio (DL-4C-NA-8821) are shared with Armed Robbery FIR 415/2024 and Cyberstalking FIR 62/2024.",
                "action_prompt": "Examine the shared entity badges. SUTRA has instantly bridged 3 completely different crime categories!"
            },
            {
                "step": 3,
                "title": "Step 3: Serial Offender MO Pattern Detector (Cold Case Matching)",
                "target_tab": "analytics",
                "target_case_id": "CASE-THEFT-2024",
                "highlight_node_id": "PER_KULDEEP_YADAV",
                "narrative": "In AI Analytics Lab -> Serial Offender MO tab, inspect Kuldeep Yadav's profile. SUTRA's behavioral pattern detector flags a 100% Modus Operandi match against cold case FIR 55/2024 (Manesar Toll Carjacking) and Kidnapping FIR 104/2024 (Abduction of student Aarav Malhotra).",
                "action_prompt": "Review the Matched Behavioral Attributes (Night, Used Vehicle, Group of 3+, Firearms, Targeted Asset)."
            },
            {
                "step": 4,
                "title": "Step 4: What-If Disruption Simulator (Keystone Interdiction)",
                "target_tab": "analytics",
                "target_case_id": "CASE-ROBBERY-2024",
                "highlight_node_id": "PER_KULDEEP_YADAV",
                "narrative": "In AI Analytics Lab -> What-If Simulator, select Kuldeep Yadav and click 'Simulate Node Removal'. The simulator computes an 88% Network Disruption Score, proving that arresting this single operative severs the logistics and weapon flow across 4 active investigations at once!",
                "action_prompt": "Observe the 88% Disruption Score and structural fragmentation graph."
            },
            {
                "step": 5,
                "title": "Step 5: Automated Case Priority Score & Judicial Triage",
                "target_tab": "priority_queue",
                "target_case_id": "CASE-ROBBERY-2024",
                "highlight_node_id": "PER_KULDEEP_YADAV",
                "narrative": "Open the Case Priority Triage Queue. SUTRA automatically evaluates the 5-factor transparent rubric. Kuldeep Yadav's connected cases (FIR 415/2024 at 93/100, FIR 104/2024 at 86/100, FIR 89/2024 at 85/100) rank at the top of the Critical Priority Queue with immediate SWAT dispatch directives.",
                "action_prompt": "Click on FIR 415/2024 to inspect the 5-factor scoring breakdown and operational action plan."
            }
        ],
        "sample_nl_queries": [
            "Show all cases connected to Kuldeep Yadav",
            "What happens if Kuldeep Yadav is arrested?",
            "Find links between Auto Theft and Kidnapping"
        ],
        "sample_fir_text": """INTELLIGENCE SYNTHESIS MEMORANDUM:
Suspect Kuldeep Yadav (alias 'KD' / 'Ustaad'), initially arrested in Rohini Auto Theft FIR 219/2024, has been identified through SUTRA AI cross-case graph analytics as the prime logistics operative for Joginder Pehalwan's Armed Robbery Syndicate (FIR 415/2024) and the abduction crew in FIR 104/2024.
ANPR telemetry confirms white Mahindra Scorpio DL-4C-NA-8821 was present at all three crime scenes within a 30-day window."""
    },
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

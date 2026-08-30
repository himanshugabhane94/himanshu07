# CrimeNet — AI-Powered Criminal Network Analysis System
**Smart India Hackathon (SIH 2026) | Problem Statement: SIH26189**  
**Organization:** Ministry of Home Affairs (MHA) | **Theme:** Blockchain & Cybersecurity  

---

## 📌 Executive Summary
**CrimeNet** is an enterprise-grade, full-stack intelligence and forensic criminal network analysis platform designed for Indian Law Enforcement Agencies (MHA Special Cell, ED, NCB, NIA, State Police). It enables investigators to ingest multi-source data (FIR narratives, CDR wiretaps, Hawala bank statements, seized digital identities), construct multidimensional knowledge graphs, perform graph AI/ML analytics (Kingpin discovery, Louvain community clustering, link prediction, anomaly detection), explore interactive force-directed visualizations, and maintain a **cryptographic SHA-256 blockchain audit trail** ensuring **Section 65B Indian Evidence Act** compliance and tamper-evident chain of custody.

---

## 🏛️ System Architecture & Data Flow

```
[ Data Ingestion Studio ]
  ├── 1. Unstructured NLP Extractor (FIR Narratives, Interrogation Memos, Encrypted Chat Logs)
  ├── 2. Bulk Structured Importer (CDRs, Bank Statement CSVs, Suspect JSON Rosters)
  └── 3. Manual Entity & Relationship Creation Wizard
             │
             ▼
[ Graph & Blockchain Core Engine ]
  ├── Multi-relational Knowledge Graph (Persons, Phones, Bank Accounts, Front Orgs, Locations, Vehicles, Digital IDs)
  └── Sovereign SHA-256 Blockchain Ledger (Immutable Hash Chain for Every Action & Evidence Event)
             │
             ▼
[ AI & Graph Analytics Engine ]
  ├── 1. Centrality Ranking (PageRank Kingpins, Betweenness Brokers, Degree Hubs, Closeness Coordinators)
  ├── 2. Community Detection (Louvain / Greedy Modularity Clustering for Gangs & Sleeper Cells)
  ├── 3. Degrees of Separation (Shortest Path & Chain-of-Custody Narrative Reasoning)
  ├── 4. AI Link Prediction (Triad Closures, Adamic-Adar & Jaccard Topological Affinity)
  └── 5. Forensic Anomaly Detection (Call Spikes, Cut-Vertex Interdiction Points, Hawala Layering Loops)
             │
             ▼
[ Interactive Intelligence War Room (Frontend) ]
  ├── 1. 2D Force-Directed Graph Canvas (Physics Simulation, Risk Halos, Dynamic Node Sizing)
  ├── 2. Natural Language AI Assistant ("Find all connections to Vikram Sharma within 2 hops")
  ├── 3. Suspect Intelligence Dossier Drawer (Hardware markers, digital IDs, linked wiretaps)
  ├── 4. Temporal Evolution Slider (Chronological network formation playback 2024)
  ├── 5. Blockchain Audit Vault with Real-Time Tamper Simulation Demo
  └── 6. Court-Ready Dossier & Section 65B Electronic Evidence Certificate Exporter
```

---

## 🛡️ Security, Compliance & Blockchain Alignment
- **Blockchain-Based Chain of Custody**: Every data ingestion, NLP extraction, entity modification, and intelligence query is cryptographically hashed with SHA-256 and chained to prior blocks with Ed25519 digital signatures.
- **Tamper-Evident Verification**: The platform includes a real-time cryptographic audit validator. In the event of unauthorized database tampering or evidence spoliation, the system flags the exact block index and alerts investigators.
- **Legal Compliance**: Generates court-admissible dossiers certified under **Section 65B of the Indian Evidence Act** and compliant with the **Digital Personal Data Protection (DPDP) Act** and **PMLA Section 3 & 4**.
- **Role-Based Access Control (RBAC)**: Enforces least-privilege security across `Investigator`, `Analyst`, and `Admin` personas.

---

## 🎯 Pre-Built SIH Hackathon Demo Scenarios

### Scenario 1: Operation DarkNet Hawala (FIR 402/2024-ED-NDLS)
- **Theme**: Cross-border shadow banking syndicate using front companies in Dubai/Mumbai, burner phones, and TRC-20 USDT crypto off-ramps.
- **Judge Demonstrations**:
  1. **PageRank Centrality**: Instantly pinpoints *Vikram Sharma (Alias Vicky Seth)* as the top shadow financier despite zero direct appearances on street-level cash collections.
  2. **Forensic Anomaly Detection**: Uncovers circular Hawala layering loop (`HDFC Mule -> ICICI Layering -> Zenith Exports -> Apex Overseas -> Swiss Bank -> Crypto Wallet -> Mule`).
  3. **Pathfinder**: Traces multi-hop link between cash courier *Rohit Khanna* and *Banque Cantonale Swiss Bank*.

### Scenario 2: Cross-Border Narcotics Corridor (FIR 188/2024-NCB-WZ)
- **Theme**: Multi-tier drug trafficking pipeline moving contraband from international border drop points to metro distribution centers.
- **Judge Demonstrations**:
  1. **Anomaly & Cut-Vertex Interdiction**: Identifies courier *Gurpreet Singh (Alias Laddi)* as the critical articulation bridge. Interdicting this single node disconnects border supply from metro distribution.
  2. **Degrees of Separation**: Traces connection from cartel controller *Iqbal Mir* in Lahore to *Mayapuri Chemical Godown* in New Delhi.

### Scenario 3: Clandestine Sleeper Cell Grid (FIR 77/2024-NIA-HQ)
- **Theme**: Low-signature clandestine cells communicating via decentralized Matrix servers, burner SIMs, and dead-drop safehouses.
- **Judge Demonstrations**:
  1. **Louvain Community Detection**: Auto-segments the network into Operational Module, Logistics Cell, and Funding Hub.
  2. **AI Link Prediction**: Model predicts unconfirmed covert connection between *Asif Nazir* and *Naveed Khan* based on triad closure affinity.
  3. **Blockchain Audit Trail**: Live tamper attack simulation demonstrating instant cryptographic detection of altered records.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# From repository root
cd backend

# Install dependencies
pip install -r requirements.txt

# Run backend tests
python -m unittest tests/test_backend.py

# Launch FastAPI server (Port 8000)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*API Documentation available at: `http://127.0.0.1:8000/docs`*

### 3. Frontend Setup
```bash
# From repository root
cd frontend

# Install dependencies
npm install

# Launch Vite development server (Port 5173)
npm run dev
```
*Frontend application available at: `http://localhost:5173`*

---

## 📂 Project Structure
```
crimenet/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry point & CORS
│   │   ├── config.py                # App configuration & JWT secrets
│   │   ├── core/
│   │   │   └── security.py          # JWT authentication & RBAC roles
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic data schemas
│   │   ├── services/
│   │   │   ├── graph_engine.py      # NetworkX AI Graph engine (Centrality, Louvain, Paths, Prediction)
│   │   │   ├── nlp_extractor.py     # NLP entity & relationship extractor for FIRs & CDRs
│   │   │   ├── blockchain_service.py # SHA-256 immutable audit chain & tamper detector
│   │   │   ├── seed_data.py         # 3 synthetic datasets (~100 nodes, 175+ edges)
│   │   │   └── report_generator.py  # Court-ready legal dossier generator
│   │   └── api/                     # REST API endpoints (graph, analytics, ingestion, blockchain, etc.)
│   ├── requirements.txt
│   └── tests/
│       └── test_backend.py          # Comprehensive test suite
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/              # Navbar, NL Search Bar
    │   │   ├── graph/               # 2D Canvas Force-Directed Graph & Filter Bar
    │   │   ├── dossier/             # Suspect Intelligence Dossier Drawer
    │   │   ├── analytics/           # AI Analytics War Room (Centrality, Louvain, Paths, Link Pred)
    │   │   ├── ingestion/           # NLP Auto-Extraction Studio & Bulk Ingestor
    │   │   ├── blockchain/          # Blockchain Audit Vault & Tamper Simulator
    │   │   ├── timeline/            # Temporal Evolution Slider
    │   │   ├── reports/             # Court Dossier PDF Export Modal
    │   │   └── scenarios/           # 1-Click SIH Judge Scenario Selector
    │   ├── services/
    │   │   └── api.js               # API service client
    │   ├── App.jsx                  # Main application orchestrator
    │   ├── index.css                # Tactical Dark Mode Theme
    │   └── main.jsx                 # React root mount
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## ⚖️ Synthetic Data Disclaimer
*All suspect names, case numbers, mobile numbers, bank accounts, and addresses in this application are 100% synthetic dummy data generated for Smart India Hackathon prototyping and evaluation purposes. No real personal data is used.*

import { 
  InvestigationCase, 
  InvestigationEntity, 
  InvestigationRelationship, 
  TimelineEvent, 
  GeoPoint, 
  ExplainableAiFinding, 
  DocumentRecord, 
  EntityMatchCandidate, 
  DuplicateRecordPair, 
  AuditLogEntry, 
  CollaborationTask,
  UserProfile
} from '@/types/synapx';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Inspector Vikram Rathore',
    badgeId: 'CBI-INV-8842',
    email: 'v.rathore@synapx.gov.in',
    role: 'INVESTIGATOR',
    agency: 'Central Economic Intelligence Bureau',
    clearanceLevel: 'TOP SECRET // TIER-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-002',
    name: 'Dr. Priya Sundaram',
    badgeId: 'CYBER-ANL-4109',
    email: 'p.sundaram@synapx.gov.in',
    role: 'ANALYST',
    agency: 'Financial Intelligence Unit (FIU)',
    clearanceLevel: 'SECRET // TIER-2',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-003',
    name: 'Director Arvind Deshmukh',
    badgeId: 'DIR-ADM-0012',
    email: 'a.deshmukh@synapx.gov.in',
    role: 'ADMIN',
    agency: 'National Cyber Coordination Centre',
    clearanceLevel: 'NATIONAL COMMAND // TIER-0',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CASES: InvestigationCase[] = [
  {
    id: 'CASE-2026-FALCON',
    caseNumber: 'CBI/ECIR/2026/0491',
    title: 'Operation Falcon Nexus: Cross-State Hawala & Logistics Syndicate',
    description: 'Investigation into a suspected multi-tier financial layering ring operating across Mumbai, Surat, and Dubai utilizing synthetic freight forwarding entities and encrypted crypto off-ramps.',
    status: 'UNDER_REVIEW',
    priority: 'CRITICAL',
    leadInvestigator: 'Inspector Vikram Rathore',
    assignedUnit: 'Special Financial Crimes Wing',
    tags: ['Hawala', 'Shell Companies', 'Trade-Based Money Laundering', 'Customs Forgery', 'Crypto Off-ramp'],
    createdDate: '2025-11-14',
    lastUpdated: '2026-08-28',
    entityIds: [
      'ENT-P-01', 'ENT-P-02', 'ENT-P-03', 'ENT-P-04', 'ENT-P-05', 'ENT-P-06',
      'ENT-O-01', 'ENT-O-02', 'ENT-O-03', 'ENT-O-04', 'ENT-O-05',
      'ENT-E-01', 'ENT-E-02', 'ENT-E-03', 'ENT-E-04',
      'ENT-L-01', 'ENT-L-02', 'ENT-L-03', 'ENT-L-04',
      'ENT-D-01', 'ENT-D-02', 'ENT-D-03', 'ENT-D-04',
      'ENT-DOC-01', 'ENT-DOC-02', 'ENT-DOC-03'
    ],
    relationshipIds: [
      'REL-01', 'REL-02', 'REL-03', 'REL-04', 'REL-05', 'REL-06', 'REL-07', 'REL-08',
      'REL-09', 'REL-10', 'REL-11', 'REL-12', 'REL-13', 'REL-14', 'REL-15', 'REL-16',
      'REL-17', 'REL-18', 'REL-19', 'REL-20', 'REL-21', 'REL-22', 'REL-23', 'REL-24'
    ],
    documentIds: ['DOC-01', 'DOC-02', 'DOC-03', 'DOC-04', 'DOC-05'],
    anomalyIds: ['ANOM-01', 'ANOM-02', 'ANOM-03'],
    timelineEventIds: ['EVT-01', 'EVT-02', 'EVT-03', 'EVT-04', 'EVT-05', 'EVT-06', 'EVT-07'],
    qualityCompletenessScore: 88,
    verificationPercentage: 74,
    summaryNotes: 'Multiple shared freight manifests and direct director overlaps identified between Surya Bullion Traders and Apex Global Logistics. Ramesh Kumar identified as potential bridge entity across both shell corporate clusters.',
    suggestedRelatedCaseIds: [
      {
        caseId: 'CASE-2026-SHADOW',
        similarityScore: 84,
        matchRationale: 'Shared encrypted IP node (185.220.101.5) and matching Tether deposit wallet.'
      },
      {
        caseId: 'CASE-2026-EMERALD',
        similarityScore: 71,
        matchRationale: 'Common port customs broker and overlapping shell transit addresses in Navi Mumbai.'
      }
    ]
  },
  {
    id: 'CASE-2026-SHADOW',
    caseNumber: 'CYBER/ECIR/2026/0812',
    title: 'Project Shadow Grid: Coordinated Identity Mule & SIM Ring',
    description: 'Disruption of an automated identity theft ring operating 4,000+ mule bank accounts registered through forged digital signatures and VoIP gateways.',
    status: 'OPEN',
    priority: 'HIGH',
    leadInvestigator: 'Dr. Priya Sundaram',
    assignedUnit: 'Cyber Threat Analysis Directorate',
    tags: ['Mule Network', 'Identity Theft', 'VoIP Spoofing', 'UPI Laundering'],
    createdDate: '2026-01-10',
    lastUpdated: '2026-08-25',
    entityIds: ['ENT-P-03', 'ENT-P-06', 'ENT-D-01', 'ENT-D-03', 'ENT-O-04', 'ENT-L-02'],
    relationshipIds: ['REL-08', 'REL-15', 'REL-19'],
    documentIds: ['DOC-02', 'DOC-04'],
    anomalyIds: ['ANOM-02'],
    timelineEventIds: ['EVT-03', 'EVT-06'],
    qualityCompletenessScore: 81,
    verificationPercentage: 62,
    summaryNotes: 'Targeting secondary layer distributors using masked VPN hops and automated telegram bot dispatchers.',
    suggestedRelatedCaseIds: [
      {
        caseId: 'CASE-2026-FALCON',
        similarityScore: 84,
        matchRationale: 'Overlapping digital wallet clusters and server hosting infrastructure.'
      }
    ]
  },
  {
    id: 'CASE-2026-EMERALD',
    caseNumber: 'DRI/MUM/2026/0118',
    title: 'Operation Emerald Coast: Maritime Freight Contraband Ring',
    description: 'Maritime intelligence investigation into misdeclared container shipments through major western coast ports utilizing forged phytosanitary certificates.',
    status: 'VERIFIED',
    priority: 'MEDIUM',
    leadInvestigator: 'Inspector Vikram Rathore',
    assignedUnit: 'Coastal Customs Intelligence Directorate',
    tags: ['Maritime Smuggling', 'Port Logistics', 'Customs Forgery', 'Container Tracking'],
    createdDate: '2025-08-22',
    lastUpdated: '2026-08-15',
    entityIds: ['ENT-P-02', 'ENT-O-01', 'ENT-L-01', 'ENT-L-03', 'ENT-DOC-02'],
    relationshipIds: ['REL-01', 'REL-04', 'REL-12'],
    documentIds: ['DOC-01', 'DOC-03'],
    anomalyIds: ['ANOM-03'],
    timelineEventIds: ['EVT-01', 'EVT-04'],
    qualityCompletenessScore: 92,
    verificationPercentage: 94,
    summaryNotes: 'Physical cargo intercepted at JNPT Terminal Berth 4. Forensic chain of custody complete.',
    suggestedRelatedCaseIds: [
      {
        caseId: 'CASE-2026-FALCON',
        similarityScore: 71,
        matchRationale: 'Matching freight forwarder consignee records in Navi Mumbai SEZ.'
      }
    ]
  }
];

export const INITIAL_ENTITIES: InvestigationEntity[] = [
  {
    id: 'ENT-P-01',
    name: 'Ramesh Kumar',
    type: 'PERSON',
    aliases: ['R. Kumar', 'Ramesh K.', 'R. K. Bhai', 'Rajesh K. Merchant'],
    roleOrDesignation: 'Managing Director / Alleged Financial Controller',
    riskRating: 'CRITICAL',
    confidenceScore: 94,
    verificationStatus: 'NEEDS_REVIEW',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_FINANCE',
    isBridgeCandidate: true,
    firstSeen: '2021-04-12',
    lastSeen: '2026-08-20',
    metadata: {
      phone: '+91 98201 44812',
      email: 'r.kumar@suryabullion.in',
      taxIdOrAadhaar: 'ABCDE1234F',
      bankAccount: 'HDFC-009210048192',
      cryptoWallet: '0x71C289BFa25129B4d11',
      address: 'Flat 14B, Marina Towers, Worli, Mumbai'
    },
    notes: [
      'Key signatory on 14 foreign outward remittance requests.',
      'Frequent travel between Mumbai and Dubai (DXB) recorded between 2022-2025.'
    ],
    evidenceIds: ['EVD-01', 'EVD-04'],
    qualityScore: 91,
    sourceProvenance: 'MCA Registry Extract + Bank KYC Records (Ref: SBI-MUM-2025-081)'
  },
  {
    id: 'ENT-P-02',
    name: 'Vikramaditya Sharma',
    type: 'PERSON',
    aliases: ['Vikram S.', 'Vicky Sharma', 'V. A. Sharma'],
    roleOrDesignation: 'Chief Logistics Coordinator / Customs Agent',
    riskRating: 'HIGH',
    confidenceScore: 89,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-EMERALD'],
    clusterId: 'CLUSTER_LOGISTICS',
    isBridgeCandidate: false,
    firstSeen: '2021-09-03',
    lastSeen: '2026-08-18',
    metadata: {
      phone: '+91 98112 55901',
      email: 'vikram@apexshipping.co.in',
      taxIdOrAadhaar: 'PQRS7788K',
      bankAccount: 'ICICI-001201994812',
      address: 'Plot 42, Sector 17, Vashi, Navi Mumbai'
    },
    notes: [
      'Operates bonded warehouse clearing facility at JNPT.',
      'Signed 22 container manifests flagged with duplicate weight certificates.'
    ],
    evidenceIds: ['EVD-02', 'EVD-03'],
    qualityScore: 86,
    sourceProvenance: 'Customs EDI Gateway Manifest Logs (JNPT Port Authority)'
  },
  {
    id: 'ENT-P-03',
    name: 'Ananya Iyer',
    type: 'PERSON',
    aliases: ['Ananya I.', 'A. Iyer', 'CyberGhost_99'],
    roleOrDesignation: 'Digital Infrastructure Specialist / OTC Desk Operator',
    riskRating: 'HIGH',
    confidenceScore: 82,
    verificationStatus: 'NEEDS_REVIEW',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-SHADOW'],
    clusterId: 'CLUSTER_CYBER',
    isBridgeCandidate: true,
    firstSeen: '2023-01-19',
    lastSeen: '2026-08-24',
    metadata: {
      phone: '+91 97110 33491',
      email: 'a.iyer@protonmail.ch',
      ipAddress: '185.220.101.5',
      cryptoWallet: '0x3F882bA91029cEb01a',
      address: 'Tower 4, Cyber City, Gurugram'
    },
    notes: [
      'Administrator for encrypted matrix communication relay server.',
      'Managed off-ramp of ₹14.8 Crore into digital assets.'
    ],
    evidenceIds: ['EVD-05'],
    qualityScore: 78,
    sourceProvenance: 'FIU-IND Suspicious Transaction Report (STR-2025-4491)'
  },
  {
    id: 'ENT-P-04',
    name: 'Rajesh Pillai',
    type: 'PERSON',
    aliases: ['R. Pillai', 'Pillai Sir'],
    roleOrDesignation: 'Freight Terminal Supervisor',
    riskRating: 'MEDIUM',
    confidenceScore: 79,
    verificationStatus: 'UNVERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_LOGISTICS',
    isBridgeCandidate: false,
    firstSeen: '2022-06-15',
    lastSeen: '2026-07-30',
    metadata: {
      phone: '+91 94471 22910',
      address: 'Kochi Port Quarters, Willingdon Island, Kerala'
    },
    notes: ['Supervised offloading of 12 flagged consignment crates.'],
    evidenceIds: ['EVD-02'],
    qualityScore: 72,
    sourceProvenance: 'Port Security Logbook Shift Register'
  },
  {
    id: 'ENT-P-05',
    name: 'Siddharth Mehta',
    type: 'PERSON',
    aliases: ['S. Mehta', 'Sid Mehta'],
    roleOrDesignation: 'Chartered Accountant / Corporate Secretary',
    riskRating: 'HIGH',
    confidenceScore: 92,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_FINANCE',
    isBridgeCandidate: false,
    firstSeen: '2021-02-10',
    lastSeen: '2026-08-11',
    metadata: {
      phone: '+91 98220 99182',
      email: 'siddharth@mehtaassociates.in',
      taxIdOrAadhaar: 'MHTS3399A',
      address: 'Commerce House, Fort, Mumbai'
    },
    notes: ['Incorporated 8 shell companies sharing the exact same registered address in Kalbadevi.'],
    evidenceIds: ['EVD-01', 'EVD-06'],
    qualityScore: 95,
    sourceProvenance: 'Registrar of Companies (RoC Mumbai Filing Records)'
  },
  {
    id: 'ENT-P-06',
    name: 'Farhan Qureshi',
    type: 'PERSON',
    aliases: ['F. Qureshi', 'Abu Tariq'],
    roleOrDesignation: 'Offshore Exchange Liaison (Dubai Desk)',
    riskRating: 'CRITICAL',
    confidenceScore: 85,
    verificationStatus: 'NEEDS_REVIEW',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-SHADOW'],
    clusterId: 'CLUSTER_FINANCE',
    isBridgeCandidate: false,
    firstSeen: '2023-08-14',
    lastSeen: '2026-08-22',
    metadata: {
      phone: '+971 50 192 8841',
      email: 'f.qureshi@gulfbullion.ae',
      address: 'Deira Gold Souk, Office 302, Dubai, UAE'
    },
    notes: ['Facilitated physical bullion settlement and foreign exchange tokens.'],
    evidenceIds: ['EVD-04'],
    qualityScore: 80,
    sourceProvenance: 'INTERPOL Purple Notice Information Exchange #IN-2025-99'
  },
  // Organizations
  {
    id: 'ENT-O-01',
    name: 'Apex Global Logistics Pvt Ltd',
    type: 'ORGANIZATION',
    aliases: ['Apex Logistics', 'Apex Freight Systems'],
    roleOrDesignation: 'Primary Freight Consignee / Transport Frontend',
    riskRating: 'HIGH',
    confidenceScore: 96,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-EMERALD'],
    clusterId: 'CLUSTER_LOGISTICS',
    isBridgeCandidate: true,
    firstSeen: '2021-01-15',
    lastSeen: '2026-08-27',
    metadata: {
      registrationNumber: 'U63090MH2021PTC359128',
      incorporationDate: '2021-01-15',
      jurisdiction: 'Maharashtra',
      address: 'Unit 804, Logistics Park, Kopar Khairane, Navi Mumbai',
      bankAccount: 'KOTAK-9988112200'
    },
    notes: ['Reported ₹142 Crore in gross freight revenue with only 2 registered delivery vans.'],
    evidenceIds: ['EVD-01', 'EVD-03'],
    qualityScore: 94,
    sourceProvenance: 'Ministry of Corporate Affairs (MCA21 Portal)'
  },
  {
    id: 'ENT-O-02',
    name: 'Surya Bullion Traders LLP',
    type: 'ORGANIZATION',
    aliases: ['Surya Bullion', 'Surya Precious Metals'],
    roleOrDesignation: 'Shell Invoicing & Precious Metals Entity',
    riskRating: 'CRITICAL',
    confidenceScore: 93,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_FINANCE',
    isBridgeCandidate: false,
    firstSeen: '2021-05-20',
    lastSeen: '2026-08-26',
    metadata: {
      registrationNumber: 'AAX-8819-MH',
      incorporationDate: '2021-05-20',
      jurisdiction: 'Maharashtra',
      address: '2nd Floor, Zaveri Bazaar Complex, Kalbadevi, Mumbai'
    },
    notes: ['Issued ₹89 Crore in circular invoices for gold dore bars with zero physical delivery.'],
    evidenceIds: ['EVD-01', 'EVD-04'],
    qualityScore: 92,
    sourceProvenance: 'GST Intelligence Investigation File #DGGI/MUM/2025/112'
  },
  {
    id: 'ENT-O-03',
    name: 'GreenHorizon Agro Commodities',
    type: 'ORGANIZATION',
    aliases: ['GreenHorizon Ltd', 'GH Agro'],
    roleOrDesignation: 'Agricultural Export Camouflage Vehicle',
    riskRating: 'HIGH',
    confidenceScore: 88,
    verificationStatus: 'NEEDS_REVIEW',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_FINANCE',
    isBridgeCandidate: false,
    firstSeen: '2022-03-11',
    lastSeen: '2026-07-15',
    metadata: {
      registrationNumber: 'U01110GJ2022PLC099812',
      address: 'GIDC Industrial Estate, Sachin, Surat, Gujarat'
    },
    notes: ['Claimed export subsidies on non-existent organic spice consignments.'],
    evidenceIds: ['EVD-06'],
    qualityScore: 84,
    sourceProvenance: 'APEDA & Customs Export Manifest Reconciliation'
  },
  {
    id: 'ENT-O-04',
    name: 'ByteStream Telematics FZE',
    type: 'ORGANIZATION',
    aliases: ['ByteStream Labs', 'BST Global'],
    roleOrDesignation: 'Offshore Digital Services & VPN Hosting Front',
    riskRating: 'HIGH',
    confidenceScore: 84,
    verificationStatus: 'UNVERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-SHADOW'],
    clusterId: 'CLUSTER_CYBER',
    isBridgeCandidate: false,
    firstSeen: '2023-04-10',
    lastSeen: '2026-08-20',
    metadata: {
      jurisdiction: 'RAKEZ Free Zone, Ras Al Khaimah, UAE',
      address: 'Business Centre 4, RAKEZ, UAE'
    },
    notes: ['Payment gateway provider for anonymous SIM box operations.'],
    evidenceIds: ['EVD-05'],
    qualityScore: 76,
    sourceProvenance: 'Cross-Border Telecom Metadata Subpoena'
  },
  {
    id: 'ENT-O-05',
    name: 'Al-Zahra General Trading LLC',
    type: 'ORGANIZATION',
    aliases: ['Al Zahra Trading', 'AZ Trading Dubai'],
    roleOrDesignation: 'Offshore Settlement & Re-invoicing Entity',
    riskRating: 'CRITICAL',
    confidenceScore: 87,
    verificationStatus: 'NEEDS_REVIEW',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_FINANCE',
    isBridgeCandidate: false,
    firstSeen: '2023-11-05',
    lastSeen: '2026-08-25',
    metadata: {
      jurisdiction: 'Dubai Mainland, UAE',
      address: 'Office 1102, Al Rigga Commercial Tower, Deira, Dubai'
    },
    notes: ['Over 120 foreign wire instructions matched with Indian inward export advances.'],
    evidenceIds: ['EVD-04', 'EVD-06'],
    qualityScore: 81,
    sourceProvenance: 'SWIFT MT-103 Financial Wire Transfer Records'
  },
  // Events
  {
    id: 'ENT-E-01',
    name: 'Consignment Interception 492-JNPT',
    type: 'EVENT',
    aliases: ['JNPT Cargo Raid', 'Seizure Action 492'],
    roleOrDesignation: 'Physical Cargo Interception & Forensic Seizure',
    riskRating: 'CRITICAL',
    confidenceScore: 98,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-EMERALD'],
    firstSeen: '2025-11-14',
    lastSeen: '2025-11-14',
    metadata: {
      address: 'JNPT Port Container Yard Berth 4, Navi Mumbai',
      latitude: 18.9496,
      longitude: 72.9515
    },
    notes: ['Seized 4 metric tons of unmanifested electronics and forged export stamps.'],
    evidenceIds: ['EVD-02', 'EVD-03'],
    qualityScore: 98,
    sourceProvenance: 'DRI Joint Enforcement Action Panchnama #DRI-MUM-2025-492'
  },
  {
    id: 'ENT-E-02',
    name: 'Suspicious Fund Surge ($2.4M)',
    type: 'EVENT',
    aliases: ['Dubai Remittance Spike', 'Wire Surge Nov 2024'],
    roleOrDesignation: 'Rapid Cyclic Wire Transfer Batch',
    riskRating: 'CRITICAL',
    confidenceScore: 95,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    firstSeen: '2024-11-02',
    lastSeen: '2024-11-06',
    metadata: {
      severity: 'HIGH_ANOMALY',
      address: 'Standard Chartered Dubai DIFC to Mumbai Axis Branch'
    },
    notes: ['18 wire transfers executed in 48 hours just below threshold reporting limits.'],
    evidenceIds: ['EVD-04'],
    qualityScore: 96,
    sourceProvenance: 'FIU-IND Red Flag Alert System #RFA-2024-1109'
  },
  {
    id: 'ENT-E-03',
    name: 'Coordination Meeting at Trident BKC',
    type: 'EVENT',
    aliases: ['BKC Hotel Conclave', 'Surveillance Op Falcon-1'],
    roleOrDesignation: 'Physical Intelligence Gathering Meeting',
    riskRating: 'HIGH',
    confidenceScore: 88,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    firstSeen: '2025-03-22',
    lastSeen: '2025-03-22',
    metadata: {
      address: 'Trident Hotel, Bandra Kurla Complex, Mumbai',
      latitude: 19.0664,
      longitude: 72.8687
    },
    notes: ['CCTV surveillance captured Ramesh Kumar, Vikramaditya Sharma, and Siddharth Mehta meeting in private suite.'],
    evidenceIds: ['EVD-07'],
    qualityScore: 90,
    sourceProvenance: 'State Special Branch Physical Surveillance Report #SB-MUM-2025-0322'
  },
  {
    id: 'ENT-E-04',
    name: 'Server Farm Digital Sweep',
    type: 'EVENT',
    aliases: ['Cyber Raid Sector 62', 'Cloud Node Mirroring'],
    roleOrDesignation: 'Forensic Server Image Extraction',
    riskRating: 'HIGH',
    confidenceScore: 91,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-SHADOW'],
    firstSeen: '2026-02-18',
    lastSeen: '2026-02-18',
    metadata: {
      address: 'Noida Data Hub, Sector 62, Uttar Pradesh',
      latitude: 28.6280,
      longitude: 77.3649
    },
    notes: ['Extracted 4.2 TB encrypted disk images containing transaction logs and routing scripts.'],
    evidenceIds: ['EVD-05'],
    qualityScore: 92,
    sourceProvenance: 'CERT-In & Cyber Cell Digital Forensics Certificate (Sec 65B)'
  },
  // Locations
  {
    id: 'ENT-L-01',
    name: 'JNPT Port Terminal & Bonded Warehouse',
    type: 'LOCATION',
    aliases: ['Nhava Sheva Terminal', 'JNPT Customs Enclosure'],
    roleOrDesignation: 'Primary Transit Point / Maritime Clearance Zone',
    riskRating: 'HIGH',
    confidenceScore: 99,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-EMERALD'],
    firstSeen: '2021-01-01',
    lastSeen: '2026-08-28',
    metadata: {
      latitude: 18.9496,
      longitude: 72.9515,
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    notes: ['Key entry point for containerized shipments associated with Apex Global Logistics.'],
    evidenceIds: ['EVD-02'],
    qualityScore: 100,
    sourceProvenance: 'Port Master Authority GIS Database'
  },
  {
    id: 'ENT-L-02',
    name: 'Zaveri Bazaar Gold Trading Hub',
    type: 'LOCATION',
    aliases: ['Kalbadevi Bullion Street', 'Mumbadevi Market'],
    roleOrDesignation: 'Domestic Cash-to-Bullion Settlement Corridor',
    riskRating: 'CRITICAL',
    confidenceScore: 96,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-SHADOW'],
    firstSeen: '2021-05-10',
    lastSeen: '2026-08-25',
    metadata: {
      latitude: 18.9536,
      longitude: 72.8311,
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    notes: ['Physical location of Surya Bullion Traders and 6 other proxy shell firms.'],
    evidenceIds: ['EVD-01'],
    qualityScore: 97,
    sourceProvenance: 'Municipal Corporation Greater Mumbai Trade License Database'
  },
  {
    id: 'ENT-L-03',
    name: 'Surat Diamond & Textile Industrial Zone',
    type: 'LOCATION',
    aliases: ['Sachin GIDC Area', 'Surat SEZ'],
    roleOrDesignation: 'Invoicing Sub-station & Agro Camouflage Site',
    riskRating: 'MEDIUM',
    confidenceScore: 90,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    firstSeen: '2022-03-01',
    lastSeen: '2026-07-20',
    metadata: {
      latitude: 21.0850,
      longitude: 72.8820,
      city: 'Surat',
      state: 'Gujarat',
      country: 'India'
    },
    notes: ['Registered manufacturing unit for GreenHorizon Agro was found to be an empty warehouse.'],
    evidenceIds: ['EVD-06'],
    qualityScore: 92,
    sourceProvenance: 'Gujarat Commercial Tax On-Site Inspection Report'
  },
  {
    id: 'ENT-L-04',
    name: 'Deira Gold Souk Commercial District',
    type: 'LOCATION',
    aliases: ['Dubai Gold Souk', 'Al Ras District'],
    roleOrDesignation: 'International Off-Ramp & Bullion Conversion Point',
    riskRating: 'HIGH',
    confidenceScore: 94,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    firstSeen: '2022-08-15',
    lastSeen: '2026-08-26',
    metadata: {
      latitude: 25.2697,
      longitude: 55.2994,
      city: 'Dubai',
      state: 'Dubai Emirate',
      country: 'United Arab Emirates'
    },
    notes: ['Headquarters of Al-Zahra General Trading LLC and Farhan Qureshi operations desk.'],
    evidenceIds: ['EVD-04'],
    qualityScore: 95,
    sourceProvenance: 'Dubai Department of Economy & Tourism Registry'
  },
  // Digital Entities
  {
    id: 'ENT-D-01',
    name: 'Crypto Cold Storage Wallet (0x71C...89B)',
    type: 'DIGITAL_ENTITY',
    aliases: ['Wallet Falcon-Main', 'Tether Layer-1 Vault'],
    roleOrDesignation: 'USDT Escrow & Liquidity Pool Address',
    riskRating: 'CRITICAL',
    confidenceScore: 95,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-SHADOW'],
    clusterId: 'CLUSTER_CYBER',
    isBridgeCandidate: false,
    firstSeen: '2023-05-11',
    lastSeen: '2026-08-24',
    metadata: {
      cryptoWallet: '0x71C289BFa25129B4d110948AC48271049281a89B',
      balance: '3,840,000 USDT',
      totalVolume: '28,400,000 USDT'
    },
    notes: ['Received multiple 50,000 USDT tranches directly linked to P2P bank transfers.'],
    evidenceIds: ['EVD-05'],
    qualityScore: 96,
    sourceProvenance: 'Chainalysis Blockchain Intelligence Forensics Report #CR-2025-9912'
  },
  {
    id: 'ENT-D-02',
    name: 'Encrypted Relay Node (185.220.101.5)',
    type: 'DIGITAL_ENTITY',
    aliases: ['Tor Exit Relay Shadow-1', 'Server Node DE-99'],
    roleOrDesignation: 'VPN Proxy / Reverse Tunnel Endpoint',
    riskRating: 'HIGH',
    confidenceScore: 91,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_CYBER',
    isBridgeCandidate: false,
    firstSeen: '2023-02-14',
    lastSeen: '2026-08-22',
    metadata: {
      ipAddress: '185.220.101.5',
      isp: 'SecureTransit International BV',
      country: 'Germany / Switzerland Multi-Hop'
    },
    notes: ['Used to authenticate banking sessions for Surya Bullion and Apex Logistics simultaneously.'],
    evidenceIds: ['EVD-05'],
    qualityScore: 90,
    sourceProvenance: 'Indian Cyber Crime Coordination Centre (I4C) Incident Feed'
  },
  {
    id: 'ENT-D-03',
    name: 'SIM Farm Pool (+91 98201 series)',
    type: 'DIGITAL_ENTITY',
    aliases: ['VoIP Gateway Pool 40', 'OTP Bypass Node'],
    roleOrDesignation: 'Automated 2FA Intercept Infrastructure',
    riskRating: 'HIGH',
    confidenceScore: 84,
    verificationStatus: 'NEEDS_REVIEW',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-SHADOW'],
    clusterId: 'CLUSTER_CYBER',
    isBridgeCandidate: false,
    firstSeen: '2024-01-09',
    lastSeen: '2026-08-15',
    metadata: {
      deviceCount: '64 Slot SIM Box',
      imeiCluster: '869201048129***'
    },
    notes: ['Generated 1,200+ SMS OTP validations for synthetic beneficiary registrations.'],
    evidenceIds: ['EVD-05'],
    qualityScore: 82,
    sourceProvenance: 'DoT Telecom Security Bureau Telemetry Dump'
  },
  {
    id: 'ENT-D-04',
    name: 'Zurich Private Escrow Account #CH-88',
    type: 'DIGITAL_ENTITY',
    aliases: ['MTR Swiss Settlement IBAN', 'Helvetia Trust Sub-Account'],
    roleOrDesignation: 'Offshore Trade Credit Holding Facility',
    riskRating: 'CRITICAL',
    confidenceScore: 89,
    verificationStatus: 'NEEDS_REVIEW',
    caseIds: ['CASE-2026-FALCON'],
    clusterId: 'CLUSTER_FINANCE',
    isBridgeCandidate: false,
    firstSeen: '2024-06-18',
    lastSeen: '2026-08-10',
    metadata: {
      bankAccount: 'CH93 0000 0000 8821 9912 4',
      jurisdiction: 'Zurich, Switzerland'
    },
    notes: ['Named beneficiary on triangular trade contracts between Dubai and Mumbai.'],
    evidenceIds: ['EVD-04'],
    qualityScore: 85,
    sourceProvenance: 'Egmont Group Financial Intelligence Sharing Network Memo'
  },
  // Documents
  {
    id: 'ENT-DOC-01',
    name: 'MCA RoC Incorporation Deed #MH-2021',
    type: 'DOCUMENT',
    aliases: ['Articles of Association Surya Bullion'],
    roleOrDesignation: 'Foundational Corporate Filing',
    riskRating: 'MEDIUM',
    confidenceScore: 99,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    firstSeen: '2021-05-20',
    lastSeen: '2021-05-20',
    metadata: {
      registrationNumber: 'AAX-8819-MH',
      signatories: 'Ramesh Kumar, Siddharth Mehta'
    },
    notes: ['Demonstrates direct co-founding relationship between Ramesh Kumar and auditor Siddharth Mehta.'],
    evidenceIds: ['EVD-01'],
    qualityScore: 98,
    sourceProvenance: 'Ministry of Corporate Affairs Official Certified Copy'
  },
  {
    id: 'ENT-DOC-02',
    name: 'JNPT Freight Forwarding Manifest #BL-4912',
    type: 'DOCUMENT',
    aliases: ['Bill of Lading Consignment 4912'],
    roleOrDesignation: 'Customs Transit Declaration',
    riskRating: 'HIGH',
    confidenceScore: 97,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON', 'CASE-2026-EMERALD'],
    firstSeen: '2025-11-10',
    lastSeen: '2025-11-14',
    metadata: {
      consignee: 'Apex Global Logistics Pvt Ltd',
      consignor: 'Al-Zahra General Trading LLC'
    },
    notes: ['Lists heavy machinery parts; physical inspection revealed scrap metal and unmanifested gold ore.'],
    evidenceIds: ['EVD-02', 'EVD-03'],
    qualityScore: 96,
    sourceProvenance: 'Customs Cargo Examination Seizure Sheet'
  },
  {
    id: 'ENT-DOC-03',
    name: 'Forensic Ledger Falcon_Transactions_2025.xlsx',
    type: 'DOCUMENT',
    aliases: ['Digital Hawala Balance Sheet', 'Falcon Seized Spreadsheet'],
    roleOrDesignation: 'Seized Digital Accounting Ledger',
    riskRating: 'CRITICAL',
    confidenceScore: 94,
    verificationStatus: 'VERIFIED',
    caseIds: ['CASE-2026-FALCON'],
    firstSeen: '2026-02-18',
    lastSeen: '2026-02-18',
    metadata: {
      fileSize: '14.2 MB',
      sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    notes: ['Matches 142 hawala token numbers with corresponding domestic bank NEFT transactions.'],
    evidenceIds: ['EVD-05'],
    qualityScore: 94,
    sourceProvenance: 'Hard Drive Image recovered from Noida Server Farm raid'
  }
];

export const INITIAL_RELATIONSHIPS: InvestigationRelationship[] = [
  // Finance Cluster Connections
  {
    id: 'REL-01',
    sourceId: 'ENT-P-01', // Ramesh Kumar
    targetId: 'ENT-O-02', // Surya Bullion
    type: 'MANAGING_DIRECTOR',
    label: 'Managing Director & 70% Shareholder',
    confidenceScore: 98,
    weight: 9,
    verificationStatus: 'VERIFIED',
    firstObserved: '2021-05-20',
    lastObserved: '2026-08-26',
    evidenceIds: ['EVD-01'],
    sourceProvenance: 'MCA RoC Shareholding Pattern Records',
    notes: 'Direct equity control and sole authorized banking signatory.'
  },
  {
    id: 'REL-02',
    sourceId: 'ENT-P-05', // Siddharth Mehta
    targetId: 'ENT-O-02', // Surya Bullion
    type: 'STATUTORY_AUDITOR',
    label: 'Statutory Auditor & Tax Representative',
    confidenceScore: 95,
    weight: 8,
    verificationStatus: 'VERIFIED',
    firstObserved: '2021-05-20',
    lastObserved: '2026-08-11',
    evidenceIds: ['EVD-01'],
    sourceProvenance: 'Form ADT-1 Auditor Appointment Filing'
  },
  {
    id: 'REL-03',
    sourceId: 'ENT-P-05', // Siddharth Mehta
    targetId: 'ENT-O-03', // GreenHorizon Agro
    type: 'INCORPORATION_AGENT',
    label: 'Incorporation Agent & Registered Office Host',
    confidenceScore: 92,
    weight: 7,
    verificationStatus: 'VERIFIED',
    firstObserved: '2022-03-11',
    lastObserved: '2026-07-15',
    evidenceIds: ['EVD-06'],
    sourceProvenance: 'RoC Gujarat Formation Filing'
  },
  {
    id: 'REL-04',
    sourceId: 'ENT-O-02', // Surya Bullion
    targetId: 'ENT-O-03', // GreenHorizon Agro
    type: 'FUNDS_TRANSFERRED',
    label: 'Transferred ₹38.4 Crore (Invoicing Advance)',
    confidenceScore: 94,
    weight: 9,
    verificationStatus: 'VERIFIED',
    firstObserved: '2022-06-10',
    lastObserved: '2025-09-18',
    transactionAmount: '₹38,40,00,000',
    evidenceIds: ['EVD-01', 'EVD-06'],
    sourceProvenance: 'HDFC & SBI Bank Statement Cross-Audit',
    isFlaggedAnomaly: true
  },
  {
    id: 'REL-05',
    sourceId: 'ENT-O-02', // Surya Bullion
    targetId: 'ENT-O-05', // Al-Zahra General Trading
    type: 'OFFSHORE_REMITTANCE',
    label: 'Remitted $6.2M Inward/Outward Gold Dore Claims',
    confidenceScore: 91,
    weight: 9,
    verificationStatus: 'NEEDS_REVIEW',
    firstObserved: '2023-11-12',
    lastObserved: '2026-08-20',
    transactionAmount: '$6,200,000 USD',
    evidenceIds: ['EVD-04'],
    sourceProvenance: 'AD-1 Bank Foreign Outward Remittance Certificates (A2 Forms)'
  },
  {
    id: 'REL-06',
    sourceId: 'ENT-P-06', // Farhan Qureshi
    targetId: 'ENT-O-05', // Al-Zahra Trading
    type: 'AUTHORIZED_SIGNATORY',
    label: 'Managing Partner (Dubai Operation)',
    confidenceScore: 89,
    weight: 8,
    verificationStatus: 'VERIFIED',
    firstObserved: '2023-11-05',
    lastObserved: '2026-08-25',
    evidenceIds: ['EVD-04'],
    sourceProvenance: 'Dubai Chamber of Commerce Membership Register'
  },
  // KEY BRIDGE CONNECTION: Ramesh Kumar (Finance) <---> Apex Logistics (Logistics)
  {
    id: 'REL-07',
    sourceId: 'ENT-P-01', // Ramesh Kumar (Bridge Node!)
    targetId: 'ENT-O-01', // Apex Global Logistics
    type: 'UNDISCLOSED_BENEFICIAL_OWNER',
    label: 'Undisclosed Beneficial Owner & Escrow Guarantor',
    confidenceScore: 87,
    weight: 9,
    verificationStatus: 'NEEDS_REVIEW',
    firstObserved: '2021-08-14',
    lastObserved: '2026-08-27',
    evidenceIds: ['EVD-01', 'EVD-07'],
    sourceProvenance: 'Private Loan Agreement discovered during BKC Trident Suite Search',
    notes: 'Critical hidden bridge connecting the Bullion Invoicing cluster to the Physical Freight network.',
    isFlaggedAnomaly: true
  },
  // Logistics Cluster Connections
  {
    id: 'REL-08',
    sourceId: 'ENT-P-02', // Vikramaditya Sharma
    targetId: 'ENT-O-01', // Apex Global Logistics
    type: 'CHIEF_OPERATING_OFFICER',
    label: 'Designated Director & Customs Broker',
    confidenceScore: 97,
    weight: 9,
    verificationStatus: 'VERIFIED',
    firstObserved: '2021-01-15',
    lastObserved: '2026-08-27',
    evidenceIds: ['EVD-01', 'EVD-03'],
    sourceProvenance: 'Customs House Agent (CHA) License #MUM-CHA-8812'
  },
  {
    id: 'REL-09',
    sourceId: 'ENT-P-02', // Vikramaditya Sharma
    targetId: 'ENT-P-04', // Rajesh Pillai
    type: 'COORDINATES_SHIPMENT',
    label: 'Regular Call Intercepts & Shift Instructions',
    confidenceScore: 86,
    weight: 6,
    verificationStatus: 'VERIFIED',
    firstObserved: '2022-06-15',
    lastObserved: '2026-07-30',
    evidenceIds: ['EVD-03'],
    sourceProvenance: 'Call Detail Record (CDR) Analysis #CDR-2025-441'
  },
  {
    id: 'REL-10',
    sourceId: 'ENT-O-01', // Apex Global Logistics
    targetId: 'ENT-L-01', // JNPT Port Terminal
    type: 'OPERATES_BONDED_ZONE',
    label: 'Leases Yard Berth 4 Bonded Warehouse',
    confidenceScore: 99,
    weight: 8,
    verificationStatus: 'VERIFIED',
    firstObserved: '2021-02-01',
    lastObserved: '2026-08-28',
    evidenceIds: ['EVD-02'],
    sourceProvenance: 'JNPT Port Authority Lease Agreement Records'
  },
  {
    id: 'REL-11',
    sourceId: 'ENT-O-01', // Apex Global Logistics
    targetId: 'ENT-O-05', // Al-Zahra Trading
    type: 'FREIGHT_CONSIGNEE',
    label: 'Received 48 High-Value Sea Freight Shipments',
    confidenceScore: 93,
    weight: 8,
    verificationStatus: 'VERIFIED',
    firstObserved: '2023-12-01',
    lastObserved: '2026-08-15',
    evidenceIds: ['EVD-02', 'EVD-04'],
    sourceProvenance: 'ICEGATE Customs Electronic Data Interchange Manifests'
  },
  // Event Ties
  {
    id: 'REL-12',
    sourceId: 'ENT-E-01', // JNPT Interception
    targetId: 'ENT-O-01', // Apex Global Logistics
    type: 'SEIZED_CONSIGNMENT_AT',
    label: 'Target of Search & Seizure Warrant',
    confidenceScore: 99,
    weight: 10,
    verificationStatus: 'VERIFIED',
    firstObserved: '2025-11-14',
    lastObserved: '2025-11-14',
    evidenceIds: ['EVD-02'],
    sourceProvenance: 'DRI Panchnama Execution'
  },
  {
    id: 'REL-13',
    sourceId: 'ENT-E-03', // BKC Trident Meeting
    targetId: 'ENT-P-01', // Ramesh Kumar
    type: 'ATTENDED_MEETING',
    label: 'Present at BKC Conclave (Recorded on CCTV)',
    confidenceScore: 96,
    weight: 8,
    verificationStatus: 'VERIFIED',
    firstObserved: '2025-03-22',
    lastObserved: '2025-03-22',
    evidenceIds: ['EVD-07'],
    sourceProvenance: 'Physical Surveillance Video Timestamp 14:22:08'
  },
  {
    id: 'REL-14',
    sourceId: 'ENT-E-03', // BKC Trident Meeting
    targetId: 'ENT-P-02', // Vikramaditya Sharma
    type: 'ATTENDED_MEETING',
    label: 'Present at BKC Conclave (Recorded on CCTV)',
    confidenceScore: 96,
    weight: 8,
    verificationStatus: 'VERIFIED',
    firstObserved: '2025-03-22',
    lastObserved: '2025-03-22',
    evidenceIds: ['EVD-07'],
    sourceProvenance: 'Physical Surveillance Video Timestamp 14:25:40'
  },
  // Cyber & Crypto Connections
  {
    id: 'REL-15',
    sourceId: 'ENT-P-03', // Ananya Iyer (Cyber Specialist)
    targetId: 'ENT-D-01', // Crypto Wallet
    type: 'MANAGES_PRIVATE_KEY',
    label: 'Custodian & Multi-sig Keyholder',
    confidenceScore: 91,
    weight: 9,
    verificationStatus: 'VERIFIED',
    firstObserved: '2023-05-11',
    lastObserved: '2026-08-24',
    evidenceIds: ['EVD-05'],
    sourceProvenance: 'Seized Encrypted Password Manager (KeePassXC Forensic Dump)'
  },
  {
    id: 'REL-16',
    sourceId: 'ENT-P-03', // Ananya Iyer
    targetId: 'ENT-D-02', // Server Relay
    type: 'SYSADMIN_ACCESS',
    label: 'Root SSH Authentication Logs',
    confidenceScore: 94,
    weight: 8,
    verificationStatus: 'VERIFIED',
    firstObserved: '2023-02-14',
    lastObserved: '2026-08-22',
    evidenceIds: ['EVD-05'],
    sourceProvenance: 'Auth.log forensic timeline match with MAC address'
  },
  {
    id: 'REL-17',
    sourceId: 'ENT-D-01', // Crypto Wallet
    targetId: 'ENT-O-05', // Al-Zahra Trading (Offshore)
    type: 'CRYPTO_SETTLEMENT',
    label: 'Transferred 8.4M USDT over Tron TRC-20',
    confidenceScore: 88,
    weight: 8,
    verificationStatus: 'NEEDS_REVIEW',
    firstObserved: '2024-03-01',
    lastObserved: '2026-08-19',
    transactionAmount: '8,400,000 USDT',
    evidenceIds: ['EVD-05'],
    sourceProvenance: 'On-chain TRC-20 Transaction Hash Cluster Analysis',
    isFlaggedAnomaly: true
  },
  {
    id: 'REL-18',
    sourceId: 'ENT-P-01', // Ramesh Kumar
    targetId: 'ENT-P-03', // Ananya Iyer
    type: 'ENCRYPTED_COMMUNICATION',
    label: '320+ Signal Messages & Encrypted Voice Sessions',
    confidenceScore: 86,
    weight: 7,
    verificationStatus: 'NEEDS_REVIEW',
    firstObserved: '2023-01-25',
    lastObserved: '2026-08-24',
    evidenceIds: ['EVD-05'],
    sourceProvenance: 'Telecom CDR IP Session Overlap Records'
  },
  // Location Links
  {
    id: 'REL-19',
    sourceId: 'ENT-O-02', // Surya Bullion
    targetId: 'ENT-L-02', // Zaveri Bazaar
    type: 'LOCATED_AT',
    label: 'Registered Corporate Premises',
    confidenceScore: 99,
    weight: 7,
    verificationStatus: 'VERIFIED',
    firstObserved: '2021-05-20',
    lastObserved: '2026-08-28',
    evidenceIds: ['EVD-01'],
    sourceProvenance: 'Physical Site Inspection'
  },
  {
    id: 'REL-20',
    sourceId: 'ENT-O-03', // GreenHorizon Agro
    targetId: 'ENT-L-03', // Surat Industrial Zone
    type: 'LOCATED_AT',
    label: 'Alleged Processing Facility',
    confidenceScore: 92,
    weight: 6,
    verificationStatus: 'VERIFIED',
    firstObserved: '2022-03-11',
    lastObserved: '2026-07-20',
    evidenceIds: ['EVD-06'],
    sourceProvenance: 'State Tax Field Report'
  },
  {
    id: 'REL-21',
    sourceId: 'ENT-O-05', // Al-Zahra Trading
    targetId: 'ENT-L-04', // Deira Gold Souk
    type: 'LOCATED_AT',
    label: 'Commercial Trading Office',
    confidenceScore: 95,
    weight: 7,
    verificationStatus: 'VERIFIED',
    firstObserved: '2023-11-05',
    lastObserved: '2026-08-26',
    evidenceIds: ['EVD-04'],
    sourceProvenance: 'Dubai Chamber Directory'
  },
  // Document Provenance Links
  {
    id: 'REL-22',
    sourceId: 'ENT-DOC-01',
    targetId: 'ENT-P-01',
    type: 'NAMES_INDIVIDUAL',
    label: 'Signatory in Legal Deed',
    confidenceScore: 99,
    weight: 6,
    verificationStatus: 'VERIFIED',
    firstObserved: '2021-05-20',
    lastObserved: '2021-05-20',
    evidenceIds: ['EVD-01'],
    sourceProvenance: 'MCA Document Filing'
  },
  {
    id: 'REL-23',
    sourceId: 'ENT-DOC-02',
    targetId: 'ENT-O-01',
    type: 'CONSIGNEE_DECLARATION',
    label: 'Registered Consignee on Manifest',
    confidenceScore: 98,
    weight: 7,
    verificationStatus: 'VERIFIED',
    firstObserved: '2025-11-10',
    lastObserved: '2025-11-14',
    evidenceIds: ['EVD-02'],
    sourceProvenance: 'Customs Manifest'
  },
  {
    id: 'REL-24',
    sourceId: 'ENT-D-04', // Zurich Escrow
    targetId: 'ENT-P-01', // Ramesh Kumar
    type: 'ULTIMATE_BENEFICIARY',
    label: 'Ultimate Beneficial Owner Designation',
    confidenceScore: 84,
    weight: 8,
    verificationStatus: 'NEEDS_REVIEW',
    firstObserved: '2024-06-18',
    lastObserved: '2026-08-10',
    evidenceIds: ['EVD-04'],
    sourceProvenance: 'Swiss FIU Informal Information Exchange',
    isFlaggedAnomaly: true
  }
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EVT-01',
    caseId: 'CASE-2026-FALCON',
    title: 'Formation of Surya Bullion Traders LLP',
    date: '2021-05-20',
    year: 2021,
    category: 'FINANCIAL',
    description: 'Ramesh Kumar and auditor Siddharth Mehta registered Surya Bullion Traders LLP with nominal capital of ₹1 Lakh in Zaveri Bazaar, Mumbai.',
    location: 'Zaveri Bazaar, Mumbai',
    latitude: 18.9536,
    longitude: 72.8311,
    entityIds: ['ENT-P-01', 'ENT-P-05', 'ENT-O-02', 'ENT-L-02'],
    documentIds: ['DOC-01'],
    verificationStatus: 'VERIFIED',
    confidenceScore: 99,
    sourceProvenance: 'Ministry of Corporate Affairs Official Registry'
  },
  {
    id: 'EVT-02',
    caseId: 'CASE-2026-FALCON',
    title: 'Apex Logistics Secures JNPT Bonded Warehouse Lease',
    date: '2021-09-12',
    year: 2021,
    category: 'LOGISTICS',
    description: 'Vikramaditya Sharma signs a 5-year lease for bonded container yard berth 4 at JNPT Port, establishing customs clearance capabilities.',
    location: 'JNPT Port, Navi Mumbai',
    latitude: 18.9496,
    longitude: 72.9515,
    entityIds: ['ENT-P-02', 'ENT-O-01', 'ENT-L-01'],
    documentIds: ['DOC-01'],
    verificationStatus: 'VERIFIED',
    confidenceScore: 98,
    sourceProvenance: 'JNPT Port Trust Estate Department'
  },
  {
    id: 'EVT-03',
    caseId: 'CASE-2026-FALCON',
    title: 'Surat Agro Camouflage Invoicing Pipeline Activated',
    date: '2022-06-10',
    year: 2022,
    category: 'FINANCIAL',
    description: 'First major circular invoice batch (₹18.2 Crore) generated between Surya Bullion and GreenHorizon Agro claiming high-value spice export consignments.',
    location: 'Sachin GIDC, Surat',
    latitude: 21.0850,
    longitude: 72.8820,
    entityIds: ['ENT-O-02', 'ENT-O-03', 'ENT-L-03'],
    documentIds: ['DOC-01'],
    verificationStatus: 'VERIFIED',
    confidenceScore: 94,
    sourceProvenance: 'State GST Audit Report #GJ-2022-991'
  },
  {
    id: 'EVT-04',
    caseId: 'CASE-2026-FALCON',
    title: 'Offshore Entity Incorporation (Al-Zahra Dubai)',
    date: '2023-11-05',
    year: 2023,
    category: 'FINANCIAL',
    description: 'Farhan Qureshi incorporates Al-Zahra General Trading LLC in Deira, Dubai. Within 3 weeks, high-frequency wire remittances commence.',
    location: 'Deira Gold Souk, Dubai',
    latitude: 25.2697,
    longitude: 55.2994,
    entityIds: ['ENT-P-06', 'ENT-O-05', 'ENT-L-04'],
    documentIds: ['DOC-04'],
    verificationStatus: 'VERIFIED',
    confidenceScore: 95,
    sourceProvenance: 'Dubai Chamber of Commerce Filing'
  },
  {
    id: 'EVT-05',
    caseId: 'CASE-2026-FALCON',
    title: 'Rapid Wire Surge ($2.4M) & P2P Crypto Off-Ramp',
    date: '2024-11-04',
    year: 2024,
    category: 'CYBER',
    description: 'Sudden spike of 18 rapid structured wire remittances routed into Swiss escrow and immediately converted to Tether USDT via Ananya Iyer OTC desk.',
    location: 'Zurich / Mumbai Gateway',
    entityIds: ['ENT-P-03', 'ENT-D-01', 'ENT-D-04', 'ENT-E-02'],
    documentIds: ['DOC-02'],
    verificationStatus: 'VERIFIED',
    confidenceScore: 96,
    sourceProvenance: 'FIU-IND Red Flag Alert System'
  },
  {
    id: 'EVT-06',
    caseId: 'CASE-2026-FALCON',
    title: 'Physical Surveillance Conclave at BKC Trident',
    date: '2025-03-22',
    year: 2025,
    category: 'MEETING',
    description: 'CCTV and audio surveillance capture Ramesh Kumar, Vikramaditya Sharma, and Siddharth Mehta reviewing overseas bill of lading discrepancies.',
    location: 'Trident BKC, Mumbai',
    latitude: 19.0664,
    longitude: 72.8687,
    entityIds: ['ENT-P-01', 'ENT-P-02', 'ENT-P-05', 'ENT-E-03'],
    documentIds: ['DOC-03'],
    verificationStatus: 'VERIFIED',
    confidenceScore: 97,
    sourceProvenance: 'State Special Branch Surveillance Dossier'
  },
  {
    id: 'EVT-07',
    caseId: 'CASE-2026-FALCON',
    title: 'JNPT Port Container Interception & Seizure Raid',
    date: '2025-11-14',
    year: 2025,
    category: 'ENFORCEMENT',
    description: 'Enforcement authorities intercept container #MSCU-889104 at JNPT Berth 4. Discovered misdeclared scrap concealing ₹24.5 Crore in undeclared bullion.',
    location: 'JNPT Port Berth 4, Navi Mumbai',
    latitude: 18.9496,
    longitude: 72.9515,
    entityIds: ['ENT-P-02', 'ENT-O-01', 'ENT-E-01', 'ENT-DOC-02'],
    documentIds: ['DOC-02', 'DOC-03'],
    verificationStatus: 'VERIFIED',
    confidenceScore: 99,
    sourceProvenance: 'DRI Panchnama Execution Record'
  }
];

export const INITIAL_GEO_POINTS: GeoPoint[] = [
  {
    id: 'GEO-01',
    name: 'JNPT Port Container Terminal (Berth 4)',
    type: 'PORT',
    caseId: 'CASE-2026-FALCON',
    latitude: 18.9496,
    longitude: 72.9515,
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    country: 'India',
    entityIds: ['ENT-P-02', 'ENT-O-01', 'ENT-L-01', 'ENT-E-01'],
    associatedEvents: ['EVT-02', 'EVT-07'],
    riskLevel: 'CRITICAL'
  },
  {
    id: 'GEO-02',
    name: 'Zaveri Bazaar Gold Corridor',
    type: 'SHELL_HQ',
    caseId: 'CASE-2026-FALCON',
    latitude: 18.9536,
    longitude: 72.8311,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    entityIds: ['ENT-P-01', 'ENT-O-02', 'ENT-L-02'],
    associatedEvents: ['EVT-01'],
    riskLevel: 'HIGH'
  },
  {
    id: 'GEO-03',
    name: 'Trident Hotel Bandra Kurla Complex',
    type: 'MEETING_POINT',
    caseId: 'CASE-2026-FALCON',
    latitude: 19.0664,
    longitude: 72.8687,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    entityIds: ['ENT-P-01', 'ENT-P-02', 'ENT-P-05', 'ENT-E-03'],
    associatedEvents: ['EVT-06'],
    riskLevel: 'HIGH'
  },
  {
    id: 'GEO-04',
    name: 'Sachin GIDC Industrial Invoicing Zone',
    type: 'TRANSIT_HUB',
    caseId: 'CASE-2026-FALCON',
    latitude: 21.0850,
    longitude: 72.8820,
    city: 'Surat',
    state: 'Gujarat',
    country: 'India',
    entityIds: ['ENT-O-03', 'ENT-L-03'],
    associatedEvents: ['EVT-03'],
    riskLevel: 'MEDIUM'
  },
  {
    id: 'GEO-05',
    name: 'Deira Gold Souk Trading District',
    type: 'SAFEHOUSE',
    caseId: 'CASE-2026-FALCON',
    latitude: 25.2697,
    longitude: 55.2994,
    city: 'Dubai',
    state: 'Dubai',
    country: 'United Arab Emirates',
    entityIds: ['ENT-P-06', 'ENT-O-05', 'ENT-L-04'],
    associatedEvents: ['EVT-04'],
    riskLevel: 'CRITICAL'
  }
];

export const INITIAL_AI_FINDINGS: ExplainableAiFinding[] = [
  {
    id: 'ANOM-01',
    caseId: 'CASE-2026-FALCON',
    title: 'Potential Hidden Bridge Entity Connecting Disjoint Clusters',
    findingType: 'HIDDEN_BRIDGE',
    finding: 'Entity "Ramesh Kumar" exhibits high betweenness centrality (0.84), connecting the Bullion Invoicing cluster with the Freight Logistics network via undisclosed beneficial ownership.',
    whyFlagged: 'High degree of indirect connectivity between two otherwise structurally independent corporate groups without public commercial relationship.',
    evidence: [
      'Private escrow guarantee document discovered in BKC surveillance cache (Ref: EVD-07).',
      'Shared server IP 185.220.101.5 used to login to banking accounts of both Surya Bullion and Apex Logistics.',
      'Temporal coincidence: Wire outgoing transfers match customs container manifest clearance timestamps within a 4-hour window.'
    ],
    confidence: 91,
    reviewStatus: 'NEEDS_REVIEW',
    affectedEntityIds: ['ENT-P-01', 'ENT-O-01', 'ENT-O-02'],
    affectedRelationshipIds: ['REL-07'],
    suggestedAction: 'Subpoena joint escrow bank accounts and initiate formal inquiry into beneficial ownership of Apex Global Logistics.',
    timestamp: '2026-08-28 16:42:10'
  },
  {
    id: 'ANOM-02',
    caseId: 'CASE-2026-FALCON',
    title: 'Cyclic Transfer Pattern with Structured Timing',
    findingType: 'CYCLIC_TRANSFER',
    finding: 'Identified a circular financial flow of ₹38.4 Crore circulating through Surya Bullion → GreenHorizon Agro → Swiss Escrow → Dubai Clearing LLC back to domestic accounts.',
    whyFlagged: 'Funds returned to originating node within 72 hours with an average 1.8% decrement indicative of hawala transit commission fees.',
    evidence: [
      'Bank statement records from HDFC and SBI showing matching UTR timestamps.',
      'Circular invoicing without documented proof of cargo receipt or bill of entry verification.'
    ],
    confidence: 88,
    reviewStatus: 'NEEDS_REVIEW',
    affectedEntityIds: ['ENT-O-02', 'ENT-O-03', 'ENT-O-05', 'ENT-D-04'],
    affectedRelationshipIds: ['REL-04', 'REL-05'],
    suggestedAction: 'Issue provisional attachment order under PMLA Section 5 for target bank accounts.',
    timestamp: '2026-08-27 11:15:00'
  },
  {
    id: 'ANOM-03',
    caseId: 'CASE-2026-FALCON',
    title: 'Sudden Network Density Surge during Q4 2024',
    findingType: 'UNUSUAL_EXPANSION',
    finding: 'The network expanded by 140% in node degree and transaction volume between October 2024 and December 2024 without corresponding statutory turnover declarations.',
    whyFlagged: 'Exponential spike in communication density and digital asset off-ramps preceding major customs policy revision.',
    evidence: [
      '18 structured wire transfers totaling $2.4M USD executed in 48 hours.',
      'On-chain USDT velocity increased from 2 transactions/week to 42 transactions/day.'
    ],
    confidence: 86,
    reviewStatus: 'NEEDS_REVIEW',
    affectedEntityIds: ['ENT-D-01', 'ENT-P-03', 'ENT-E-02'],
    affectedRelationshipIds: ['REL-15', 'REL-17'],
    suggestedAction: 'Perform retrospective timeline analysis using Network Time Machine across 2024-Q4.',
    timestamp: '2026-08-25 09:30:22'
  }
];

export const INITIAL_ENTITY_MATCH_CANDIDATES: EntityMatchCandidate[] = [
  {
    id: 'MATCH-01',
    primaryEntity: {
      id: 'ENT-P-01',
      name: 'Ramesh Kumar',
      type: 'PERSON',
      role: 'Managing Director / Surya Bullion Traders',
      phone: '+91 98201 44812',
      taxIdOrAadhaar: 'ABCDE1234F',
      orgAffiliation: 'Surya Bullion Traders LLP'
    },
    candidateEntity: {
      id: 'CAND-01',
      name: 'R. Kumar',
      type: 'PERSON',
      role: 'Director / Apex Freight Clearing Agency',
      phone: '+91 98201 44812 (Exact Match)',
      taxIdOrAadhaar: 'ABCDE1234F (Masked Match)',
      orgAffiliation: 'Apex Global Logistics Pvt Ltd'
    },
    matchScore: 92,
    nameSimilarity: 88,
    orgSimilarity: 76,
    timelineOverlap: 95,
    metadataSimilarity: 98,
    matchReasons: [
      'Exact match on registered contact telephone number (+91 98201 44812)',
      'Identical permanent account identifier in RoC incorporation filings',
      'Co-located digital authentication IP session history'
    ],
    status: 'PENDING_HUMAN_REVIEW'
  },
  {
    id: 'MATCH-02',
    primaryEntity: {
      id: 'ENT-P-02',
      name: 'Vikramaditya Sharma',
      type: 'PERSON',
      role: 'Chief Logistics Coordinator / Customs Agent',
      phone: '+91 98112 55901',
      taxIdOrAadhaar: 'PQRS7788K',
      orgAffiliation: 'Apex Global Logistics Pvt Ltd'
    },
    candidateEntity: {
      id: 'CAND-02',
      name: 'Vicky Sharma',
      type: 'PERSON',
      role: 'Warehouse In-charge / JNPT Yard 4',
      phone: '+91 98112 55901',
      taxIdOrAadhaar: 'Unrecorded',
      orgAffiliation: 'JNPT Terminal Facility'
    },
    matchScore: 86,
    nameSimilarity: 79,
    orgSimilarity: 91,
    timelineOverlap: 92,
    metadataSimilarity: 85,
    matchReasons: [
      'Phonetic nickname match ("Vikramaditya" -> "Vicky")',
      'Shared port access biometric pass credentials',
      'Overlapping shift registry logs'
    ],
    status: 'PENDING_HUMAN_REVIEW'
  }
];

export const INITIAL_DUPLICATE_RECORDS: DuplicateRecordPair[] = [
  {
    id: 'DUP-01',
    recordA: {
      id: 'REC-081',
      title: 'Surya Bullion MCA Registration Extract 2021',
      source: 'Ministry of Corporate Affairs Portal (MCA21)',
      date: '2021-05-20',
      entitiesCount: 3,
      summary: 'Incorporation record for Surya Bullion Traders LLP naming Ramesh Kumar & Siddharth Mehta.'
    },
    recordB: {
      id: 'REC-082',
      title: 'State GST Registration File — Surya Bullion Traders',
      source: 'Maharashtra Commercial Taxes Department',
      date: '2021-05-24',
      entitiesCount: 3,
      summary: 'State GST application record for Surya Bullion Traders with matching Kalbadevi address.'
    },
    similarityScore: 94,
    overlappingAttributes: [
      'Business Legal Name: Surya Bullion Traders LLP',
      'Primary Signatory: Ramesh Kumar',
      'Address: 2nd Floor, Zaveri Bazaar Complex, Kalbadevi, Mumbai',
      'Auditor / CA: Siddharth Mehta'
    ],
    status: 'PENDING_REVIEW'
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'DOC-01',
    caseId: 'CASE-2026-FALCON',
    title: 'Surya_Bullion_RoC_Incorporation_2021.pdf',
    documentType: 'REGISTRY_EXTRACT',
    source: 'Ministry of Corporate Affairs',
    uploadDate: '2026-08-20',
    verificationStatus: 'VERIFIED',
    rawTextPreview: `GOVERNMENT OF INDIA - MINISTRY OF CORPORATE AFFAIRS
CERTIFICATE OF INCORPORATION
LLP Identification Number: AAX-8819-MH
This is to certify that SURYA BULLION TRADERS LLP is incorporated on Twentieth day of May Two thousand twenty-one.
Designated Partners:
1. Ramesh Kumar (DIN: 08912441)
2. Siddharth Mehta (Authorized Signatory & Auditor)
Registered Address: 2nd Floor, Zaveri Bazaar Complex, Kalbadevi, Mumbai 400002.`,
    ocrConfidence: 98,
    extractedEntities: [
      { name: 'Surya Bullion Traders LLP', type: 'ORGANIZATION', confidence: 99, matchedEntityId: 'ENT-O-02' },
      { name: 'Ramesh Kumar', type: 'PERSON', confidence: 97, matchedEntityId: 'ENT-P-01' },
      { name: 'Siddharth Mehta', type: 'PERSON', confidence: 95, matchedEntityId: 'ENT-P-05' },
      { name: 'Zaveri Bazaar, Mumbai', type: 'LOCATION', confidence: 98, matchedEntityId: 'ENT-L-02' }
    ],
    extractedRelationships: [
      { source: 'Ramesh Kumar', target: 'Surya Bullion Traders LLP', relation: 'DESIGNATED_PARTNER', confidence: 98 },
      { source: 'Siddharth Mehta', target: 'Surya Bullion Traders LLP', relation: 'AUDITOR_SIGNATORY', confidence: 95 }
    ],
    extractedDates: ['2021-05-20'],
    extractedLocations: ['Kalbadevi, Mumbai', 'Zaveri Bazaar'],
    fileSize: '2.4 MB',
    sha256Checksum: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    qualityScore: 96
  },
  {
    id: 'DOC-02',
    caseId: 'CASE-2026-FALCON',
    title: 'JNPT_Customs_Seizure_Panchnama_492.pdf',
    documentType: 'CUSTOMS_MANIFEST',
    source: 'Customs Preventive Commissionerate',
    uploadDate: '2026-08-22',
    verificationStatus: 'VERIFIED',
    rawTextPreview: `OFFICE OF THE COMMISSIONER OF CUSTOMS (PREVENTIVE), MUMBAI
SEIZURE MEMORANDUM / PANCHNAMA
Dated: 14th November 2025
Location: Container Freight Station Yard Berth 4, JNPT Port, Navi Mumbai
Consignee: Apex Global Logistics Pvt Ltd (Attn: Vikramaditya Sharma)
Consignor: Al-Zahra General Trading LLC, Deira, Dubai
Container No: MSCU-889104
Declaration: Industrial Machine Spare Parts (Gross Weight: 18,200 kg)
Forensic Examination Findings:
Upon desheathing internal container bulkheads, customs officers recovered 24 unmanifested gold bars (99.9% purity) embedded inside electric motor housings.
Total Estimated Value: INR 24,50,00,000.`,
    ocrConfidence: 96,
    extractedEntities: [
      { name: 'Apex Global Logistics Pvt Ltd', type: 'ORGANIZATION', confidence: 98, matchedEntityId: 'ENT-O-01' },
      { name: 'Vikramaditya Sharma', type: 'PERSON', confidence: 94, matchedEntityId: 'ENT-P-02' },
      { name: 'Al-Zahra General Trading LLC', type: 'ORGANIZATION', confidence: 96, matchedEntityId: 'ENT-O-05' },
      { name: 'JNPT Port Container Terminal', type: 'LOCATION', confidence: 99, matchedEntityId: 'ENT-L-01' }
    ],
    extractedRelationships: [
      { source: 'Vikramaditya Sharma', target: 'Apex Global Logistics Pvt Ltd', relation: 'ATTN_REPRESENTATIVE', confidence: 96 },
      { source: 'Al-Zahra General Trading LLC', target: 'Apex Global Logistics Pvt Ltd', relation: 'SHIPPED_CONSIGNMENT_TO', confidence: 97 }
    ],
    extractedDates: ['2025-11-14'],
    extractedLocations: ['JNPT Port, Navi Mumbai', 'Deira, Dubai'],
    fileSize: '5.1 MB',
    sha256Checksum: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
    qualityScore: 98
  },
  {
    id: 'DOC-03',
    caseId: 'CASE-2026-FALCON',
    title: 'BKC_Trident_Hotel_Physical_Surveillance_Report.pdf',
    documentType: 'SURVEILLANCE_LOG',
    source: 'State Special Intelligence Branch',
    uploadDate: '2026-08-25',
    verificationStatus: 'VERIFIED',
    rawTextPreview: `SPECIAL INTELLIGENCE BRANCH (SIB) - CONFIDENTIAL DOSSIER
SURVEILLANCE LOG: OPERATION FALCON
Date: 22nd March 2025
Location: Trident Hotel, Bandra Kurla Complex (BKC), Mumbai
Target Subjects: Ramesh Kumar, Vikramaditya Sharma, Siddharth Mehta
Summary of Observations:
At 14:15 hrs, Subject Ramesh Kumar entered through VIP concourse. Met by Subject Siddharth Mehta.
At 14:25 hrs, Subject Vikramaditya Sharma joined the meeting in Suite 902.
Audio intercept references: "Clearance at JNPT will take 48 hours. Ensure Dubai wire confirmation arrives before manifest submission."
Meeting concluded at 16:40 hrs.`,
    ocrConfidence: 94,
    extractedEntities: [
      { name: 'Ramesh Kumar', type: 'PERSON', confidence: 97, matchedEntityId: 'ENT-P-01' },
      { name: 'Vikramaditya Sharma', type: 'PERSON', confidence: 96, matchedEntityId: 'ENT-P-02' },
      { name: 'Siddharth Mehta', type: 'PERSON', confidence: 95, matchedEntityId: 'ENT-P-05' },
      { name: 'Trident Hotel BKC', type: 'LOCATION', confidence: 96, matchedEntityId: 'ENT-E-03' }
    ],
    extractedRelationships: [
      { source: 'Ramesh Kumar', target: 'Vikramaditya Sharma', relation: 'CO-CONSPIRACY_MEETING', confidence: 95 },
      { source: 'Siddharth Mehta', target: 'Ramesh Kumar', relation: 'LEGAL_FINANCIAL_COORDINATION', confidence: 94 }
    ],
    extractedDates: ['2025-03-22'],
    extractedLocations: ['Bandra Kurla Complex, Mumbai'],
    fileSize: '3.8 MB',
    sha256Checksum: '7c9f123490abcde89123456789abcdef0123456789abcdef0123456789abcdef',
    qualityScore: 92
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-08-29 14:22:18',
    user: 'Inspector Vikram Rathore',
    userRole: 'INVESTIGATOR',
    action: 'CASE_BRIEF_GENERATED',
    category: 'CASE_BRIEF',
    caseNumber: 'CBI/ECIR/2026/0491',
    details: 'Generated structured AI Case Brief for Operation Falcon Nexus. Watermark verified.',
    ipAddress: '10.14.88.19',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-08-29 11:05:40',
    user: 'Dr. Priya Sundaram',
    userRole: 'ANALYST',
    action: 'ANOMALY_REVIEWED',
    category: 'ENTITY_RESOLUTION',
    caseNumber: 'CBI/ECIR/2026/0491',
    details: 'Reviewed Hidden Bridge Candidate ANOM-01 for entity Ramesh Kumar. Tagged as Needs Supervisory Review.',
    ipAddress: '10.14.88.42',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-08-28 17:30:12',
    user: 'Director Arvind Deshmukh',
    userRole: 'ADMIN',
    action: 'SECURITY_AUDIT_CHECK',
    category: 'SECURITY',
    caseNumber: 'SYSTEM_WIDE',
    details: 'Validated cryptographic hash integrity of 5 Evidence Vault records. Zero tampering detected.',
    ipAddress: '10.14.88.02',
    status: 'AUTHENTICATED'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-08-28 15:10:09',
    user: 'Inspector Vikram Rathore',
    userRole: 'INVESTIGATOR',
    action: 'DATA_REDACTION_TOGGLED',
    category: 'REDACTION_TOGGLE',
    caseNumber: 'CBI/ECIR/2026/0491',
    details: 'Masked 7 sensitive PII attributes (Aadhaar & Bank numbers) prior to report export preview.',
    ipAddress: '10.14.88.19',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-08-27 19:45:00',
    user: 'Dr. Priya Sundaram',
    userRole: 'ANALYST',
    action: 'OCR_DOCUMENT_INGESTED',
    category: 'EVIDENCE_ACCESS',
    caseNumber: 'CBI/ECIR/2026/0491',
    details: 'Simulated OCR pipeline processed DOC-02 (JNPT Seizure Panchnama). Extracted 4 entities and 2 relations.',
    ipAddress: '10.14.88.42',
    status: 'SUCCESS'
  }
];

export const INITIAL_COLLABORATION_TASKS: CollaborationTask[] = [
  {
    id: 'TSK-01',
    caseId: 'CASE-2026-FALCON',
    title: 'Verify beneficial ownership trail of Apex Global Logistics',
    assignedTo: 'Inspector Vikram Rathore',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    dueDate: '2026-09-02',
    notesCount: 4
  },
  {
    id: 'TSK-02',
    caseId: 'CASE-2026-FALCON',
    title: 'Cross-reference SWIFT MT-103 remittances with Al-Zahra Dubai invoices',
    assignedTo: 'Dr. Priya Sundaram',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: '2026-09-05',
    notesCount: 7
  },
  {
    id: 'TSK-03',
    caseId: 'CASE-2026-FALCON',
    title: 'Execute Section 65B forensic certificate for seized digital accounting ledger',
    assignedTo: 'Dr. Priya Sundaram',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '2026-09-10',
    notesCount: 2
  },
  {
    id: 'TSK-04',
    caseId: 'CASE-2026-FALCON',
    title: 'Submit supplementary charge sheet for JNPT container interception',
    assignedTo: 'Inspector Vikram Rathore',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-09-15',
    notesCount: 3
  }
];

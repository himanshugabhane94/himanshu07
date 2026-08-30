const API_BASE = '/api/v1';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const getHeaders = (extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const fetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        console.warn(`[API ${res.status}] ${url}:`, data);
        throw new Error(data.detail || `Request failed with status ${res.status}`);
      }
      return data;
    }
    
    const text = await res.text();
    if (!res.ok) {
      console.warn(`[API ${res.status}] ${url}:`, text);
      throw new Error(text || `Request failed with status ${res.status}`);
    }
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error(`[API FETCH ERROR] ${url}:`, err);
    throw err;
  }
};

export const api = {
  // Authentication & RBAC
  login: async (username, password) => {
    return fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  },

  switchRole: async (role) => {
    return fetchJson(`${API_BASE}/auth/switch-role/${role}`, {
      method: 'POST',
      headers: getHeaders()
    });
  },

  getMe: async () => {
    return fetchJson(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
  },

  // Cases
  getCases: async () => {
    return fetchJson(`${API_BASE}/cases`, {
      headers: getHeaders()
    });
  },

  // Case Handover Briefing
  generateHandover: async (caseId, incomingOfficer = '') => {
    return fetchJson(`${API_BASE}/cases/${encodeURIComponent(caseId)}/generate-handover`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ incoming_officer: incomingOfficer })
    });
  },

  getHandoverBriefing: async (caseId, incomingOfficer = '') => {
    const query = incomingOfficer ? `?incoming_officer=${encodeURIComponent(incomingOfficer)}` : '';
    return fetchJson(`${API_BASE}/cases/${encodeURIComponent(caseId)}/handover${query}`, {
      headers: getHeaders()
    });
  },

  getHandoverHtmlUrl: (caseId, incomingOfficer = '') => {
    const query = incomingOfficer ? `?incoming_officer=${encodeURIComponent(incomingOfficer)}` : '';
    return `${API_BASE}/cases/${encodeURIComponent(caseId)}/handover/html${query}`;
  },

  // Graph Data
  getGraph: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.caseId) query.append('case_id', params.caseId);
    if (params.minRisk) query.append('min_risk', params.minRisk);
    if (params.startDate) query.append('start_date', params.startDate);
    if (params.endDate) query.append('end_date', params.endDate);
    if (params.nodeTypes && params.nodeTypes.length > 0) {
      params.nodeTypes.forEach(t => query.append('node_types', t));
    }
    return fetchJson(`${API_BASE}/graph?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getTimeline: async (caseId) => {
    const query = new URLSearchParams();
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/graph/timeline?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getNodeDossier: async (nodeId) => {
    return fetchJson(`${API_BASE}/graph/node/${encodeURIComponent(nodeId)}`, {
      headers: getHeaders()
    });
  },

  expandNode: async (nodeId, depth = 1) => {
    return fetchJson(`${API_BASE}/graph/node/${encodeURIComponent(nodeId)}/expand?depth=${depth}`, {
      headers: getHeaders()
    });
  },

  createNode: async (nodeData) => {
    return fetchJson(`${API_BASE}/graph/node`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(nodeData)
    });
  },

  createEdge: async (edgeData) => {
    return fetchJson(`${API_BASE}/graph/edge`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(edgeData)
    });
  },

  // AI Graph Analytics
  getCentrality: async (metricOrCaseId = 'pagerank', maybeCaseId = null) => {
    let metric = 'pagerank';
    let caseId = null;
    if (metricOrCaseId && (metricOrCaseId.startsWith('CASE-') || metricOrCaseId.startsWith('MHA-'))) {
      caseId = metricOrCaseId;
    } else {
      metric = metricOrCaseId || 'pagerank';
      caseId = maybeCaseId;
    }
    const query = new URLSearchParams({ metric });
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/analytics/centrality?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getCommunities: async (caseId = null) => {
    const query = new URLSearchParams();
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/analytics/communities?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getShortestPath: async (sourceId, targetId) => {
    const query = new URLSearchParams({ source_id: sourceId, target_id: targetId });
    return fetchJson(`${API_BASE}/analytics/shortest-path?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getPredictedLinks: async (caseId = null, topK = 10) => {
    const query = new URLSearchParams({ top_k: topK });
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/analytics/link-prediction?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getLinkPredictions: async (caseId = null, topK = 10) => {
    const query = new URLSearchParams({ top_k: topK });
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/analytics/link-prediction?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getAnomalies: async (caseId = null) => {
    const query = new URLSearchParams();
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/analytics/anomalies?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getRiskExplanation: async (nodeId, caseId = null) => {
    const query = new URLSearchParams();
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/analytics/explain/${encodeURIComponent(nodeId)}?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  executeNlQuery: async (queryText, caseId = null) => {
    return fetchJson(`${API_BASE}/analytics/nl-query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query: queryText, case_id: caseId })
    });
  },

  // Cross-Case Intelligence Linker
  getCrossCaseLinks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.state) query.append('state', params.state);
    if (params.entityType) query.append('entity_type', params.entityType);
    return fetchJson(`${API_BASE}/cross-case/links?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getCaseOverlap: async (case1, case2) => {
    const query = new URLSearchParams({ case_1: case1, case_2: case2 });
    return fetchJson(`${API_BASE}/cross-case/overlap?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  getCrossCaseAlerts: async () => {
    return fetchJson(`${API_BASE}/cross-case/alerts`, {
      headers: getHeaders()
    });
  },

  triggerCrossCaseScan: async () => {
    return fetchJson(`${API_BASE}/cross-case/scan`, {
      method: 'POST',
      headers: getHeaders()
    });
  },

  // Ingestion & NLP
  extractNlp: async (text, caseId, sourceType = 'FIR') => {
    return fetchJson(`${API_BASE}/ingest/nlp-extract`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, case_id: caseId, source_type: sourceType })
    });
  },

  commitNlp: async (extractionResult) => {
    return fetchJson(`${API_BASE}/ingest/nlp-commit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(extractionResult)
    });
  },

  commitNlpExtraction: async (caseId, extractionData) => {
    // Alias for backward compatibility
    const payload = extractionData?.extracted_entities ? extractionData : { case_id: caseId, ...extractionData };
    return fetchJson(`${API_BASE}/ingest/nlp-commit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
  },

  // Blockchain & Evidence Integrity Ledger
  getLedger: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.caseId) query.append('case_id', params.caseId);
    if (params.entityId) query.append('entity_id', params.entityId);
    if (params.actionType) query.append('action_type', params.actionType);
    return fetchJson(`${API_BASE}/blockchain/ledger?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  verifyChainIntegrity: async () => {
    return fetchJson(`${API_BASE}/blockchain/verify-chain`, {
      headers: getHeaders()
    });
  },

  simulateDatabaseTamper: async (blockId, maliciousData) => {
    return fetchJson(`${API_BASE}/blockchain/tamper-demo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ block_id: blockId, malicious_data: maliciousData })
    });
  },

  restoreLedgerConsensus: async () => {
    return fetchJson(`${API_BASE}/blockchain/restore`, {
      method: 'POST',
      headers: getHeaders()
    });
  },

  anchorLayer2Checkpoint: async () => {
    return fetchJson(`${API_BASE}/blockchain/l2-anchor`, {
      method: 'POST',
      headers: getHeaders()
    });
  },

  getEntityChainOfCustody: async (entityId) => {
    return fetchJson(`${API_BASE}/blockchain/entity-history/${encodeURIComponent(entityId)}`, {
      headers: getHeaders()
    });
  },

  getBlockchainBlocks: async (caseId = null) => {
    const query = new URLSearchParams();
    if (caseId) query.append('case_id', caseId);
    return fetchJson(`${API_BASE}/blockchain/ledger?${query.toString()}`, {
      headers: getHeaders()
    });
  },

  verifyBlockchain: async () => {
    return fetchJson(`${API_BASE}/blockchain/verify-chain`, {
      headers: getHeaders()
    });
  },

  simulateTamper: async (blockIndex, maliciousData) => {
    return fetchJson(`${API_BASE}/blockchain/tamper-demo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ block_id: blockIndex, malicious_data: maliciousData })
    });
  },

  restoreBlockchain: async () => {
    return fetchJson(`${API_BASE}/blockchain/restore`, {
      method: 'POST',
      headers: getHeaders()
    });
  },

  getCustodyCertificate: async (caseId) => {
    return fetchJson(`${API_BASE}/blockchain/certificate/${encodeURIComponent(caseId)}`, {
      headers: getHeaders()
    });
  },

  // Scenarios
  getScenarios: async () => {
    return fetchJson(`${API_BASE}/scenarios`, {
      headers: getHeaders()
    });
  },

  // Reports
  getDossierUrl: (caseId) => {
    return `${API_BASE}/reports/dossier/${encodeURIComponent(caseId || 'CASE-HAWALA-2024')}?format=html`;
  },

  getCaseReportHtml: async (caseId) => {
    const res = await fetch(`${API_BASE}/reports/dossier/${encodeURIComponent(caseId)}?format=html`, {
      headers: getHeaders()
    });
    return res.text();
  }
};

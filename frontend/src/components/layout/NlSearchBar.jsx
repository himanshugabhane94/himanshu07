import React, { useState } from 'react';
import { Search, Sparkles, Terminal, ArrowRight, X, Lightbulb, Check } from 'lucide-react';
import { api } from '../../services/api';

export default function NlSearchBar({ selectedCaseId, onQueryResults, onClearQuery }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  const sampleQueries = [
    "Show all connections to Vikram Sharma within 2 hops",
    "Find path between Rohit Khanna and Swiss Bank",
    "Who is the kingpin in Hawala case?",
    "Show high-risk entities in Narcotics corridor",
    "Find 2 hop associates of Gurpreet Singh"
  ];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.executeNlQuery(query, selectedCaseId);
      setLastResponse(res);
      if (onQueryResults) {
        onQueryResults(res);
      }
    } catch (err) {
      console.error("NL Query failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setQuery(sample);
    setTimeout(() => {
      api.executeNlQuery(sample, selectedCaseId).then(res => {
        setLastResponse(res);
        if (onQueryResults) onQueryResults(res);
      });
    }, 50);
  };

  const clearSearch = () => {
    setQuery('');
    setLastResponse(null);
    if (onClearQuery) onClearQuery();
  };

  return (
    <div className="w-full bg-[#0f0e0d]/95 border-b border-[#3a352d] p-3 shadow-dossier">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#d68a1f]">
            <Sparkles className="w-4 h-4" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask SUTRA Natural Language AI: 'Show 2-hop connections to Vikram Sharma', 'Find path between Rohit Khanna and Swiss Bank'..."
            className="w-full pl-10 pr-24 py-2 bg-[#1c1a17] border border-[#3a352d] rounded-xl text-xs text-[#ece7de] placeholder-[#8a8478] focus:outline-none focus:border-[#d68a1f] font-mono transition-all"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 rounded-lg text-[#8a8478] hover:text-[#ece7de] hover:bg-[#24211d] transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 rounded-lg bg-[#d68a1f] hover:bg-[#e59b2d] text-[#0f0e0d] text-xs font-bold font-mono transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-[#0f0e0d] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Query</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Query Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono py-0.5 no-scrollbar">
          <span className="text-[#8a8478] flex items-center gap-1 shrink-0">
            <Lightbulb className="w-3 h-3 text-[#d68a1f]" /> Quick Queries:
          </span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(q)}
              className="px-2.5 py-0.5 rounded-lg bg-[#1c1a17] hover:bg-[#24211d] border border-[#3a352d] text-[#8a8478] hover:text-[#ece7de] transition-all shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Response Banner (If Query Executed) */}
        {lastResponse && (
          <div className="p-3 rounded-xl bg-[#1c1a17] border border-[#d68a1f]/40 space-y-1.5 animate-in fade-in slide-in-from-top-1 text-xs font-mono shadow-dossier">
            <div className="flex items-center justify-between text-[#d68a1f] font-bold">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>AI Interpretation & Cypher Execution</span>
              </div>
              <span className="text-[10px] text-[#8a8478]">
                {lastResponse.matching_nodes?.length || 0} Entities Found
              </span>
            </div>

            <div className="text-[#ece7de] font-serif">
              {lastResponse.interpretation}
            </div>

            <div className="bg-[#0f0e0d] p-2 rounded-lg border border-[#3a352d] text-[11px] text-[#f5c074] truncate">
              <code>{lastResponse.cypher_equivalent}</code>
            </div>

            {lastResponse.insights?.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-[#8a8478] font-serif">
                {lastResponse.insights.map((ins, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="text-[#d68a1f]">▪</span>
                    <span>{ins}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

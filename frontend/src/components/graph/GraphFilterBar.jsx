import React from 'react';
import { 
  User, Phone, Building2, Landmark, Truck, 
  MapPin, Globe, AlertOctagon, Filter, Eye, ShieldAlert,
  Sliders, Maximize2, RefreshCw, Crosshair, Package
} from 'lucide-react';

export default function GraphFilterBar({
  selectedNodeTypes,
  onToggleNodeType,
  minRisk,
  onSelectMinRisk,
  searchQuery,
  onSearchChange,
  nodeSizingMetric,
  onSelectNodeSizing,
  layoutMode,
  onSelectLayout,
  onResetView,
  stats
}) {
  const nodeTypeConfigs = [
    { type: 'Person', label: 'Persons', icon: User, color: 'text-[#d68a1f]', count: stats?.persons_count },
    { type: 'Phone', label: 'Phones', icon: Phone, color: 'text-[#4a6670]', count: stats?.phones_count },
    { type: 'BankAccount', label: 'Bank Accounts', icon: Landmark, color: 'text-[#5c7a5c]', count: stats?.bank_accounts_count },
    { type: 'Organization', label: 'Front Orgs', icon: Building2, color: 'text-[#8a7258]' },
    { type: 'Vehicle', label: 'Vehicles', icon: Truck, color: 'text-[#6d757a]' },
    { type: 'Location', label: 'Locations', icon: MapPin, color: 'text-[#8c5e4a]' },
    { type: 'Weapon', label: 'Weapons', icon: Crosshair, color: 'text-[#a5342a]' },
    { type: 'StolenProperty', label: 'Stolen Property', icon: Package, color: 'text-[#c9a227]' },
    { type: 'DigitalID', label: 'Digital / Crypto', icon: Globe, color: 'text-[#6a5a7a]' },
  ];

  return (
    <div className="bg-[#1c1a17]/95 backdrop-blur-md border-b border-[#3a352d] p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm select-none">
      
      {/* Node Type Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[#8a8478] font-semibold flex items-center gap-1 mr-1 text-[11px] font-mono">
          <Filter className="w-3 h-3 text-[#d68a1f]" /> FILTERS:
        </span>
        {nodeTypeConfigs.map((cfg) => {
          const Icon = cfg.icon;
          const isSelected = selectedNodeTypes.includes(cfg.type);
          return (
            <button
              key={cfg.type}
              onClick={() => onToggleNodeType(cfg.type)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#24211d] border-[#d68a1f]/50 text-[#f5c074]'
                  : 'bg-[#0f0e0d] border-[#3a352d] text-[#8a8478] hover:text-[#ece7de]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? cfg.color : 'text-[#666157]'}`} />
              <span className="font-medium">{cfg.label}</span>
              {cfg.count !== undefined && (
                <span className="text-[10px] px-1 bg-[#0f0e0d] rounded text-[#8a8478] font-mono">
                  {cfg.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Risk Filter, Node Sizing, Layout, Reset */}
      <div className="flex items-center gap-2 flex-wrap ml-auto">
        
        {/* Risk Level Filter */}
        <div className="flex items-center gap-1 bg-[#0f0e0d] px-2 py-1 rounded-xl border border-[#3a352d]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#a5342a]" />
          <select
            value={minRisk || ''}
            onChange={(e) => onSelectMinRisk(e.target.value || null)}
            className="bg-transparent text-xs text-[#ece7de] font-mono focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-[#1c1a17]">All Risk Tiers</option>
            <option value="Critical" className="bg-[#1c1a17]">Critical Only (Level 4)</option>
            <option value="High" className="bg-[#1c1a17]">High & Above</option>
            <option value="Medium" className="bg-[#1c1a17]">Medium & Above</option>
          </select>
        </div>

        {/* Node Sizing Metric Selector */}
        <div className="flex items-center gap-1 bg-[#0f0e0d] px-2 py-1 rounded-xl border border-[#3a352d]">
          <Eye className="w-3.5 h-3.5 text-[#d68a1f]" />
          <select
            value={nodeSizingMetric}
            onChange={(e) => onSelectNodeSizing(e.target.value)}
            className="bg-transparent text-xs text-[#ece7de] font-mono focus:outline-none cursor-pointer"
          >
            <option value="pagerank" className="bg-[#1c1a17]">Size: PageRank</option>
            <option value="betweenness" className="bg-[#1c1a17]">Size: Betweenness</option>
            <option value="degree" className="bg-[#1c1a17]">Size: Degree</option>
            <option value="risk" className="bg-[#1c1a17]">Size: Risk Score</option>
          </select>
        </div>

        {/* Graph Layout Mode */}
        <div className="flex items-center gap-1 bg-[#0f0e0d] px-2 py-1 rounded-xl border border-[#3a352d]">
          <Sliders className="w-3.5 h-3.5 text-[#4a6670]" />
          <select
            value={layoutMode}
            onChange={(e) => onSelectLayout(e.target.value)}
            className="bg-transparent text-xs text-[#ece7de] font-mono focus:outline-none cursor-pointer"
          >
            <option value="force" className="bg-[#1c1a17]">Layout: Force Grid</option>
            <option value="concentric" className="bg-[#1c1a17]">Layout: Concentric</option>
            <option value="community" className="bg-[#1c1a17]">Layout: Clusters</option>
          </select>
        </div>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          className="p-1.5 rounded-xl bg-[#0f0e0d] hover:bg-[#24211d] border border-[#3a352d] text-[#8a8478] hover:text-[#ece7de] transition-all"
          title="Reset Graph Simulation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
}

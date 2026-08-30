'use client';

import React, { useState } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { GeoPoint } from '@/types/synapx';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Filter, 
  Building, 
  Anchor, 
  ShieldAlert, 
  Eye, 
  Share2, 
  Calendar,
  X,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

export function GeoIntelligenceMap() {
  const { geoPoints, entities, activeCase, highlightEntitiesOnGraph } = useInvestigation();
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(geoPoints[0]?.id || null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const selectedPoint = geoPoints.find(g => g.id === selectedGeoId);

  const filteredPoints = geoPoints.filter(p => {
    if (filterType === 'ALL') return true;
    return p.type === filterType;
  });

  // Relative SVG coordinates projection for India & Gulf region
  const getCoordinates = (lat: number, lng: number) => {
    // Map projection bounds: Lng (50 to 90), Lat (10 to 32)
    const x = ((lng - 50) / 40) * 800 + 40;
    const y = ((32 - lat) / 22) * 480 + 40;
    return { x: Math.max(30, Math.min(840, x)), y: Math.max(30, Math.min(500, y)) };
  };

  const getMarkerColor = (type: GeoPoint['type']) => {
    switch (type) {
      case 'PORT': return '#14B8A6'; // Teal
      case 'SHELL_HQ': return '#F59E0B'; // Amber
      case 'MEETING_POINT': return '#06B6D4'; // Cyan
      case 'SAFEHOUSE': return '#EF4444'; // Red
      case 'TRANSIT_HUB': return '#EAB308'; // Gold
      default: return '#A855F7';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-obsidian-700">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">Geographic Intelligence & Crime Hotspots</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Geospatial correlation of transit corridors, shell incorporation hubs, and interdicted cargo terminals.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-obsidian-850 p-1 rounded-lg border border-obsidian-700 text-xs">
          <span className="text-slate-400 font-mono text-[10px] px-1 uppercase">Filter:</span>
          {['ALL', 'PORT', 'SHELL_HQ', 'MEETING_POINT', 'SAFEHOUSE', 'TRANSIT_HUB'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filterType === type
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Geospatial Map Canvas & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Map Canvas */}
        <div className="lg:col-span-2 synapx-card p-4 bg-obsidian-900 border border-obsidian-700 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          
          {/* Top Map Bar */}
          <div className="flex items-center justify-between z-10 text-xs mb-2">
            <span className="font-mono text-teal-400 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              West Coast Maritime Corridor (Mumbai ↔ Surat ↔ Dubai Transit)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Projection: WGS84 Geo-Sync</span>
          </div>

          {/* SVG Map Projection */}
          <div className="relative flex-1 bg-obsidian-950 rounded-xl border border-obsidian-800 p-2 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 880 540" className="w-full h-full max-h-[480px]">
              
              {/* Subtle Grid Lat/Long Lines */}
              <defs>
                <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#geo-grid)" />

              {/* Synthetic Coastline Polyline (Arabian Sea to Gulf) */}
              <path
                d="M 50 120 Q 150 160 220 220 T 320 380 Q 420 440 500 500"
                fill="none"
                stroke="rgba(15, 118, 110, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Transit Route Polylines connecting Dubai -> JNPT Port */}
              <path
                d="M 145 280 Q 300 240 488 385"
                fill="none"
                stroke="rgba(245, 158, 11, 0.6)"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              <text x="290" y="295" fill="#F59E0B" fontSize="10" fontFamily="monospace">Maritime Smuggling Vector</text>

              {/* Surat to Mumbai Domestic Transit Vector */}
              <path
                d="M 488 385 L 485 340"
                fill="none"
                stroke="rgba(20, 184, 166, 0.6)"
                strokeWidth="2"
              />

              {/* Render Location Markers */}
              {filteredPoints.map((point) => {
                const { x, y } = getCoordinates(point.latitude, point.longitude);
                const isSelected = selectedGeoId === point.id;
                const color = getMarkerColor(point.type);

                return (
                  <g
                    key={point.id}
                    onClick={() => setSelectedGeoId(point.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Outer Ring for selected / critical */}
                    {(isSelected || point.riskLevel === 'CRITICAL') && (
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 18 : 14}
                        fill={color}
                        opacity="0.2"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 12 : 9}
                      fill="#151B23"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                    />

                    {/* Inner Core */}
                    <circle cx={x} cy={y} r={isSelected ? 5 : 3.5} fill={color} />

                    {/* Label Tag */}
                    <rect
                      x={x + 12}
                      y={y - 12}
                      width={point.name.length * 6.5 + 16}
                      height="20"
                      rx="4"
                      fill="rgba(13, 17, 23, 0.9)"
                      stroke={isSelected ? color : 'rgba(30, 41, 59, 0.8)'}
                    />
                    <text
                      x={x + 20}
                      y={y + 2}
                      fill={isSelected ? '#F8FAFC' : '#94A3B8'}
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {point.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Legend */}
          <div className="pt-3 border-t border-obsidian-800 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> Port Logistics</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Shell Corporate HQ</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Meeting Point</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Safehouse / Off-Ramp</span>
            </div>
            <span>{filteredPoints.length} Locations Active</span>
          </div>
        </div>

        {/* Right Col: Selected Location Details & Linked Suspects */}
        <div className="synapx-card p-5 bg-obsidian-850 flex flex-col justify-between">
          {selectedPoint ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-obsidian-700">
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">
                  {selectedPoint.type.replace('_', ' ')} • {selectedPoint.riskLevel} RISK
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{selectedPoint.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedPoint.city}, {selectedPoint.state}, {selectedPoint.country}
                </p>
              </div>

              {/* Coordinates Pill */}
              <div className="p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 font-mono text-xs text-slate-300 flex items-center justify-between">
                <span>Coordinates:</span>
                <span className="text-teal-400">{selectedPoint.latitude.toFixed(4)}°N, {selectedPoint.longitude.toFixed(4)}°E</span>
              </div>

              {/* Connected Suspects / Entities */}
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-2">
                  Linked Target Entities ({selectedPoint.entityIds.length})
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedPoint.entityIds.map(entId => {
                    const ent = entities.find(e => e.id === entId);
                    if (!ent) return null;
                    return (
                      <div key={ent.id} className="p-2 rounded bg-obsidian-900 border border-obsidian-750 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-200">{ent.name}</div>
                          <div className="text-[10px] text-slate-400">{ent.roleOrDesignation}</div>
                        </div>
                        <span className="text-[10px] font-mono text-teal-400">{ent.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Graph Sync Trigger */}
              <button
                onClick={() => highlightEntitiesOnGraph(selectedPoint.entityIds)}
                className="w-full py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-500/40 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Highlight Linked Nodes on Graph</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p>Select any geospatial marker on the map to inspect location metadata and connected suspects.</p>
            </div>
          )}

          <div className="pt-3 border-t border-obsidian-700 text-[11px] text-slate-400">
            <span>Geospatial Intelligence Module v2.6</span>
          </div>
        </div>

      </div>

    </div>
  );
}

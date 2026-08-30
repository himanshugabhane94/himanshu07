import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, ShieldAlert, Layers, Filter, 
  Sparkles, Compass, Search, RefreshCw, 
  Maximize2, ZoomIn, ZoomOut, AlertTriangle,
  ChevronRight, ExternalLink, Activity, Info
} from 'lucide-react';
import { api } from '../../services/api';

// Regional preset coordinates for quick navigation
const REGION_PRESETS = [
  { label: 'All India Overview', lat: 22.8, lng: 79.5, zoom: 5, icon: '🇮🇳' },
  { label: 'Delhi NCR Grid', lat: 28.58, lng: 77.15, zoom: 11, icon: '🏛️' },
  { label: 'Mumbai Metro Corridor', lat: 19.00, lng: 72.84, zoom: 12, icon: '🚢' },
  { label: 'Punjab Border Line', lat: 31.61, lng: 74.59, zoom: 12, icon: '🌾' },
  { label: 'J&K Technical Grid', lat: 33.85, lng: 75.20, zoom: 9, icon: '🏔️' },
  { label: 'Alwar Transit Safehouse', lat: 27.55, lng: 76.63, zoom: 11, icon: '🏜️' }
];

// Color mapping per crime category
const CRIME_COLORS = {
  Murder: { bg: '#a5342a', border: '#e27d75', text: '#fde8e7' },
  SexualAssault: { bg: '#a5342a', border: '#e27d75', text: '#fde8e7' },
  Robbery: { bg: '#8b261d', border: '#e27d75', text: '#fde8e7' },
  Kidnapping: { bg: '#c86a24', border: '#f5c074', text: '#fff3db' },
  Narcotics: { bg: '#b85d19', border: '#e5aa70', text: '#fff3db' },
  SleeperCell: { bg: '#6e2b24', border: '#e27d75', text: '#fde8e7' },
  Harassment: { bg: '#4a6670', border: '#8fb1bd', text: '#eef6f8' },
  Theft: { bg: '#735738', border: '#d68a1f', text: '#fef7e8' },
  Hawala: { bg: '#3a5059', border: '#789da8', text: '#edf4f6' },
  DEFAULT: { bg: '#d68a1f', border: '#f5c074', text: '#fff3db' }
};

export default function GeoIntelligenceMap({ cases = [], onSelectCase, onSelectNode }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const circlesLayerRef = useRef(null);

  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  
  // Filters
  const [radiusKm, setRadiusKm] = useState(15.0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState('hotspots'); // 'hotspots' | 'locations'

  // Fetch geospatial data from API
  const fetchGeoData = async () => {
    setLoading(true);
    try {
      const params = {
        radius_km: radiusKm,
        crime_category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        risk_level: selectedRisk !== 'ALL' ? selectedRisk : undefined
      };
      const res = await api.getGeoClusters(params);
      setGeoData(res);
    } catch (err) {
      console.error('Failed to fetch geospatial intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeoData();
  }, [radiusKm, selectedCategory, selectedRisk]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!window.L) {
      console.error('Leaflet is not loaded on window.');
      return;
    }

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [22.8, 79.5],
        zoom: 5,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter tile layer for Federal Archive theme
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CartoDB & OpenStreetMap'
      }).addTo(map);

      // Attribution
      window.L.control.attribution({ position: 'bottomright' })
        .addAttribution('SUTRA Federal Intelligence Grid | MHA')
        .addTo(map);

      markersLayerRef.current = window.L.layerGroup().addTo(map);
      circlesLayerRef.current = window.L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers & Clusters on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !geoData || !window.L) return;

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const circlesLayer = circlesLayerRef.current;

    markersLayer.clearLayers();
    circlesLayer.clearLayers();

    // 1. Plot Proximity Hotspot Circles
    if (geoData.clusters) {
      geoData.clusters.forEach(cluster => {
        if (cluster.location_count >= 2) {
          const isCritical = cluster.risk_severity === 'CRITICAL';
          const circleColor = isCritical ? '#a5342a' : '#d68a1f';

          const circle = window.L.circle([cluster.center_latitude, cluster.center_longitude], {
            radius: cluster.radius_km * 1000,
            color: circleColor,
            fillColor: circleColor,
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: '5, 5'
          });

          circle.bindTooltip(`
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 2px;">
              <strong style="color: ${circleColor};">${cluster.cluster_title}</strong><br/>
              <span>${cluster.location_count} Incident Points • Radius: ${cluster.radius_km} km</span>
            </div>
          `, { sticky: true, className: 'sutra-map-tooltip' });

          circle.on('click', () => {
            setSelectedCluster(cluster);
            map.flyTo([cluster.center_latitude, cluster.center_longitude], 12, { duration: 1.0 });
          });

          circlesLayer.addLayer(circle);
        }
      });
    }

    // 2. Plot Location Point Markers
    if (geoData.locations) {
      geoData.locations.forEach(pt => {
        const style = CRIME_COLORS[pt.crime_category] || CRIME_COLORS.DEFAULT;
        const isCritical = pt.risk_level === 'Critical';

        // Custom SVG Pin Icon
        const iconHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: ${style.bg};
            border: 2px solid ${style.border};
            box-shadow: 0 0 12px ${style.bg}88;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span style="font-size: 11px; color: ${style.text}; font-family: 'IBM Plex Mono', monospace; font-weight: bold;">
              ${pt.risk_level === 'Critical' ? '!' : '●'}
            </span>
          </div>
        `;

        const customIcon = window.L.divIcon({
          html: iconHtml,
          className: 'sutra-custom-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = window.L.marker([pt.latitude, pt.longitude], { icon: customIcon });

        // Popup template
        const popupContent = `
          <div style="font-family: 'Source Serif 4', Georgia, serif; color: #ece7de; background: #1c1a17; padding: 12px; border-radius: 12px; border: 1px solid #3a352d; min-width: 220px;">
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #d68a1f; letter-spacing: 0.5px; font-weight: bold; margin-bottom: 4px;">
              ${pt.fir_number} • ${pt.city}, ${pt.state}
            </div>
            <div style="font-size: 13px; font-weight: bold; margin-bottom: 6px; color: #ece7de;">
              ${pt.label}
            </div>
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
              <span style="background: #24211d; color: ${style.border}; padding: 2px 6px; border-radius: 4px; border: 1px solid #3a352d;">
                ${pt.crime_category}
              </span>
              <span style="background: #24211d; color: #8a8478; padding: 2px 6px; border-radius: 4px; border: 1px solid #3a352d;">
                ${pt.risk_level} Risk
              </span>
            </div>
            ${pt.evidence_ref ? `
              <div style="font-size: 11px; color: #8a8478; border-top: 1px solid #2a2620; padding-top: 6px; margin-top: 4px;">
                ${pt.evidence_ref}
              </div>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent, { className: 'sutra-map-popup' });
        marker.on('click', () => {
          setSelectedPoint(pt);
        });

        markersLayer.addLayer(marker);
      });
    }

  }, [geoData]);

  // Jump to Preset Region
  const handleJumpToRegion = (preset) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([preset.lat, preset.lng], preset.zoom, { duration: 1.2 });
  };

  // Zoom to specific cluster
  const handleFocusCluster = (cluster) => {
    setSelectedCluster(cluster);
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([cluster.center_latitude, cluster.center_longitude], 12, { duration: 1.2 });
  };

  // Filtered hotspots & locations for search
  const filteredHotspots = geoData?.clusters?.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.cluster_title.toLowerCase().includes(q) || 
           c.gang_territory_analysis.toLowerCase().includes(q) ||
           c.associated_firs.some(f => f.toLowerCase().includes(q));
  }) || [];

  const filteredLocations = geoData?.locations?.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return l.label.toLowerCase().includes(q) || 
           l.fir_number.toLowerCase().includes(q) || 
           l.city.toLowerCase().includes(q) || 
           l.crime_category.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-[#0f0e0d] text-[#ece7de] overflow-hidden">
      
      {/* Top Filter & Control Ribbon */}
      <div className="px-4 py-2.5 bg-[#141210] border-b border-[#3a352d] flex items-center justify-between gap-3 flex-wrap">
        
        {/* Title & Stats */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-[#1c1a17] border border-[#d68a1f]/40 text-[#f5c074]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide font-cinzel text-[#ece7de]">
              Geospatial Crime Intelligence Map
            </h1>
            <p className="text-[11px] text-[#8a8478] font-mono">
              {geoData?.total_locations_mapped || 0} Incident Scenes Mapped • {geoData?.total_hotspots_detected || 0} High-Density Hotspots Detected
            </p>
          </div>
        </div>

        {/* Quick Regional Navigation Presets */}
        <div className="hidden lg:flex items-center gap-1 bg-[#0f0e0d] p-1 rounded-xl border border-[#3a352d]">
          {REGION_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToRegion(preset)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-[#8a8478] hover:text-[#ece7de] hover:bg-[#1c1a17] transition-all flex items-center gap-1.5"
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Filters Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          
          {/* Crime Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1c1a17] border border-[#3a352d] text-[#ece7de] px-2.5 py-1.5 rounded-xl focus:border-[#d68a1f] outline-none"
          >
            <option value="ALL">All Crime Types</option>
            <option value="Murder">Homicide / Murder</option>
            <option value="Kidnapping">Kidnapping & Abduction</option>
            <option value="Robbery">Armed Robbery</option>
            <option value="Theft">Burglary & Auto Theft</option>
            <option value="SexualAssault">Sexual Assault</option>
            <option value="Harassment">Cyberstalking & Threats</option>
            <option value="Narcotics">Narcotics Trafficking</option>
            <option value="Hawala">Hawala & Money Laundering</option>
            <option value="SleeperCell">Counter-Terrorism</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-[#1c1a17] border border-[#3a352d] text-[#ece7de] px-2.5 py-1.5 rounded-xl focus:border-[#d68a1f] outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Critical">Critical Risk</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
          </select>

          {/* Cluster Radius Slider */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1c1a17] border border-[#3a352d] text-[#8a8478]">
            <span className="text-[10px]">Radius:</span>
            <span className="text-[#f5c074] font-bold">{radiusKm}km</span>
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5"
              value={radiusKm} 
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              className="w-16 accent-[#d68a1f] cursor-pointer"
            />
          </div>

          <button
            onClick={fetchGeoData}
            className="p-1.5 rounded-xl bg-[#1c1a17] border border-[#3a352d] hover:border-[#d68a1f] text-[#8a8478] hover:text-[#ece7de] transition-all"
            title="Refresh GIS Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d68a1f]' : ''}`} />
          </button>
        </div>

      </div>

      {/* Main Content Area: Map Canvas + Intelligence Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Interactive Map Canvas */}
        <div className="flex-1 h-full relative bg-[#0a0908]">
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

          {/* Map Controls Floating Overlay */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2 rounded-xl bg-[#1c1a17]/90 backdrop-blur border border-[#3a352d] hover:border-[#d68a1f] text-[#ece7de] shadow-lg transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2 rounded-xl bg-[#1c1a17]/90 backdrop-blur border border-[#3a352d] hover:border-[#d68a1f] text-[#ece7de] shadow-lg transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-6 left-4 z-10 p-3 rounded-2xl bg-[#0f0e0d]/90 backdrop-blur-md border border-[#3a352d] shadow-2xl max-w-xs space-y-2">
            <div className="text-[10px] font-bold text-[#8a8478] uppercase font-mono tracking-wider">
              Crime Classification Legend
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a5342a] border border-[#e27d75]"></span>
                <span className="text-[#ece7de]">Homicide / Assault</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c86a24] border border-[#f5c074]"></span>
                <span className="text-[#ece7de]">Kidnapping / Heist</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b85d19] border border-[#e5aa70]"></span>
                <span className="text-[#ece7de]">Narcotics / Terror</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4a6670] border border-[#8fb1bd]"></span>
                <span className="text-[#ece7de]">Cyber / Harassment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#735738] border border-[#d68a1f]"></span>
                <span className="text-[#ece7de]">Theft / Pawn Vault</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3a5059] border border-[#789da8]"></span>
                <span className="text-[#ece7de]">Hawala / Shells</span>
              </div>
            </div>
            <div className="text-[10px] text-[#8a8478] font-serif italic pt-1 border-t border-[#2a2620]">
              Dashed halos indicate spatial crime clustering and suspected gang territories.
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar: Hotspots & Gang Territories Analysis */}
        <div className="w-96 lg:w-[420px] bg-[#141210] border-l border-[#3a352d] flex flex-col h-full shadow-2xl z-20">
          
          {/* Sidebar Tabs & Search */}
          <div className="p-4 border-b border-[#3a352d] space-y-3">
            <div className="flex items-center rounded-xl bg-[#0f0e0d] border border-[#3a352d] p-1 text-xs font-mono">
              <button
                onClick={() => setActiveSidebarTab('hotspots')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeSidebarTab === 'hotspots'
                    ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40'
                    : 'text-[#8a8478] hover:text-[#ece7de]'
                }`}
              >
                Hotspots ({geoData?.clusters?.filter(c => c.location_count >= 2).length || 0})
              </button>
              <button
                onClick={() => setActiveSidebarTab('locations')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeSidebarTab === 'locations'
                    ? 'bg-[#24211d] text-[#f5c074] border border-[#d68a1f]/40'
                    : 'text-[#8a8478] hover:text-[#ece7de]'
                }`}
              >
                All Nodes ({geoData?.locations?.length || 0})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8a8478] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city, FIR, scene or gang territory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#0f0e0d] border border-[#3a352d] rounded-xl text-xs text-[#ece7de] placeholder-[#8a8478] focus:border-[#d68a1f] outline-none font-serif"
              />
            </div>
          </div>

          {/* Sidebar Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#3a352d]">
            
            {/* TAB 1: DETECTED HOTSPOTS */}
            {activeSidebarTab === 'hotspots' && (
              <>
                <div className="text-[10px] font-bold text-[#8a8478] uppercase font-mono tracking-wider">
                  Proximity Spatial Hotspots & Operational Radii
                </div>

                {filteredHotspots.length > 0 ? (
                  filteredHotspots.map((cluster, idx) => {
                    const isSelected = selectedCluster?.cluster_id === cluster.cluster_id;
                    const isMulti = cluster.location_count >= 2;
                    const isCritical = cluster.risk_severity === 'CRITICAL';

                    return (
                      <div
                        key={idx}
                        onClick={() => handleFocusCluster(cluster)}
                        className={`p-4 rounded-2xl bg-[#0f0e0d] border transition-all cursor-pointer space-y-2.5 ${
                          isSelected
                            ? 'border-[#d68a1f] ring-1 ring-[#d68a1f]/40 shadow-dossier'
                            : isCritical
                            ? 'border-[#a5342a]/40 hover:border-[#a5342a]'
                            : 'border-[#3a352d] hover:border-[#d68a1f]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-xs text-[#ece7de] font-serif">
                              {cluster.cluster_title}
                            </div>
                            <div className="text-[11px] text-[#8a8478] font-mono mt-0.5">
                              {cluster.location_count} Incident Nodes • {cluster.radius_km} km Radius
                            </div>
                          </div>
                          <span className={isCritical ? 'seal-badge-critical' : 'seal-badge-high'}>
                            {cluster.dominant_crime_category}
                          </span>
                        </div>

                        {/* Associated FIR Badges */}
                        <div className="flex flex-wrap gap-1">
                          {cluster.associated_firs.map((fir, fIdx) => (
                            <span 
                              key={fIdx}
                              className="px-2 py-0.5 rounded-lg bg-[#1c1a17] text-[#f5c074] border border-[#3a352d] text-[10px] font-mono"
                            >
                              {fir}
                            </span>
                          ))}
                        </div>

                        {/* Gang Territory & Tactical Analysis Narrative */}
                        <p className="text-xs text-[#ece7de] font-serif bg-[#1c1a17] p-2.5 rounded-xl border border-[#2a2620] leading-relaxed">
                          {cluster.gang_territory_analysis}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#d68a1f]">
                          <span>Centroid: {cluster.center_latitude}, {cluster.center_longitude}</span>
                          <span className="flex items-center gap-1 font-bold">
                            Focus Territory <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-[#8a8478] font-mono rounded-2xl bg-[#0f0e0d] border border-[#3a352d]">
                    No crime clusters matching current radius and category filters.
                  </div>
                )}
              </>
            )}

            {/* TAB 2: ALL LOCATION NODES */}
            {activeSidebarTab === 'locations' && (
              <>
                <div className="text-[10px] font-bold text-[#8a8478] uppercase font-mono tracking-wider">
                  All Mapped Criminal Infrastructure & Scenes
                </div>

                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedPoint(loc);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 14, { duration: 1.0 });
                        }
                      }}
                      className="p-3 rounded-xl bg-[#0f0e0d] border border-[#3a352d] hover:border-[#d68a1f] transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-[#ece7de] font-serif">{loc.label}</span>
                        <span className="seal-badge-medium">{loc.risk_level}</span>
                      </div>
                      <div className="text-[11px] text-[#8a8478] font-mono">
                        {loc.fir_number} • {loc.city}, {loc.state}
                      </div>
                      <div className="text-[10px] text-[#d68a1f] font-mono">
                        Coordinates: {loc.latitude}, {loc.longitude}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-[#8a8478] font-mono rounded-2xl bg-[#0f0e0d] border border-[#3a352d]">
                    No locations match the query.
                  </div>
                )}
              </>
            )}

          </div>

          {/* Sidebar Footer Statutory Note */}
          <div className="p-3 border-t border-[#3a352d] bg-[#0f0e0d] text-[10px] text-[#8a8478] font-serif italic text-center">
            ⚖️ <strong>GIS Operational Notice:</strong> Haversine spatial clustering groups incidents within specified distance thresholds to expose cross-FIR mobile syndicate operations and transit corridors.
          </div>

        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useInvestigation } from '@/context/InvestigationContext';
import { 
  InvestigationEntity, 
  InvestigationRelationship, 
  EntityType 
} from '@/types/synapx';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RefreshCw, 
  Filter, 
  Layers, 
  Sliders, 
  Eye, 
  ShieldCheck, 
  Sparkles, 
  Info,
  X,
  Share2,
  Lock,
  Compass,
  Zap,
  ArrowRight
} from 'lucide-react';
import { EntityTypeBadge, ProvenanceBadge, PriorityBadge } from '@/components/common/ProvenanceBadge';
import { RedactedText } from '@/components/common/RedactedText';

interface GraphNode {
  id: string;
  name: string;
  type: EntityType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  entity: InvestigationEntity;
  isBridge?: boolean;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight: number;
  confidence: number;
  isAnomaly?: boolean;
  rel: InvestigationRelationship;
}

interface InteractiveNetworkGraphProps {
  initialFocusEntityId?: string;
  highlightPath?: string[];
  forceFocusMode?: boolean;
  filterCluster?: string;
}

export function InteractiveNetworkGraph({
  initialFocusEntityId,
  highlightPath = [],
  forceFocusMode = false,
  filterCluster
}: InteractiveNetworkGraphProps) {
  const { 
    entities, 
    relationships, 
    activeCase, 
    highlightedEntityIds, 
    updateEntityVerification 
  } = useInvestigation();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Layers toggle state
  const [layers, setLayers] = useState<Record<EntityType, boolean>>({
    PERSON: true,
    ORGANIZATION: true,
    EVENT: true,
    LOCATION: true,
    DIGITAL_ENTITY: true,
    DOCUMENT: true
  });

  // Graph state controls
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<GraphNode | null>(null);

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(initialFocusEntityId || null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  
  const [hopDistance, setHopDistance] = useState<number>(forceFocusMode ? 1 : 3);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(forceFocusMode);
  const [minWeight, setMinWeight] = useState<number>(1);
  const [showClusters, setShowClusters] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Node Type Color Mapping
  const nodeColors: Record<EntityType, string> = {
    PERSON: '#14B8A6',        // Bright Teal
    ORGANIZATION: '#F59E0B',  // Amber
    EVENT: '#06B6D4',         // Cyan
    LOCATION: '#EAB308',      // Gold
    DIGITAL_ENTITY: '#A855F7',// Purple
    DOCUMENT: '#94A3B8'       // Slate/White
  };

  // Filter entities according to active layers, cluster and search
  const visibleEntities = useMemo(() => {
    return entities.filter(ent => {
      if (!layers[ent.type]) return false;
      if (filterCluster && ent.clusterId && ent.clusterId !== filterCluster) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return ent.name.toLowerCase().includes(q) || ent.aliases.some(a => a.toLowerCase().includes(q));
      }
      return true;
    });
  }, [entities, layers, filterCluster, searchFilter]);

  const visibleEntityIds = useMemo(() => new Set(visibleEntities.map(e => e.id)), [visibleEntities]);

  // Compute Hop Distance set if Focus Mode is enabled
  const focusEntityIds = useMemo(() => {
    if (!isFocusMode || !selectedEntityId) return null;

    const reachable = new Set<string>([selectedEntityId]);
    let currentLevel = new Set<string>([selectedEntityId]);

    for (let hop = 0; hop < hopDistance; hop++) {
      const nextLevel = new Set<string>();
      relationships.forEach(rel => {
        if (currentLevel.has(rel.sourceId) && visibleEntityIds.has(rel.targetId)) {
          reachable.add(rel.targetId);
          nextLevel.add(rel.targetId);
        }
        if (currentLevel.has(rel.targetId) && visibleEntityIds.has(rel.sourceId)) {
          reachable.add(rel.sourceId);
          nextLevel.add(rel.sourceId);
        }
      });
      currentLevel = nextLevel;
    }

    return reachable;
  }, [isFocusMode, selectedEntityId, hopDistance, relationships, visibleEntityIds]);

  // Filter relationships
  const visibleRelationships = useMemo(() => {
    return relationships.filter(rel => {
      if (!visibleEntityIds.has(rel.sourceId) || !visibleEntityIds.has(rel.targetId)) return false;
      if (rel.weight < minWeight) return false;
      if (focusEntityIds) {
        return focusEntityIds.has(rel.sourceId) && focusEntityIds.has(rel.targetId);
      }
      return true;
    });
  }, [relationships, visibleEntityIds, minWeight, focusEntityIds]);

  // Initialize node layout coordinates
  const nodesRef = useRef<Map<string, GraphNode>>(new Map());

  useEffect(() => {
    const existing = nodesRef.current;
    const newMap = new Map<string, GraphNode>();

    const activeList = visibleEntities.filter(ent => !focusEntityIds || focusEntityIds.has(ent.id));
    const total = activeList.length;

    activeList.forEach((ent, index) => {
      let x = 400 + Math.cos((index / total) * 2 * Math.PI) * 260 + (Math.random() - 0.5) * 40;
      let y = 300 + Math.sin((index / total) * 2 * Math.PI) * 200 + (Math.random() - 0.5) * 40;

      // Group by cluster
      if (ent.clusterId === 'CLUSTER_FINANCE') {
        x = 240 + (index % 4) * 60 + (Math.random() - 0.5) * 30;
        y = 220 + Math.floor(index / 4) * 60 + (Math.random() - 0.5) * 30;
      } else if (ent.clusterId === 'CLUSTER_LOGISTICS') {
        x = 580 + (index % 4) * 60 + (Math.random() - 0.5) * 30;
        y = 220 + Math.floor(index / 4) * 60 + (Math.random() - 0.5) * 30;
      } else if (ent.clusterId === 'CLUSTER_CYBER') {
        x = 410 + (index % 3) * 60 + (Math.random() - 0.5) * 30;
        y = 440 + Math.floor(index / 3) * 60 + (Math.random() - 0.5) * 30;
      }

      if (ent.isBridgeCandidate) {
        x = 410;
        y = 240;
      }

      if (existing.has(ent.id)) {
        const prev = existing.get(ent.id)!;
        newMap.set(ent.id, { ...prev, entity: ent });
      } else {
        newMap.set(ent.id, {
          id: ent.id,
          name: ent.name,
          type: ent.type,
          x,
          y,
          vx: 0,
          vy: 0,
          radius: ent.isBridgeCandidate ? 22 : ent.type === 'ORGANIZATION' ? 19 : 16,
          color: nodeColors[ent.type],
          entity: ent,
          isBridge: ent.isBridgeCandidate
        });
      }
    });

    nodesRef.current = newMap;
  }, [visibleEntities, focusEntityIds]);

  // Simulation physics loop & Canvas Render
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Simple force simulation tick
      const nodes = Array.from(nodesRef.current.values());

      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 180) {
            const force = (180 - dist) / (dist * 18);
            nodes[i].vx -= dx * force;
            nodes[i].vy -= dy * force;
            nodes[j].vx += dx * force;
            nodes[j].vy += dy * force;
          }
        }
      }

      // Spring attraction along edges
      visibleRelationships.forEach(rel => {
        const sourceNode = nodesRef.current.get(rel.sourceId);
        const targetNode = nodesRef.current.get(rel.targetId);
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 130;
          const force = (dist - targetDist) * 0.008;
          sourceNode.vx += (dx / dist) * force;
          sourceNode.vy += (dy / dist) * force;
          targetNode.vx -= (dx / dist) * force;
          targetNode.vy -= (dy / dist) * force;
        }
      });

      // Update positions
      nodes.forEach(node => {
        if (draggedNode && draggedNode.id === node.id) return; // Don't move actively dragged node
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;

        // Keep inside bounds
        node.x = Math.max(50, Math.min(width - 50, node.x));
        node.y = Math.max(50, Math.min(height - 50, node.y));
      });

      // CLEAR CANVAS
      ctx.clearRect(0, 0, width, height);

      // SAVE TRANSFORM
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // 1. Draw Cluster Background Enclosures if enabled
      if (showClusters) {
        // Finance Cluster Aura
        ctx.fillStyle = 'rgba(245, 158, 11, 0.04)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(260, 240, 160, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.font = '10px monospace';
        ctx.fillText('FINANCE & INVOICING CLUSTER', 160, 95);

        // Logistics Cluster Aura
        ctx.fillStyle = 'rgba(20, 184, 166, 0.04)';
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.2)';
        ctx.beginPath();
        ctx.arc(620, 240, 160, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(20, 184, 166, 0.6)';
        ctx.fillText('LOGISTICS & CUSTOMS CLUSTER', 530, 95);

        // Cyber / Mule Cluster Aura
        ctx.fillStyle = 'rgba(168, 85, 247, 0.04)';
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.beginPath();
        ctx.arc(430, 480, 140, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.fillText('CYBER & OFFSHORE MULE POOL', 340, 600);
        ctx.setLineDash([]);
      }

      // 2. Draw Edges
      visibleRelationships.forEach(rel => {
        const source = nodesRef.current.get(rel.sourceId);
        const target = nodesRef.current.get(rel.targetId);
        if (!source || !target) return;

        const isPathEdge = highlightPath.includes(rel.sourceId) && highlightPath.includes(rel.targetId);
        const isAnomalyEdge = rel.isFlaggedAnomaly;
        const isSelectedEdge = selectedEntityId && (rel.sourceId === selectedEntityId || rel.targetId === selectedEntityId);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isPathEdge) {
          ctx.strokeStyle = '#FBBF24'; // Gold Path
          ctx.lineWidth = 3.5;
        } else if (isAnomalyEdge) {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red Anomaly
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 2]);
        } else if (isSelectedEdge) {
          ctx.strokeStyle = '#14B8A6';
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
          ctx.lineWidth = Math.max(1, rel.weight * 0.4);
        }

        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Edge Label on hover or selection
        if (isSelectedEdge || isPathEdge || hoveredNode?.id === source.id || hoveredNode?.id === target.id) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
          ctx.fillRect(midX - 40, midY - 8, 80, 16);
          ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
          ctx.strokeRect(midX - 40, midY - 8, 80, 16);

          ctx.fillStyle = isAnomalyEdge ? '#F87171' : '#94A3B8';
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(rel.type.slice(0, 14), midX, midY + 3);
        }
      });

      // 3. Draw Nodes
      nodes.forEach(node => {
        const isSelected = selectedEntityId === node.id;
        const isHighlighted = highlightedEntityIds.includes(node.id) || highlightPath.includes(node.id);
        const isHovered = hoveredNode?.id === node.id;

        // Glow Aura for Selected / Bridge / Highlighted
        if (isSelected || isHighlighted || node.isBridge) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + (node.isBridge ? 12 : 8), 0, 2 * Math.PI);
          ctx.fillStyle = node.isBridge ? 'rgba(245, 158, 11, 0.25)' : 'rgba(20, 184, 166, 0.3)';
          ctx.fill();
        }

        // Node Circle Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#151B23';
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#38BDF8' : isHighlighted ? '#F59E0B' : node.color;
        ctx.lineWidth = isSelected ? 3.5 : isHighlighted ? 3 : 2;
        ctx.stroke();

        // Inner Core Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.45, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Name Label
        ctx.fillStyle = isSelected ? '#F8FAFC' : '#CBD5E1';
        ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + node.radius + 14);

        // Subtitle / Designation (Type)
        ctx.fillStyle = '#94A3B8';
        ctx.font = '8px monospace';
        ctx.fillText(node.entity.roleOrDesignation.slice(0, 20), node.x, node.y + node.radius + 24);

        // Bridge Crown Indicator
        if (node.isBridge) {
          ctx.fillStyle = '#F59E0B';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('★ BRIDGE', node.x, node.y - node.radius - 6);
        }
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [zoom, pan, visibleRelationships, selectedEntityId, highlightedEntityIds, highlightPath, hoveredNode, showClusters, draggedNode]);

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked a node
    let clicked: GraphNode | null = null;
    nodesRef.current.forEach(node => {
      const dx = node.x - mouseX;
      const dy = node.y - mouseY;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 5) {
        clicked = node;
      }
    });

    if (clicked) {
      setDraggedNode(clicked);
      setSelectedEntityId((clicked as GraphNode).id);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    if (draggedNode) {
      draggedNode.x = mouseX;
      draggedNode.y = mouseY;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
    } else if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else {
      // Hover detection
      let hovered: GraphNode | null = null;
      nodesRef.current.forEach(node => {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 5) {
          hovered = node;
        }
      });
      setHoveredNode(hovered);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.min(2.5, Math.max(0.4, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedEntityId(null);
  };

  // Selected Entity Object
  const selectedEntity = useMemo(() => {
    if (!selectedEntityId) return null;
    return entities.find(e => e.id === selectedEntityId) || null;
  }, [selectedEntityId, entities]);

  // Selected Entity Connected Relationships
  const connectedEdges = useMemo(() => {
    if (!selectedEntityId) return [];
    return relationships.filter(r => r.sourceId === selectedEntityId || r.targetId === selectedEntityId);
  }, [selectedEntityId, relationships]);

  return (
    <div className="relative w-full h-full min-h-[600px] bg-obsidian-900 border border-obsidian-700 rounded-xl overflow-hidden flex flex-col select-none">
      
      {/* Top Graph Control Bar */}
      <div className="p-3 bg-obsidian-850 border-b border-obsidian-700 flex items-center justify-between gap-3 flex-wrap z-10">
        
        {/* Layer Checkboxes */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="font-mono text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-teal-400" /> Layers:
          </span>
          {(Object.keys(layers) as EntityType[]).map(type => (
            <button
              key={type}
              onClick={() => setLayers(prev => ({ ...prev, [type]: !prev[type] }))}
              className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                layers[type]
                  ? 'bg-obsidian-750 text-slate-200 border border-obsidian-600 shadow-sm'
                  : 'bg-obsidian-950 text-slate-400 line-through opacity-60 border border-obsidian-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: nodeColors[type] }} />
              <span>{type.replace('_', ' ')}</span>
            </button>
          ))}
        </div>

        {/* View Tools: Zoom, Hop Expansion, Clusters, Reset */}
        <div className="flex items-center gap-2">
          {/* Hop Distance Selector */}
          <div className="flex items-center gap-1 bg-obsidian-900 px-2 py-1 rounded-lg border border-obsidian-700 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Hops:</span>
            {[1, 2, 3].map(hop => (
              <button
                key={hop}
                onClick={() => {
                  setHopDistance(hop);
                  setIsFocusMode(true);
                }}
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold transition-colors ${
                  isFocusMode && hopDistance === hop
                    ? 'bg-teal-500 text-obsidian-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {hop}H
              </button>
            ))}
            {isFocusMode && (
              <button
                onClick={() => setIsFocusMode(false)}
                className="text-[10px] text-amber-400 hover:text-amber-300 ml-1 underline"
                title="Reset Focus Mode"
              >
                All
              </button>
            )}
          </div>

          {/* Cluster Enclosure Toggle */}
          <button
            onClick={() => setShowClusters(!showClusters)}
            className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
              showClusters
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-obsidian-900 border-obsidian-700 text-slate-400'
            }`}
          >
            Clusters
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-obsidian-900 p-0.5 rounded-lg border border-obsidian-700">
            <button
              onClick={() => setZoom(prev => Math.min(2.5, prev * 1.15))}
              className="p-1 hover:bg-obsidian-750 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.4, prev * 0.85))}
              className="p-1 hover:bg-obsidian-750 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1 hover:bg-obsidian-750 rounded text-slate-300"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 bg-dot-pattern">
        <canvas
          ref={canvasRef}
          width={960}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-obsidian-850/90 backdrop-blur-md p-2.5 rounded-lg border border-obsidian-700 text-[10px] space-y-1 z-10">
          <div className="font-mono uppercase font-bold text-slate-400 mb-1">Entity Color Legend</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400" /><span className="text-slate-300">Person</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-slate-300">Organization</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /><span className="text-slate-300">Event</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><span className="text-slate-300">Location</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /><span className="text-slate-300">Digital Entity</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /><span className="text-slate-300">Document</span></div>
          </div>
        </div>

        {/* Selected Entity Inspection Drawer */}
        {selectedEntity && (
          <div className="absolute top-3 right-3 bottom-3 w-80 bg-obsidian-850/95 backdrop-blur-xl border border-obsidian-700 rounded-xl shadow-2xl p-4 overflow-y-auto z-20 animate-in slide-in-from-right duration-150 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-2 mb-3 border-b border-obsidian-700">
                <div>
                  <EntityTypeBadge type={selectedEntity.type} />
                  <h3 className="text-base font-bold text-slate-100 mt-1">{selectedEntity.name}</h3>
                  <p className="text-xs text-teal-400 font-mono">{selectedEntity.roleOrDesignation}</p>
                </div>
                <button
                  onClick={() => setSelectedEntityId(null)}
                  className="p-1 hover:bg-obsidian-750 rounded text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status & Risk */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <ProvenanceBadge verificationStatus={selectedEntity.verificationStatus} confidenceScore={selectedEntity.confidenceScore} />
                <PriorityBadge priority={selectedEntity.riskRating} />
              </div>

              {/* Aliases */}
              {selectedEntity.aliases && selectedEntity.aliases.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">Aliases & Nicknames</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEntity.aliases.map((al, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded bg-obsidian-950 text-slate-300 border border-obsidian-700">
                        {al}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata Fields (with Smart Redaction) */}
              <div className="mb-3 p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750 space-y-1.5 text-xs">
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">Entity Metadata Attributes</div>
                {selectedEntity.metadata.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Phone:</span>
                    <RedactedText value={selectedEntity.metadata.phone} type="phone" />
                  </div>
                )}
                {selectedEntity.metadata.taxIdOrAadhaar && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tax ID / PAN:</span>
                    <RedactedText value={selectedEntity.metadata.taxIdOrAadhaar} type="taxId" />
                  </div>
                )}
                {selectedEntity.metadata.bankAccount && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Bank Account:</span>
                    <RedactedText value={selectedEntity.metadata.bankAccount} type="bank" />
                  </div>
                )}
                {selectedEntity.metadata.cryptoWallet && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Crypto Wallet:</span>
                    <RedactedText value={selectedEntity.metadata.cryptoWallet} type="crypto" />
                  </div>
                )}
                {selectedEntity.metadata.address && (
                  <div className="flex justify-between items-start pt-1 border-t border-obsidian-800">
                    <span className="text-slate-400 shrink-0 mr-2">Address:</span>
                    <span className="text-slate-300 text-right">{selectedEntity.metadata.address}</span>
                  </div>
                )}
              </div>

              {/* Connected Relationships List */}
              <div className="mb-3">
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Connected Links ({connectedEdges.length})</span>
                  <span className="text-teal-400">1-Hop</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {connectedEdges.map(edge => {
                    const otherId = edge.sourceId === selectedEntity.id ? edge.targetId : edge.sourceId;
                    const otherEnt = entities.find(e => e.id === otherId);
                    return (
                      <div key={edge.id} className="p-1.5 rounded bg-obsidian-900 border border-obsidian-800 text-[11px] flex items-center justify-between">
                        <div className="truncate mr-1">
                          <span className="font-semibold text-slate-200 truncate">{otherEnt?.name}</span>
                          <p className="text-[10px] text-slate-400 truncate">{edge.label}</p>
                        </div>
                        <span className="font-mono text-[10px] text-teal-400 shrink-0">{edge.confidenceScore}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Source Provenance */}
              <div className="p-2 rounded bg-obsidian-950 border border-obsidian-750 text-[10px] text-slate-400">
                <strong className="text-slate-300">Data Provenance: </strong>
                <span>{selectedEntity.sourceProvenance}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-obsidian-700 flex items-center gap-2">
              <button
                onClick={() => {
                  const nextStatus = selectedEntity.verificationStatus === 'VERIFIED' ? 'NEEDS_REVIEW' : 'VERIFIED';
                  updateEntityVerification(selectedEntity.id, nextStatus);
                }}
                className="flex-1 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-obsidian-950 font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-glow-teal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{selectedEntity.verificationStatus === 'VERIFIED' ? 'Mark For Review' : 'Verify Entity'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

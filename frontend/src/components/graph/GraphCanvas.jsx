import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Pause, Play, Camera, 
  ShieldAlert, Crosshair, Info, Navigation
} from 'lucide-react';
import THEME from '../../styles/theme';

const NODE_COLORS = {
  Person: '#d68a1f',        // Saffron
  Phone: '#4a6670',         // Muted Slate-Teal
  BankAccount: '#5c7a5c',   // Deep Sage Green
  Organization: '#8a7258',  // Muted Bronze
  Vehicle: '#6d757a',       // Charcoal Steel
  Location: '#8c5e4a',      // Terracotta
  DigitalID: '#6a5a7a',     // Muted Indigo
  Incident: '#b8860b',      // Dark Amber
  Weapon: '#a5342a',        // Deep Rust Red
  StolenProperty: '#c9a227' // Muted Antique Gold
};

const RISK_COLORS = {
  Critical: '#a5342a',      // Brick red (desaturated)
  High: '#d68a1f',          // Saffron
  Medium: '#4a6670',        // Slate-teal
  Low: '#5c7a5c'            // Sage green
};

export default function GraphCanvas({
  nodes = [],
  edges = [],
  selectedNodeId,
  onSelectNode,
  onExpandNode,
  highlightedPathNodeIds = [],
  highlightedPathEdgeIds = [],
  nodeSizingMetric = 'pagerank',
  layoutMode = 'force',
  stats,
  activeNodeIds = null,
  activeEdgeIds = null,
  activeMilestone = null,
  timelineDate = null
}) {
  const canvasRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [physicsRunning, setPhysicsRunning] = useState(true);

  // Graph Simulation State
  const simNodesRef = useRef([]);
  const simEdgesRef = useRef([]);
  const animFrameRef = useRef(null);
  const nodeAnimMapRef = useRef(new Map());

  // Fit Graph into Visible Viewport Function
  const fitToView = useCallback((padding = 50) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const simNodes = simNodesRef.current;
    if (!simNodes || simNodes.length === 0) {
      setTransform({ x: 0, y: 0, k: 1 });
      return;
    }

    const width = canvas.clientWidth || 1000;
    const height = canvas.clientHeight || 700;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    simNodes.forEach(node => {
      const r = (node.radius || 18) + 24;
      if (node.x - r < minX) minX = node.x - r;
      if (node.x + r > maxX) maxX = node.x + r;
      if (node.y - r < minY) minY = node.y - r;
      if (node.y + r > maxY) maxY = node.y + r;
    });

    if (minX === Infinity || maxX === -Infinity || minX === maxX) {
      setTransform({ x: 0, y: 0, k: 1 });
      return;
    }

    const graphWidth = Math.max(100, maxX - minX);
    const graphHeight = Math.max(100, maxY - minY);

    const availableWidth = Math.max(200, width - padding * 2);
    const availableHeight = Math.max(200, height - padding * 2);

    const scaleX = availableWidth / graphWidth;
    const scaleY = availableHeight / graphHeight;
    const newK = Math.max(0.25, Math.min(1.35, Math.min(scaleX, scaleY)));

    const graphCenterX = (minX + maxX) / 2;
    const graphCenterY = (minY + maxY) / 2;

    const newX = (width / 2) - (graphCenterX * newK);
    const newY = (height / 2) - (graphCenterY * newK);

    setTransform({ x: newX, y: newY, k: newK });
  }, []);

  // Initialize and Synchronize Nodes & Edges
  useEffect(() => {
    const width = canvasRef.current?.clientWidth || 1000;
    const height = canvasRef.current?.clientHeight || 700;

    const existingMap = new Map(simNodesRef.current.map(n => [n.id, n]));

    const newSimNodes = nodes.map((n, i) => {
      const existing = existingMap.get(n.id);
      let initX, initY;

      if (existing) {
        initX = existing.x;
        initY = existing.y;
      } else if (layoutMode === 'concentric') {
        const angle = (i / Math.max(1, nodes.length)) * 2 * Math.PI;
        const radius = 150 + ((i % 3) * 100);
        initX = width / 2 + radius * Math.cos(angle);
        initY = height / 2 + radius * Math.sin(angle);
      } else if (layoutMode === 'community') {
        const commId = n.community_id || 1;
        const commAngle = (commId * 1.25) * Math.PI;
        const commCenterX = width / 2 + 220 * Math.cos(commAngle);
        const commCenterY = height / 2 + 180 * Math.sin(commAngle);
        initX = commCenterX + (Math.random() - 0.5) * 140;
        initY = commCenterY + (Math.random() - 0.5) * 140;
      } else {
        // Force layout scatter around center
        const angle = Math.random() * 2 * Math.PI;
        const dist = 50 + Math.random() * 240;
        initX = width / 2 + dist * Math.cos(angle);
        initY = height / 2 + dist * Math.sin(angle);
      }

      // Initialize animation state if not present
      if (!nodeAnimMapRef.current.has(n.id)) {
        nodeAnimMapRef.current.set(n.id, {
          scale: 0.1,
          ripple: 1,
          hasRippled: false
        });
      }

      return {
        ...n,
        x: initX,
        y: initY,
        vx: 0,
        vy: 0,
        radius: Math.max(14, Math.min(26, 15 + ((n.centrality_score || 0.03) * 180)))
      };
    });

    simNodesRef.current = newSimNodes;
    simEdgesRef.current = edges;

    // Auto-fit on node updates & expansion
    fitToView(60);
    const timer = setTimeout(() => {
      fitToView(60);
    }, 350);

    return () => clearTimeout(timer);
  }, [nodes, edges, layoutMode, nodeSizingMetric, fitToView]);

  // Window/Container Resize Observer for Dynamic Auto-Fit
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      fitToView(60);
    });
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }
    return () => observer.disconnect();
  }, [fitToView]);

  // Physics Simulation Step
  const tickPhysics = useCallback(() => {
    if (!physicsRunning) return;
    const simNodes = simNodesRef.current;
    const simEdges = simEdgesRef.current;
    if (simNodes.length === 0) return;

    const width = canvasRef.current?.clientWidth || 1000;
    const height = canvasRef.current?.clientHeight || 700;
    const centerX = width / 2;
    const centerY = height / 2;

    const kRepel = 2400;
    const kAttract = 0.035;
    const damping = 0.88;
    const centerGravity = 0.008;

    const nodeMap = new Map(simNodes.map(n => [n.id, n]));

    // 1. Repulsion between node pairs
    for (let i = 0; i < simNodes.length; i++) {
      for (let j = i + 1; j < simNodes.length; j++) {
        const n1 = simNodes[i];
        const n2 = simNodes[j];

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy || 1;
        const dist = Math.sqrt(distSq);

        if (dist < 320) {
          const force = kRepel / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (n1 !== draggedNode) {
            n1.vx -= fx;
            n1.vy -= fy;
          }
          if (n2 !== draggedNode) {
            n2.vx += fx;
            n2.vy += fy;
          }
        }
      }
    }

    // 2. Spring attraction along edges
    for (let edge of simEdges) {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) continue;

      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const idealDist = 120;
      const force = (dist - idealDist) * kAttract * (edge.weight || 1);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (src !== draggedNode) {
        src.vx += fx;
        src.vy += fy;
      }
      if (tgt !== draggedNode) {
        tgt.vx -= fx;
        tgt.vy -= fy;
      }
    }

    // 3. Center gravity & velocity dampening
    for (let node of simNodes) {
      if (node === draggedNode) continue;

      node.vx += (centerX - node.x) * centerGravity;
      node.vy += (centerY - node.y) * centerGravity;

      node.vx *= damping;
      node.vy *= damping;

      node.x += node.vx;
      node.y += node.vy;
    }
  }, [physicsRunning, draggedNode]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let timeOffset = 0;

    const render = () => {
      timeOffset += 0.03;
      tickPhysics();

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Deep Warm Charcoal Base Background
      ctx.fillStyle = '#0f0e0d';
      ctx.fillRect(0, 0, width, height);

      // Apply Zoom/Pan Transform
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Subtle Barely-Visible Dot Grid (Federal Archive Style)
      const gridSize = 40;
      const startX = Math.floor((-transform.x / transform.k) / gridSize) * gridSize - gridSize;
      const endX = startX + (width / transform.k) + gridSize * 2;
      const startY = Math.floor((-transform.y / transform.k) / gridSize) * gridSize - gridSize;
      const endY = startY + (height / transform.k) + gridSize * 2;

      ctx.fillStyle = 'rgba(236, 231, 222, 0.04)';
      for (let x = startX; x <= endX; x += gridSize) {
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        }
      }

      const nodeMap = new Map(simNodesRef.current.map(n => [n.id, n]));
      const activeSet = activeNodeIds ? new Set(activeNodeIds) : null;
      const activeEdgeSet = activeEdgeIds ? new Set(activeEdgeIds) : null;

      // ==========================================
      // 1. DRAW EDGES (Thin, Subtle Hairlines, Directional Arrows)
      // ==========================================
      for (let edge of simEdgesRef.current) {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) continue;

        // Active timeline check
        if (activeSet && (!activeSet.has(src.id) || !activeSet.has(tgt.id))) continue;
        if (activeEdgeSet && !activeEdgeSet.has(edge.id)) continue;

        const isHighlighted = highlightedPathEdgeIds.includes(edge.id) || 
          (highlightedPathNodeIds.includes(src.id) && highlightedPathNodeIds.includes(tgt.id)) ||
          (selectedNodeId && (src.id === selectedNodeId || tgt.id === selectedNodeId));

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#d68a1f';
          ctx.lineWidth = 2.0;
        } else {
          ctx.strokeStyle = '#3a352d';
          ctx.lineWidth = 1.0;
        }
        ctx.stroke();

        // Directional flow indicator (Small Arrowhead)
        const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
        const tgtRadius = tgt.radius || 18;
        const arrowX = tgt.x - (tgtRadius + 4) * Math.cos(angle);
        const arrowY = tgt.y - (tgtRadius + 4) * Math.sin(angle);
        const arrowLen = 5;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - arrowLen * Math.cos(angle - Math.PI / 6), arrowY - arrowLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - arrowLen * Math.cos(angle + Math.PI / 6), arrowY - arrowLen * Math.sin(angle + Math.PI / 6));
        ctx.strokeStyle = isHighlighted ? '#d68a1f' : '#5a544a';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();

        // Subtle Data Flow Pulse Dot on Highlighted Edges
        if (isHighlighted || (edge.weight && edge.weight >= 0.85)) {
          const progress = (Math.sin(timeOffset + (src.x % 10)) + 1) / 2;
          const px = src.x + (tgt.x - src.x) * progress;
          const py = src.y + (tgt.y - src.y) * progress;

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, isHighlighted ? 2.5 : 1.8, 0, 2 * Math.PI);
          ctx.fillStyle = isHighlighted ? '#d68a1f' : '#8a8478';
          ctx.fill();
          ctx.restore();
        }

        // Draw Edge Type Label (when zoomed in)
        if (transform.k > 0.85 || isHighlighted) {
          const midX = (src.x + tgt.x) / 2;
          const midY = (src.y + tgt.y) / 2;
          const label = edge.type ? edge.type.replace('_', ' ') : '';
          
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillStyle = isHighlighted ? '#f5c074' : '#8a8478';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, midX, midY - 6);
        }
      }

      // ==========================================
      // 2. DRAW NODES (Flat Fill, Hairline Risk Ring, No Neon Glow)
      // ==========================================
      for (let node of simNodesRef.current) {
        const isActive = !activeSet || activeSet.has(node.id);

        let anim = nodeAnimMapRef.current.get(node.id);
        if (!anim) {
          anim = { scale: 0.1, ripple: 1, hasRippled: false };
          nodeAnimMapRef.current.set(node.id, anim);
        }

        if (isActive) {
          anim.scale = Math.min(1.0, anim.scale + 0.14);
        } else {
          anim.scale = Math.max(0.0, anim.scale - 0.20);
        }

        if (anim.scale <= 0.02) continue;

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isPathHighlighted = highlightedPathNodeIds.includes(node.id);
        const isMilestoneTarget = activeMilestone && activeMilestone.entity_id === node.id;

        const color = NODE_COLORS[node.type] || '#d68a1f';
        const riskColor = RISK_COLORS[node.risk_level] || '#5c7a5c';
        const targetRadius = node.radius || 18;
        const currentRadius = targetRadius * anim.scale;

        ctx.save();
        ctx.globalAlpha = Math.min(1.0, anim.scale * 1.1);

        // 2a. Milestone Breakthrough Target Reticle (Technical Hairlines)
        if (isMilestoneTarget) {
          const pulseRing = 10 + Math.sin(timeOffset * 3) * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius + pulseRing, 0, 2 * Math.PI);
          ctx.strokeStyle = '#d68a1f';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Crosshairs
          ctx.strokeStyle = '#d68a1f';
          ctx.lineWidth = 1;
          const chLen = currentRadius + pulseRing + 5;
          ctx.beginPath();
          ctx.moveTo(node.x - chLen, node.y);
          ctx.lineTo(node.x - (currentRadius + 3), node.y);
          ctx.moveTo(node.x + (currentRadius + 3), node.y);
          ctx.lineTo(node.x + chLen, node.y);
          ctx.moveTo(node.x, node.y - chLen);
          ctx.lineTo(node.x, node.y - (currentRadius + 3));
          ctx.moveTo(node.x, node.y + (currentRadius + 3));
          ctx.lineTo(node.x, node.y + chLen);
          ctx.stroke();
        }

        // 2b. Outer Risk Ring (Crisp 1.5px Hairline, Flat)
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius + (isSelected ? 5 : (isPathHighlighted ? 4 : 2.5)), 0, 2 * Math.PI);
        if (isSelected || isPathHighlighted || isMilestoneTarget) {
          ctx.strokeStyle = '#d68a1f';
          ctx.lineWidth = 2.0;
        } else {
          ctx.strokeStyle = riskColor;
          ctx.lineWidth = node.risk_level === 'Critical' ? 2.0 : 1.2;
        }
        ctx.stroke();

        // 2c. Inner Node Body (Flat Warm Gray Fill)
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#1c1a17';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = color;
        ctx.stroke();

        // 2d. Node Glyph / Monogram Icon
        if (anim.scale > 0.5) {
          ctx.font = `bold ${Math.round(currentRadius * 0.7)}px "IBM Plex Sans", sans-serif`;
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const glyph = node.type === 'Person' ? '👤' : 
                        node.type === 'Phone' ? '📞' :
                        node.type === 'BankAccount' ? '🏦' :
                        node.type === 'Vehicle' ? '🚗' :
                        node.type === 'Organization' ? '🏢' :
                        node.type === 'Location' ? '📍' :
                        node.type === 'Weapon' ? '🗡️' :
                        node.type === 'StolenProperty' ? '💎' : '🌐';
          ctx.fillText(glyph, node.x, node.y + 1);
        }

        // 2e. Node Label (Clean Box, Hairline Border)
        if (anim.scale > 0.6) {
          const labelText = node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label;
          ctx.font = `${isSelected ? '600' : '400'} 11px "IBM Plex Sans", sans-serif`;
          const textWidth = ctx.measureText(labelText).width;
          
          ctx.fillStyle = '#1c1a17';
          ctx.strokeStyle = isSelected || isMilestoneTarget ? '#d68a1f' : '#3a352d';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(node.x - (textWidth / 2) - 6, node.y + currentRadius + 5, textWidth + 12, 18, 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isSelected || isMilestoneTarget ? '#f5c074' : '#ece7de';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(labelText, node.x, node.y + currentRadius + 14);
        }

        // 2f. Milestone Breakthrough Floating Header Tag
        if (isMilestoneTarget && anim.scale > 0.7) {
          const tag = `BREAKTHROUGH UNLOCKED`;
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          const tagW = ctx.measureText(tag).width;
          ctx.fillStyle = '#d68a1f';
          ctx.beginPath();
          ctx.roundRect(node.x - tagW/2 - 6, node.y - currentRadius - 22, tagW + 12, 16, 2);
          ctx.fill();

          ctx.fillStyle = '#0f0e0d';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tag, node.x, node.y - currentRadius - 14);
        }

        ctx.restore();
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [transform, selectedNodeId, hoveredNode, highlightedPathNodeIds, highlightedPathEdgeIds, activeNodeIds, activeEdgeIds, activeMilestone, tickPhysics]);

  // Mouse Interaction Handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newK = Math.max(0.2, Math.min(3.5, transform.k * zoomFactor));

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX = mouseX - (mouseX - transform.x) * (newK / transform.k);
    const newY = mouseY - (mouseY - transform.y) * (newK / transform.k);

    setTransform({ x: newX, y: newY, k: newK });
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const graphX = (screenX - transform.x) / transform.k;
    const graphY = (screenY - transform.y) / transform.k;
    return { screenX, screenY, graphX, graphY };
  };

  const findNodeAt = (graphX, graphY) => {
    const activeSet = activeNodeIds ? new Set(activeNodeIds) : null;
    for (let i = simNodesRef.current.length - 1; i >= 0; i--) {
      const n = simNodesRef.current[i];
      if (activeSet && !activeSet.has(n.id)) continue;
      const dist = Math.sqrt((graphX - n.x) ** 2 + (graphY - n.y) ** 2);
      if (dist <= (n.radius || 18) + 8) {
        return n;
      }
    }
    return null;
  };

  const handleMouseDown = (e) => {
    const { screenX, screenY, graphX, graphY } = getCanvasCoords(e);
    const hitNode = findNodeAt(graphX, graphY);

    if (hitNode) {
      setDraggedNode(hitNode);
      onSelectNode(hitNode.id);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: screenX - transform.x, y: screenY - transform.y });
    }
  };

  const handleMouseMove = (e) => {
    const { screenX, screenY, graphX, graphY } = getCanvasCoords(e);

    if (draggedNode) {
      draggedNode.x = graphX;
      draggedNode.y = graphY;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
    } else {
      const hitNode = findNodeAt(graphX, graphY);
      setHoveredNode(hitNode);
      if (isDraggingCanvas) {
        setTransform(t => ({
          ...t,
          x: screenX - dragStart.x,
          y: screenY - dragStart.y
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsDraggingCanvas(false);
  };

  const handleDoubleClick = (e) => {
    const { graphX, graphY } = getCanvasCoords(e);
    const hitNode = findNodeAt(graphX, graphY);
    if (hitNode && onExpandNode) {
      onExpandNode(hitNode.id);
    }
  };

  // Zoom & Fit Helpers
  const handleZoomIn = () => setTransform(t => ({ ...t, k: Math.min(3.5, t.k * 1.25) }));
  const handleZoomOut = () => setTransform(t => ({ ...t, k: Math.max(0.2, t.k * 0.8) }));
  const handleRecenter = () => {
    fitToView(60);
  };

  const handleCaptureScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `SUTRA_Federal_Graph_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const visibleNodesCount = activeNodeIds ? activeNodeIds.length : nodes.length;
  const visibleEdgesCount = activeEdgeIds ? activeEdgeIds.length : edges.length;

  return (
    <div className="relative w-full h-full min-h-0 flex-1 bg-[#0f0e0d] overflow-hidden select-none">
      
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating HUD: Graph Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 bg-[#1c1a17]/95 backdrop-blur-md p-1.5 rounded-xl border border-[#3a352d] shadow-dossier z-20">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-[#d68a1f]" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-[#d68a1f]" />
        </button>
        <button
          onClick={handleRecenter}
          className="p-2 rounded-lg bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] transition-all"
          title="Fit Graph / Center"
        >
          <Maximize2 className="w-4 h-4 text-[#8a8478] hover:text-[#ece7de]" />
        </button>
        <button
          onClick={() => setPhysicsRunning(!physicsRunning)}
          className={`p-2 rounded-lg transition-all ${
            physicsRunning ? 'bg-[#d68a1f]/20 text-[#f5c074] border border-[#d68a1f]/40' : 'bg-[#24211d] text-[#8a8478]'
          }`}
          title={physicsRunning ? 'Pause Physics Simulation' : 'Resume Physics'}
        >
          {physicsRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={handleCaptureScreenshot}
          className="p-2 rounded-lg bg-[#24211d] hover:bg-[#2d2924] text-[#ece7de] transition-all"
          title="Export PNG High-Res Snapshot"
        >
          <Camera className="w-4 h-4 text-[#8a8478] hover:text-[#ece7de]" />
        </button>
      </div>

      {/* Floating Tactical Status HUD (Bottom Left) */}
      <div className="absolute bottom-4 left-4 bg-[#1c1a17]/95 backdrop-blur-md p-3 rounded-xl border border-[#3a352d] shadow-dossier z-20 text-xs flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#d68a1f] animate-ping"></div>
          <span className="font-mono text-[#d68a1f] font-bold tracking-wider">FEDERAL TOPOLOGY GRID</span>
        </div>
        <div className="h-4 w-px bg-[#3a352d]"></div>
        <div className="text-[#8a8478] font-mono">
          Entities: <strong className="text-[#ece7de]">{visibleNodesCount}</strong>
          {activeNodeIds && <span className="text-[#666157]"> / {nodes.length}</span>}
        </div>
        <div className="text-[#8a8478] font-mono">
          Links: <strong className="text-[#ece7de]">{visibleEdgesCount}</strong>
          {activeEdgeIds && <span className="text-[#666157]"> / {edges.length}</span>}
        </div>
        <div className="text-[#8a8478] font-mono">
          Critical: <strong className="text-[#a5342a]">{stats?.critical_suspects || 0}</strong>
        </div>
      </div>

    </div>
  );
}

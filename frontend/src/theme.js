/**
 * SUTRA — Institutional Intelligence Design System Tokens
 * Problem Statement: SIH26189 | Ministry of Home Affairs (MHA)
 */

export const theme = {
  name: "SUTRA Institutional Intelligence",
  tagline: "AI Criminal Network Analysis & Cross-Case Case Intelligence",
  jurisdiction: "Ministry of Home Affairs | SIH26189",

  // Core Palette
  colors: {
    // Primary Backgrounds (Deep charcoal / graphite)
    bgVoid: '#0f1113',        // Darkest canvas background
    bgPrimary: '#141618',     // Root app background
    bgSurface: '#1a1d1f',     // Primary card & panel surface
    bgElevated: '#222629',    // Raised dialogs, dropdowns, headers
    bgSubtle: '#2a2e33',      // Inset wells, code blocks, borders

    // Institutional Accent: Muted Gold & Amber (Official seals, authority, primary highlights)
    accentGold: '#c9a227',        // Primary institutional gold
    accentGoldHover: '#d4af37',   // Lighter gold for hover
    accentGoldMuted: '#9e7d1b',   // Muted gold for secondary accents
    accentGoldGlow: 'rgba(201, 162, 39, 0.15)', // Subtle backdrop glow
    accentGoldBorder: 'rgba(201, 162, 39, 0.35)',

    // Severity & Status Palette (Desaturated, serious institutional tones)
    dangerCrimson: '#c0392b',     // Critical threat / Tamper detected
    dangerCrimsonBg: 'rgba(192, 57, 43, 0.12)',
    dangerCrimsonBorder: 'rgba(192, 57, 43, 0.4)',

    warningAmber: '#d97706',      // High risk / Warnings
    warningAmberBg: 'rgba(217, 119, 6, 0.12)',
    warningAmberBorder: 'rgba(217, 119, 6, 0.4)',

    successForest: '#2d6a4f',     // Verified / Clean integrity
    successForestBg: 'rgba(45, 106, 79, 0.15)',
    successForestBorder: 'rgba(45, 106, 79, 0.45)',

    infoSlate: '#475569',         // Neutral institutional info
    infoSlateBg: 'rgba(71, 85, 105, 0.2)',

    // Typography Colors (Warm off-white for reduced glare and official reading)
    textPrimary: '#e8e6e1',       // High-contrast warm off-white
    textSecondary: '#a8a59e',     // Muted label & caption gray
    textMuted: '#6f6c65',         // Placeholder & inactive elements
    textGold: '#e5c970',          // Gold text for official headings/badges

    // Borders & Dividers
    borderSubtle: '#2d3238',      // Default component borders
    borderDossier: '#3d444d',     // Crisp official paper borders
    borderGold: 'rgba(201, 162, 39, 0.4)',
  },

  // Typography Fonts
  fonts: {
    heading: "'Lora', 'Source Serif 4', Georgia, serif",
    body: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    brand: "'Cinzel', 'Lora', serif",
    mono: "'IBM Plex Mono', 'JetBrains Mono', monospace",
  },

  // Cytoscape Graph Palette
  graphTheme: {
    background: '#141618',
    gridColor: 'rgba(255, 255, 255, 0.03)',
    nodeColors: {
      Person: '#c9a227',         // Gold
      Phone: '#3b82f6',          // Muted blue
      BankAccount: '#2d6a4f',    // Forest green
      Vehicle: '#e67e22',        // Muted bronze
      Organization: '#8e44ad',   // Imperial purple
      Location: '#c0392b',       // Crimson
      DigitalID: '#0d9488',      // Deep teal
    },
    riskColors: {
      Critical: '#c0392b',
      High: '#d97706',
      Medium: '#c9a227',
      Low: '#475569',
    },
    edgeColor: 'rgba(168, 165, 158, 0.35)',
    highlightColor: '#d4af37',
  }
};

export default theme;

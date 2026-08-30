/**
 * SUTRA Design Tokens — "Federal Archive" Aesthetic System
 * Reference: Modern data visualization studio + Classified intelligence briefing room
 */

export const THEME = {
  colors: {
    // Base backgrounds
    bgBase: '#0f0e0d',        // Near-black warm charcoal
    bgPanel: '#1c1a17',       // Slightly lighter warm gray
    bgCard: '#24211d',        // Card & component background
    bgHover: '#2d2924',       // Hover state background
    bgElevated: '#332f29',    // Dropdown / Popover background

    // Accents
    accentPrimary: '#d68a1f', // Deep saffron / amber (used sparingly for primary actions & key highlights)
    accentHover: '#e59b2d',   // Saffron hover
    accentMuted: '#4a6670',   // Muted teal-slate (secondary UI elements)
    accentMutedHover: '#5b7a86',

    // Status / Risk
    danger: '#a5342a',        // Desaturated brick red (Critical risk / tamper)
    dangerMuted: 'rgba(165, 52, 42, 0.18)',
    dangerBorder: 'rgba(165, 52, 42, 0.45)',
    dangerText: '#e27d75',

    warning: '#d68a1f',       // Saffron (High risk / alert)
    warningMuted: 'rgba(214, 138, 31, 0.15)',
    warningBorder: 'rgba(214, 138, 31, 0.45)',
    warningText: '#f5c074',

    info: '#4a6670',          // Teal-slate (Medium risk)
    infoMuted: 'rgba(74, 102, 112, 0.2)',
    infoBorder: 'rgba(74, 102, 112, 0.45)',
    infoText: '#8fa8b3',

    success: '#5c7a5c',       // Deep sage green (Low risk / verified)
    successMuted: 'rgba(92, 122, 92, 0.2)',
    successBorder: 'rgba(92, 122, 92, 0.45)',
    successText: '#8eb38e',

    // Typography
    textPrimary: '#ece7de',   // Warm bone white
    textSecondary: '#8a8478', // Warm gray
    textMuted: '#666157',     // Dim technical text
    textAccent: '#d68a1f',    // Saffron text

    // Borders & Hairlines
    borderHairline: '#3a352d', // Crisp 1px warm gray border
    borderSubtle: '#2a2620',   // Faint inner dividers
    borderActive: '#d68a1f',   // Active / focused border

    // Node entity colors for Canvas (Flat, muted palette)
    nodeTypes: {
      Person: '#d68a1f',        // Saffron
      Phone: '#4a6670',         // Slate-teal
      BankAccount: '#5c7a5c',   // Sage green
      Organization: '#8a7258',  // Muted bronze
      Vehicle: '#6d757a',       // Charcoal steel
      Location: '#8c5e4a',      // Terracotta
      DigitalID: '#6a5a7a'      // Muted indigo
    },

    // Node risk borders for Canvas
    riskBorder: {
      Critical: '#a5342a',      // Brick red
      High: '#d68a1f',          // Saffron
      Medium: '#4a6670',        // Slate-teal
      Low: '#5c7a5c'            // Sage green
    }
  },

  fonts: {
    serif: '"Fraunces", "Source Serif 4", "Lora", serif',
    sans: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"IBM Plex Mono", "JetBrains Mono", monospace',
    display: '"Fraunces", "Cinzel", serif'
  }
};

export default THEME;

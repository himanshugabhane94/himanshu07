/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Federal Archive core palette
        archive: {
          base: '#0f0e0d',      // Base warm charcoal
          panel: '#1c1a17',     // Panel warm gray
          card: '#24211d',      // Card background
          hover: '#2d2924',     // Hover state
          border: '#3a352d',    // Hairline border
          subtle: '#2a2620',    // Faint divider
          muted: '#8a8478',     // Secondary text
          dim: '#666157',       // Dim text
          bone: '#ece7de',      // Primary bone white text
        },
        // Accents
        saffron: {
          DEFAULT: '#d68a1f',
          light: '#f5c074',
          hover: '#e59b2d',
          dark: '#9e6211',
          muted: 'rgba(214, 138, 31, 0.15)',
          border: 'rgba(214, 138, 31, 0.45)',
        },
        slateTeal: {
          DEFAULT: '#4a6670',
          light: '#8fa8b3',
          hover: '#5b7a86',
          dark: '#31444b',
          muted: 'rgba(74, 102, 112, 0.2)',
          border: 'rgba(74, 102, 112, 0.45)',
        },
        brick: {
          DEFAULT: '#a5342a',
          light: '#e27d75',
          dark: '#73221b',
          muted: 'rgba(165, 52, 42, 0.18)',
          border: 'rgba(165, 52, 42, 0.45)',
        },
        sage: {
          DEFAULT: '#5c7a5c',
          light: '#8eb38e',
          dark: '#3d523d',
          muted: 'rgba(92, 122, 92, 0.2)',
          border: 'rgba(92, 122, 92, 0.45)',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Source Serif 4', 'Lora', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'monospace'],
        cinzel: ['Fraunces', 'Cinzel', 'serif'],
      },
      backgroundImage: {
        'archive-dots': "radial-gradient(rgba(236, 231, 222, 0.04) 1px, transparent 1px)",
        'archive-grid': "radial-gradient(rgba(214, 138, 31, 0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        'hairline': '0 0 0 1px #3a352d',
        'dossier': '0 4px 16px -2px rgba(0, 0, 0, 0.4)',
        'dossier-lg': '0 12px 32px -4px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}

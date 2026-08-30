import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Obsidian x Teal x Amber Core Palette
        obsidian: {
          950: '#06090E',
          900: '#0D1117', // Base background
          850: '#11161F',
          800: '#151B23', // Primary card/surface
          750: '#1A2332',
          700: '#1E293B', // Border
          600: '#334155',
          500: '#475569',
        },
        synapx: {
          bg: '#0D1117',
          card: '#151B23',
          cardHover: '#1A2332',
          border: '#1E293B',
          borderLight: '#334155',
          textMain: '#F8FAFC',
          textMuted: '#94A3B8',
          textDim: '#64748B',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // Bright Teal
          600: '#0D9488',
          700: '#0F766E', // Primary Deep Teal
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24', // Soft Gold
          500: '#F59E0B', // Amber
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        // Node Type Palette
        node: {
          person: '#14B8A6', // Teal
          org: '#F59E0B',    // Amber
          event: '#06B6D4',  // Cyan
          location: '#EAB308', // Gold
          digital: '#A855F7',  // Purple
          document: '#94A3B8', // Gray/Slate
        },
        status: {
          critical: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          info: '#0EA5E9',
          verified: '#10B981',
          review: '#F59E0B',
          unverified: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

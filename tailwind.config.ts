import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GovTech Refined Color System
        govNavy: {
          50: '#F0F4FA',
          100: '#DCE6F5',
          200: '#BCD0EC',
          300: '#94B4DF',
          400: '#5E8FC9',
          500: '#356EAF',
          600: '#1F5396',
          700: '#14417B',
          800: '#0B3D91', // Primary Deep Navy #0B3D91
          900: '#082D6E',
          950: '#051C47',
        },
        navy: {
          50: '#F0F4FA',
          100: '#DCE6F5',
          200: '#BCD0EC',
          300: '#94B4DF',
          400: '#5E8FC9',
          500: '#356EAF',
          600: '#1F5396',
          700: '#14417B',
          800: '#0B3D91',
          900: '#082D6E',
          950: '#051C47',
        },
        saffron: {
          50: '#FFF9F2',
          100: '#FFF2E0',
          200: '#FFE0B8',
          300: '#FFCA85',
          400: '#FFAF4D',
          500: '#FF9933', // Accent Saffron #FF9933
          600: '#E67300',
          700: '#BF5C00',
          800: '#944400',
          900: '#753400',
        },
        govGreen: {
          50: '#F0FDF2',
          100: '#DCFCE3',
          200: '#B8F7C6',
          300: '#7FEA99',
          400: '#3ED265',
          500: '#1DB846',
          600: '#138808', // Success/Eligible Green #138808
          700: '#116E0A',
          800: '#12570D',
          900: '#11480D',
        },
        govEmerald: {
          50: '#F0FDF2',
          100: '#DCFCE3',
          200: '#B8F7C6',
          300: '#7FEA99',
          400: '#3ED265',
          500: '#1DB846',
          600: '#138808',
          700: '#116E0A',
          800: '#12570D',
          900: '#11480D',
        },
        govBg: '#F5F6F8',
        govOffWhite: '#FAFAFA',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-plus-jakarta)', 'Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px 0 rgba(11, 61, 145, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft-md': '0 4px 16px -2px rgba(11, 61, 145, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 12px 32px -4px rgba(11, 61, 145, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(11, 61, 145, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
export default config;

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { InvestigationProvider } from '@/context/InvestigationContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'SYNAPX — AI-Powered Criminal Network Analysis System (SIH26189)',
  description:
    'From Records → Relationships → Intelligence. Decision-support intelligence platform for complex criminal network analysis, entity resolution, hidden bridge detection, and explainable AI dossiers.',
  keywords: [
    'SYNAPX',
    'Criminal Network Analysis',
    'SIH 2026',
    'SIH26189',
    'Knowledge Graph',
    'Entity Resolution',
    'Hidden Bridge Detection',
    'Case DNA',
    'Explainable AI',
    'Forensic Investigation'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-sans antialiased bg-obsidian-900 text-slate-100 min-h-screen selection:bg-teal-500/30 selection:text-teal-200">
        <InvestigationProvider>
          {children}
        </InvestigationProvider>
      </body>
    </html>
  );
}


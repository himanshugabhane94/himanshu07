import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import AuthSessionProvider from '@/context/AuthSessionProvider';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import MinistryLogosRow from '@/components/MinistryLogosRow';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YogyaSetu - Indian Government Schemes & Scholarships Portal',
  description:
    'Aapke Liye Sahi Yojana, Ab Ek Hi Jagah. Check your eligibility and get direct official application links for 100+ Central and State welfare schemes, PM-KISAN, Ayushman Bharat, Scholarships, and PMAY.',
  keywords: [
    'YogyaSetu',
    'Government Schemes India',
    'Sarkari Yojana',
    'National Scholarship Portal',
    'PM-KISAN',
    'Ayushman Bharat',
    'PM Awas Yojana',
    'Sukanya Samriddhi',
    'Eligibility Checker',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 flex flex-col min-h-screen selection:bg-govEmerald-100 selection:text-govNavy-900">
        <AuthSessionProvider>
          <LanguageProvider>
            <AccessibilityToolbar />
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <MinistryLogosRow />
            <BottomNav />
            <Footer />
          </LanguageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

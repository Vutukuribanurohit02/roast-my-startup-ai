import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Roast My Startup AI - Investor-Grade Startup Analysis',
  description: 'Get your startup roasted by AI before investors do. Get brutal, honest, VC-grade feedback, GTM advice, SWOT, target persona analysis, and a 7-day action plan.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}

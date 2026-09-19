import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Riviera — Pagamenti e Prenotazioni su Avalanche',
  description: 'AI concierge per prenotazioni balneari, pass eventi, ristorazione e noleggi verificati onchain su Avalanche. Pescara.',
  keywords: ['Avalanche', 'Web3', 'AI', 'Blockchain Beach', 'Pescara', 'Smart Contracts', 'Wagmi'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={inter.className}>
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

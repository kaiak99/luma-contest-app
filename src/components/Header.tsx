'use client';

import React from 'react';
import { Compass, Ticket as TicketIcon, ScanLine, LogOut } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RivieraLogo } from './RivieraLogo';

interface HeaderProps {
  role: 'customer' | 'merchant' | null;
  onLogout: () => void;
  activeTab: 'concierge' | 'tickets';
  setActiveTab: (tab: 'concierge' | 'tickets') => void;
  ticketCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onLogout,
  activeTab,
  setActiveTab,
  ticketCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={role ? onLogout : undefined}
          className={`flex items-center gap-3 shrink-0 ${role ? 'cursor-pointer' : ''}`}
          title={role ? 'Torna alla schermata iniziale' : undefined}
        >
          <RivieraLogo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Riviera
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-red-50 text-[#E84142] border border-red-200 rounded-full flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E84142]" />
                Avalanche
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              {role === 'merchant' ? 'Area Gestori Pescara' : 'Prenotazioni Verificate'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Utente) */}
        {role === 'customer' && (
          <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shrink-0">
            <button
              onClick={() => setActiveTab('concierge')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'concierge'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Prenota</span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TicketIcon className="w-4 h-4 text-slate-600 shrink-0" />
              <span>I Miei Pass</span>
              {ticketCount > 0 && (
                <span className="ml-0.5 px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold leading-none">
                  {ticketCount}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Merchant Indicator (Gestore) */}
        {role === 'merchant' && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-sm font-semibold border border-slate-200">
            <ScanLine className="w-4 h-4 text-slate-600" />
            <span>Postazione Check-in Esercente</span>
          </div>
        )}

        {/* Right Section: Connect Wallet & Logout */}
        <div className="flex items-center gap-3 shrink-0">
          <ConnectButton
            label="Connetti Wallet"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            chainStatus={{
              smallScreen: 'icon',
              largeScreen: 'full',
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />

          {/* Dedicated Logout button if logged in */}
          {role && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Esci e torna alla schermata di accesso"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Esci</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

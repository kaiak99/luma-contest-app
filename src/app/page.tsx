'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChatConcierge } from '@/components/ChatConcierge';
import { MyTicketsView } from '@/components/MyTicketsView';
import { TicketModal } from '@/components/TicketModal';
import { MerchantDashboard } from '@/components/MerchantDashboard';
import { MerchantVenueSelect } from '@/components/MerchantVenueSelect';
import { RoleLoginView } from '@/components/RoleLoginView';
import { VerifiableTicket } from '@/types';
import { PESCARA_VENUES, Venue } from '@/data/mockVenues';
import { storageService } from '@/services/storageService';
import { useAccount } from 'wagmi';

const ROLE_STORAGE_KEY = 'riviera_role_v2';
const VENUE_STORAGE_KEY = 'riviera_merchant_venue_v2';

export default function Home() {
  const [role, setRole] = useState<'customer' | 'merchant' | null>(null);
  const [isSelectingVenue, setIsSelectingVenue] = useState<boolean>(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue>(PESCARA_VENUES[1]); // Default: Pizzeria Da Giampiero al Mare
  const [activeTab, setActiveTab] = useState<'concierge' | 'tickets'>('concierge');
  const [tickets, setTickets] = useState<VerifiableTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<VerifiableTicket | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
    const storedTickets = storageService.getTickets();
    setTickets(storedTickets);

    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as 'customer' | 'merchant' | null;
    const savedVenueId = localStorage.getItem(VENUE_STORAGE_KEY);

    if (savedRole === 'customer' || savedRole === 'merchant') {
      setRole(savedRole);
    }
    if (savedVenueId) {
      const found = PESCARA_VENUES.find(v => v.id === savedVenueId);
      if (found) setSelectedVenue(found);
    }
  }, []);

  const handleSelectRoleFromLogin = (chosenRole: 'customer' | 'merchant') => {
    if (chosenRole === 'customer') {
      setRole('customer');
      setIsSelectingVenue(false);
      localStorage.setItem(ROLE_STORAGE_KEY, 'customer');
    } else {
      // Gestore clicked: prompt venue selection
      setIsSelectingVenue(true);
    }
  };

  const handleVenueSelected = (venue: Venue) => {
    setSelectedVenue(venue);
    setRole('merchant');
    setIsSelectingVenue(false);
    localStorage.setItem(ROLE_STORAGE_KEY, 'merchant');
    localStorage.setItem(VENUE_STORAGE_KEY, venue.id);
  };

  const handleLogout = () => {
    setRole(null);
    setIsSelectingVenue(false);
    localStorage.removeItem(ROLE_STORAGE_KEY);
  };

  const handleTicketGenerated = (newTicket: VerifiableTicket) => {
    storageService.saveTicket(newTicket);
    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
  };

  const handleValidateTicket = (ticketId: string) => {
    const success = storageService.validateTicket(ticketId);
    if (success) {
      setTickets(prev =>
        prev.map(t =>
          t.ticketId === ticketId
            ? { ...t, isValidated: true, validatedAt: Date.now() }
            : t
        )
      );
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Main Header without role swap */}
      <Header
        role={role}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ticketCount={tickets.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-8">
        {/* State 1: Choose Venue (for Merchant) */}
        {isSelectingVenue && (
          <MerchantVenueSelect
            onSelectVenue={handleVenueSelected}
            onBack={() => setIsSelectingVenue(false)}
          />
        )}

        {/* State 2: Role Selection Login Screen */}
        {!isSelectingVenue && role === null && (
          <RoleLoginView onSelectRole={handleSelectRoleFromLogin} />
        )}

        {/* State 3: Customer / Utente View */}
        {!isSelectingVenue && role === 'customer' && (
          <>
            {activeTab === 'concierge' && (
              <ChatConcierge
                onTicketGenerated={handleTicketGenerated}
                onOpenTicket={ticket => setSelectedTicket(ticket)}
                walletAddress={isConnected && address ? address : null}
              />
            )}

            {activeTab === 'tickets' && (
              <MyTicketsView
                tickets={tickets}
                onSelectTicket={ticket => setSelectedTicket(ticket)}
                onNavigateToConcierge={() => setActiveTab('concierge')}
              />
            )}
          </>
        )}

        {/* State 4: Merchant / Gestore View */}
        {!isSelectingVenue && role === 'merchant' && (
          <MerchantDashboard
            tickets={tickets}
            onValidateTicket={handleValidateTicket}
            selectedVenue={selectedVenue}
            onChangeVenue={() => setIsSelectingVenue(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Verifiable Pass Modal (Customer Only) */}
      <TicketModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-800">
            <span>Riviera</span>
            <span>•</span>
            <span>Protocollo di prenotazione verificato su Avalanche</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span>Pescara</span>
            <span>•</span>
            <a
              href="https://snowtrace.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E84142] font-semibold hover:underline"
            >
              Snowtrace Explorer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React from 'react';
import { VerifiableTicket } from '@/types';
import { Ticket as TicketIcon, QrCode, ExternalLink, CheckCircle2, Clock, MapPin, Calendar, Users, CloudRain, Sun } from 'lucide-react';
import { getExplorerTxUrl } from '@/config/avalanche';

interface MyTicketsViewProps {
  tickets: VerifiableTicket[];
  onSelectTicket: (ticket: VerifiableTicket) => void;
  onNavigateToConcierge: () => void;
  onClearTickets?: () => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  tickets,
  onSelectTicket,
  onNavigateToConcierge,
  onClearTickets,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">I Miei Pass</h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Biglietti e pass d&apos;ingresso registrati su Avalanche C-Chain. Mostra il codice QR all&apos;arrivo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {tickets.length > 0 && onClearTickets && (
            <button
              onClick={onClearTickets}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
            >
              Azzera Pass
            </button>
          )}
          <button
            onClick={onNavigateToConcierge}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-colors cursor-pointer"
          >
            Nuova Prenotazione
          </button>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-4">
            <TicketIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Nessun pass presente</h3>
          <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            Effettua una prenotazione per visualizzare qui i tuoi pass verificati per ristoranti e lidi di Pescara.
          </p>
          <button
            onClick={onNavigateToConcierge}
            className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-sm font-bold cursor-pointer transition-colors"
          >
            Inizia Ora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tickets.map(ticket => (
            <div
              key={ticket.ticketId}
              className="bg-white border border-slate-200 hover:border-slate-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      {ticket.ticketId.split('-').slice(0, 2).join('-')}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2.5">{ticket.venueName}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                      <MapPin className="w-4 h-4 text-slate-400" /> Pescara
                    </p>
                  </div>

                  {ticket.isValidated ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      Arrivato
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1 shrink-0">
                      <Clock className="w-4 h-4 text-slate-600" />
                      Valido
                    </span>
                  )}
                </div>

                <div className="py-4 space-y-2.5 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" /> Data:
                    </span>
                    <span className="font-semibold text-slate-900">{ticket.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-4 h-4 text-slate-400" /> Ospiti:
                    </span>
                    <span className="font-bold text-slate-900">
                      {ticket.guestCount} {ticket.guestCount > 1 ? 'Persone' : 'Persona'}
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 pb-3">
                  {ticket.groupId && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Gruppo ({ticket.guestCount} pax)
                    </span>
                  )}
                  {ticket.weatherClause && ticket.weatherInfo && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                      {ticket.weatherInfo.isFavorable ? (
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                      )}
                      Meteo {ticket.weatherInfo.description}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => onSelectTicket(ticket)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-sm font-bold transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Mostra Pass QR</span>
                </button>

                <a
                  href={getExplorerTxUrl(ticket.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                  title="Ricevuta su Snowtrace"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

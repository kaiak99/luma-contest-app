'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VerifiableTicket } from '@/types';
import { Venue } from '@/data/mockVenues';
import { 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Camera, 
  ScanLine, 
  MapPin, 
  Clock,
  LogOut,
  Building2,
  Users
} from 'lucide-react';
import { getExplorerTxUrl } from '@/config/avalanche';
import confetti from 'canvas-confetti';

interface MerchantDashboardProps {
  tickets: VerifiableTicket[];
  onValidateTicket: (ticketId: string) => void;
  selectedVenue: Venue;
  onChangeVenue: () => void;
  onLogout: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  tickets,
  onValidateTicket,
  selectedVenue,
  onChangeVenue,
  onLogout,
}) => {
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    ticket?: VerifiableTicket;
  } | null>(null);

  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      }
    } catch {
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleValidate = (ticketId: string) => {
    const target = tickets.find(t => t.ticketId.toLowerCase() === ticketId.toLowerCase());
    
    if (!target) {
      setFeedback({
        type: 'error',
        title: 'Pass non valido o non trovato',
      });
      return;
    }

    if (target.isValidated) {
      setFeedback({
        type: 'warning',
        title: 'Pass già convalidato in precedenza',
        ticket: target,
      });
      return;
    }

    onValidateTicket(target.ticketId);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setFeedback({
      type: 'success',
      title: 'Check-in registrato con successo',
      ticket: { ...target, isValidated: true },
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;

    const query = manualCodeInput.trim().toLowerCase();
    const matched = tickets.find(
      t => t.ticketId.toLowerCase().includes(query) || t.qrPayload.toLowerCase().includes(query)
    );

    if (matched) {
      handleValidate(matched.ticketId);
      setManualCodeInput('');
    } else {
      setFeedback({
        type: 'error',
        title: `Nessun pass trovato per "${manualCodeInput}"`,
      });
    }
  };

  // Filter tickets specifically for this venue
  const displayTickets = tickets.filter(t => 
    t.venueName.toLowerCase().includes(selectedVenue.name.toLowerCase()) ||
    selectedVenue.name.toLowerCase().includes(t.venueName.toLowerCase())
  );

  const filteredTickets = displayTickets.filter(t => {
    if (filter === 'pending') return !t.isValidated;
    if (filter === 'validated') return t.isValidated;
    return true;
  });

  const pendingCount = displayTickets.filter(t => !t.isValidated).length;
  const validatedCount = displayTickets.filter(t => t.isValidated).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Terminale Gestore
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {selectedVenue.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-slate-400" /> {selectedVenue.location}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onChangeVenue}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-white/15 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Cambia Locale</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-white/10 hover:bg-rose-600/80 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-white/15 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Esci</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Prenotazioni
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {displayTickets.length}
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Arrivati
            </span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {validatedCount}
            </span>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              In Attesa
            </span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Scanner & Input, Right Guest List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Scanner & Search */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">Scanner Ingresso</h2>

              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  Spegni
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="text-xs font-bold text-slate-900 bg-slate-100 px-3.5 py-1.5 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Fotocamera</span>
                </button>
              )}
            </div>

            {/* Viewfinder */}
            <div className="relative aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <ScanLine className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">Mirino Attivo</p>
                </div>
              )}

              {/* Viewfinder Target */}
              <div className="absolute inset-8 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                </div>
                
                <div className="w-full h-0.5 bg-linear-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-bounce" />

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Validation Feedback Banner */}
          {feedback && (
            <div className={`p-4 rounded-2xl border ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : feedback.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm">{feedback.title}</span>
                </div>
                <button
                  onClick={() => setFeedback(null)}
                  className="text-xs font-bold opacity-60 hover:opacity-100"
                >
                  Chiudi
                </button>
              </div>
              {feedback.ticket && (
                <div className="mt-2 text-xs font-semibold text-slate-700">
                  ID: {feedback.ticket.ticketId.split('-').slice(0, 2).join('-')} • {feedback.ticket.guestCount} persone ({feedback.ticket.date})
                </div>
              )}
            </div>
          )}

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="pt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualCodeInput}
                onChange={e => setManualCodeInput(e.target.value)}
                placeholder="Codice pass (es. RIV-3641991)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer shrink-0"
            >
              Convalida
            </button>
          </form>
        </div>

        {/* Right Column: Live Guest Check-in Registry */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Registro Ospiti</h2>
                <p className="text-xs text-slate-500 font-medium">Tavoli e pass assegnati a questo locale</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tutti ({displayTickets.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filter === 'pending' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  In Attesa ({pendingCount})
                </button>
                <button
                  onClick={() => setFilter('validated')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filter === 'validated' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Arrivati ({validatedCount})
                </button>
              </div>
            </div>

            {/* Guest List Cards */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Nessun ospite trovato per il filtro selezionato.
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {filteredTickets.map(ticket => (
                  <div
                    key={ticket.ticketId}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg">
                          {ticket.ticketId.split('-').slice(0, 2).join('-')}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {ticket.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span>{ticket.date} {ticket.timeSlot && `• ${ticket.timeSlot}`}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" /> {ticket.guestCount} Ospiti
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <a
                        href={getExplorerTxUrl(ticket.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                        title="Verifica Transazione Snowtrace"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {!ticket.isValidated ? (
                        <button
                          onClick={() => handleValidate(ticket.ticketId)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Convalida</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Arrivato</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

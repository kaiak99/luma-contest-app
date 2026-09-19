'use client';

import React, { useState } from 'react';
import { VerifiableTicket } from '@/types';
import { X, ExternalLink, CheckCircle2, ShieldCheck, MapPin, Calendar, Users, Copy, Check } from 'lucide-react';
import { getExplorerTxUrl } from '@/config/avalanche';

interface TicketModalProps {
  ticket: VerifiableTicket | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  ticket,
  onClose,
}) => {
  const [groupLinkCopied, setGroupLinkCopied] = useState(false);
  const [localTicket, setLocalTicket] = useState<VerifiableTicket | null>(ticket);

  // Sync with prop
  React.useEffect(() => {
    setLocalTicket(ticket);
  }, [ticket]);

  if (!localTicket) return null;

  const explorerUrl = getExplorerTxUrl(localTicket.txHash);

  const handleCopyGroupLink = () => {
    if (localTicket.groupId) {
      const link = `${window.location.origin}?group=${localTicket.groupId}`;
      navigator.clipboard.writeText(link);
      setGroupLinkCopied(true);
      setTimeout(() => setGroupLinkCopied(false), 2500);
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(localTicket.qrPayload)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header - Modern Executive Slate */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pass Verificato Avalanche</span>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight pr-6">
            {localTicket.venueName}
          </h2>
          <p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-slate-400" /> Pescara
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 flex-1 bg-slate-50">
          
          {/* Status & Pass ID */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Stato Biglietto
              </span>
              {localTicket.isValidated ? (
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Check-in Effettuato
                </span>
              ) : (
                <span className="text-sm font-bold text-sky-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Valido all&apos;Ingresso
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Codice Pass
              </span>
              <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                {localTicket.ticketId.split('-').slice(0, 2).join('-')}
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative">
              <img 
                src={qrUrl} 
                alt="QR Pass" 
                className={`w-44 h-44 object-contain ${localTicket.isValidated ? 'opacity-20 grayscale' : ''}`}
              />
              {localTicket.isValidated && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Check className="w-6 h-6" />
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-600 font-medium mt-3 text-center">
              {localTicket.isValidated 
                ? 'Check-in già confermato' 
                : 'Scansiona all\'ingresso del locale'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> Data e Ora
              </span>
              <span className="font-bold text-slate-900 text-sm block">{localTicket.date}</span>
              {localTicket.timeSlot && <span className="text-xs text-slate-500 font-medium mt-0.5 block">{localTicket.timeSlot}</span>}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                <Users className="w-4 h-4 text-slate-400" /> Ospiti
              </span>
              <span className="font-bold text-slate-900 text-sm block">
                {localTicket.guestCount} {localTicket.guestCount > 1 ? 'Persone' : 'Persona'}
              </span>
              <span className="text-xs text-emerald-600 font-semibold mt-0.5 block">Tavolo Confermato</span>
            </div>
          </div>

          {/* Group Pass (if applicable) */}
          {localTicket.groupId && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 text-sm block">Pass di Gruppo</span>
                <span className="text-xs text-slate-500">{localTicket.guestCount} partecipanti</span>
              </div>
              <button
                onClick={handleCopyGroupLink}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {groupLinkCopied ? (
                  <><Check className="w-3.5 h-3.5" /> Copiato</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Condividi</>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-2xl text-sm font-bold transition-colors border border-slate-200 cursor-pointer"
          >
            <span>Verifica su Snowtrace</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

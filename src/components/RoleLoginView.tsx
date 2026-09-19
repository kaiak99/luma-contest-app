'use client';

import React from 'react';
import { User, ScanLine, ArrowRight, Check } from 'lucide-react';
import { RivieraLogo } from './RivieraLogo';

interface RoleLoginViewProps {
  onSelectRole: (role: 'customer' | 'merchant') => void;
}

export const RoleLoginView: React.FC<RoleLoginViewProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="flex justify-center mb-4">
          <RivieraLogo size={52} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Benvenuto su Riviera
        </h1>
        <p className="text-slate-600 mt-2 text-base">
          Seleziona la modalità di accesso per proseguire:
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Card 1: Utente / Cliente */}
        <div
          onClick={() => onSelectRole('customer')}
          className="group bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Accesso Ospiti
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Cliente
            </h2>

            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              Esplora locali e servizi a Pescara, prenota tavoli ed esperienze e visualizza i tuoi pass verificati.
            </p>

            <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Prenotazione rapida per ristoranti e lidi</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pass QR digitale per accesso immediato</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garanzie verificate su Avalanche</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button
              className="w-full bg-slate-900 group-hover:bg-slate-800 text-white py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Accedi come Cliente</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Card 2: Gestore Locale */}
        <div
          onClick={() => onSelectRole('merchant')}
          className="group bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <ScanLine className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Accesso Locale
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Gestore
            </h2>

            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              Terminale dedicato al personale per la lettura QR dei pass all&apos;ingresso e la registrazione degli arrivi.
            </p>

            <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Scanner per codici QR e identificativi pass</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Validazione check-in in tempo reale</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Registro presenze e arrivi del giorno</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button
              className="w-full bg-slate-900 group-hover:bg-slate-800 text-white py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Accedi come Gestore</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

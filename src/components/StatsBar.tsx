'use client';

import React from 'react';
import { DollarSign, CalendarCheck, CheckCircle2, Award } from 'lucide-react';

interface StatsBarProps {
  totalAvaxVolume: number;
  totalBookings: number;
  checkedInCount: number;
  loyaltyPoints: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalAvaxVolume,
  totalBookings,
  checkedInCount,
  loyaltyPoints,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between text-slate-600 text-sm font-medium mb-1">
          <span>Pass Emessi Onchain</span>
          <CalendarCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono">
          {totalBookings} Pass
        </div>
        <div className="text-sm text-slate-500 mt-1">
          Smart Contract Escrow attivo su Avalanche
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between text-slate-600 text-sm font-medium mb-1">
          <span>Prenotazioni Confermate</span>
          <CalendarCheck className="w-5 h-5 text-sky-600" />
        </div>
        <div className="text-2xl font-bold text-slate-900">
          {totalBookings}
        </div>
        <div className="text-sm text-slate-500 mt-1">
          {checkedInCount} clienti già arrivati
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between text-slate-600 text-sm font-medium mb-1">
          <span>Punti Fedeltà Disponibili</span>
          <Award className="w-5 h-5 text-amber-600" />
        </div>
        <div className="text-2xl font-bold text-amber-600 font-mono">
          {loyaltyPoints} Punti
        </div>
        <div className="text-sm text-slate-500 mt-1">
          Sconto attivo nei locali convenzionati
        </div>
      </div>
    </div>
  );
};

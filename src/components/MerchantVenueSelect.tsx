'use client';

import React, { useState } from 'react';
import { PESCARA_VENUES, Venue } from '@/data/mockVenues';
import { MapPin, Search, ArrowLeft, ArrowRight, Store } from 'lucide-react';
import { RivieraLogo } from './RivieraLogo';

interface MerchantVenueSelectProps {
  onSelectVenue: (venue: Venue) => void;
  onBack: () => void;
}

export const MerchantVenueSelect: React.FC<MerchantVenueSelectProps> = ({
  onSelectVenue,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVenues = PESCARA_VENUES.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Top navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Indietro</span>
        </button>

        <div className="flex items-center gap-2">
          <RivieraLogo size={32} />
          <span className="text-sm font-bold text-slate-800">Terminale Gestori</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Seleziona il Locale Gestito
        </h1>
        <p className="text-slate-600 mt-1.5 text-base">
          Scegli la tua attività commerciale per accedere alla postazione scanner e check-in.
        </p>

        {/* Search */}
        <div className="mt-6 relative max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome o via..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-slate-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVenues.map(venue => (
          <div
            key={venue.id}
            onClick={() => onSelectVenue(venue)}
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-900 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 uppercase tracking-wider">
                  {venue.category}
                </span>
                <span className="text-xs font-semibold text-slate-500">Pescara</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800">
                {venue.name}
              </h3>
              
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{venue.location}</span>
              </p>

              <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                {venue.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Accedi al terminale</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { ParsedIntent, WeatherInfo } from '@/types';
import { ArrowRight, MapPin, Calendar, Wallet, ShieldAlert, Users, CloudRain, Sun, Network } from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { avalanche } from 'wagmi/chains';
import { DEPOSIT_AVAX } from '@/config/avalanche';
import { fetchPescaraWeather, isOutdoorActivity } from '@/services/weatherService';

interface ActionProposalCardProps {
  intent: ParsedIntent;
  onExecute: (intent: ParsedIntent) => void;
  isExecuting: boolean;
  walletAddress: string | null;
  onOpenWalletModal?: () => void;
}

export const ActionProposalCard: React.FC<ActionProposalCardProps> = ({
  intent,
  onExecute,
  isExecuting,
  walletAddress,
  onOpenWalletModal,
}) => {
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(intent.weatherInfo || null);

  const isOutdoor = isOutdoorActivity(intent.type);
  const isWrongChain = Boolean(walletAddress && chainId !== avalanche.id);

  useEffect(() => {
    if (isOutdoor && !weatherInfo) {
      fetchPescaraWeather().then(setWeatherInfo);
    }
  }, [isOutdoor, weatherInfo]);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Disponibilità Trovata • Richiede Conferma On-Chain</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{intent.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {intent.venueName}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {intent.date} {intent.timeSlot && `• ${intent.timeSlot}`}
            </span>
          </div>
        </div>

        {/* Deposit Box */}
        <div className="bg-slate-50 py-3 px-5 rounded-2xl border border-slate-200 sm:text-right shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Garanzia Deposito
          </span>
          <span className="text-lg font-extrabold text-slate-900 block mt-0.5">
            {DEPOSIT_AVAX} AVAX
          </span>
          <span className="text-xs text-slate-500 font-medium block">
            Rimborsabile al check-in
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="py-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Riepilogo Richiesta
          </span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Users className="w-4 h-4 text-slate-400" />
            {intent.guestCount} Ospiti
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
          {intent.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-slate-800 font-semibold">
                {item.name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                In attesa di firma
              </span>
            </div>
          ))}
          <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ubicazione: {intent.venueLocation}</span>
            <span>Check-in con pass QR crittografico</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
          Nessuna prenotazione è registrata finché non autorizzi la transazione dal tuo wallet Web3 su blockchain Avalanche C-Chain.
        </p>

        {/* Weather Clause (if outdoor) */}
        {isOutdoor && weatherInfo && (
          <div className={`border rounded-2xl p-3.5 flex items-center justify-between ${
            weatherInfo.isFavorable
              ? 'bg-sky-50 border-sky-200 text-sky-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {weatherInfo.isFavorable ? (
                <Sun className="w-5 h-5 text-sky-600 shrink-0" />
              ) : (
                <CloudRain className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">
                Meteo Pescara: {weatherInfo.description} ({weatherInfo.temperature}°C)
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-current">
              {weatherInfo.isFavorable ? 'Ottimale' : 'Garanzia Rimborso'}
            </span>
          </div>
        )}
      </div>

      {/* Confirmation Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-[#E84142]" />
          <span>Rete: Avalanche C-Chain (43114)</span>
        </div>

        {walletAddress ? (
          isWrongChain ? (
            <button
              onClick={async () => {
                try {
                  await switchChainAsync({ chainId: avalanche.id });
                } catch (e) {
                  console.error(e);
                }
              }}
              disabled={isSwitchingChain}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E84142] hover:bg-[#d03738] text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Network className="w-4 h-4" />
              <span>{isSwitchingChain ? 'Passaggio rete...' : 'Passa ad Avalanche C-Chain'}</span>
            </button>
          ) : (
            <button
              onClick={() => onExecute(intent)}
              disabled={isExecuting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Attesa firma nel wallet...</span>
                </>
              ) : (
                <>
                  <span>Firma ed Emetti Pass ({DEPOSIT_AVAX} AVAX)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )
        ) : (
          <button
            onClick={() => {
              if (openConnectModal) {
                openConnectModal();
              } else if (onOpenWalletModal) {
                onOpenWalletModal();
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-slate-400" />
            <span>Connetti Wallet per Prenotare</span>
          </button>
        )}
      </div>
    </div>
  );
};

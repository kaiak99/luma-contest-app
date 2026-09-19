'use client';

import React, { useState, useEffect } from 'react';
import { ParsedIntent, WeatherInfo } from '@/types';
import { ArrowRight, Wallet, Network } from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useChainId, useSwitchChain } from 'wagmi';
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

  const serviceName = intent.items.map(i => i.name).join(', ') || intent.title;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      {/* Top Header: Venue & Deposit */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {intent.venueName}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {intent.date} {intent.timeSlot && `• ${intent.timeSlot}`} • {intent.guestCount} Ospiti
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Garanzia
          </span>
          <span className="text-lg font-extrabold text-slate-900 block">
            {DEPOSIT_AVAX} AVAX
          </span>
        </div>
      </div>

      {/* Clean Service Line */}
      <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-800">
          {serviceName}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {intent.venueLocation}
        </span>
      </div>

      {/* Weather clause only if outdoor and raining/unfavorable */}
      {isOutdoor && weatherInfo && !weatherInfo.isFavorable && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-between font-medium">
          <span>Meteo: {weatherInfo.description} ({weatherInfo.temperature}°C)</span>
          <span className="font-bold">Rimborso garantito se piove</span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-1 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E84142]" />
          Avalanche C-Chain
        </span>

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
              className="flex items-center gap-1.5 bg-[#E84142] hover:bg-[#d03738] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Passa ad Avalanche</span>
            </button>
          ) : (
            <button
              onClick={() => onExecute(intent)}
              disabled={isExecuting}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isExecuting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Attesa firma...</span>
                </>
              ) : (
                <>
                  <span>Conferma ({DEPOSIT_AVAX} AVAX)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Wallet className="w-3.5 h-3.5 text-slate-400" />
            <span>Connetti Wallet</span>
          </button>
        )}
      </div>
    </div>
  );
};

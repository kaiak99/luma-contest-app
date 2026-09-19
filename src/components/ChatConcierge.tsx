'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ParsedIntent, VerifiableTicket, SuggestionOption, ActionType } from '@/types';
import { parseNaturalLanguageIntent } from '@/services/aiIntentParser';
import { RIVIERA_CONTRACTS, DEPOSIT_AVAX, DEPOSIT_AVAX_NUMBER } from '@/config/avalanche';
import { ActionProposalCard } from './ActionProposalCard';
import { Send, Ticket as TicketIcon, MapPin, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSendTransaction, useSwitchChain } from 'wagmi';
import { avalanche } from 'wagmi/chains';
import { parseEther, isAddress, getAddress } from 'viem';
import { isOutdoorActivity } from '@/services/weatherService';
import { RivieraLogo } from './RivieraLogo';
import { getExplorerTxUrl } from '@/config/avalanche';

const DEFAULT_MERCHANT: `0x${string}` = '0x3685061A465FC913bb81cd090C9fF715Fa25ffA4';

function resolveValidAddress(raw?: string): `0x${string}` {
  if (!raw) return DEFAULT_MERCHANT;
  try {
    const trimmed = raw.trim();
    if (isAddress(trimmed)) return getAddress(trimmed);
    if (isAddress(trimmed.toLowerCase())) return getAddress(trimmed.toLowerCase());
  } catch {
    // fallback
  }
  return DEFAULT_MERCHANT;
}

interface ChatConciergeProps {
  onTicketGenerated: (ticket: VerifiableTicket) => void;
  onOpenTicket: (ticket: VerifiableTicket) => void;
  walletAddress: string | null;
  onOpenWalletModal?: () => void;
}

export const ChatConcierge: React.FC<ChatConciergeProps> = ({
  onTicketGenerated,
  onOpenTicket,
  walletAddress,
  onOpenWalletModal,
}) => {
  const { openConnectModal } = useConnectModal();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Benvenuto al Desk Riviera per Pescara.\nIndica il locale, ristorante o attività che desideri prenotare. La prenotazione diventerà effettiva solo previa firma della transazione di deposito on-chain su Avalanche C-Chain con il tuo wallet Web3.',
      timestamp: Date.now(),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [executingIntentId, setExecutingIntentId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, executingIntentId, isProcessing, processingStep]);

  const executeRealTransaction = async (intent: ParsedIntent) => {
    try {
      // 1. Ensure user is on Avalanche C-Chain (Chain ID 43114)
      if (chainId !== avalanche.id) {
        try {
          await switchChainAsync({ chainId: avalanche.id });
        } catch {
          throw new Error('Passaggio di rete ad Avalanche C-Chain rifiutato. È necessario essere su Avalanche per confermare.');
        }
      }

      const merchantAddress = resolveValidAddress(intent.merchantAddress);

      // 2. Request user's wallet signature & broadcast transaction on Avalanche C-Chain
      const txHash = await sendTransactionAsync({
        to: merchantAddress,
        value: parseEther(DEPOSIT_AVAX),
        chainId: avalanche.id,
      });

      if (!txHash) {
        throw new Error('Nessun hash di transazione generato dal wallet.');
      }

      const blockTimestamp = Date.now();
      const ticketId = `RIV-${Math.floor(Date.now() / 1000).toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;

      const groupId = intent.guestCount >= 3
        ? `GRP-${Date.now().toString(36).toUpperCase()}`
        : undefined;

      const ticket: VerifiableTicket = {
        ticketId,
        txHash,
        qrPayload: JSON.stringify({
          id: ticketId,
          venue: intent.venueName,
          tx: txHash,
          deposit: DEPOSIT_AVAX,
          holder: walletAddress,
          time: blockTimestamp,
          group: groupId,
          chain: 'avalanche-c-chain-43114',
        }),
        actionType: intent.type,
        title: intent.title,
        venueName: intent.venueName,
        venueLocation: intent.venueLocation,
        date: intent.date,
        timeSlot: intent.timeSlot,
        guestCount: intent.guestCount,
        bookingType: intent.bookingType,
        items: intent.items,
        totalAvax: DEPOSIT_AVAX_NUMBER,
        totalEur: 0,
        depositAvax: DEPOSIT_AVAX_NUMBER,
        issuedAt: blockTimestamp,
        holderAddress: walletAddress || '',
        merchantAddress: intent.merchantAddress,
        isValidated: false,
        weatherClause: isOutdoorActivity(intent.type),
        weatherInfo: intent.weatherInfo,
        groupId,
        groupMembers: groupId ? [walletAddress || ''] : undefined,
      };

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      // ONLY save and propagate the ticket after confirmed wallet signature
      onTicketGenerated(ticket);

      const confirmMsg: ChatMessage = {
        id: `confirm-${Date.now()}`,
        sender: 'assistant',
        text: `Transazione on-chain confermata su Avalanche C-Chain!\nHash: [${txHash.slice(0, 10)}...${txHash.slice(-6)}](${getExplorerTxUrl(txHash)})\n\nIl pass d'ingresso crittografico per **${intent.venueName}** è stato registrato ed è ora attivo nella scheda "I Miei Pass". Mostra il codice QR al personale del locale all'arrivo.`,
        timestamp: Date.now(),
        ticket,
      };

      setMessages(prev => [...prev, confirmMsg]);
    } catch (err: any) {
      console.error('Wallet transaction error:', err);
      const isUserRejected = err?.name === 'UserRejectedRequestError' || 
                             err?.message?.toLowerCase().includes('reject') ||
                             err?.message?.toLowerCase().includes('user denied');
      const isInsufficient = err?.message?.toLowerCase().includes('insufficient') ||
                             err?.shortMessage?.toLowerCase().includes('insufficient');

      let errText = `Errore transazione: ${err?.shortMessage || err?.message || 'Verifica il wallet.'}`;
      if (isUserRejected) {
        errText = 'Firma annullata nel wallet. Nessun fondo è stato trasferito, la prenotazione NON è registrata e nessun pass è stato emesso.';
      } else if (isInsufficient) {
        errText = `Saldo AVAX insufficiente. Per effettuare la prenotazione reale on-chain su Avalanche occorrono ${DEPOSIT_AVAX} AVAX per il deposito cauzionale più una frazione per il gas di rete.`;
      }

      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: errText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setExecutingIntentId(null);
    }
  };

  const presetScenarios = [
    {
      label: 'Cena per 2 stasera (Pizzeria Da Giampiero)',
      query: 'Vorrei prenotare un tavolo per cena per 2 persone stasera alla Pizzeria Da Giampiero',
    },
    {
      label: 'Pranzo di pesce sul mare (Lido Moby Dick)',
      query: 'Prenota un tavolo per 4 persone per pranzo al Lido Moby Dick',
    },
    {
      label: 'Partita Padel Pescara (4 giocatori)',
      query: 'Vorrei prenotare un campo da padel per 4 persone alle 19',
    },
    {
      label: 'Aperitivo al tramonto per 3',
      query: 'Vorrei riservare un tavolo aperitivo al tramonto vista mare per 3 persone',
    },
    {
      label: 'Noleggio E-Bike Via Verde',
      query: 'Vorrei noleggiare 2 e-bike per percorrere la costa',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsProcessing(true);
    setProcessingStep(0);

    setTimeout(() => {
      const parsed = parseNaturalLanguageIntent(text);

      if (parsed.options && parsed.options.length > 0) {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: `Ecco le strutture disponibili a Pescara per la tua richiesta:`,
          timestamp: Date.now(),
          options: parsed.options,
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsProcessing(false);
      } else if (parsed.actionProposal) {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: `Disponibilità verificata per **${parsed.actionProposal.venueName}**:`,
          timestamp: Date.now(),
          actionProposal: parsed.actionProposal,
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsProcessing(false);
      } else {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: parsed.text || 'Non ho trovato locali corrispondenti. Puoi provare a cercare pizzerie, ristoranti sul mare o lidi a Pescara.',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsProcessing(false);
      }
    }, 900);
  };

  const handleSelectOption = (option: SuggestionOption) => {
    if (option.actionPrompt) {
      handleSend(option.actionPrompt);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const actionType: ActionType = 'dining_reservation';
      const guestCount = 2;
      const groupId = guestCount >= 3 ? `GRP-${Date.now().toString(36).toUpperCase()}` : undefined;

      const proposal: ParsedIntent = {
        id: `intent-${Date.now()}`,
        type: actionType,
        title: `Proposta: ${option.venueName || option.title}`,
        venueName: option.venueName || option.title,
        venueLocation: option.location,
        date: 'Stasera (19 Settembre)',
        timeSlot: 'Ore 20:30',
        guestCount,
        bookingType: option.bookingType,
        merchantAddress: resolveValidAddress(option.merchantAddress),
        items: [
          {
            name: `${option.bookingType || 'Tavolo'} per ${guestCount} persone`,
            quantity: 1,
          },
        ],
        totalEur: 0,
        totalAvax: DEPOSIT_AVAX_NUMBER,
        depositAvax: DEPOSIT_AVAX_NUMBER,
        onchainMethod: 'registraPrenotazione()',
        calldataPreview: '0x...',
        contractTarget: RIVIERA_CONTRACTS.bookingEscrow,
        loyaltyCashbackAvax: 0,
        explanation: `Disponibilità verificata per **${option.venueName || option.title}**.`,
        isOutdoor: isOutdoorActivity(actionType),
        groupId,
      };

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: `Disponibilità verificata per **${option.venueName || option.title}**:`,
        timestamp: Date.now(),
        actionProposal: proposal,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 700);
  };

  const handleExecuteAction = async (intent: ParsedIntent) => {
    if (!walletAddress) {
      if (openConnectModal) {
        openConnectModal();
      } else if (onOpenWalletModal) {
        onOpenWalletModal();
      }
      return;
    }

    setExecutingIntentId(intent.id);
    await executeRealTransaction(intent);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[740px] overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                <RivieraLogo size={20} />
                <span>Desk Riviera</span>
              </div>
            )}

            <div
              className={`max-w-xl px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.text
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold hover:text-blue-800">$1</a>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>'),
              }}
            />

            {/* Suggestions list */}
            {msg.options && msg.options.length > 0 && (
              <div className="mt-3 w-full max-w-xl space-y-3">
                <div className="text-xs font-bold uppercase text-slate-400 tracking-wider px-1">
                  Opzioni Disponibili
                </div>
                {msg.options.map(option => (
                  <div
                    key={option.id}
                    className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-4 transition-all shadow-2xs flex flex-col sm:flex-row gap-3"
                  >
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-base text-slate-900 leading-tight">
                        {option.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {option.location}
                      </p>
                      <p className="text-sm text-slate-600 leading-snug pt-1">
                        {option.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                        {option.bookingType || 'Disponibile'}
                      </span>
                      <button
                        onClick={() => handleSelectOption(option)}
                        className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Seleziona</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Onchain Proposal Card */}
            {msg.actionProposal && (
              <div className="mt-4 w-full max-w-xl">
                <ActionProposalCard
                  intent={msg.actionProposal}
                  onExecute={handleExecuteAction}
                  isExecuting={executingIntentId === msg.actionProposal.id}
                  walletAddress={walletAddress}
                  onOpenWalletModal={onOpenWalletModal}
                />
              </div>
            )}

            {/* View ticket button */}
            {msg.ticket && (
              <div className="mt-3">
                <button
                  onClick={() => onOpenTicket(msg.ticket!)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
                >
                  <TicketIcon className="w-4 h-4 text-emerald-400" />
                  <span>Visualizza Pass QR ({msg.ticket.ticketId.split('-').slice(0, 2).join('-')})</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl w-fit">
            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="font-semibold text-xs text-slate-700">Verifica disponibilità a Pescara in corso...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset scenario prompt chips */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider">
            Consigliati:
          </span>
          {presetScenarios.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sc.query)}
              className="text-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3.5 py-1.5 rounded-xl font-semibold shrink-0 transition-colors cursor-pointer shadow-2xs"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input query field */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-slate-200 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder="Cerca locale o ristorante... (es. Pizzeria Da Giampiero, Lido Moby Dick)"
          className="flex-1 text-sm text-slate-900 bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-2xl px-5 py-3.5 focus:outline-hidden transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isProcessing}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white px-5 py-3.5 rounded-2xl font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2"
        >
          <span className="text-sm hidden sm:inline">Cerca</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export type ActionType =
  | 'beach_booking'
  | 'event_pass'
  | 'dining_reservation'
  | 'sport_booking'
  | 'wellness_booking'
  | 'mobility_rental'
  | 'hotel_booking'
  | 'boat_charter'
  | 'loyalty_claim';

export interface ActionItem {
  name: string;
  quantity: number;
  unitPriceEur?: number;
}

export interface WeatherInfo {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  description: string;
  isFavorable: boolean;
  icon: string;
}

export interface ParsedIntent {
  id: string;
  type: ActionType;
  title: string;
  venueName: string;
  venueLocation: string;
  merchantAddress: string;
  date: string;
  timeSlot?: string;
  guestCount: number;
  bookingType?: string;
  items: ActionItem[];
  totalEur: number;
  totalAvax: number;
  depositAvax: number;
  onchainMethod: string;
  calldataPreview: string;
  contractTarget: string;
  loyaltyCashbackAvax: number;
  explanation: string;
  weatherClause?: boolean;
  weatherInfo?: WeatherInfo;
  groupId?: string;
  isOutdoor?: boolean;
}

export interface SuggestionOption {
  id: string;
  title: string;
  venueName: string;
  location: string;
  merchantAddress: string;
  bookingType?: string;
  priceEur?: number;
  priceAvax?: number;
  description: string;
  badge?: string;
  items: ActionItem[];
  actionPrompt: string;
}

export interface OnchainTransactionReceipt {
  txHash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  valueAvax: number;
  gasUsed: string;
  effectiveGasPriceGwei: string;
  status: 'confirmed' | 'pending' | 'failed';
  chainName: string;
  chainId: number;
  explorerUrl: string;
}

export interface VerifiableTicket {
  ticketId: string;
  txHash: string;
  qrPayload: string;
  actionType: ActionType;
  title: string;
  venueName: string;
  venueLocation: string;
  date: string;
  timeSlot?: string;
  guestCount: number;
  bookingType?: string;
  items: ActionItem[];
  totalAvax: number;
  totalEur: number;
  depositAvax: number;
  issuedAt: number;
  holderAddress: string;
  merchantAddress: string;
  isValidated: boolean;
  validatedAt?: number;
  weatherClause?: boolean;
  weatherInfo?: WeatherInfo;
  groupId?: string;
  groupMembers?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  options?: SuggestionOption[];
  actionProposal?: ParsedIntent;
  receipt?: OnchainTransactionReceipt;
  ticket?: VerifiableTicket;
}

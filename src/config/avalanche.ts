export const AVALANCHE_CONFIG = {
  chainId: 43114,
  chainName: 'Avalanche C-Chain',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  blockExplorerUrl: 'https://snowtrace.io',
  currency: 'AVAX',
};

// Deposit amount for anti no-show (real AVAX on mainnet)
export const DEPOSIT_AVAX = '0.001';
export const DEPOSIT_AVAX_NUMBER = 0.001;

// Official smart contracts for Riviera
export const RIVIERA_CONTRACTS = {
  bookingEscrow: '0x8f2d5c3176ba32049e21ab745199678120398711',
  verifiableTickets: '0x3F83DeD44955E9Fcfd95bB54E0513988647e335F',
  loyaltyRewards: '0x892a065D397aB47833010E102f8319f39B54508e',
};

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getExplorerTxUrl(txHash: string): string {
  return `${AVALANCHE_CONFIG.blockExplorerUrl}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${AVALANCHE_CONFIG.blockExplorerUrl}/address/${address}`;
}

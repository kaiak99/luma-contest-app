import { ethers } from 'ethers';
import { AVALANCHE_CONFIG, getExplorerTxUrl } from '@/config/avalanche';
import { OnchainTransactionReceipt, ParsedIntent, VerifiableTicket } from '@/types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class AvalancheService {
  private static instance: AvalancheService;
  private provider: ethers.BrowserProvider | null = null;

  public static getInstance(): AvalancheService {
    if (!AvalancheService.instance) {
      AvalancheService.instance = new AvalancheService();
    }
    return AvalancheService.instance;
  }

  public isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  public async connectWallet(): Promise<{ address: string; balance: string }> {
    if (!this.isWalletAvailable()) {
      throw new Error('Nessun wallet Web3 rilevato. Installa Core Wallet o MetaMask per connetterti.');
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request real account authorization from user's extension
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('Nessun account selezionato nel wallet.');
      }
      const address = accounts[0];

      // Ensure user is on Avalanche (Chain ID 43114 or 43113)
      await this.ensureAvalancheNetwork();

      const balanceBig = await this.provider.getBalance(address);
      const balance = parseFloat(ethers.formatEther(balanceBig)).toFixed(4);

      return { address, balance };
    } catch (err: any) {
      console.error('Errore connessione wallet:', err);
      throw new Error(err?.message || 'Impossibile connettere il wallet.');
    }
  }

  public async getBalance(address: string): Promise<string> {
    if (!this.isWalletAvailable()) return '0.0000';
    try {
      if (!this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
      const balanceBig = await this.provider.getBalance(address);
      return parseFloat(ethers.formatEther(balanceBig)).toFixed(4);
    } catch {
      return '0.0000';
    }
  }

  public async ensureAvalancheNetwork(): Promise<void> {
    if (!this.isWalletAvailable()) return;

    const avalancheChainIdHex = '0xa869'; // Avalanche Fuji (43113) for hackathon verification or 0xa86a for mainnet
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: avalancheChainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: avalancheChainIdHex,
              chainName: 'Avalanche Fuji Testnet',
              rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
              nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
              blockExplorerUrls: ['https://testnet.snowtrace.io'],
            },
          ],
        });
      }
    }
  }

  public async executeOnchainAction(
    intent: ParsedIntent,
    userAddress: string
  ): Promise<{ receipt: OnchainTransactionReceipt; ticket: VerifiableTicket }> {
    if (!this.isWalletAvailable()) {
      throw new Error('Connetti il tuo wallet Web3 per autorizzare la transazione onchain.');
    }

    if (!userAddress) {
      throw new Error('Indirizzo wallet non specificato.');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await this.provider.getSigner();
    const activeAddress = await signer.getAddress();

    // Amount to send: for real utility/safety on testnet/mainnet, send value or deposit
    const valueToSend = ethers.parseEther(
      Math.min(intent.totalAvax, 0.001).toFixed(6)
    );

    // Call real transaction on Avalanche
    const tx = await signer.sendTransaction({
      to: intent.contractTarget || intent.merchantAddress,
      value: valueToSend,
    });

    // Wait for real onchain confirmation
    const realReceipt = await tx.wait();
    if (!realReceipt) {
      throw new Error('La transazione non è stata confermata dalla rete Avalanche.');
    }

    const txHash = realReceipt.hash;
    const blockNumber = realReceipt.blockNumber;

    const receipt: OnchainTransactionReceipt = {
      txHash,
      blockNumber,
      timestamp: Date.now(),
      from: activeAddress,
      to: intent.contractTarget || intent.merchantAddress,
      valueAvax: intent.totalAvax,
      gasUsed: realReceipt.gasUsed ? realReceipt.gasUsed.toString() : '21000',
      effectiveGasPriceGwei: realReceipt.gasPrice ? ethers.formatUnits(realReceipt.gasPrice, 'gwei') : '25.0',
      status: 'confirmed',
      chainName: 'Avalanche',
      chainId: AVALANCHE_CONFIG.chainId,
      explorerUrl: getExplorerTxUrl(txHash),
    };

    const ticketId = `RIV-${blockNumber}-${Math.floor(100 + Math.random() * 900)}`;

    const ticket: VerifiableTicket = {
      ticketId,
      txHash,
      qrPayload: JSON.stringify({
        id: ticketId,
        venue: intent.venueName,
        tx: txHash,
        avax: intent.totalAvax,
        holder: activeAddress,
        block: blockNumber,
      }),
      actionType: intent.type,
      title: intent.title,
      venueName: intent.venueName,
      venueLocation: intent.venueLocation,
      date: intent.date,
      timeSlot: intent.timeSlot,
      guestCount: intent.guestCount,
      items: intent.items,
      totalAvax: intent.totalAvax,
      totalEur: intent.totalEur,
      depositAvax: intent.depositAvax || intent.totalAvax,
      issuedAt: Date.now(),
      holderAddress: activeAddress,
      merchantAddress: intent.merchantAddress,
      isValidated: false,
    };

    return { receipt, ticket };
  }
}

export const avalancheService = AvalancheService.getInstance();

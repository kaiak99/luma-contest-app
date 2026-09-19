import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche } from 'wagmi/chains';
import { http } from 'wagmi';

export const wagmiConfig = getDefaultConfig({
  appName: 'Riviera',
  projectId: '21fef48091f12692cad574a6f7753643',
  chains: [avalanche],
  transports: {
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
  ssr: true,
});

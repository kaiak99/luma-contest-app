import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { http } from 'wagmi';

export const wagmiConfig = getDefaultConfig({
  appName: 'Riviera AI',
  projectId: '21fef48091f12692cad574a6f7753643',
  chains: [avalancheFuji, avalanche],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
  ssr: true,
});

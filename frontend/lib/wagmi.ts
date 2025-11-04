import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, sepolia, bscTestnet, arbitrumSepolia } from 'wagmi/chains';

// Custom chain config for Polygon Amoy
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
    public: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'ChainReactor',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [polygonAmoy, sepolia, bscTestnet, arbitrumSepolia],
  ssr: true,
});
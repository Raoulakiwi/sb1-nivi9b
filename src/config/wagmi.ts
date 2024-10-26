import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { pulsechain } from './chains';
import { publicProvider } from 'wagmi/providers/public';

export const chains = [pulsechain];

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'Web3 Revenue Share',
    projectId: 'YOUR_PROJECT_ID',
    chains,
    providers: [publicProvider()]
  })
);
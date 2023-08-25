import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';
import { NETWORK } from '@/constants/contracts';

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  devnet: {
    url: getFullnodeUrl('devnet'),
  },
  testnet: {
    url: getFullnodeUrl('testnet'),
  },
  mainnet: {
    url: getFullnodeUrl('mainnet'),
  },
});

export { useNetworkVariable, useNetworkVariables, networkConfig };

export function getSuiClient() {
  return new SuiClient({ url: getFullnodeUrl(NETWORK) });
}

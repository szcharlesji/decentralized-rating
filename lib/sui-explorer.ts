import { NETWORK } from '@/constants/contracts';

export function getExplorerUrl(objectId: string, type: 'object' | 'txblock' | 'address' = 'object'): string {
  const baseUrl = NETWORK === 'mainnet'
    ? 'https://suiscan.xyz/mainnet'
    : `https://suiscan.xyz/${NETWORK}`;

  return `${baseUrl}/${type}/${objectId}`;
}

export function shortenAddress(address: string, chars = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

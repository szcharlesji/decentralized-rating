'use client';

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness, jwtToAddress } from '@mysten/sui/zklogin';

export interface ZkLoginSession {
  ephemeralKeyPair: Ed25519Keypair;
  nonce: string;
  randomness: string;
  maxEpoch: number;
}

export interface ZkLoginState {
  isAuthenticated: boolean;
  userAddress?: string;
  jwt?: string;
  session?: ZkLoginSession;
}

/**
 * Initialize a zkLogin session with ephemeral key pair
 */
export function initZkLoginSession(maxEpoch: number): ZkLoginSession {
  const ephemeralKeyPair = new Ed25519Keypair();
  const randomness = generateRandomness();
  const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

  return {
    ephemeralKeyPair,
    nonce,
    randomness,
    maxEpoch,
  };
}

/**
 * Build Google OAuth URL for zkLogin
 */
export function getGoogleAuthUrl(nonce: string): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: nonce,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Parse JWT from OAuth callback
 */
export function parseJwtFromUrl(url: string): string | null {
  const hash = url.split('#')[1];
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  return params.get('id_token');
}

/**
 * Get Sui address from JWT token
 */
export async function getSuiAddressFromJwt(jwt: string, salt: string): Promise<string> {
  return await jwtToAddress(jwt, salt);
}

/**
 * Store zkLogin session in localStorage
 */
export function saveZkLoginSession(session: ZkLoginSession): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('zklogin_session', JSON.stringify({
    ...session,
    ephemeralPrivateKey: session.ephemeralKeyPair.getSecretKey(),
  }));
}

/**
 * Retrieve zkLogin session from localStorage
 */
export function loadZkLoginSession(): ZkLoginSession | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('zklogin_session');
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    const keypair = Ed25519Keypair.fromSecretKey(data.ephemeralPrivateKey);

    return {
      ephemeralKeyPair: keypair,
      nonce: data.nonce,
      randomness: data.randomness,
      maxEpoch: data.maxEpoch,
    };
  } catch (e) {
    console.error('Failed to load zkLogin session:', e);
    return null;
  }
}

/**
 * Clear zkLogin session from localStorage
 */
export function clearZkLoginSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('zklogin_session');
  localStorage.removeItem('zklogin_jwt');
  localStorage.removeItem('zklogin_address');
}

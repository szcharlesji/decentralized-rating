'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import {
  ZkLoginState,
  initZkLoginSession,
  getGoogleAuthUrl,
  saveZkLoginSession,
  loadZkLoginSession,
  clearZkLoginSession,
  getSuiAddressFromJwt,
} from '@/lib/zklogin';

interface ZkLoginContextType {
  state: ZkLoginState;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const ZkLoginContext = createContext<ZkLoginContextType | undefined>(undefined);

export function ZkLoginProvider({ children }: { children: ReactNode }) {
  const client = useSuiClient();
  const [state, setState] = useState<ZkLoginState>({
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load existing session on mount
  useEffect(() => {
    const loadExistingSession = async () => {
      try {
        const session = loadZkLoginSession();
        const jwt = typeof window !== 'undefined' ? localStorage.getItem('zklogin_jwt') : null;
        const address = typeof window !== 'undefined' ? localStorage.getItem('zklogin_address') : null;

        if (session && jwt && address) {
          setState({
            isAuthenticated: true,
            userAddress: address,
            jwt,
            session,
          });
        }
      } catch (error) {
        console.error('Error loading zkLogin session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingSession();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);

      // Get current epoch for maxEpoch calculation
      const { epoch } = await client.getLatestSuiSystemState();
      const maxEpoch = Number(epoch) + 10; // Valid for 10 epochs (~24 hours)

      // Initialize zkLogin session
      const session = initZkLoginSession(maxEpoch);
      saveZkLoginSession(session);

      // Redirect to Google OAuth
      const authUrl = getGoogleAuthUrl(session.nonce);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating zkLogin:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearZkLoginSession();
    setState({
      isAuthenticated: false,
    });
  };

  return (
    <ZkLoginContext.Provider value={{ state, login, logout, isLoading }}>
      {children}
    </ZkLoginContext.Provider>
  );
}

export function useZkLogin() {
  const context = useContext(ZkLoginContext);
  if (!context) {
    throw new Error('useZkLogin must be used within ZkLoginProvider');
  }
  return context;
}

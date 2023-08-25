'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJwtFromUrl, loadZkLoginSession, getSuiAddressFromJwt } from '@/lib/zklogin';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Parse JWT from URL hash
        const jwt = parseJwtFromUrl(window.location.href);
        if (!jwt) {
          throw new Error('No JWT token found in callback URL');
        }

        // Load the zkLogin session
        const session = loadZkLoginSession();
        if (!session) {
          throw new Error('No zkLogin session found. Please try logging in again.');
        }

        // Get salt from backend (using mock for now)
        // In production, you'd call your salt service here
        const mockSalt = '129390038577185583942388216820280642146';

        // Derive Sui address from JWT
        const userAddress = await getSuiAddressFromJwt(jwt, mockSalt);

        // Store authentication data
        localStorage.setItem('zklogin_jwt', jwt);
        localStorage.setItem('zklogin_address', userAddress);

        setStatus('success');

        // Redirect to home page after successful authentication
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (err: any) {
        console.error('Error processing OAuth callback:', err);
        setError(err.message || 'Failed to complete authentication');
        setStatus('error');

        // Redirect back to home after error
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    processCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Authentication
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your sign-in...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful
            </h2>
            <p className="text-gray-600">
              Redirecting you to the app...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-600 text-5xl mb-4">✕</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Redirecting you back...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

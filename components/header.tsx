'use client';

import Link from 'next/link';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export function Header() {
  const account = useCurrentAccount();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              dApp Reviews
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/browse"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/analytics"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Analytics
              </Link>
              {account && (
                <Link
                  href="/submit"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Submit Review
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

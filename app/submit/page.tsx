'use client';

import { Header } from '@/components/header';
import { ReviewForm } from '@/components/review-form';
import { useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';

export default function SubmitPage() {
  const account = useCurrentAccount();

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to submit a review.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Submit a Review
          </h1>
          <p className="text-gray-600">
            Share your experience with a Sui dApp. Reviews are permanent and stored on-chain.
          </p>
        </div>
        <ReviewForm />
      </main>
    </div>
  );
}

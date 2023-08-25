import { Header } from '@/components/header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover & Review Sui dApps
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Multi-dimensional ratings for decentralized applications. Transparent, immutable, and community-driven.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Immutable Reviews</h3>
            <p className="text-gray-600">
              All reviews are permanently stored on-chain, ensuring transparency and preventing manipulation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Multi-dimensional</h3>
            <p className="text-gray-600">
              Rate dApps across 5 key dimensions: Security, Usability, Performance, Documentation, and Innovation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-3xl mb-3">🗳️</div>
            <h3 className="text-lg font-semibold mb-2">Community Voting</h3>
            <p className="text-gray-600">
              Upvote or downvote reviews to surface the most helpful community feedback.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to browse reviews and submit your own.
          </p>
          <Link
            href="/browse"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse dApps
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Deployed on Sui Devnet</p>
          <p className="mt-1 font-mono text-xs">
            Package: {process.env.NEXT_PUBLIC_PACKAGE_ID?.slice(0, 10)}...
          </p>
        </div>
      </main>
    </div>
  );
}

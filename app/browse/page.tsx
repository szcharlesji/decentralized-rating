'use client';

import { Header } from '@/components/header';
import { ReviewCard } from '@/components/review-card';
import { useReviews } from '@/hooks/use-reviews';
import Link from 'next/link';

export default function BrowsePage() {
  const { data: reviews, isLoading, error } = useReviews();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Reviews
            </h1>
            <p className="text-gray-600">
              Discover what the community thinks about Sui dApps
            </p>
          </div>
          <Link
            href="/submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </Link>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Failed to load reviews. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && reviews && reviews.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">
              No reviews yet. Be the first to review a Sui dApp!
            </p>
            <Link
              href="/submit"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit First Review
            </Link>
          </div>
        )}

        {!isLoading && !error && reviews && reviews.length > 0 && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

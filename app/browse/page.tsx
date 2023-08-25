'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { ReviewCard } from '@/components/review-card';
import { useReviews } from '@/hooks/use-reviews';
import Link from 'next/link';

export default function BrowsePage() {
  const { data: reviews, isLoading, error } = useReviews();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'most-voted'>('newest');

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    if (!reviews) return [];

    let filtered = reviews;

    // Filter by search query (package ID)
    if (searchQuery) {
      filtered = filtered.filter((review) =>
        review.targetPackage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'highest':
          const scoreA =
            a.ratingSecurity * 0.3 +
            a.ratingUsability * 0.25 +
            a.ratingPerformance * 0.2 +
            a.ratingDocumentation * 0.15 +
            a.ratingInnovation * 0.1;
          const scoreB =
            b.ratingSecurity * 0.3 +
            b.ratingUsability * 0.25 +
            b.ratingPerformance * 0.2 +
            b.ratingDocumentation * 0.15 +
            b.ratingInnovation * 0.1;
          return scoreB - scoreA;
        case 'most-voted':
          const votesA = parseInt(a.upvotes) + parseInt(a.downvotes);
          const votesB = parseInt(b.upvotes) + parseInt(b.downvotes);
          return votesB - votesA;
        case 'newest':
        default:
          return parseInt(b.timestamp) - parseInt(a.timestamp);
      }
    });

    return sorted;
  }, [reviews, searchQuery, sortBy]);

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
              {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'} found
            </p>
          </div>
          <Link
            href="/submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </Link>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by package ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
                <option value="most-voted">Most Voted</option>
              </select>
            </div>
          </div>
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

        {!isLoading && !error && filteredReviews.length === 0 && reviews && reviews.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">
              No reviews match your search.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {!isLoading && !error && filteredReviews.length > 0 && (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

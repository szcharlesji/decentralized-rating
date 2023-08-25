'use client';

import { useMemo } from 'react';
import { Header } from '@/components/header';
import { ReviewCard } from '@/components/review-card';
import { useReviews, calculateCompositeScore } from '@/hooks/use-reviews';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const { data: reviews, isLoading } = useReviews();

  const userStats = useMemo(() => {
    if (!reviews || !address) {
      return {
        userReviews: [],
        totalReviews: 0,
        avgRatingGiven: 0,
        totalVotesReceived: 0,
        dimensionAverages: {
          security: 0,
          usability: 0,
          performance: 0,
          documentation: 0,
          innovation: 0,
        },
      };
    }

    const userReviews = reviews.filter(
      (review) => review.reviewer.toLowerCase() === address.toLowerCase()
    );

    if (userReviews.length === 0) {
      return {
        userReviews: [],
        totalReviews: 0,
        avgRatingGiven: 0,
        totalVotesReceived: 0,
        dimensionAverages: {
          security: 0,
          usability: 0,
          performance: 0,
          documentation: 0,
          innovation: 0,
        },
      };
    }

    const avgRatingGiven =
      userReviews.reduce((sum, r) => sum + calculateCompositeScore(r), 0) / userReviews.length;

    const totalVotesReceived = userReviews.reduce(
      (sum, r) => sum + parseInt(r.upvotes) + parseInt(r.downvotes),
      0
    );

    const dimensionAverages = {
      security: userReviews.reduce((sum, r) => sum + r.ratingSecurity, 0) / userReviews.length,
      usability: userReviews.reduce((sum, r) => sum + r.ratingUsability, 0) / userReviews.length,
      performance:
        userReviews.reduce((sum, r) => sum + r.ratingPerformance, 0) / userReviews.length,
      documentation:
        userReviews.reduce((sum, r) => sum + r.ratingDocumentation, 0) / userReviews.length,
      innovation:
        userReviews.reduce((sum, r) => sum + r.ratingInnovation, 0) / userReviews.length,
    };

    return {
      userReviews,
      totalReviews: userReviews.length,
      avgRatingGiven,
      totalVotesReceived,
      dimensionAverages,
    };
  }, [reviews, address]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {address?.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">User Profile</h1>
              <p className="text-sm font-mono text-gray-600 break-all">{address}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {userStats.totalReviews}
                </div>
                <div className="text-sm text-gray-600">Reviews Submitted</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {userStats.avgRatingGiven.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average Rating Given</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {userStats.totalVotesReceived}
                </div>
                <div className="text-sm text-gray-600">Total Votes Received</div>
              </div>
            </div>

            {/* Rating Tendencies */}
            {userStats.totalReviews > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Rating Tendencies</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Average ratings given across all dimensions
                </p>
                <div className="space-y-4">
                  {[
                    { key: 'security', label: 'Security', color: 'bg-blue-600' },
                    { key: 'usability', label: 'Usability', color: 'bg-green-600' },
                    { key: 'performance', label: 'Performance', color: 'bg-purple-600' },
                    { key: 'documentation', label: 'Documentation', color: 'bg-yellow-600' },
                    { key: 'innovation', label: 'Innovation', color: 'bg-pink-600' },
                  ].map((dim) => {
                    const value =
                      userStats.dimensionAverages[dim.key as keyof typeof userStats.dimensionAverages];
                    const percentage = (value / 5) * 100;
                    return (
                      <div key={dim.key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{dim.label}</span>
                          <span className="text-sm text-gray-600">{value.toFixed(1)} / 5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${dim.color} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* User's Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Reviews ({userStats.totalReviews})
              </h2>
              {userStats.userReviews.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-600">This user hasn't submitted any reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userStats.userReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

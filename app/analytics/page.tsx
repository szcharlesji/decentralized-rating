'use client';

import { useMemo } from 'react';
import { Header } from '@/components/header';
import { useReviews, calculateCompositeScore } from '@/hooks/use-reviews';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { data: reviews, isLoading } = useReviews();

  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        uniqueDApps: 0,
        totalVotes: 0,
        avgRating: 0,
        topDApps: [],
        recentReviews: [],
        dimensionAverages: {
          security: 0,
          usability: 0,
          performance: 0,
          documentation: 0,
          innovation: 0,
        },
      };
    }

    // Calculate platform stats
    const uniqueDApps = new Set(reviews.map((r) => r.targetPackage)).size;
    const totalVotes = reviews.reduce(
      (sum, r) => sum + parseInt(r.upvotes) + parseInt(r.downvotes),
      0
    );

    const avgRating =
      reviews.reduce((sum, r) => sum + calculateCompositeScore(r), 0) / reviews.length;

    // Group by dApp and calculate average ratings
    const dAppStats = reviews.reduce((acc, review) => {
      const pkg = review.targetPackage;
      if (!acc[pkg]) {
        acc[pkg] = {
          packageId: pkg,
          reviews: [],
          totalScore: 0,
          totalVotes: 0,
        };
      }
      acc[pkg].reviews.push(review);
      acc[pkg].totalScore += calculateCompositeScore(review);
      acc[pkg].totalVotes += parseInt(review.upvotes) + parseInt(review.downvotes);
      return acc;
    }, {} as Record<string, any>);

    // Top rated dApps
    const topDApps = Object.values(dAppStats)
      .map((dapp: any) => ({
        ...dapp,
        avgScore: dapp.totalScore / dapp.reviews.length,
        reviewCount: dapp.reviews.length,
      }))
      .sort((a: any, b: any) => b.avgScore - a.avgScore)
      .slice(0, 5);

    // Recent reviews
    const recentReviews = [...reviews]
      .sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
      .slice(0, 5);

    // Dimension averages
    const dimensionAverages = {
      security: reviews.reduce((sum, r) => sum + r.ratingSecurity, 0) / reviews.length,
      usability: reviews.reduce((sum, r) => sum + r.ratingUsability, 0) / reviews.length,
      performance: reviews.reduce((sum, r) => sum + r.ratingPerformance, 0) / reviews.length,
      documentation:
        reviews.reduce((sum, r) => sum + r.ratingDocumentation, 0) / reviews.length,
      innovation: reviews.reduce((sum, r) => sum + r.ratingInnovation, 0) / reviews.length,
    };

    return {
      totalReviews: reviews.length,
      uniqueDApps,
      totalVotes,
      avgRating,
      topDApps,
      recentReviews,
      dimensionAverages,
    };
  }, [reviews]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Platform statistics and insights</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.totalReviews}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.uniqueDApps}
                </div>
                <div className="text-sm text-gray-600">Unique dApps</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.totalVotes}
                </div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>

            {/* Dimension Averages */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Rating Dimensions Overview</h2>
              <div className="space-y-4">
                {[
                  { key: 'security', label: 'Security', color: 'bg-blue-600' },
                  { key: 'usability', label: 'Usability', color: 'bg-green-600' },
                  { key: 'performance', label: 'Performance', color: 'bg-purple-600' },
                  { key: 'documentation', label: 'Documentation', color: 'bg-yellow-600' },
                  { key: 'innovation', label: 'Innovation', color: 'bg-pink-600' },
                ].map((dim) => {
                  const value =
                    stats.dimensionAverages[dim.key as keyof typeof stats.dimensionAverages];
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

            <div className="grid md:grid-cols-2 gap-8">
              {/* Top Rated dApps */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Top Rated dApps</h2>
                {stats.topDApps.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No data yet</p>
                ) : (
                  <div className="space-y-4">
                    {stats.topDApps.map((dapp: any, index: number) => (
                      <div key={dapp.packageId} className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-mono text-gray-500 truncate">
                            {dapp.packageId.slice(0, 20)}...
                          </div>
                          <div className="text-sm text-gray-600">
                            {dapp.reviewCount} {dapp.reviewCount === 1 ? 'review' : 'reviews'}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {dapp.avgScore.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
                {stats.recentReviews.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentReviews.map((review: any) => {
                      const score = calculateCompositeScore(review);
                      const date = new Date(parseInt(review.timestamp));
                      return (
                        <div key={review.id} className="border-l-4 border-blue-600 pl-4">
                          <div className="flex justify-between items-start mb-1">
                            <div className="text-sm font-medium text-gray-900">
                              Score: {score.toFixed(1)}/5
                            </div>
                            <div className="text-xs text-gray-500">
                              {date.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-xs font-mono text-gray-500 truncate">
                            {review.targetPackage.slice(0, 30)}...
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Help Grow the Platform</h3>
              <p className="text-gray-600 mb-4">
                Share your experience and help others discover great dApps
              </p>
              <Link
                href="/submit"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Submit a Review
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

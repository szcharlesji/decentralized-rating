'use client';

import Link from 'next/link';
import { Review, calculateCompositeScore } from '@/hooks/use-reviews';
import { RATING_DIMENSIONS } from '@/constants/contracts';
import { VoteButtons } from './vote-buttons';
import { getExplorerUrl, shortenAddress } from '@/lib/sui-explorer';
import { usePackageMetadata } from '@/hooks/use-package-metadata';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const compositeScore = calculateCompositeScore(review);
  const date = new Date(parseInt(review.timestamp));
  const { data: packageMetadata, isLoading: isLoadingMetadata } = usePackageMetadata(review.targetPackage);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl font-bold text-blue-600">
              {compositeScore.toFixed(1)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Overall Rating
              </div>
              <div className="text-xs text-gray-500">
                {date.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Package Metadata */}
          <div className="mb-2">
            {isLoadingMetadata ? (
              <div className="text-sm text-gray-400">Loading package info...</div>
            ) : packageMetadata?.hasMetadata ? (
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {packageMetadata.name}
                </div>
                {packageMetadata.modules && packageMetadata.modules.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {packageMetadata.modules.slice(0, 3).map((module) => (
                      <span
                        key={module}
                        className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                      >
                        {module}
                      </span>
                    ))}
                    {packageMetadata.modules.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        +{packageMetadata.modules.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">
              Package: {shortenAddress(review.targetPackage, 8)}
            </span>
            <a
              href={getExplorerUrl(review.targetPackage, 'object')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View →
            </a>
          </div>
        </div>
        <VoteButtons
          reviewId={review.id}
          upvotes={parseInt(review.upvotes)}
          downvotes={parseInt(review.downvotes)}
        />
      </div>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {RATING_DIMENSIONS.map((dim) => {
          const rating = review[`rating${dim.label}` as keyof Review] as number;
          return (
            <div key={dim.key} className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {rating}/5
              </div>
              <div className="text-xs text-gray-600">{dim.label}</div>
            </div>
          );
        })}
      </div>

      {/* Review Text */}
      {review.reviewText && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {review.reviewText}
          </p>
        </div>
      )}

      {/* Reviewer Info */}
      <div className="mt-4">
        <Link
          href={`/profile/${review.reviewer}`}
          className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          Reviewed by {shortenAddress(review.reviewer)}
        </Link>
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';
import { CONTRACTS } from '@/constants/contracts';

export interface Review {
  id: string;
  targetPackage: string;
  reviewer: string;
  timestamp: string;
  ratingSecurity: number;
  ratingUsability: number;
  ratingPerformance: number;
  ratingDocumentation: number;
  ratingInnovation: number;
  reviewText: string;
  upvotes: string;
  downvotes: string;
}

export function useReviews() {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      try {
        // Query all Review objects owned by users
        const { data } = await client.getOwnedObjects({
          filter: {
            StructType: `${CONTRACTS.PACKAGE_ID}::dapp_reviews::Review`,
          },
          options: {
            showContent: true,
            showType: true,
          },
        });

        const reviews: Review[] = [];

        for (const obj of data) {
          if (obj.data?.content?.dataType === 'moveObject') {
            const fields = obj.data.content.fields as any;
            reviews.push({
              id: obj.data.objectId,
              targetPackage: fields.target_package,
              reviewer: fields.reviewer,
              timestamp: fields.timestamp,
              ratingSecurity: fields.rating_security,
              ratingUsability: fields.rating_usability,
              ratingPerformance: fields.rating_performance,
              ratingDocumentation: fields.rating_documentation,
              ratingInnovation: fields.rating_innovation,
              reviewText: fields.review_text,
              upvotes: fields.upvotes,
              downvotes: fields.downvotes,
            });
          }
        }

        // Sort by timestamp (newest first)
        reviews.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

        return reviews;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function calculateCompositeScore(review: Review): number {
  const score =
    review.ratingSecurity * 0.3 +
    review.ratingUsability * 0.25 +
    review.ratingPerformance * 0.2 +
    review.ratingDocumentation * 0.15 +
    review.ratingInnovation * 0.1;

  return Math.round(score * 10) / 10; // Round to 1 decimal
}

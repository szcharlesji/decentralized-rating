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
  upvotes: string;
  downvotes: string;
}

export function useReviews() {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      try {
        const eventType = `${CONTRACTS.PACKAGE_ID}::dapp_reviews::ReviewCreated`;
        const events = await client.queryEvents({
          query: {
            MoveEventType: eventType,
          },
          order: 'descending',
          limit: 100,
        });

        const reviewIds = events.data
          .map((event) => {
            const parsed = event.parsedJson as { review_id?: string } | null;
            return parsed?.review_id;
          })
          .filter((id): id is string => typeof id === 'string');

        if (reviewIds.length === 0) {
          return [];
        }

        const objects = await client.multiGetObjects({
          ids: reviewIds,
          options: {
            showContent: true,
            showType: true,
          },
        });

        const reviews: Review[] = [];

        for (const obj of objects) {
          const data = obj.data;
          if (data?.content?.dataType === 'moveObject') {
            const fields = data.content.fields as any;
            reviews.push({
              id: data.objectId,
              targetPackage: fields.target_package,
              reviewer: fields.reviewer,
              timestamp: fields.timestamp,
              ratingSecurity: fields.rating_security,
              ratingUsability: fields.rating_usability,
              ratingPerformance: fields.rating_performance,
              ratingDocumentation: fields.rating_documentation,
              ratingInnovation: fields.rating_innovation,
              upvotes: fields.upvotes,
              downvotes: fields.downvotes,
            });
          }
        }

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

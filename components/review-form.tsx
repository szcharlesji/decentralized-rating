'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { isValidSuiAddress, normalizeSuiAddress } from '@mysten/sui/utils';
import { toast } from 'sonner';
import { CONTRACTS, RATING_DIMENSIONS } from '@/constants/contracts';
import { useRouter } from 'next/navigation';

export function ReviewForm() {
  const router = useRouter();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [packageId, setPackageId] = useState('');
  const [ratings, setRatings] = useState({
    security: 3,
    usability: 3,
    performance: 3,
    documentation: 3,
    innovation: 3,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (dimension: string, value: number) => {
    setRatings((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const trimmedPackageId = packageId.trim();

      // Validate package ID
      if (!trimmedPackageId || trimmedPackageId.length < 10) {
        throw new Error('Please enter a valid package ID');
      }

      const normalizedPackageId = normalizeSuiAddress(trimmedPackageId);
      if (!isValidSuiAddress(normalizedPackageId)) {
        throw new Error('Package ID must be a valid Sui address (0x...)');
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACTS.PACKAGE_ID}::dapp_reviews::create_review`,
        arguments: [
          tx.object(CONTRACTS.REVIEW_REGISTRY),
          tx.pure.address(normalizedPackageId),
          tx.pure.u8(ratings.security),
          tx.pure.u8(ratings.usability),
          tx.pure.u8(ratings.performance),
          tx.pure.u8(ratings.documentation),
          tx.pure.u8(ratings.innovation),
          tx.object('0x6'), // Clock object
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('Review submitted:', result);
            toast.success('Review submitted successfully!');
            router.push('/browse');
          },
          onError: (err) => {
            console.error('Error submitting review:', err);
            toast.error(err.message || 'Failed to submit review');
            setIsSubmitting(false);
          },
        }
      );
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to submit review');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        {/* Package ID Input */}
        <div>
          <label htmlFor="packageId" className="block text-sm font-medium text-gray-700 mb-2">
            dApp Package ID *
          </label>
          <input
            type="text"
            id="packageId"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            The on-chain package ID of the dApp you're reviewing
          </p>
        </div>

        {/* Rating Sliders */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Rate the dApp (1-5 stars)
          </h3>
          <div className="space-y-4">
            {RATING_DIMENSIONS.map((dim) => (
              <div key={dim.key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-700">{dim.label}</label>
                  <span className="text-sm font-semibold text-gray-900">
                    {ratings[dim.key as keyof typeof ratings]} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratings[dim.key as keyof typeof ratings]}
                  onChange={(e) => handleRatingChange(dim.key, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Reviews are permanent and cannot be edited or deleted once submitted.
            Please review carefully before submitting.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACTS } from '@/constants/contracts';

interface VoteButtonsProps {
  reviewId: string;
  upvotes: number;
  downvotes: number;
}

export function VoteButtons({ reviewId, upvotes, downvotes }: VoteButtonsProps) {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isVoting, setIsVoting] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);

  const handleVote = async (isUpvote: boolean) => {
    if (!account) {
      alert('Please connect your wallet to vote');
      return;
    }

    setIsVoting(true);

    try {
      const tx = new Transaction();

      const functionName = isUpvote ? 'upvote_review' : 'downvote_review';

      tx.moveCall({
        target: `${CONTRACTS.PACKAGE_ID}::dapp_reviews::${functionName}`,
        arguments: [
          tx.object(reviewId),
          tx.object(CONTRACTS.VOTE_RECORD),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            // Optimistically update local state
            if (isUpvote) {
              setLocalUpvotes((prev) => prev + 1);
            } else {
              setLocalDownvotes((prev) => prev + 1);
            }
            setIsVoting(false);
          },
          onError: (err) => {
            console.error('Error voting:', err);
            alert(err.message || 'Failed to vote');
            setIsVoting(false);
          },
        }
      );
    } catch (err: any) {
      console.error('Error:', err);
      alert(err.message || 'Failed to vote');
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(true)}
        disabled={isVoting || !account}
        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Upvote"
      >
        <span>👍</span>
        <span className="font-medium">{localUpvotes}</span>
      </button>
      <button
        onClick={() => handleVote(false)}
        disabled={isVoting || !account}
        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Downvote"
      >
        <span>👎</span>
        <span className="font-medium">{localDownvotes}</span>
      </button>
    </div>
  );
}

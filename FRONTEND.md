# Frontend Setup

## Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Sui TypeScript SDK** (@mysten/sui)
- **Mysten dApp Kit** (@mysten/dapp-kit)
- **React Query** for data fetching

## Features

- ✅ Wallet connection with Sui dApp Kit
- ✅ Multi-dimensional review submission form
- ✅ Browse and display reviews
- ✅ Upvote/downvote functionality
- ✅ Real-time review fetching
- ✅ Responsive design

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

The `.env.local` file is already configured with the deployed contract addresses:

```env
NEXT_PUBLIC_PACKAGE_ID=0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2
NEXT_PUBLIC_REVIEW_REGISTRY=0x26b5b69028383b03a6447423d7e851fbea6947ab934277e09985a6765e9e143e
NEXT_PUBLIC_VOTE_RECORD=0x781e7cd88112e1ff2061eb792dc6e60154bcc318205741b569b75a62dd3d84ec
```

### 3. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── browse/
│   │   └── page.tsx          # Browse reviews page
│   ├── submit/
│   │   └── page.tsx          # Submit review page
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── header.tsx            # Header with wallet connection
│   ├── providers.tsx         # Sui and React Query providers
│   ├── review-form.tsx       # Review submission form
│   ├── review-card.tsx       # Review display component
│   └── vote-buttons.tsx      # Voting UI component
├── hooks/
│   └── use-reviews.ts        # Custom hook for fetching reviews
├── lib/
│   └── sui-client.ts         # Sui client configuration
└── constants/
    └── contracts.ts          # Contract addresses and constants
```

## Key Components

### Review Submission

The `ReviewForm` component allows users to:
- Enter a dApp package ID
- Rate across 5 dimensions (1-5 stars):
  - Security (30% weight)
  - Usability (25% weight)
  - Performance (20% weight)
  - Documentation (15% weight)
  - Innovation (10% weight)
- Write a review (up to 500 characters)
- Submit the review on-chain

### Browse Reviews

The `BrowsePage` displays:
- All submitted reviews
- Composite scores
- Individual dimension ratings
- Upvote/downvote counts
- Review text and metadata

### Voting

Users can:
- Upvote or downvote reviews
- See vote counts in real-time
- Votes are recorded on-chain via the `VoteRecord` smart contract

## Sui Integration

### Wallet Connection

Using `@mysten/dapp-kit`:
```tsx
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

const account = useCurrentAccount();
```

### Transaction Submission

```tsx
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::dapp_reviews::create_review`,
  arguments: [/* ... */],
});

signAndExecute({ transaction: tx });
```

### Querying Data

```tsx
import { useSuiClient } from '@mysten/dapp-kit';

const client = useSuiClient();
const { data } = await client.getOwnedObjects({
  filter: {
    StructType: `${PACKAGE_ID}::dapp_reviews::Review`,
  },
});
```

## Network

Currently configured for **Sui Devnet**.

To switch networks, update the `NETWORK` constant in `constants/contracts.ts`.

## Next Steps

- [ ] Add zkLogin integration
- [ ] Implement search and filtering
- [ ] Add package ID validation
- [ ] Show dApp metadata from Sui Explorer
- [ ] Add user profile page
- [ ] Implement pagination
- [ ] Deploy to production

## Testing

1. **Connect Wallet**: Use Sui Wallet browser extension
2. **Get Devnet SUI**: Visit [Sui Devnet Faucet](https://discord.com/channels/916379725201563759/971488439931392130)
3. **Submit Review**: Go to `/submit` and test review creation
4. **Browse**: View reviews on `/browse`
5. **Vote**: Test upvote/downvote functionality

## Troubleshooting

**Issue**: Wallet not connecting
- Make sure Sui Wallet extension is installed
- Switch wallet network to Devnet

**Issue**: Reviews not loading
- Check browser console for errors
- Verify contract addresses in `constants/contracts.ts`
- Ensure you're connected to Devnet

**Issue**: Transaction failing
- Ensure you have enough SUI for gas
- Check that the package ID is valid
- Verify review text is under 500 characters

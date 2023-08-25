# Decentralized dApp Review Platform

A blockchain-based review system for Sui dApps with multi-dimensional ratings and community voting.

## Overview

This platform allows users to review Sui dApps (identified by package ID) with:
- **Multi-dimensional ratings** (Security, Usability, Performance, Documentation, Innovation)
- **Immutable reviews** - permanent on-chain records
- **Community voting** - upvote/downvote system with vote changing
- **Anti-spam** - one review per user per dApp

## Architecture

### Smart Contracts (Move)
Located in `dapp_reviews/`

**Core Data Structures:**
- `Review` - Immutable review object with 5-dimensional ratings
- `ReviewRegistry` - Shared registry tracking all reviews
- `VoteRecord` - Shared object preventing double voting

**Key Functions:**
- `create_review()` - Submit a new review
- `upvote_review()` - Upvote a review
- `downvote_review()` - Downvote a review
- `change_vote()` - Change existing vote
- View functions for querying reviews

### Deployment

**Network:** Sui Devnet

**Package ID:**
```
0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2
```

See `dapp_reviews/DEPLOYMENT.md` for complete deployment information and usage examples.

## Features Implemented

✅ Multi-dimensional rating system (1-5 scale for each dimension)
✅ One review per user per dApp enforcement
✅ Immutable reviews (permanent on-chain)
✅ Upvote/downvote functionality
✅ Vote changing capability
✅ 500 character review text limit
✅ Event emissions for indexing
✅ Weighted composite score calculation
✅ Full-stack dApp with Next.js frontend
✅ Wallet connection with Sui dApp Kit
✅ Real-time review browsing
✅ Interactive voting UI

## Project Status

**Phase 1: Smart Contracts** ✅ Complete
- Move contracts implemented and deployed to Devnet
- All core functionality tested
- Event system for frontend integration

**Phase 2: Frontend** ✅ Complete
- Next.js + React application
- Sui dApp Kit integration
- Review submission and browsing
- Voting functionality
- Responsive UI with Tailwind CSS

**Phase 3: Enhancements** 🔜 Coming Next
- zkLogin integration (Google OAuth)
- Search and filtering
- Package metadata display
- User profiles
- Analytics dashboard

## Tech Stack

### Smart Contracts
- Sui Move
- Sui Framework
- Deployed on Sui Devnet

### Frontend
- Next.js 15
- React 19
- TypeScript
- Sui TypeScript SDK (@mysten/sui)
- Mysten dApp Kit (@mysten/dapp-kit)
- React Query
- Tailwind CSS 4

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Sui Wallet browser extension
- Devnet SUI tokens

### Run the Application

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

See `FRONTEND.md` for detailed frontend documentation.

### Deploy Smart Contracts (Already Deployed)

```bash
cd dapp_reviews
sui client publish --gas-budget 100000000
```

See `dapp_reviews/DEPLOYMENT.md` for examples of direct CLI interaction.

## Smart Contract Details

### Rating Dimensions

Each review includes ratings (1-5) for:
1. **Security** (30% weight) - Smart contract safety, audits
2. **Usability** (25% weight) - User experience, ease of use
3. **Performance** (20% weight) - Transaction speed, responsiveness
4. **Documentation** (15% weight) - Quality of docs, community support
5. **Innovation** (10% weight) - Uniqueness, feature set

### Composite Score

Calculated as a weighted average:
```
score = (security × 0.30) + (usability × 0.25) + (performance × 0.20) +
        (documentation × 0.15) + (innovation × 0.10)
```

Returned as `u64` (multiplied by 100), e.g., 425 = 4.25/5.00

## Security Features

- ✅ Duplicate review prevention (one per user per dApp)
- ✅ Vote deduplication (prevent double voting)
- ✅ Character limit enforcement (500 chars max)
- ✅ Rating bounds validation (1-5)
- ✅ Immutable review data integrity
- ✅ Shared objects for concurrent access

## Screenshots

Visit the app at [http://localhost:3000](http://localhost:3000) to see:
- **Home Page**: Landing page with feature overview
- **Browse**: View all reviews with ratings and voting
- **Submit Review**: Multi-dimensional rating form
- **Wallet Integration**: Connect with Sui Wallet

## Next Steps

1. Add zkLogin integration (Google OAuth)
2. Implement search and filtering by package ID
3. Show dApp metadata from Sui Explorer
4. Add user profile pages
5. Create analytics dashboard
6. Deploy to Sui Testnet
7. Production deployment to Mainnet

## License

MIT

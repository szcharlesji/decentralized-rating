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

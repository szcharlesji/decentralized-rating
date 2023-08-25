# Deployment Information

## Network
**Sui Devnet**

## Deployed Addresses

### Package ID
```
0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2
```

### Shared Objects

**ReviewRegistry**
```
0x26b5b69028383b03a6447423d7e851fbea6947ab934277e09985a6765e9e143e
```

**VoteRecord**
```
0x781e7cd88112e1ff2061eb792dc6e60154bcc318205741b569b75a62dd3d84ec
```

### UpgradeCap
```
0x9c9a0e8574e5300dadf01a7ea4519542fcb71a8b8f049cba3fe79de7704d665d
```

## Contract Functions

### Creating a Review
```bash
sui client call \
  --package 0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2 \
  --module dapp_reviews \
  --function create_review \
  --args \
    0x26b5b69028383b03a6447423d7e851fbea6947ab934277e09985a6765e9e143e \
    "<TARGET_PACKAGE_ADDRESS>" \
    4 \
    5 \
    3 \
    4 \
    5 \
    "This is a great dApp!" \
    0x6 \
  --gas-budget 10000000
```

### Upvoting a Review
```bash
sui client call \
  --package 0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2 \
  --module dapp_reviews \
  --function upvote_review \
  --args \
    <REVIEW_OBJECT_ID> \
    0x781e7cd88112e1ff2061eb792dc6e60154bcc318205741b569b75a62dd3d84ec \
  --gas-budget 10000000
```

### Downvoting a Review
```bash
sui client call \
  --package 0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2 \
  --module dapp_reviews \
  --function downvote_review \
  --args \
    <REVIEW_OBJECT_ID> \
    0x781e7cd88112e1ff2061eb792dc6e60154bcc318205741b569b75a62dd3d84ec \
  --gas-budget 10000000
```

### Changing a Vote
```bash
sui client call \
  --package 0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2 \
  --module dapp_reviews \
  --function change_vote \
  --args \
    <REVIEW_OBJECT_ID> \
    0x781e7cd88112e1ff2061eb792dc6e60154bcc318205741b569b75a62dd3d84ec \
    true \
  --gas-budget 10000000
```

## Transaction Digest
```
7cdaqZgZKedcKrUuwkfNjfNz6Q5TVyzQQvdoCGQsm3pq
```

## Explorer Links

**Package:** https://suiscan.xyz/devnet/object/0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2

**Transaction:** https://suiscan.xyz/devnet/tx/7cdaqZgZKedcKrUuwkfNjfNz6Q5TVyzQQvdoCGQsm3pq

## Features

- ✅ Multi-dimensional ratings (Security, Usability, Performance, Documentation, Innovation)
- ✅ One review per user per dApp
- ✅ Immutable reviews
- ✅ Upvote/downvote system
- ✅ Vote changing capability
- ✅ Duplicate review prevention
- ✅ 500 character review text limit
- ✅ Shared registry for tracking all reviews
- ✅ Events for indexing

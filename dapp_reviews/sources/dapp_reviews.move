module dapp_reviews::dapp_reviews;

use sui::table::{Self, Table};
use std::string::String;
use sui::event;

// ===== Error Codes =====
const EReviewTooLong: u64 = 0;
const EInvalidRating: u64 = 1;
const EAlreadyReviewed: u64 = 2;
const EAlreadyVoted: u64 = 3;
const ENotVoted: u64 = 4;

// ===== Constants =====
const MAX_REVIEW_LENGTH: u64 = 500;
const MIN_RATING: u8 = 1;
const MAX_RATING: u8 = 5;

// ===== Structs =====

/// Immutable review object
public struct Review has key, store {
    id: UID,
    target_package: address,
    reviewer: address,
    timestamp: u64,
    // Multi-dimensional ratings (1-5 each)
    rating_security: u8,
    rating_usability: u8,
    rating_performance: u8,
    rating_documentation: u8,
    rating_innovation: u8,
    review_text: String,
    upvotes: u64,
    downvotes: u64,
}

/// Shared registry tracking all reviews
public struct ReviewRegistry has key {
    id: UID,
    // Maps package address -> vector of review object IDs
    reviews_by_package: Table<address, vector<ID>>,
    // Maps reviewer address -> vector of reviewed package addresses
    reviews_by_user: Table<address, vector<address>>,
    total_reviews: u64,
}

/// Tracks votes to prevent double voting
public struct VoteRecord has key {
    id: UID,
    // Outer table: review_id -> inner table
    // Inner table: voter_address -> vote_type (true=upvote, false=downvote)
    votes: Table<ID, Table<address, bool>>,
}

// ===== Events =====

public struct ReviewCreated has copy, drop {
    review_id: ID,
    target_package: address,
    reviewer: address,
    timestamp: u64,
}

public struct VoteCast has copy, drop {
    review_id: ID,
    voter: address,
    is_upvote: bool,
}

public struct VoteChanged has copy, drop {
    review_id: ID,
    voter: address,
    new_vote_is_upvote: bool,
}

// ===== Initialization =====

fun init(ctx: &mut TxContext) {
    // Create and share the review registry
    let registry = ReviewRegistry {
        id: object::new(ctx),
        reviews_by_package: table::new(ctx),
        reviews_by_user: table::new(ctx),
        total_reviews: 0,
    };
    transfer::share_object(registry);

    // Create and share the vote record
    let vote_record = VoteRecord {
        id: object::new(ctx),
        votes: table::new(ctx),
    };
    transfer::share_object(vote_record);
}

// ===== Core Functions =====

/// Create a new review (one per user per dApp)
public entry fun create_review(
    registry: &mut ReviewRegistry,
    target_package: address,
    rating_security: u8,
    rating_usability: u8,
    rating_performance: u8,
    rating_documentation: u8,
    rating_innovation: u8,
    review_text: String,
    clock: &sui::clock::Clock,
    ctx: &mut TxContext
) {
    let reviewer = tx_context::sender(ctx);

    // Validate ratings
    assert!(rating_security >= MIN_RATING && rating_security <= MAX_RATING, EInvalidRating);
    assert!(rating_usability >= MIN_RATING && rating_usability <= MAX_RATING, EInvalidRating);
    assert!(rating_performance >= MIN_RATING && rating_performance <= MAX_RATING, EInvalidRating);
    assert!(rating_documentation >= MIN_RATING && rating_documentation <= MAX_RATING, EInvalidRating);
    assert!(rating_innovation >= MIN_RATING && rating_innovation <= MAX_RATING, EInvalidRating);

    // Validate review text length
    assert!(review_text.length() <= MAX_REVIEW_LENGTH, EReviewTooLong);

    // Check if user has already reviewed this package
    if (table::contains(&registry.reviews_by_user, reviewer)) {
        let reviewed_packages = table::borrow(&registry.reviews_by_user, reviewer);
        assert!(!vector::contains(reviewed_packages, &target_package), EAlreadyReviewed);
    };

    // Create review object
    let review_id = object::new(ctx);
    let review_id_copy = object::uid_to_inner(&review_id);

    let review = Review {
        id: review_id,
        target_package,
        reviewer,
        timestamp: sui::clock::timestamp_ms(clock),
        rating_security,
        rating_usability,
        rating_performance,
        rating_documentation,
        rating_innovation,
        review_text,
        upvotes: 0,
        downvotes: 0,
    };

    // Update registry: add to reviews_by_package
    if (!table::contains(&registry.reviews_by_package, target_package)) {
        table::add(&mut registry.reviews_by_package, target_package, vector::empty());
    };
    let package_reviews = table::borrow_mut(&mut registry.reviews_by_package, target_package);
    vector::push_back(package_reviews, review_id_copy);

    // Update registry: add to reviews_by_user
    if (!table::contains(&registry.reviews_by_user, reviewer)) {
        table::add(&mut registry.reviews_by_user, reviewer, vector::empty());
    };
    let user_reviews = table::borrow_mut(&mut registry.reviews_by_user, reviewer);
    vector::push_back(user_reviews, target_package);

    // Increment total reviews
    registry.total_reviews = registry.total_reviews + 1;

    // Emit event
    event::emit(ReviewCreated {
        review_id: review_id_copy,
        target_package,
        reviewer,
        timestamp: sui::clock::timestamp_ms(clock),
    });

    // Transfer review to reviewer (they own it but it's immutable)
    transfer::public_transfer(review, reviewer);
}

/// Upvote a review
public entry fun upvote_review(
    review: &mut Review,
    vote_record: &mut VoteRecord,
    ctx: &mut TxContext
) {
    let voter = tx_context::sender(ctx);
    let review_id = object::uid_to_inner(&review.id);

    // Initialize vote table for this review if it doesn't exist
    if (!table::contains(&vote_record.votes, review_id)) {
        table::add(&mut vote_record.votes, review_id, table::new(ctx));
    };

    let review_votes = table::borrow_mut(&mut vote_record.votes, review_id);

    // Check if user has already voted
    assert!(!table::contains(review_votes, voter), EAlreadyVoted);

    // Record vote
    table::add(review_votes, voter, true);

    // Increment upvote counter
    review.upvotes = review.upvotes + 1;

    // Emit event
    event::emit(VoteCast {
        review_id,
        voter,
        is_upvote: true,
    });
}

/// Downvote a review
public entry fun downvote_review(
    review: &mut Review,
    vote_record: &mut VoteRecord,
    ctx: &mut TxContext
) {
    let voter = tx_context::sender(ctx);
    let review_id = object::uid_to_inner(&review.id);

    // Initialize vote table for this review if it doesn't exist
    if (!table::contains(&vote_record.votes, review_id)) {
        table::add(&mut vote_record.votes, review_id, table::new(ctx));
    };

    let review_votes = table::borrow_mut(&mut vote_record.votes, review_id);

    // Check if user has already voted
    assert!(!table::contains(review_votes, voter), EAlreadyVoted);

    // Record vote
    table::add(review_votes, voter, false);

    // Increment downvote counter
    review.downvotes = review.downvotes + 1;

    // Emit event
    event::emit(VoteCast {
        review_id,
        voter,
        is_upvote: false,
    });
}

/// Change an existing vote
public entry fun change_vote(
    review: &mut Review,
    vote_record: &mut VoteRecord,
    new_vote_is_upvote: bool,
    ctx: &mut TxContext
) {
    let voter = tx_context::sender(ctx);
    let review_id = object::uid_to_inner(&review.id);

    // Check if vote record exists for this review
    assert!(table::contains(&vote_record.votes, review_id), ENotVoted);

    let review_votes = table::borrow_mut(&mut vote_record.votes, review_id);

    // Check if user has voted
    assert!(table::contains(review_votes, voter), ENotVoted);

    // Get current vote
    let current_vote = table::borrow(review_votes, voter);
    let was_upvote = *current_vote;

    // Update counters if vote changed
    if (was_upvote != new_vote_is_upvote) {
        if (was_upvote) {
            // Was upvote, now downvote
            review.upvotes = review.upvotes - 1;
            review.downvotes = review.downvotes + 1;
        } else {
            // Was downvote, now upvote
            review.downvotes = review.downvotes - 1;
            review.upvotes = review.upvotes + 1;
        };

        // Update vote record
        *table::borrow_mut(review_votes, voter) = new_vote_is_upvote;

        // Emit event
        event::emit(VoteChanged {
            review_id,
            voter,
            new_vote_is_upvote,
        });
    };
}

// ===== View Functions =====

/// Check if a user has already reviewed a package
public fun has_user_reviewed(
    registry: &ReviewRegistry,
    user: address,
    package_id: address
): bool {
    if (!table::contains(&registry.reviews_by_user, user)) {
        return false
    };

    let reviewed_packages = table::borrow(&registry.reviews_by_user, user);
    vector::contains(reviewed_packages, &package_id)
}

/// Get total number of reviews
public fun get_total_reviews(registry: &ReviewRegistry): u64 {
    registry.total_reviews
}

/// Get review details (public accessors)
public fun get_review_target(review: &Review): address {
    review.target_package
}

public fun get_review_reviewer(review: &Review): address {
    review.reviewer
}

public fun get_review_timestamp(review: &Review): u64 {
    review.timestamp
}

public fun get_review_ratings(review: &Review): (u8, u8, u8, u8, u8) {
    (
        review.rating_security,
        review.rating_usability,
        review.rating_performance,
        review.rating_documentation,
        review.rating_innovation
    )
}

public fun get_review_text(review: &Review): String {
    review.review_text
}

public fun get_review_votes(review: &Review): (u64, u64) {
    (review.upvotes, review.downvotes)
}

/// Calculate composite score with weighted average
/// Returns score as u64 (multiplied by 100 to avoid decimals)
/// e.g., 425 means 4.25 out of 5
public fun calculate_composite_score(review: &Review): u64 {
    // Weights (must sum to 100):
    // Security: 30%, Usability: 25%, Performance: 20%, Documentation: 15%, Innovation: 10%
    let weighted_sum =
        (review.rating_security as u64) * 30 +
        (review.rating_usability as u64) * 25 +
        (review.rating_performance as u64) * 20 +
        (review.rating_documentation as u64) * 15 +
        (review.rating_innovation as u64) * 10;

    // Return score (out of 500, where 500 = 5.00)
    weighted_sum
}

// ===== Test Functions =====
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}

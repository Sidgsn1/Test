// package com.prrp.repository;

// import com.prrp.entity.ModerationStatus;
// import com.prrp.entity.Review;
// import org.springframework.data.domain.Sort;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface ReviewRepository extends JpaRepository<Review, Long> {

//     List<Review> findByProductIdAndModerationStatus(Long productId, ModerationStatus status, Sort sort);

//     List<Review> findByUserId(Long userId, Sort sort);

//     List<Review> findByProductSellerId(Long sellerId, Sort sort);

//     List<Review> findByModerationStatus(ModerationStatus status, Sort sort);

//     boolean existsByUserIdAndProductId(Long userId, Long productId);

//     Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

//     @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.moderationStatus = 'APPROVED'")
//     long countApprovedByProductId(@Param("productId") Long productId);

//     @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.moderationStatus = 'APPROVED'")
//     Double findAverageRatingByProductId(@Param("productId") Long productId);

//     @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.moderationStatus = 'APPROVED' GROUP BY r.rating")
//     List<Object[]> getRatingBreakdownByProductId(@Param("productId") Long productId);
// }



package com.prrp.repository;

import com.prrp.entity.ModerationStatus;
import com.prrp.entity.Review;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdAndModerationStatus(
            Long productId, ModerationStatus status, Sort sort);

    List<Review> findByUserId(Long userId, Sort sort);

    List<Review> findByProductSellerId(Long sellerId, Sort sort);

    List<Review> findByModerationStatus(ModerationStatus status, Sort sort);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    // Product-wise approved review count
    @Query("""
        SELECT COUNT(r)
        FROM Review r
        WHERE r.product.id = :productId
        AND r.moderationStatus = 'APPROVED'
    """)
    long countApprovedByProductId(@Param("productId") Long productId);

    // Product-wise average rating
    @Query("""
        SELECT AVG(r.rating)
        FROM Review r
        WHERE r.product.id = :productId
        AND r.moderationStatus = 'APPROVED'
    """)
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    // Product-wise rating distribution
    @Query("""
        SELECT r.rating, COUNT(r)
        FROM Review r
        WHERE r.product.id = :productId
        AND r.moderationStatus = 'APPROVED'
        GROUP BY r.rating
    """)
    List<Object[]> getRatingBreakdownByProductId(
            @Param("productId") Long productId);

    // Seller leaderboard statistics
    // Only active sellers and approved reviews are considered.
    @Query("""
        SELECT
            s.id,
            s.fullName,
            AVG(r.rating),
            COUNT(r),
            SUM(CASE WHEN r.rating >= 4 THEN 1 ELSE 0 END)
        FROM Review r
        JOIN r.product p
        JOIN p.seller s
        WHERE r.moderationStatus = 'APPROVED'
        AND s.isActive = true
        AND s.role = com.prrp.entity.Role.ROLE_SELLER
        GROUP BY s.id, s.fullName
    """)
    List<Object[]> findActiveSellerLeaderboardStats();

    // Platform-wide average rating for Bayesian ranking
    @Query("""
        SELECT AVG(r.rating)
        FROM Review r
        JOIN r.product p
        JOIN p.seller s
        WHERE r.moderationStatus = 'APPROVED'
        AND s.isActive = true
        AND s.role = com.prrp.entity.Role.ROLE_SELLER
    """)
    Double findPlatformAverageApprovedRating();
}


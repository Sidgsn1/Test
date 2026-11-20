
package com.prrp.repository;

import com.prrp.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySellerId(Long sellerId);

    // Existing paginated product search
    @Query("""
        SELECT p FROM Product p
        WHERE p.isAvailable = true
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (
            :keyword IS NULL
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    Page<Product> searchProducts(
        @Param("categoryId") Long categoryId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    // Paginated search with minimum approved rating
    @Query("""
        SELECT p FROM Product p
        WHERE p.isAvailable = true
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (
            :keyword IS NULL
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (
            :minRating IS NULL
            OR (
                SELECT AVG(r.rating)
                FROM Review r
                WHERE r.product.id = p.id
                AND r.moderationStatus =
                    com.prrp.entity.ModerationStatus.APPROVED
            ) >= :minRating
        )
    """)
    Page<Product> searchProductsWithMinRating(
        @Param("categoryId") Long categoryId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("keyword") String keyword,
        @Param("minRating") BigDecimal minRating,
        Pageable pageable
    );

    // Fetch all matching products before global sorting and pagination
    @Query("""
        SELECT p FROM Product p
        WHERE p.isAvailable = true
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:minPrice IS NULL OR p.price >= :minPrice)
        AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        AND (
            :keyword IS NULL
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (
            :minRating IS NULL
            OR (
                SELECT AVG(r.rating)
                FROM Review r
                WHERE r.product.id = p.id
                AND r.moderationStatus =
                    com.prrp.entity.ModerationStatus.APPROVED
            ) >= :minRating
        )
    """)
    List<Product> findFilteredProducts(
        @Param("categoryId") Long categoryId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("keyword") String keyword,
        @Param("minRating") BigDecimal minRating
    );

    // Fetch available products in a category for ranking
    @Query("""
        SELECT p FROM Product p
        WHERE p.isAvailable = true
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
    """)
    List<Product> findAvailableProductsForRanking(
        @Param("categoryId") Long categoryId
    );
}

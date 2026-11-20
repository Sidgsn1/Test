
package com.prrp.service.impl;

import com.prrp.dto.SellerAnalyticsResponse;
import com.prrp.dto.SellerDashboardResponse;
import com.prrp.dto.SellerLeaderboardResponse;
import com.prrp.dto.SellerProfileResponse;
import com.prrp.dto.SellerProfileUpdateRequest;
import com.prrp.dto.SellerResponse;
import com.prrp.entity.ModerationStatus;
import com.prrp.entity.Product;
import com.prrp.entity.Review;
import com.prrp.entity.Role;
import com.prrp.entity.User;
import com.prrp.exception.ResourceNotFoundException;
import com.prrp.repository.ProductRepository;
import com.prrp.repository.ReviewRepository;
import com.prrp.repository.UserRepository;
import com.prrp.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    private static final double MIN_REVIEW_THRESHOLD = 5.0;

    @Override
    @Transactional(readOnly = true)
    public SellerDashboardResponse getSellerDashboard(Long sellerId) {

        User seller = getSellerOrThrow(sellerId);

        long totalProducts =
                productRepository.findBySellerId(sellerId).size();

        List<Review> reviews =
                reviewRepository.findByProductSellerId(sellerId, Sort.unsorted());

        List<Review> approved = reviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED)
                .toList();

        long pendingCount = reviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.PENDING)
                .count();

        long rejectedCount = reviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.REJECTED)
                .count();

        double avgRating = approved.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> distribution = createDistribution(approved);

        return SellerDashboardResponse.builder()
                .sellerId(seller.getId())
                .sellerName(seller.getFullName())
                .totalProducts(totalProducts)
                .totalApprovedReviews((long) approved.size())
                .totalPendingReviews(pendingCount)
                .totalRejectedReviews(rejectedCount)
                .averageRating(round(avgRating, 1))
                .ratingDistribution(distribution)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public SellerAnalyticsResponse getSellerRatings(Long sellerId) {

        getSellerOrThrow(sellerId);

        List<Product> products =
                productRepository.findBySellerId(sellerId);

        List<Review> sellerReviews =
                reviewRepository.findByProductSellerId(
                        sellerId,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                );

        List<Review> approved = sellerReviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED)
                .toList();

        long approvedCount = approved.size();

        long pendingCount = sellerReviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.PENDING)
                .count();

        long rejectedCount = sellerReviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.REJECTED)
                .count();

        double avgRating = approved.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> distribution = createDistribution(approved);

        long positiveCount = distribution.get(5) + distribution.get(4);

        double positivePercentage = approvedCount > 0
                ? (double) positiveCount / approvedCount * 100.0
                : 0.0;

        Double platformAverage =
                reviewRepository.findPlatformAverageApprovedRating();

        double platformRating =
                platformAverage != null ? platformAverage : 0.0;

        List<SellerAnalyticsResponse.ProductPerformanceDto> performanceList =
                products.stream()
                        .map(product -> {

                            Double productAverage =
                                    reviewRepository.findAverageRatingByProductId(
                                            product.getId()
                                    );

                            long reviewCount =
                                    reviewRepository.countApprovedByProductId(
                                            product.getId()
                                    );

                            double rating =
                                    productAverage != null ? productAverage : 0.0;

                            String thumbnail =
                                    product.getImages() != null
                                            && !product.getImages().isEmpty()
                                            ? product.getImages().get(0).getImageUrl()
                                            : null;

                            return SellerAnalyticsResponse.ProductPerformanceDto.builder()
                                    .id(product.getId())
                                    .name(product.getName())
                                    .averageRating(round(rating, 1))
                                    .reviewCount(reviewCount)
                                    .price(product.getPrice())
                                    .thumbnail(thumbnail)
                                    .build();
                        })
                        .sorted((a, b) -> Double.compare(
                                calculateBayesianScore(
                                        b.getAverageRating(),
                                        b.getReviewCount(),
                                        platformRating
                                ),
                                calculateBayesianScore(
                                        a.getAverageRating(),
                                        a.getReviewCount(),
                                        platformRating
                                )
                        ))
                        .collect(Collectors.toList());

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy");

        List<SellerAnalyticsResponse.SellerFeedbackDto> recentFeedback =
                sellerReviews.stream()
                        .limit(10)
                        .map(r ->
                                SellerAnalyticsResponse.SellerFeedbackDto.builder()
                                        .id(r.getId())
                                        .productName(r.getProduct().getName())
                                        .buyerName(r.getUser().getFullName())
                                        .rating(r.getRating())
                                        .title(r.getTitle())
                                        .comment(r.getComment())
                                        .date(r.getCreatedAt() != null
                                                ? r.getCreatedAt().format(formatter)
                                                : "Recently")
                                        .moderationStatus(r.getModerationStatus().name())
                                        .build()
                        )
                        .collect(Collectors.toList());

        SellerAnalyticsResponse.SellerAspectBreakdown breakdown =
                SellerAnalyticsResponse.SellerAspectBreakdown.builder()
                        .itemAsDescribed(round(avgRating, 1))
                        .shippingSpeed(null)
                        .packagingQuality(null)
                        .customerCommunication(null)
                        .dispatchTime(null)
                        .build();

        return SellerAnalyticsResponse.builder()
                .overallRating(round(avgRating, 1))
                .totalSellerReviews(approvedCount)
                .positivePercentage(round(positivePercentage, 1))
                .totalProducts((long) products.size())
                .approvedReviews(approvedCount)
                .pendingReviews(pendingCount)
                .rejectedReviews(rejectedCount)
                .distribution(distribution)
                .productPerformance(performanceList)
                .recentFeedback(recentFeedback)
                .breakdown(breakdown)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerResponse> getAllSellerResponses() {

        return userRepository.findByRoleAndIsActiveTrue(Role.ROLE_SELLER)
                .stream()
                .map(seller -> SellerResponse.builder()
                        .id(seller.getId())
                        .fullName(seller.getFullName())
                        .city(seller.getCity())
                        .state(seller.getState())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SellerLeaderboardResponse> getSellerLeaderboard() {

        List<User> activeSellers =
                userRepository.findByRoleAndIsActiveTrue(Role.ROLE_SELLER);

        List<Object[]> statistics =
                reviewRepository.findActiveSellerLeaderboardStats();

        Double platformAverage =
                reviewRepository.findPlatformAverageApprovedRating();

        double globalAverage =
                platformAverage != null ? platformAverage : 0.0;

        Map<Long, Object[]> statsMap = new HashMap<>();

        for (Object[] row : statistics) {
            Long sellerId = ((Number) row[0]).longValue();
            statsMap.put(sellerId, row);
        }

        List<SellerLeaderboardResponse> leaderboard =
                activeSellers.stream()
                        .map(seller -> {

                            Object[] stats = statsMap.get(seller.getId());

                            double averageRating = 0.0;
                            long reviewCount = 0;
                            long positiveCount = 0;

                            if (stats != null) {
                                averageRating = stats[2] != null
                                        ? ((Number) stats[2]).doubleValue()
                                        : 0.0;

                                reviewCount = stats[3] != null
                                        ? ((Number) stats[3]).longValue()
                                        : 0L;

                                positiveCount = stats[4] != null
                                        ? ((Number) stats[4]).longValue()
                                        : 0L;
                            }

                            double positivePercentage = reviewCount > 0
                                    ? (double) positiveCount / reviewCount * 100.0
                                    : 0.0;

                            double rankingScore = calculateBayesianScore(
                                    averageRating,
                                    reviewCount,
                                    globalAverage
                            );

                            return SellerLeaderboardResponse.builder()
                                    .sellerId(seller.getId())
                                    .sellerName(seller.getFullName())
                                    .averageRating(round(averageRating, 1))
                                    .totalApprovedReviews(reviewCount)
                                    .positivePercentage(round(positivePercentage, 1))
                                    .rankingScore(round(rankingScore, 3))
                                    .build();
                        })
                        .sorted(
                                Comparator.comparing(
                                        SellerLeaderboardResponse::getRankingScore,
                                        Comparator.nullsLast(Comparator.reverseOrder())
                                )
                                .thenComparing(
                                        SellerLeaderboardResponse::getTotalApprovedReviews,
                                        Comparator.nullsLast(Comparator.reverseOrder())
                                )
                                .thenComparing(
                                        SellerLeaderboardResponse::getAverageRating,
                                        Comparator.nullsLast(Comparator.reverseOrder())
                                )
                                .thenComparing(
                                        SellerLeaderboardResponse::getSellerId
                                )
                        )
                        .collect(Collectors.toList());

        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllSellers() {
        return userRepository.findByRole(Role.ROLE_SELLER);
    }

    // Fetch seller profile
    @Override
    @Transactional(readOnly = true)
    public SellerProfileResponse getSellerProfile(Long sellerId) {

        User seller = getSellerOrThrow(sellerId);

        return mapToSellerProfileResponse(seller);
    }

    // Update seller profile
    @Override
    @Transactional
    public SellerProfileResponse updateSellerProfile(
            Long sellerId,
            SellerProfileUpdateRequest request
    ) {

        User seller = getSellerOrThrow(sellerId);

        seller.setFullName(request.getFullName().trim());

        seller.setPhoneNumber(
                request.getPhoneNumber() != null
                        ? request.getPhoneNumber().trim()
                        : null
        );

        seller.setCity(
                request.getCity() != null
                        ? request.getCity().trim()
                        : null
        );

        seller.setState(
                request.getState() != null
                        ? request.getState().trim()
                        : null
        );

        User updatedSeller = userRepository.save(seller);

        return mapToSellerProfileResponse(updatedSeller);
    }

    private SellerProfileResponse mapToSellerProfileResponse(User seller) {

        return SellerProfileResponse.builder()
                .id(seller.getId())
                .fullName(seller.getFullName())
                .email(seller.getEmail())
                .phoneNumber(seller.getPhoneNumber())
                .city(seller.getCity())
                .state(seller.getState())
                .isActive(seller.getIsActive())
                .createdAt(seller.getCreatedAt())
                .build();
    }

    private User getSellerOrThrow(Long sellerId) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller not found with id: " + sellerId
                        )
                );

        if (seller.getRole() != Role.ROLE_SELLER) {
            throw new ResourceNotFoundException(
                    "Seller not found with id: " + sellerId
            );
        }

        return seller;
    }

    private Map<Integer, Long> createDistribution(List<Review> approved) {

        Map<Integer, Long> distribution = new LinkedHashMap<>();

        for (int i = 5; i >= 1; i--) {
            distribution.put(i, 0L);
        }

        approved.forEach(review ->
                distribution.merge(review.getRating(), 1L, Long::sum)
        );

        return distribution;
    }

    private double calculateBayesianScore(
            double averageRating,
            long reviewCount,
            double platformAverage
    ) {

        if (reviewCount == 0) {
            return platformAverage;
        }

        return (
                (reviewCount / (reviewCount + MIN_REVIEW_THRESHOLD))
                        * averageRating
        )
                +
                (
                        (MIN_REVIEW_THRESHOLD /
                                (reviewCount + MIN_REVIEW_THRESHOLD))
                                * platformAverage
                );
    }

    private double round(double value, int places) {

        double multiplier = Math.pow(10, places);

        return Math.round(value * multiplier) / multiplier;
    }
}

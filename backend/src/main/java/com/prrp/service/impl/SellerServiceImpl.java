package com.prrp.service.impl;

import com.prrp.dto.SellerAnalyticsResponse;
import com.prrp.dto.SellerDashboardResponse;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public SellerDashboardResponse getSellerDashboard(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));

        long totalProducts = productRepository.findBySellerId(sellerId).size();
        List<Review> sellerReviews = reviewRepository.findByProductSellerId(sellerId, Sort.unsorted());

        long approvedCount = sellerReviews.stream().filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED).count();
        long pendingCount = sellerReviews.stream().filter(r -> r.getModerationStatus() == ModerationStatus.PENDING).count();
        long rejectedCount = sellerReviews.stream().filter(r -> r.getModerationStatus() == ModerationStatus.REJECTED).count();

        double avgRating = sellerReviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED)
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int i = 5; i >= 1; i--) {
            distribution.put(i, 0L);
        }
        sellerReviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED)
                .forEach(r -> distribution.put(r.getRating(), distribution.get(r.getRating()) + 1));

        return SellerDashboardResponse.builder()
                .sellerId(seller.getId())
                .sellerName(seller.getFullName())
                .totalProducts(totalProducts)
                .totalApprovedReviews(approvedCount)
                .totalPendingReviews(pendingCount)
                .totalRejectedReviews(rejectedCount)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .ratingDistribution(distribution)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public SellerAnalyticsResponse getSellerRatings(Long sellerId) {
        List<Product> products = productRepository.findBySellerId(sellerId);
        List<Review> sellerReviews = reviewRepository.findByProductSellerId(sellerId, Sort.unsorted());

        long approvedCount = sellerReviews.stream().filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED).count();
        long pendingCount = sellerReviews.stream().filter(r -> r.getModerationStatus() == ModerationStatus.PENDING).count();
        long rejectedCount = sellerReviews.stream().filter(r -> r.getModerationStatus() == ModerationStatus.REJECTED).count();

        double avgRating = sellerReviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED)
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int i = 5; i >= 1; i--) {
            distribution.put(i, 0L);
        }
        sellerReviews.stream()
                .filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED)
                .forEach(r -> distribution.put(r.getRating(), distribution.get(r.getRating()) + 1));

        double roundedAvg = Math.round(avgRating * 10.0) / 10.0;
        long posCount = distribution.get(5) + distribution.get(4);
        double positivePct = approvedCount > 0 ? Math.round(((double) posCount / approvedCount) * 1000.0) / 10.0 : 0.0;

        List<SellerAnalyticsResponse.ProductPerformanceDto> performanceList = products.stream()
                .map(p -> {
                    Double pAvg = reviewRepository.findAverageRatingByProductId(p.getId());
                    long pCount = reviewRepository.countApprovedByProductId(p.getId());
                    String thumb = p.getImages() != null && !p.getImages().isEmpty()
                            ? p.getImages().get(0).getImageUrl()
                            : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

                    return SellerAnalyticsResponse.ProductPerformanceDto.builder()
                            .id(p.getId())
                            .name(p.getName())
                            .averageRating(pAvg != null ? Math.round(pAvg * 10.0) / 10.0 : 0.0)
                            .reviewCount(pCount)
                            .price(p.getPrice())
                            .thumbnail(thumb)
                            .build();
                })
                .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
                .collect(Collectors.toList());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        List<SellerAnalyticsResponse.SellerFeedbackDto> recentFeedback = sellerReviews.stream()
                .limit(10)
                .map(r -> SellerAnalyticsResponse.SellerFeedbackDto.builder()
                        .id(r.getId())
                        .productName(r.getProduct().getName())
                        .buyerName(r.getUser().getFullName())
                        .rating(r.getRating())
                        .title(r.getTitle())
                        .comment(r.getComment())
                        .date(r.getCreatedAt() != null ? r.getCreatedAt().format(formatter) : "Recently")
                        .moderationStatus(r.getModerationStatus().name())
                        .build())
                .collect(Collectors.toList());

        SellerAnalyticsResponse.SellerAspectBreakdown breakdown = SellerAnalyticsResponse.SellerAspectBreakdown.builder()
                .itemAsDescribed(roundedAvg)
                .shippingSpeed(Math.min(5.0, Math.round((roundedAvg + 0.1) * 10.0) / 10.0))
                .packagingQuality(Math.min(5.0, Math.round((roundedAvg + 0.1) * 10.0) / 10.0))
                .customerCommunication(Math.max(4.0, Math.round((roundedAvg - 0.1) * 10.0) / 10.0))
                .dispatchTime(4.8)
                .build();

        return SellerAnalyticsResponse.builder()
                .overallRating(roundedAvg)
                .totalSellerReviews(approvedCount)
                .positivePercentage(positivePct)
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
    public List<User> getAllSellers() {
        return userRepository.findByRole(Role.ROLE_SELLER);
    }
}

package com.prrp.service.impl;

import com.prrp.dto.RatingBreakdownDto;
import com.prrp.dto.SellerDashboardResponse;
import com.prrp.entity.ModerationStatus;
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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
    public RatingBreakdownDto getSellerRatings(Long sellerId) {
        List<Review> sellerReviews = reviewRepository.findByProductSellerId(sellerId, Sort.unsorted());
        long approvedCount = sellerReviews.stream().filter(r -> r.getModerationStatus() == ModerationStatus.APPROVED).count();

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

        return RatingBreakdownDto.builder()
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .totalReviews(approvedCount)
                .distribution(distribution)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllSellers() {
        return userRepository.findByRole(Role.ROLE_SELLER);
    }
}

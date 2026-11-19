package com.prrp.service.impl;

import com.prrp.dto.ModerationActionRequest;
import com.prrp.dto.ReviewCreateRequest;
import com.prrp.dto.ReviewResponse;
import com.prrp.entity.*;
import com.prrp.exception.BadRequestException;
import com.prrp.exception.ResourceNotFoundException;
import com.prrp.exception.UnauthorizedException;
import com.prrp.repository.*;
import com.prrp.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewModerationLogRepository moderationLogRepository;

    @Override
    @Transactional
    public ReviewResponse submitReview(Long userId, ReviewCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new BadRequestException("You have already submitted a review for this product.");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .moderationStatus(ModerationStatus.PENDING)
                .build();

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            final Review finalReview = review;
            List<ReviewImage> images = request.getImageUrls().stream()
                    .map(url -> ReviewImage.builder().review(finalReview).imageUrl(url).build())
                    .collect(Collectors.toList());
            review.setImages(images);
        }

        Review savedReview = reviewRepository.save(review);
        return mapToReviewResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId, Integer ratingFilter, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("highest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("lowest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "rating");
        }

        List<Review> reviews = reviewRepository.findByProductIdAndModerationStatus(productId, ModerationStatus.APPROVED, sort);

        if (ratingFilter != null && ratingFilter > 0) {
            reviews = reviews.stream()
                    .filter(r -> r.getRating().equals(ratingFilter))
                    .collect(Collectors.toList());
        }

        return reviews.stream().map(this::mapToReviewResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getUserReviews(Long userId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return reviewRepository.findByUserId(userId, sort).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews(ModerationStatus status) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        List<Review> reviews = (status != null)
                ? reviewRepository.findByModerationStatus(status, sort)
                : reviewRepository.findAll(sort);

        return reviews.stream().map(this::mapToReviewResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getSellerReviews(Long sellerId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return reviewRepository.findByProductSellerId(sellerId, sort).stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewResponse moderateReview(Long reviewId, Long adminId, ModerationActionRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with id: " + adminId));

        review.setModerationStatus(request.getAction());
        review = reviewRepository.save(review);

        ReviewModerationLog log = ReviewModerationLog.builder()
                .review(review)
                .moderatedBy(admin)
                .action(request.getAction())
                .moderationRemarks(request.getRemarks())
                .build();
        moderationLogRepository.save(log);

        return mapToReviewResponse(review);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long userId, ReviewCreateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!review.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only modify your own reviews.");
        }

        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setModerationStatus(ModerationStatus.PENDING);

        review = reviewRepository.save(review);
        return mapToReviewResponse(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long userId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!isAdmin && !review.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own reviews.");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        String thumbnail = null;
        if (review.getProduct().getImages() != null && !review.getProduct().getImages().isEmpty()) {
            thumbnail = review.getProduct().getImages().get(0).getImageUrl();
        }

        List<String> imageUrls = new ArrayList<>();
        if (review.getImages() != null) {
            imageUrls = review.getImages().stream().map(ReviewImage::getImageUrl).collect(Collectors.toList());
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .productThumbnail(thumbnail)
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .moderationStatus(review.getModerationStatus())
                .images(imageUrls)
                .createdAt(review.getCreatedAt())
                .build();
    }
}

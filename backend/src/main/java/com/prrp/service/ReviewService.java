package com.prrp.service;

import com.prrp.dto.ModerationActionRequest;
import com.prrp.dto.ReviewCreateRequest;
import com.prrp.dto.ReviewResponse;
import com.prrp.entity.ModerationStatus;

import java.util.List;

public interface ReviewService {
    ReviewResponse submitReview(Long userId, ReviewCreateRequest request);
    List<ReviewResponse> getReviewsByProduct(Long productId, Integer ratingFilter, String sortBy);
    List<ReviewResponse> getUserReviews(Long userId);
    List<ReviewResponse> getAllReviews(ModerationStatus status);
    List<ReviewResponse> getSellerReviews(Long sellerId);
    ReviewResponse moderateReview(Long reviewId, Long adminId, ModerationActionRequest request);
    ReviewResponse updateReview(Long reviewId, Long userId, ReviewCreateRequest request);
    void deleteReview(Long reviewId, Long userId, boolean isAdmin);
}

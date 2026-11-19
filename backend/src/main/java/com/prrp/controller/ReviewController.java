package com.prrp.controller;

import com.prrp.dto.ModerationActionRequest;
import com.prrp.dto.ReviewCreateRequest;
import com.prrp.dto.ReviewResponse;
import com.prrp.entity.ModerationStatus;
import com.prrp.security.UserPrincipal;
import com.prrp.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(required = false) Integer ratingFilter,
            @RequestParam(defaultValue = "newest") String sortBy
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId, ratingFilter, sortBy));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> submitReview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ReviewCreateRequest request
    ) {
        return new ResponseEntity<>(reviewService.submitReview(userPrincipal.getId(), request), HttpStatus.CREATED);
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ReviewCreateRequest request
    ) {
        return ResponseEntity.ok(reviewService.updateReview(id, userPrincipal.getId(), request));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        reviewService.deleteReview(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }

    @GetMapping("/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewResponse>> getAllReviews(
            @RequestParam(required = false) ModerationStatus status
    ) {
        return ResponseEntity.ok(reviewService.getAllReviews(status));
    }

    @PatchMapping("/admin/reviews/{id}/action")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewResponse> moderateReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ModerationActionRequest request
    ) {
        return ResponseEntity.ok(reviewService.moderateReview(id, userPrincipal.getId(), request));
    }
}

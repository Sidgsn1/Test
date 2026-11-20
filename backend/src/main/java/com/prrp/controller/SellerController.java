
package com.prrp.controller;

import com.prrp.dto.ProductResponse;
import com.prrp.dto.ReviewResponse;
import com.prrp.dto.SellerAnalyticsResponse;
import com.prrp.dto.SellerDashboardResponse;
import com.prrp.dto.SellerLeaderboardResponse;
import com.prrp.dto.SellerProfileResponse;
import com.prrp.dto.SellerProfileUpdateRequest;
import com.prrp.dto.SellerResponse;
import com.prrp.security.UserPrincipal;
import com.prrp.service.ProductService;
import com.prrp.service.ReviewService;
import com.prrp.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sellers")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final ProductService productService;
    private final ReviewService reviewService;

    // Public seller listing
    @GetMapping
    public ResponseEntity<List<SellerResponse>> getAllSellers() {
        return ResponseEntity.ok(
                sellerService.getAllSellerResponses()
        );
    }

    // Public seller leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<List<SellerLeaderboardResponse>> getSellerLeaderboard() {
        return ResponseEntity.ok(
                sellerService.getSellerLeaderboard()
        );
    }

    // Private: seller owner or ADMIN
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<SellerDashboardResponse> getSellerDashboard(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        verifySellerAccess(id, userPrincipal);

        return ResponseEntity.ok(
                sellerService.getSellerDashboard(id)
        );
    }

    // Private: seller owner or ADMIN
    @GetMapping("/{id}/ratings")
    public ResponseEntity<SellerAnalyticsResponse> getSellerRatings(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        verifySellerAccess(id, userPrincipal);

        return ResponseEntity.ok(
                sellerService.getSellerRatings(id)
        );
    }

    // Private: seller owner or ADMIN - get profile
    @GetMapping("/{id}/profile")
    public ResponseEntity<SellerProfileResponse> getSellerProfile(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        verifySellerAccess(id, userPrincipal);

        return ResponseEntity.ok(
                sellerService.getSellerProfile(id)
        );
    }

    // Private: seller owner or ADMIN - update profile
    @PutMapping("/{id}/profile")
    public ResponseEntity<SellerProfileResponse> updateSellerProfile(
            @PathVariable Long id,
            @Valid @RequestBody SellerProfileUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        verifySellerAccess(id, userPrincipal);

        return ResponseEntity.ok(
                sellerService.updateSellerProfile(id, request)
        );
    }

    // Public seller products
    @GetMapping("/{id}/products")
    public ResponseEntity<List<ProductResponse>> getSellerProducts(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                productService.getSellerProducts(id)
        );
    }

    // Public: approved reviews only
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getSellerReviews(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reviewService.getSellerReviews(id)
        );
    }

    // Private: all review statuses for seller owner or ADMIN
    @GetMapping("/{id}/my-reviews")
    public ResponseEntity<List<ReviewResponse>> getSellerDashboardReviews(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        verifySellerAccess(id, userPrincipal);

        return ResponseEntity.ok(
                reviewService.getSellerDashboardReviews(id)
        );
    }

    // Verify seller ownership or ADMIN role
    private void verifySellerAccess(
            Long requestedSellerId,
            UserPrincipal userPrincipal) {

        if (userPrincipal == null) {
            throw new AccessDeniedException(
                    "Authentication is required."
            );
        }

        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN"));

        boolean isSeller = userPrincipal.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_SELLER"));

        boolean isOwner = userPrincipal.getId().equals(requestedSellerId);

        if (!isAdmin && !(isSeller && isOwner)) {
            throw new AccessDeniedException(
                    "You are not authorized to access this seller resource."
            );
        }
    }
}

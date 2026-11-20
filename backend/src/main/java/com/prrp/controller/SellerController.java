// package com.prrp.controller;

// import com.prrp.dto.ProductResponse;
// import com.prrp.dto.ReviewResponse;
// import com.prrp.dto.SellerAnalyticsResponse;
// import com.prrp.dto.SellerDashboardResponse;
// import com.prrp.entity.User;
// import com.prrp.service.ProductService;
// import com.prrp.service.ReviewService;
// import com.prrp.service.SellerService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/v1/sellers")
// @RequiredArgsConstructor
// public class SellerController {

//     private final SellerService sellerService;
//     private final ProductService productService;
//     private final ReviewService reviewService;

//     @GetMapping
//     public ResponseEntity<List<User>> getAllSellers() {
//         return ResponseEntity.ok(sellerService.getAllSellers());
//     }

//     @GetMapping("/{id}/dashboard")
//     public ResponseEntity<SellerDashboardResponse> getSellerDashboard(@PathVariable Long id) {
//         return ResponseEntity.ok(sellerService.getSellerDashboard(id));
//     }

//     @GetMapping("/{id}/ratings")
//     public ResponseEntity<SellerAnalyticsResponse> getSellerRatings(@PathVariable Long id) {
//         return ResponseEntity.ok(sellerService.getSellerRatings(id));
//     }

//     @GetMapping("/{id}/products")
//     public ResponseEntity<List<ProductResponse>> getSellerProducts(@PathVariable Long id) {
//         return ResponseEntity.ok(productService.getSellerProducts(id));
//     }

//     @GetMapping("/{id}/reviews")
//     public ResponseEntity<List<ReviewResponse>> getSellerReviews(@PathVariable Long id) {
//         return ResponseEntity.ok(reviewService.getSellerReviews(id));
//     }
// }


package com.prrp.controller;

import com.prrp.dto.ProductResponse;
import com.prrp.dto.ReviewResponse;
import com.prrp.dto.SellerAnalyticsResponse;
import com.prrp.dto.SellerDashboardResponse;
import com.prrp.dto.SellerLeaderboardResponse;
import com.prrp.dto.SellerResponse;
import com.prrp.service.ProductService;
import com.prrp.service.ReviewService;
import com.prrp.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sellers")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final ProductService productService;
    private final ReviewService reviewService;

    // Public seller listing - safe DTO response
    @GetMapping
    public ResponseEntity<List<SellerResponse>> getAllSellers() {
        return ResponseEntity.ok(
                sellerService.getAllSellerResponses()
        );
    }

    // Platform-wide seller leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<List<SellerLeaderboardResponse>> getSellerLeaderboard() {
        return ResponseEntity.ok(
                sellerService.getSellerLeaderboard()
        );
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<SellerDashboardResponse> getSellerDashboard(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                sellerService.getSellerDashboard(id)
        );
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<SellerAnalyticsResponse> getSellerRatings(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                sellerService.getSellerRatings(id)
        );
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<ProductResponse>> getSellerProducts(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                productService.getSellerProducts(id)
        );
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getSellerReviews(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                reviewService.getSellerReviews(id)
        );
    }
}


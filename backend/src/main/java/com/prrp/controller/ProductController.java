
package com.prrp.controller;

import com.prrp.dto.ProductCreateRequest;
import com.prrp.dto.ProductResponse;
import com.prrp.dto.RatingBreakdownDto;
import com.prrp.entity.Category;
import com.prrp.security.UserPrincipal;
import com.prrp.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minRating,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "featured") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Page must be non-negative and size must be between 1 and 100."
            );
        }

        if (minRating != null &&
                (minRating.compareTo(BigDecimal.ZERO) < 0 ||
                 minRating.compareTo(BigDecimal.valueOf(5)) > 0)) {
            throw new IllegalArgumentException(
                    "Minimum rating must be between 0 and 5."
            );
        }

        return ResponseEntity.ok(
                productService.getProducts(
                        categoryId,
                        minPrice,
                        maxPrice,
                        minRating,
                        keyword,
                        sortBy,
                        PageRequest.of(page, size)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(
                productService.getAllCategories()
        );
    }

    @GetMapping("/rankings")
    public ResponseEntity<List<ProductResponse>> getRankings(
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(
                productService.getRankings(categoryId)
        );
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<RatingBreakdownDto> getRatingBreakdown(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                productService.getProductRatingBreakdown(id)
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ProductCreateRequest request
    ) {
        return new ResponseEntity<>(
                productService.createProduct(
                        userPrincipal.getId(),
                        request
                ),
                HttpStatus.CREATED
        );
    }
}

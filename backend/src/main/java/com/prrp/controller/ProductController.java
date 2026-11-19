package com.prrp.controller;

import com.prrp.dto.ProductResponse;
import com.prrp.dto.RatingBreakdownDto;
import com.prrp.entity.Category;
import com.prrp.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
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
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "featured") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(productService.getProducts(categoryId, minPrice, maxPrice, keyword, sortBy, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @GetMapping("/rankings")
    public ResponseEntity<List<ProductResponse>> getRankings(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(productService.getRankings(categoryId));
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<RatingBreakdownDto> getRatingBreakdown(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductRatingBreakdown(id));
    }
}


package com.prrp.service;

import com.prrp.dto.ProductCreateRequest;
import com.prrp.dto.ProductResponse;
import com.prrp.dto.RatingBreakdownDto;
import com.prrp.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    Page<ProductResponse> getProducts(
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minRating,
            String keyword,
            String sortBy,
            Pageable pageable
    );

    ProductResponse getProductById(Long id);

    List<Category> getAllCategories();

    List<ProductResponse> getSellerProducts(Long sellerId);

    List<ProductResponse> getRankings(Long categoryId);

    RatingBreakdownDto getProductRatingBreakdown(Long productId);

    ProductResponse createProduct(Long sellerId, ProductCreateRequest request);
}

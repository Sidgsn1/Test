package com.prrp.service.impl;

import com.prrp.dto.ProductResponse;
import com.prrp.dto.RatingBreakdownDto;
import com.prrp.entity.Category;
import com.prrp.entity.Product;
import com.prrp.entity.ProductImage;
import com.prrp.exception.ResourceNotFoundException;
import com.prrp.repository.CategoryRepository;
import com.prrp.repository.ProductRepository;
import com.prrp.repository.ReviewRepository;
import com.prrp.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                            String keyword, String sortBy, Pageable pageable) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price-low".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price-high".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        }

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        Page<Product> products = productRepository.searchProducts(categoryId, minPrice, maxPrice, keyword, sortedPageable);

        List<ProductResponse> responses = products.getContent().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        if ("rating-desc".equalsIgnoreCase(sortBy)) {
            responses.sort((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()));
        } else if ("reviews-desc".equalsIgnoreCase(sortBy)) {
            responses.sort((a, b) -> Long.compare(b.getTotalReviews(), a.getTotalReviews()));
        }

        return new PageImpl<>(responses, sortedPageable, products.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToProductResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getSellerProducts(Long sellerId) {
        return productRepository.findBySellerId(sellerId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getRankings(Long categoryId) {
        List<Product> products;
        if (categoryId != null && categoryId > 0) {
            products = productRepository.searchProducts(categoryId, null, null, null, PageRequest.of(0, 100)).getContent();
        } else {
            products = productRepository.findAll();
        }

        List<ProductResponse> responses = products.stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        responses.sort((a, b) -> {
            double scoreA = (a.getAverageRating() * 20.0) + Math.min(a.getTotalReviews() / 10.0, 20.0);
            double scoreB = (b.getAverageRating() * 20.0) + Math.min(b.getTotalReviews() / 10.0, 20.0);
            return Double.compare(scoreB, scoreA);
        });

        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public RatingBreakdownDto getProductRatingBreakdown(Long productId) {
        Double avgRating = reviewRepository.findAverageRatingByProductId(productId);
        long totalCount = reviewRepository.countApprovedByProductId(productId);
        Map<Integer, Long> distribution = calculateDistribution(productId);

        return RatingBreakdownDto.builder()
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalReviews(totalCount)
                .distribution(distribution)
                .build();
    }

    private ProductResponse mapToProductResponse(Product product) {
        Double avgRating = reviewRepository.findAverageRatingByProductId(product.getId());
        long totalReviews = reviewRepository.countApprovedByProductId(product.getId());
        Map<Integer, Long> distribution = calculateDistribution(product.getId());

        String primaryImageUrl = null;
        List<String> imageUrls = new ArrayList<>();
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            for (ProductImage img : product.getImages()) {
                imageUrls.add(img.getImageUrl());
                if (Boolean.TRUE.equals(img.getIsPrimary()) && primaryImageUrl == null) {
                    primaryImageUrl = img.getImageUrl();
                }
            }
            if (primaryImageUrl == null) {
                primaryImageUrl = imageUrls.get(0);
            }
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .sku(product.getSku())
                .isAvailable(product.getIsAvailable())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .sellerId(product.getSeller().getId())
                .sellerName(product.getSeller().getFullName())
                .primaryImageUrl(primaryImageUrl)
                .images(imageUrls)
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalReviews(totalReviews)
                .ratingDistribution(distribution)
                .build();
    }

    private Map<Integer, Long> calculateDistribution(Long productId) {
        Map<Integer, Long> distribution = new LinkedHashMap<>();
        for (int i = 5; i >= 1; i--) {
            distribution.put(i, 0L);
        }
        List<Object[]> rows = reviewRepository.getRatingBreakdownByProductId(productId);
        for (Object[] row : rows) {
            Integer rating = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            distribution.put(rating, count);
        }
        return distribution;
    }
}

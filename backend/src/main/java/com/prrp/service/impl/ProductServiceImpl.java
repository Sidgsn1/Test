package com.prrp.service.impl;

import com.prrp.dto.ProductCreateRequest;
import com.prrp.dto.ProductResponse;
import com.prrp.dto.RatingBreakdownDto;
import com.prrp.entity.Category;
import com.prrp.entity.Product;
import com.prrp.entity.ProductImage;
import com.prrp.entity.User;
import com.prrp.exception.ResourceNotFoundException;
import com.prrp.repository.CategoryRepository;
import com.prrp.repository.ProductRepository;
import com.prrp.repository.ReviewRepository;
import com.prrp.repository.UserRepository;
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
    private final UserRepository userRepository;

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

        for (int i = 0; i < responses.size(); i++) {
            responses.get(i).setRank(i + 1);
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
        List<ProductResponse> list = productRepository.findBySellerId(sellerId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        list.sort((a, b) -> {
            int ratingCompare = Double.compare(b.getAverageRating(), a.getAverageRating());
            if (ratingCompare != 0) return ratingCompare;
            int reviewCompare = Long.compare(b.getTotalReviews(), a.getTotalReviews());
            if (reviewCompare != 0) return reviewCompare;
            return a.getName().compareToIgnoreCase(b.getName());
        });

        for (int i = 0; i < list.size(); i++) {
            list.get(i).setRank(i + 1);
        }
        return list;
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

        for (int i = 0; i < responses.size(); i++) {
            responses.get(i).setRank(i + 1);
        }

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

    @Override
    @Transactional
    public ProductResponse createProduct(Long sellerId, ProductCreateRequest request) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found with id: " + sellerId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String sku = request.getSku();
        if (sku == null || sku.trim().isEmpty()) {
            sku = "SKU-" + System.currentTimeMillis();
        }

        Product product = Product.builder()
                .seller(seller)
                .category(category)
                .name(request.getName().trim())
                .description(request.getDescription().trim())
                .price(request.getPrice())
                .sku(sku.trim())
                .isAvailable(true)
                .images(new ArrayList<>())
                .build();

        String primaryUrl = request.getPrimaryImageUrl();
        if (primaryUrl != null && !primaryUrl.trim().isEmpty()) {
            ProductImage primaryImg = ProductImage.builder()
                    .product(product)
                    .imageUrl(primaryUrl.trim())
                    .isPrimary(true)
                    .displayOrder(1)
                    .build();
            product.getImages().add(primaryImg);
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            int order = product.getImages().size() + 1;
            for (String imgUrl : request.getImages()) {
                if (imgUrl != null && !imgUrl.trim().isEmpty() && !imgUrl.trim().equals(primaryUrl)) {
                    ProductImage img = ProductImage.builder()
                            .product(product)
                            .imageUrl(imgUrl.trim())
                            .isPrimary(false)
                            .displayOrder(order++)
                            .build();
                    product.getImages().add(img);
                }
            }
        }

        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
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

        if (primaryImageUrl == null || primaryImageUrl.isEmpty()) {
            primaryImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";
        }

        double finalRating = avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;

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
                .thumbnail(primaryImageUrl)
                .images(imageUrls)
                .averageRating(finalRating)
                .rating(finalRating)
                .totalReviews(totalReviews)
                .reviewCount(totalReviews)
                .ratingDistribution(distribution)
                .ratingBreakdown(distribution)
                .rank(1)
                .sellerRating(4.8)
                .discountPercent(15)
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

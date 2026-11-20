
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    private static final double MINIMUM_REVIEW_THRESHOLD = 5.0;
    private static final double DEFAULT_PLATFORM_RATING = 3.0;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minRating,
            String keyword,
            String sortBy,
            Pageable pageable) {

        List<Product> products = productRepository.findFilteredProducts(
                categoryId,
                minPrice,
                maxPrice,
                keyword,
                minRating
        );

        List<ProductResponse> responses = products.stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        String sorting = sortBy == null ? "featured" : sortBy.toLowerCase();

        switch (sorting) {

            case "price-low":
                responses.sort(
                        Comparator.comparing(ProductResponse::getPrice)
                );
                break;

            case "price-high":
                responses.sort(
                        Comparator.comparing(
                                ProductResponse::getPrice,
                                Comparator.reverseOrder()
                        )
                );
                break;

            case "rating-desc":
                responses.sort(
                        Comparator.comparingDouble(
                                ProductResponse::getAverageRating
                        ).reversed()
                        .thenComparing(
                                ProductResponse::getTotalReviews,
                                Comparator.reverseOrder()
                        )
                );
                break;

            case "reviews-desc":
                responses.sort(
                        Comparator.comparing(
                                ProductResponse::getTotalReviews,
                                Comparator.reverseOrder()
                        )
                        .thenComparing(
                                ProductResponse::getAverageRating,
                                Comparator.reverseOrder()
                        )
                );
                break;

            case "rank":
                responses.removeIf(
                        product -> product.getTotalReviews() == null
                                || product.getTotalReviews() <= 0
                );

                responses.sort(
                        Comparator.comparingDouble(
                                this::calculateBayesianScore
                        ).reversed()
                );

                break;

            default:
                responses.sort(
                        Comparator.comparing(
                                ProductResponse::getId,
                                Comparator.reverseOrder()
                        )
                );
                break;
        }

        // Assign rank only when marketplace ranking is selected.
        if ("rank".equals(sorting)) {
            for (int i = 0; i < responses.size(); i++) {
                responses.get(i).setRank(i + 1);
            }
        }

        // Pagination happens after sorting the complete filtered result.
        int pageNumber = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();

        int start = Math.min(pageNumber * pageSize, responses.size());
        int end = Math.min(start + pageSize, responses.size());

        List<ProductResponse> pageContent =
                responses.subList(start, end);

        return new PageImpl<>(
                pageContent,
                PageRequest.of(pageNumber, pageSize),
                responses.size()
        );
    }

    private double calculateBayesianScore(ProductResponse product) {

        double rating = product.getAverageRating() != null
                ? product.getAverageRating()
                : 0.0;

        double reviewCount = product.getTotalReviews() != null
                ? product.getTotalReviews()
                : 0.0;

        Double platformAverage =
                reviewRepository.findPlatformAverageApprovedRating();

        double globalAverage = platformAverage != null
                ? platformAverage
                : DEFAULT_PLATFORM_RATING;

        return (
                (reviewCount / (reviewCount + MINIMUM_REVIEW_THRESHOLD))
                        * rating
        ) + (
                (MINIMUM_REVIEW_THRESHOLD
                        / (reviewCount + MINIMUM_REVIEW_THRESHOLD))
                        * globalAverage
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id
                        )
                );

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

        List<ProductResponse> list = productRepository.findBySellerId(sellerId)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        list.sort(
                Comparator.comparing(
                        ProductResponse::getAverageRating,
                        Comparator.reverseOrder()
                ).thenComparing(
                        ProductResponse::getTotalReviews,
                        Comparator.reverseOrder()
                )
        );

        for (int i = 0; i < list.size(); i++) {
            list.get(i).setRank(i + 1);
        }

        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getRankings(Long categoryId) {

        List<Product> products =
                productRepository.findAvailableProductsForRanking(categoryId);

        List<ProductResponse> responses = products.stream()
                .map(this::mapToProductResponse)
                .filter(product ->
                        product.getTotalReviews() != null
                                && product.getTotalReviews() > 0
                )
                .collect(Collectors.toList());

        responses.sort(
                Comparator.comparingDouble(
                        this::calculateBayesianScore
                ).reversed()
        );

        for (int i = 0; i < responses.size(); i++) {
            responses.get(i).setRank(i + 1);
        }

        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public RatingBreakdownDto getProductRatingBreakdown(Long productId) {

        Double avgRating =
                reviewRepository.findAverageRatingByProductId(productId);

        long totalCount =
                reviewRepository.countApprovedByProductId(productId);

        Map<Integer, Long> distribution =
                calculateDistribution(productId);

        return RatingBreakdownDto.builder()
                .averageRating(
                        avgRating != null
                                ? Math.round(avgRating * 10.0) / 10.0
                                : 0.0
                )
                .totalReviews(totalCount)
                .distribution(distribution)
                .build();
    }

    @Override
    @Transactional
    public ProductResponse createProduct(
            Long sellerId,
            ProductCreateRequest request) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller not found with id: " + sellerId
                        )
                );

        Category category = categoryRepository.findById(
                request.getCategoryId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Category not found with id: "
                                + request.getCategoryId()
                )
        );

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

                if (imgUrl != null
                        && !imgUrl.trim().isEmpty()
                        && !imgUrl.trim().equals(primaryUrl)) {

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

        Double avgRating =
                reviewRepository.findAverageRatingByProductId(product.getId());

        long totalReviews =
                reviewRepository.countApprovedByProductId(product.getId());

        Map<Integer, Long> distribution =
                calculateDistribution(product.getId());

        String primaryImageUrl = null;
        List<String> imageUrls = new ArrayList<>();

        if (product.getImages() != null && !product.getImages().isEmpty()) {

            for (ProductImage img : product.getImages()) {

                imageUrls.add(img.getImageUrl());

                if (Boolean.TRUE.equals(img.getIsPrimary())
                        && primaryImageUrl == null) {

                    primaryImageUrl = img.getImageUrl();
                }
            }

            if (primaryImageUrl == null) {
                primaryImageUrl = imageUrls.get(0);
            }
        }

        if (primaryImageUrl == null || primaryImageUrl.isEmpty()) {
            primaryImageUrl =
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";
        }

        double finalRating = avgRating != null
                ? Math.round(avgRating * 10.0) / 10.0
                : 0.0;

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
                .build();
    }

    private Map<Integer, Long> calculateDistribution(Long productId) {

        Map<Integer, Long> distribution = new LinkedHashMap<>();

        for (int i = 5; i >= 1; i--) {
            distribution.put(i, 0L);
        }

        List<Object[]> rows =
                reviewRepository.getRatingBreakdownByProductId(productId);

        for (Object[] row : rows) {

            Integer rating = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();

            distribution.put(rating, count);
        }

        return distribution;
    }
}

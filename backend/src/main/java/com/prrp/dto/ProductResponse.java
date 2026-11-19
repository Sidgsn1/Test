package com.prrp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String sku;
    private Boolean isAvailable;
    private Long categoryId;
    private String categoryName;
    private Long sellerId;
    private String sellerName;
    private String primaryImageUrl;
    private String thumbnail;
    private List<String> images;
    private Double averageRating;
    private Double rating;
    private Long totalReviews;
    private Long reviewCount;
    private Map<Integer, Long> ratingDistribution;
    private Map<Integer, Long> ratingBreakdown;
    private Integer rank;
    private Double sellerRating;
    private Integer discountPercent;
}

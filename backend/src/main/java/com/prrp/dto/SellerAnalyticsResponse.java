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
public class SellerAnalyticsResponse {

    private Double overallRating;
    private Long totalSellerReviews;
    private Double positivePercentage;
    private Long totalProducts;
    private Long approvedReviews;
    private Long pendingReviews;
    private Long rejectedReviews;
    private Map<Integer, Long> distribution;
    private List<ProductPerformanceDto> productPerformance;
    private List<SellerFeedbackDto> recentFeedback;
    private SellerAspectBreakdown breakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductPerformanceDto {
        private Long id;
        private String name;
        private Double averageRating;
        private Long reviewCount;
        private BigDecimal price;
        private String thumbnail;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerFeedbackDto {
        private Long id;
        private String productName;
        private String buyerName;
        private Integer rating;
        private String title;
        private String comment;
        private String date;
        private String moderationStatus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerAspectBreakdown {
        private Double shippingSpeed;
        private Double itemAsDescribed;
        private Double packagingQuality;
        private Double customerCommunication;
        private Double dispatchTime;
    }
}

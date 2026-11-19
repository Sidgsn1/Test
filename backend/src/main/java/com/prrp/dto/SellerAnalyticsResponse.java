package com.prrp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private SellerAspectBreakdown breakdown;
    private Map<Integer, Long> distribution;
    private List<SellerFeedbackDto> recentFeedback;

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

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerFeedbackDto {
        private Long id;
        private String buyerName;
        private Integer rating;
        private String comment;
        private String date;
    }
}

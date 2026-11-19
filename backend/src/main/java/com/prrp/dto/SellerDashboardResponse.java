package com.prrp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerDashboardResponse {
    private Long sellerId;
    private String sellerName;
    private Long totalProducts;
    private Long totalApprovedReviews;
    private Long totalPendingReviews;
    private Long totalRejectedReviews;
    private Double averageRating;
    private Map<Integer, Long> ratingDistribution;
}

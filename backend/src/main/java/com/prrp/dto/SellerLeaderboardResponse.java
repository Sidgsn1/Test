
package com.prrp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerLeaderboardResponse {

    private Integer rank;
    private Long sellerId;
    private String sellerName;
    private Double averageRating;
    private Long totalApprovedReviews;
    private Double positivePercentage;
    private Double rankingScore;
}

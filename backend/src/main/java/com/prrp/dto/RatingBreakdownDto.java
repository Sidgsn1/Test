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
public class RatingBreakdownDto {
    private Double averageRating;
    private Long totalReviews;
    private Map<Integer, Long> distribution;
}

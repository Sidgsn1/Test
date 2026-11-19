package com.prrp.dto;

import com.prrp.entity.ModerationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productThumbnail;
    private Long userId;
    private String userName;
    private Integer rating;
    private String title;
    private String comment;
    private ModerationStatus moderationStatus;
    private List<String> images;
    private LocalDateTime createdAt;
}

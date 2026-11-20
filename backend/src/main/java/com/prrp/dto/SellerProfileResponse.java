
package com.prrp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String city;
    private String state;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

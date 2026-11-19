package com.prrp.dto;

import com.prrp.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String city;
    private String state;
    private LocalDateTime createdAt;
}

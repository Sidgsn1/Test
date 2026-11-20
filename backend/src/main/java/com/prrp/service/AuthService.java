
package com.prrp.service;

import com.prrp.dto.AuthResponse;
import com.prrp.dto.LoginRequest;
import com.prrp.dto.RegisterRequest;
import com.prrp.dto.UserProfileResponse;
import com.prrp.dto.CustomerProfileUpdateRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    UserProfileResponse getCurrentUserProfile(String email);

    UserProfileResponse updateCurrentUserProfile(
            String email,
            CustomerProfileUpdateRequest request
    );
}

package com.prrp.service;

import com.prrp.dto.AuthResponse;
import com.prrp.dto.LoginRequest;
import com.prrp.dto.RegisterRequest;
import com.prrp.dto.UserProfileResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    UserProfileResponse getCurrentUserProfile(String email);
}

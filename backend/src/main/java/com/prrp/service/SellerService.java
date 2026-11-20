
package com.prrp.service;

import com.prrp.dto.SellerAnalyticsResponse;
import com.prrp.dto.SellerDashboardResponse;
import com.prrp.dto.SellerLeaderboardResponse;
import com.prrp.dto.SellerProfileResponse;
import com.prrp.dto.SellerProfileUpdateRequest;
import com.prrp.dto.SellerResponse;
import com.prrp.entity.User;

import java.util.List;

public interface SellerService {

    SellerDashboardResponse getSellerDashboard(Long sellerId);

    SellerAnalyticsResponse getSellerRatings(Long sellerId);

    List<User> getAllSellers();

    List<SellerResponse> getAllSellerResponses();

    List<SellerLeaderboardResponse> getSellerLeaderboard();

    // Seller profile
    SellerProfileResponse getSellerProfile(Long sellerId);

    SellerProfileResponse updateSellerProfile(
            Long sellerId,
            SellerProfileUpdateRequest request
    );
}

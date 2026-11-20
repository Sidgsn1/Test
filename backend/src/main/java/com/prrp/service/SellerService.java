// package com.prrp.service;

// import com.prrp.dto.SellerAnalyticsResponse;
// import com.prrp.dto.SellerDashboardResponse;
// import com.prrp.entity.User;

// import java.util.List;

// public interface SellerService {
//     SellerDashboardResponse getSellerDashboard(Long sellerId);
//     SellerAnalyticsResponse getSellerRatings(Long sellerId);
//     List<User> getAllSellers();
// }



package com.prrp.service;

import com.prrp.dto.SellerAnalyticsResponse;
import com.prrp.dto.SellerDashboardResponse;
import com.prrp.dto.SellerLeaderboardResponse;
import com.prrp.dto.SellerResponse;
import com.prrp.entity.User;

import java.util.List;

public interface SellerService {

    SellerDashboardResponse getSellerDashboard(Long sellerId);

    SellerAnalyticsResponse getSellerRatings(Long sellerId);

    List<User> getAllSellers();

    // Public seller listing without sensitive user information
    List<SellerResponse> getAllSellerResponses();

    // Platform-wide seller leaderboard
    List<SellerLeaderboardResponse> getSellerLeaderboard();
}

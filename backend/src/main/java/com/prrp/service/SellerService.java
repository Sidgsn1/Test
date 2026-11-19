package com.prrp.service;

import com.prrp.dto.RatingBreakdownDto;
import com.prrp.dto.SellerDashboardResponse;
import com.prrp.entity.User;

import java.util.List;

public interface SellerService {
    SellerDashboardResponse getSellerDashboard(Long sellerId);
    RatingBreakdownDto getSellerRatings(Long sellerId);
    List<User> getAllSellers();
}

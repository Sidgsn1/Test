package com.prrp.repository;

import com.prrp.entity.ReviewModerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewModerationLogRepository extends JpaRepository<ReviewModerationLog, Long> {
    List<ReviewModerationLog> findByReviewIdOrderByActionTimestampDesc(Long reviewId);
}

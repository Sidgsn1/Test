package com.prrp.service;

import com.prrp.dto.ReviewCreateRequest;
import com.prrp.dto.ReviewResponse;
import com.prrp.entity.*;
import com.prrp.exception.BadRequestException;
import com.prrp.repository.*;
import com.prrp.service.impl.ReviewServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReviewModerationLogRepository moderationLogRepository;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private User customer;
    private Product product;

    @BeforeEach
    void setUp() {
        customer = User.builder()
                .id(1L)
                .fullName("Amit Kumar")
                .email("amit@example.com")
                .role(Role.ROLE_CUSTOMER)
                .build();

        Category category = Category.builder().id(1L).name("Electronics").slug("electronics").build();

        product = Product.builder()
                .id(100L)
                .name("Wireless Earbuds")
                .description("Noise cancelling earbuds")
                .price(new BigDecimal("1999.00"))
                .seller(customer)
                .category(category)
                .build();
    }

    @Test
    void submitReview_ShouldSetStatusToPending_WhenValid() {
        ReviewCreateRequest request = ReviewCreateRequest.builder()
                .productId(100L)
                .rating(5)
                .title("Fantastic Battery Life")
                .comment("Lasts for more than 24 hours with the case.")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(reviewRepository.existsByUserIdAndProductId(1L, 100L)).thenReturn(false);

        Review savedReview = Review.builder()
                .id(10L)
                .user(customer)
                .product(product)
                .rating(5)
                .title("Fantastic Battery Life")
                .comment("Lasts for more than 24 hours with the case.")
                .moderationStatus(ModerationStatus.PENDING)
                .build();

        when(reviewRepository.save(any(Review.class))).thenReturn(savedReview);

        ReviewResponse response = reviewService.submitReview(1L, request);

        assertNotNull(response);
        assertEquals(ModerationStatus.PENDING, response.getModerationStatus());
        assertEquals(5, response.getRating());
        assertEquals("Fantastic Battery Life", response.getTitle());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void submitReview_ShouldThrowBadRequest_WhenUserAlreadyReviewed() {
        ReviewCreateRequest request = ReviewCreateRequest.builder()
                .productId(100L)
                .rating(4)
                .title("Good purchase")
                .comment("Pretty decent sound quality.")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));
        when(reviewRepository.existsByUserIdAndProductId(1L, 100L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> reviewService.submitReview(1L, request));
        verify(reviewRepository, never()).save(any(Review.class));
    }
}

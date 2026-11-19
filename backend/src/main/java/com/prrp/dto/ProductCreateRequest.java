package com.prrp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequest {

    @NotBlank
    @Size(min = 3, max = 200)
    private String name;

    @NotBlank
    private String description;

    @NotNull
    @DecimalMin(value = "1.00")
    private BigDecimal price;

    private String sku;

    @NotNull
    private Long categoryId;

    private String primaryImageUrl;

    private List<String> images;
}

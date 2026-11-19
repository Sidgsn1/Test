package com.prrp.dto;

import com.prrp.entity.ModerationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationActionRequest {

    @NotNull
    private ModerationStatus action;

    private String remarks;
}

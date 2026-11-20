
package com.prrp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerProfileUpdateRequest {

    @NotBlank(message = "Full name is required.")
    @Size(max = 100, message = "Full name cannot exceed 100 characters.")
    private String fullName;

    @Pattern(
            regexp = "^[+]?[0-9\\s-]{10,15}$",
            message = "Please provide a valid phone number."
    )
    private String phoneNumber;

    @Size(max = 60, message = "City cannot exceed 60 characters.")
    private String city;

    @Size(max = 60, message = "State cannot exceed 60 characters.")
    private String state;
}

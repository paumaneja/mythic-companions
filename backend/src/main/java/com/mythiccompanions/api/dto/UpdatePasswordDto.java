package com.mythiccompanions.api.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordDto(
        @NotBlank String oldPassword,
        @NotBlank @Size(min = 8) String newPassword
) {}
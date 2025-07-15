package com.mythiccompanions.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record GiveItemRequestDto(
        @NotBlank String itemId,
        @Min(1) int quantity
) {}
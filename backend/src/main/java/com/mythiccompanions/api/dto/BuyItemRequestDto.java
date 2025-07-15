package com.mythiccompanions.api.dto;

import jakarta.validation.constraints.Min;

public record BuyItemRequestDto(
        @Min(value = 1, message = "Quantity must be at least 1")
        int quantity
) {}
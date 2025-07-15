package com.mythiccompanions.api.dto;

import jakarta.validation.constraints.NotNull;

public record UseItemRequestDto(
        @NotNull Long companionId
) {}
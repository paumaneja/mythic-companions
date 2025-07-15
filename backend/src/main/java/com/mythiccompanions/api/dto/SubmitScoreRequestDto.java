package com.mythiccompanions.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record SubmitScoreRequestDto(
        @NotBlank String gameId,
        @Min(0) int score
) {}
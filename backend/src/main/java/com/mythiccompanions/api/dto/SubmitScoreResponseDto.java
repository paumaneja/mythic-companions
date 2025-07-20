package com.mythiccompanions.api.dto;

public record SubmitScoreResponseDto(
        MinigameResultDto gameResult,
        UserDto user
) {}
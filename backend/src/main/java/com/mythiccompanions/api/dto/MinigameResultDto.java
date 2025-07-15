package com.mythiccompanions.api.dto;

public record MinigameResultDto(
        int finalScore,
        boolean isNewHighScore,
        MinigameRewardDto rewards
) {}
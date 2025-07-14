package com.mythiccompanions.api.dto;

public record ProgressionDto(
        long totalXp,
        int level,
        long currentXpInLevel,
        long xpForNextLevel
) {}
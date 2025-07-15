package com.mythiccompanions.api.dto;

public record RankingDto(
        String username,
        String avatarUrl,
        int score
) {}
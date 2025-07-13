package com.mythiccompanions.api.dto;

public record UserDto(
        Long id,
        String username,
        String email,
        String avatarUrl,
        int mythicCoins
) {}
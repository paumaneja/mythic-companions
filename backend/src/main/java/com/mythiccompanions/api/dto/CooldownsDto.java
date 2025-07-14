package com.mythiccompanions.api.dto;

import java.time.LocalDateTime;

public record CooldownsDto(
        LocalDateTime feed,
        LocalDateTime play,
        LocalDateTime clean,
        LocalDateTime sleep,
        LocalDateTime train
) {}
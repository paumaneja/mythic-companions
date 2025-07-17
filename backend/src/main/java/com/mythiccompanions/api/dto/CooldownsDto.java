package com.mythiccompanions.api.dto;

import java.time.ZonedDateTime;

public record CooldownsDto(
        ZonedDateTime feed,
        ZonedDateTime play,
        ZonedDateTime clean,
        ZonedDateTime sleep,
        ZonedDateTime train
) {}
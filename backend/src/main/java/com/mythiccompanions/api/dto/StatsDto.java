package com.mythiccompanions.api.dto;

public record StatsDto(
        int health,
        int energy,
        int hunger,
        int happiness,
        int hygiene
) {}
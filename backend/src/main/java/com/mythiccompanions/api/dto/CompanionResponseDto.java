package com.mythiccompanions.api.dto;

import com.mythiccompanions.api.model.Status;

public record CompanionResponseDto(
        Long id,
        String name,
        String speciesId,
        Status status,
        int health,
        int energy,
        int hunger,
        int happiness,
        int hygiene,
        int experiencePoints,
        String equippedWeaponId
) {}
package com.mythiccompanions.api.dto;

import com.mythiccompanions.api.model.Status;

public record SanctuaryDto(
        Long id,
        String name,
        String universeId,
        SpeciesDto species,
        Status status,
        StatsDto stats,
        ProgressionDto progression,
        EquippedWeaponDto equippedWeapon,
        CooldownsDto cooldowns
) {}
package com.mythiccompanions.api.dto;

import com.mythiccompanions.api.model.Status;

public record CompanionCardDto(
        Long id,
        String name,
        String speciesId,
        Status status,
        String imageUrl,
        String equippedWeaponId
) {}
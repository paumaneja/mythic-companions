package com.mythiccompanions.api.dto;

import jakarta.validation.constraints.NotNull;

public record EquipWeaponRequestDto(
        @NotNull Long companionId
) {}
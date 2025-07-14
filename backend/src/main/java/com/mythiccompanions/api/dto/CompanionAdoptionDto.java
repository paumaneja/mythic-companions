package com.mythiccompanions.api.dto;

import jakarta.validation.constraints.NotBlank;

public record CompanionAdoptionDto(
        @NotBlank(message = "Companion name cannot be blank")
        String name,

        @NotBlank(message = "Species ID cannot be blank")
        String speciesId
) {}
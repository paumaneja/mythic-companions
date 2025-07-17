package com.mythiccompanions.api.dto;

import com.mythiccompanions.api.model.SpeciesAssets;

public record SpeciesDto(
        String id,
        String name,
        String description,
        SpeciesAssets assets
) {}
package com.mythiccompanions.api.dto;

import java.util.List;

public record AdoptionUniverseDto(
        String universeId,
        String name,
        List<AdoptionSpeciesDto> species
) {}
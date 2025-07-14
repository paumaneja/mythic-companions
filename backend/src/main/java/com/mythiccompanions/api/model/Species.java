package com.mythiccompanions.api.model;

import lombok.Data;
import java.util.List;

@Data
public class Species {
    private String speciesId;
    private String name;
    private String description;
    private List<String> allowedWeaponTypes;
    private SpeciesAssets assets;
}
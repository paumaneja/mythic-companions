package com.mythiccompanions.api.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class Species {
    private String speciesId;
    private String name;
    private String description;
    private List<String> allowedWeaponTypes;
    private SpeciesAssets assets;
}

@Data
class SpeciesAssets {
    private Map<String, String> static_equipped;
    private Map<String, String> actions;
    private Map<String, String> train;
}
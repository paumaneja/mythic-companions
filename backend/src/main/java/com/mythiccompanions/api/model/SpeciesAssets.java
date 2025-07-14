package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class SpeciesAssets {
    @JsonProperty("static_unequipped")
    private String staticUnequipped;

    @JsonProperty("static_equipped")
    private Map<String, String> staticEquipped;

    private ActionAssetDetails actions;
}
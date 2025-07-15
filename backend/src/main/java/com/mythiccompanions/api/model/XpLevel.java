package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class XpLevel {
    private int level;
    @JsonProperty("xp_required")
    private int xpRequired;
}
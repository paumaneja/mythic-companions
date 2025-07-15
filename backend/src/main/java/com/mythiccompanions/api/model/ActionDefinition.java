package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ActionDefinition {
    @JsonProperty("cooldown_hours")
    private int cooldownHours;
    private ActionEffects effects;
}
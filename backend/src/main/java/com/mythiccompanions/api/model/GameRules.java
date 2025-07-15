package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class GameRules {
    @JsonProperty("decay_rates_per_hour")
    private DecayRates decayRatesPerHour;

    @JsonProperty("sickness_health_decay_per_hour")
    private int sicknessHealthDecayPerHour;

    private Map<String, ActionDefinition> actions;
}
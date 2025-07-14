package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GameRules {
    @JsonProperty("decay_rates_per_hour")
    private DecayRates decayRatesPerHour;

    @JsonProperty("sickness_health_decay_per_hour")
    private int sicknessHealthDecayPerHour;
}
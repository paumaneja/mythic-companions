package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class ProgressionRules {
    @JsonProperty("train_xp_gain")
    private int trainXpGain;

    @JsonProperty("energy_cost_train")
    private int energyCostTrain;

    @JsonProperty("hygiene_cost_train")
    private int hygieneCostTrain;

    @JsonProperty("xp_levels")
    private List<XpLevel> xpLevels;
}
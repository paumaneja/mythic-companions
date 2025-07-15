package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class MinigameRewards {
    @JsonProperty("coin_multiplier")
    private double coinMultiplier;
    @JsonProperty("item_loot_chance")
    private double itemLootChance;
    @JsonProperty("loot_table")
    private List<LootTableEntry> lootTable;
}
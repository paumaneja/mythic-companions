package com.mythiccompanions.api.model;

import lombok.Data;

@Data
public class Minigame {
    private String id;
    private String name;
    private String description;
    private boolean enabled;
    private MinigameRewards rewards;
}

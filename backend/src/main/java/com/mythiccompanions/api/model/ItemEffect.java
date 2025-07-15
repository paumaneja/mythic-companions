package com.mythiccompanions.api.model;

import lombok.Data;

@Data
public class ItemEffect {
    private int health = 0;
    private int energy = 0;
    private int hunger = 0;
    private int happiness = 0;
    private int hygiene = 0;

    private boolean revive = false;
    private boolean curesSickness = false;
}
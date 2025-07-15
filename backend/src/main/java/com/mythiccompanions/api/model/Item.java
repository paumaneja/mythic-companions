package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Item {
    private String itemId;
    private String name;
    private String description;
    private ItemType type;
    @JsonProperty("imageUrl")
    private String imageUrl;
    private String rarity;
    private boolean forSale;
    private int price;
    private ItemEffect effect;
    private String weaponType;
}
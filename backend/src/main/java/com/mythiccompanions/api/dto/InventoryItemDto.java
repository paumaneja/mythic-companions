package com.mythiccompanions.api.dto;

import com.mythiccompanions.api.model.ItemType;

public record InventoryItemDto(
        String itemId,
        String name,
        String description,
        ItemType type,
        String imageUrl,
        String rarity,

        int quantity
) {}
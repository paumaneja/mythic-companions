package com.mythiccompanions.api.mapper;

import com.mythiccompanions.api.dto.InventoryItemDto;
import com.mythiccompanions.api.entity.UserInventory;
import com.mythiccompanions.api.model.Item;
import com.mythiccompanions.api.service.GameDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InventoryMapper {

    private final GameDataService gameDataService;

    public InventoryItemDto toDto(UserInventory inventoryEntry) {
        Item itemData = gameDataService.getItemById(inventoryEntry.getId().getItemId())
                .orElseThrow(() -> new IllegalStateException("Invalid item ID in inventory: " + inventoryEntry.getId().getItemId()));

        return new InventoryItemDto(
                itemData.getItemId(),
                itemData.getName(),
                itemData.getDescription(),
                itemData.getType(),
                itemData.getImageUrl(),
                itemData.getRarity(),
                itemData.getWeaponType(),
                inventoryEntry.getQuantity()
        );
    }
}
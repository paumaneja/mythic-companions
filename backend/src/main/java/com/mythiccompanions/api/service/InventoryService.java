package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.InventoryItemDto;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.entity.UserInventory;
import com.mythiccompanions.api.entity.UserInventoryId;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.model.Item;
import com.mythiccompanions.api.repository.UserInventoryRepository;
import com.mythiccompanions.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final UserRepository userRepository;
    private final UserInventoryRepository inventoryRepository;
    private final GameDataService gameDataService;

    public List<InventoryItemDto> getUserInventory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<UserInventory> inventoryEntries = inventoryRepository.findByUser(user);

        return inventoryEntries.stream()
                .map(this::convertToInventoryItemDto)
                .collect(Collectors.toList());
    }

    private InventoryItemDto convertToInventoryItemDto(UserInventory inventoryEntry) {
        Item itemData = gameDataService.getItemById(inventoryEntry.getId().getItemId())
                .orElseThrow(() -> new IllegalStateException("Invalid item ID in inventory: " + inventoryEntry.getId().getItemId()));

        return new InventoryItemDto(
                itemData.getItemId(),
                itemData.getName(),
                itemData.getDescription(),
                itemData.getType(),
                itemData.getImageUrl(),
                itemData.getRarity(),
                inventoryEntry.getQuantity()
        );
    }

    // --- Temporary method for testing ---
    @Transactional
    public void giveItemToUser(String username, String itemId, int quantity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        gameDataService.getItemById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid item ID: " + itemId));

        UserInventoryId inventoryId = new UserInventoryId();
        inventoryId.setUserId(user.getId());
        inventoryId.setItemId(itemId);

        UserInventory inventoryEntry = inventoryRepository.findById(inventoryId)
                .orElse(new UserInventory());

        inventoryEntry.setId(inventoryId);
        inventoryEntry.setUser(user);
        inventoryEntry.setQuantity(inventoryEntry.getQuantity() + quantity);

        inventoryRepository.save(inventoryEntry);
    }
}
package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.InventoryItemDto;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.entity.UserInventory;
import com.mythiccompanions.api.entity.UserInventoryId;
import com.mythiccompanions.api.mapper.InventoryMapper;
import com.mythiccompanions.api.exception.InvalidItemTargetException;
import com.mythiccompanions.api.exception.ItemNotFoundException;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.model.Item;
import com.mythiccompanions.api.model.ItemEffect;
import com.mythiccompanions.api.model.Status;
import com.mythiccompanions.api.repository.CompanionRepository;
import com.mythiccompanions.api.repository.UserInventoryRepository;
import com.mythiccompanions.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.function.IntUnaryOperator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final UserRepository userRepository;
    private final UserInventoryRepository inventoryRepository;
    private final GameDataService gameDataService;
    private final CompanionRepository companionRepository;
    private final GameLoopService gameLoopService;
    private final InventoryMapper inventoryMapper;

    public List<InventoryItemDto> getUserInventory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return inventoryRepository.findByUser(user).stream()
                .map(inventoryMapper::toDto)
                .collect(Collectors.toList());
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

    @Transactional
    public Companion useItem(String username, String itemId, Long companionId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        UserInventory inventoryEntry = inventoryRepository.findByUserAndId_ItemId(user, itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found in inventory: " + itemId));

        Item itemData = gameDataService.getItemById(itemId)
                .orElseThrow(() -> new IllegalStateException("Item data mismatch for: " + itemId));
        ItemEffect effects = itemData.getEffect();

        Companion companion = companionRepository.findById(companionId)
                .orElseThrow(() -> new ResourceNotFoundException("Companion not found: " + companionId));
        gameLoopService.applyPassiveEffects(companion);

        if (!companion.getUser().equals(user)) {
            throw new SecurityException("User does not own this companion.");
        }
        if (effects.isRevive()) {
            if (companion.getStatus() != Status.HOSPITALIZED) {
                throw new InvalidItemTargetException("This item can only be used on a hospitalized companion.");
            }
            companion.setStatus(Status.ACTIVE);
        } else if (effects.isCuresSickness()) {
            if (companion.getStatus() != Status.SICK) {
                throw new InvalidItemTargetException("This item can only be used on a sick companion.");
            }
            companion.setStatus(Status.ACTIVE);
        } else {
            if (companion.getStatus() == Status.HOSPITALIZED) {
                throw new InvalidItemTargetException("This item cannot be used on a hospitalized companion.");
            }
        }

        IntUnaryOperator clamp = value -> Math.max(0, Math.min(100, value));
        companion.setHealth(clamp.applyAsInt(companion.getHealth() + effects.getHealth()));
        companion.setEnergy(clamp.applyAsInt(companion.getEnergy() + effects.getEnergy()));
        companion.setHunger(clamp.applyAsInt(companion.getHunger() + effects.getHunger()));
        companion.setHappiness(clamp.applyAsInt(companion.getHappiness() + effects.getHappiness()));
        companion.setHygiene(clamp.applyAsInt(companion.getHygiene() + effects.getHygiene()));

        inventoryEntry.setQuantity(inventoryEntry.getQuantity() - 1);
        if (inventoryEntry.getQuantity() <= 0) {
            inventoryRepository.delete(inventoryEntry);
        } else {
            inventoryRepository.save(inventoryEntry);
        }

        return companionRepository.save(companion);
    }
}
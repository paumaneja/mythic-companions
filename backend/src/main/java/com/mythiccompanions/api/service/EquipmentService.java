package com.mythiccompanions.api.service;

import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.IncompatibleWeaponException;
import com.mythiccompanions.api.exception.ItemNotFoundException;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.model.Item;
import com.mythiccompanions.api.model.ItemType;
import com.mythiccompanions.api.model.Species;
import com.mythiccompanions.api.repository.CompanionRepository;
import com.mythiccompanions.api.repository.UserInventoryRepository;
import com.mythiccompanions.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final UserRepository userRepository;
    private final CompanionRepository companionRepository;
    private final UserInventoryRepository inventoryRepository;
    private final GameDataService gameDataService;

    @Transactional
    public Companion equipWeapon(String username, String itemId, Long companionId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        inventoryRepository.findByUserAndId_ItemId(user, itemId)
                .orElseThrow(() -> new ItemNotFoundException("Weapon not found in inventory: " + itemId));

        Item weaponData = gameDataService.getItemById(itemId)
                .orElseThrow(() -> new IllegalStateException("Item data mismatch for: " + itemId));

        Companion companion = companionRepository.findById(companionId)
                .orElseThrow(() -> new ResourceNotFoundException("Companion not found: " + companionId));

        Species speciesData = gameDataService.getSpeciesById(companion.getSpeciesId())
                .orElseThrow(() -> new IllegalStateException("Species data mismatch for: " + companion.getSpeciesId()));

        if (!companion.getUser().equals(user)) {
            throw new AccessDeniedException("User does not own this companion.");
        }
        if (weaponData.getType() != ItemType.WEAPON) {
            throw new IncompatibleWeaponException("Item '" + itemId + "' is not a weapon.");
        }
        if (!speciesData.getAllowedWeaponTypes().contains(weaponData.getWeaponType())) {
            throw new IncompatibleWeaponException("Weapon type '" + weaponData.getWeaponType() + "' is not compatible with species '" + speciesData.getSpeciesId() + "'.");
        }

        companion.setEquippedWeaponId(itemId);
        return companionRepository.save(companion);
    }

    @Transactional
    public Companion unequipWeapon(String username, Long companionId) {
        Companion companion = companionRepository.findById(companionId)
                .orElseThrow(() -> new ResourceNotFoundException("Companion not found: " + companionId));

        if (!companion.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("User does not own this companion.");
        }

        companion.setEquippedWeaponId(null);
        return companionRepository.save(companion);
    }
}
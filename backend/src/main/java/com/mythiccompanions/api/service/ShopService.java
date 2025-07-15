package com.mythiccompanions.api.service;

import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.ItemNotForSaleException;
import com.mythiccompanions.api.exception.ItemNotFoundException;
import com.mythiccompanions.api.exception.NotEnoughCoinsException;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.model.Item;
import com.mythiccompanions.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final GameDataService gameDataService;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    public List<Item> getItemsForSale() {
        return gameDataService.getItems().stream()
                .filter(Item::isForSale)
                .collect(Collectors.toList());
    }

    @Transactional
    public void buyItem(String username, String itemId, int quantity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Item item = gameDataService.getItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found: " + itemId));

        if (!item.isForSale()) {
            throw new ItemNotForSaleException("Item '" + itemId + "' is not for sale.");
        }

        int totalCost = item.getPrice() * quantity;
        if (user.getMythicCoins() < totalCost) {
            throw new NotEnoughCoinsException("Not enough MythicCoins. Required: " + totalCost + ", Available: " + user.getMythicCoins());
        }

        user.setMythicCoins(user.getMythicCoins() - totalCost);
        userRepository.save(user);

        inventoryService.giveItemToUser(username, itemId, quantity);
    }
}
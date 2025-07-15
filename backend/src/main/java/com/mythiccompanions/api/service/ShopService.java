package com.mythiccompanions.api.service;

import com.mythiccompanions.api.model.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final GameDataService gameDataService;

    public List<Item> getItemsForSale() {
        return gameDataService.getItems().stream()
                .filter(Item::isForSale)
                .collect(Collectors.toList());
    }
}
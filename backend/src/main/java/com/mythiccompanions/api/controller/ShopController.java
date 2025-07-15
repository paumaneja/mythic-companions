package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.model.Item;
import com.mythiccompanions.api.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/items")
    public ResponseEntity<List<Item>> getShopItems() {
        List<Item> itemsForSale = shopService.getItemsForSale();
        return ResponseEntity.ok(itemsForSale);
    }
}
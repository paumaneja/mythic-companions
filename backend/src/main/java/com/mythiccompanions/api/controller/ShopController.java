package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.BuyItemRequestDto;
import com.mythiccompanions.api.model.Item;
import com.mythiccompanions.api.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/buy/{itemId}")
    public ResponseEntity<?> buyItem(
            @PathVariable String itemId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BuyItemRequestDto buyRequest) {

        shopService.buyItem(userDetails.getUsername(), itemId, buyRequest.quantity());

        return ResponseEntity.ok(Map.of("message", "Purchase successful!"));
    }
}
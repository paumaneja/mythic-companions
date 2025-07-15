package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.GiveItemRequestDto;
import com.mythiccompanions.api.dto.InventoryItemDto;
import com.mythiccompanions.api.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryItemDto>> getUserInventory(@AuthenticationPrincipal UserDetails userDetails) {
        List<InventoryItemDto> inventory = inventoryService.getUserInventory(userDetails.getUsername());
        return ResponseEntity.ok(inventory);
    }

    // --- Temporary endpoint for testing and development ---
    @PostMapping("/add-test-item")
    public ResponseEntity<String> giveTestItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody GiveItemRequestDto giveItemRequest) {

        inventoryService.giveItemToUser(
                userDetails.getUsername(),
                giveItemRequest.itemId(),
                giveItemRequest.quantity()
        );
        return ResponseEntity.ok("Item '" + giveItemRequest.itemId() + "' added to inventory.");
    }
}
package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.EquipWeaponRequestDto;
import com.mythiccompanions.api.dto.SanctuaryDto;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.mapper.CompanionMapper;
import com.mythiccompanions.api.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final CompanionMapper companionMapper;

    @PostMapping("/equip/{itemId}")
    public ResponseEntity<SanctuaryDto> equipWeapon(
            @PathVariable String itemId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody EquipWeaponRequestDto request) {

        Companion updatedCompanion = equipmentService.equipWeapon(
                userDetails.getUsername(),
                itemId,
                request.companionId()
        );

        return ResponseEntity.ok(companionMapper.toSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/unequip/{companionId}")
    public ResponseEntity<SanctuaryDto> unequipWeapon(
            @PathVariable Long companionId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Companion updatedCompanion = equipmentService.unequipWeapon(
                userDetails.getUsername(),
                companionId
        );

        return ResponseEntity.ok(companionMapper.toSanctuaryDto(updatedCompanion));
    }
}
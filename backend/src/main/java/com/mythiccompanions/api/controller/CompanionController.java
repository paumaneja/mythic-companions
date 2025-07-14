package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.CompanionAdoptionDto;
import com.mythiccompanions.api.dto.CompanionCardDto;
import com.mythiccompanions.api.dto.CompanionResponseDto;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.service.CompanionService;
import com.mythiccompanions.api.service.GameDataService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/companions")
@RequiredArgsConstructor
public class CompanionController {

    private final CompanionService companionService;
    private final GameDataService gameDataService;

    @PostMapping
    public ResponseEntity<CompanionResponseDto> adoptCompanion(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CompanionAdoptionDto adoptionDto) {

        String username = userDetails.getUsername();
        Companion savedCompanion = companionService.adoptCompanion(username, adoptionDto);

        CompanionResponseDto responseDto = new CompanionResponseDto(
                savedCompanion.getId(),
                savedCompanion.getName(),
                savedCompanion.getSpeciesId(),
                savedCompanion.getStatus(),
                savedCompanion.getHealth(),
                savedCompanion.getEnergy(),
                savedCompanion.getHunger(),
                savedCompanion.getHappiness(),
                savedCompanion.getHygiene(),
                savedCompanion.getExperiencePoints(),
                savedCompanion.getEquippedWeaponId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<CompanionCardDto>> getUserCompanions(@AuthenticationPrincipal UserDetails userDetails) {
        List<Companion> companions = companionService.findCompanionsByUsername(userDetails.getUsername());

        List<CompanionCardDto> companionCards = companions.stream()
                .map(this::convertToCompanionCardDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(companionCards);
    }

    private CompanionCardDto convertToCompanionCardDto(Companion companion) {
        String imageUrl = gameDataService.getSpeciesById(companion.getSpeciesId())
                .map(species -> {
                    if (companion.getEquippedWeaponId() != null && species.getAssets().getStaticEquipped() != null) {
                        return species.getAssets().getStaticEquipped().getOrDefault(companion.getEquippedWeaponId(), species.getAssets().getStaticUnequipped());
                    }
                    return species.getAssets().getStaticUnequipped();
                })
                .orElse("/assets/companions/default.png");

        return new CompanionCardDto(
                companion.getId(),
                companion.getName(),
                companion.getSpeciesId(),
                companion.getStatus(),
                imageUrl,
                companion.getEquippedWeaponId()
        );
    }
}
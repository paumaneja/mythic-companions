package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.*;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.mapper.CompanionMapper;
import com.mythiccompanions.api.model.Universe;
import com.mythiccompanions.api.service.CompanionService;
import com.mythiccompanions.api.service.GameDataService;
import com.mythiccompanions.api.service.ProgressionService;
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
    private final ProgressionService progressionService;
    private final CompanionMapper companionMapper;

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
                .map(companionMapper::toCompanionCardDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(companionCards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanctuaryDto> getCompanionDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Companion companion = companionService.getCompanionByIdAndUsername(id, userDetails.getUsername());
        SanctuaryDto sanctuaryDto = companionMapper.toSanctuaryDto(companion);

        return ResponseEntity.ok(sanctuaryDto);
    }

    @PostMapping("/{id}/feed")
    public ResponseEntity<SanctuaryDto> feedCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.feedCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(companionMapper.toSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/play")
    public ResponseEntity<SanctuaryDto> playWithCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.playWithCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(companionMapper.toSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/clean")
    public ResponseEntity<SanctuaryDto> cleanCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.cleanCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(companionMapper.toSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/sleep")
    public ResponseEntity<SanctuaryDto> sleepCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.sleepCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(companionMapper.toSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/train")
    public ResponseEntity<SanctuaryDto> trainCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Companion updatedCompanion = progressionService.trainCompanion(id, userDetails.getUsername());
        return ResponseEntity.ok(companionMapper.toSanctuaryDto(updatedCompanion));
    }
}
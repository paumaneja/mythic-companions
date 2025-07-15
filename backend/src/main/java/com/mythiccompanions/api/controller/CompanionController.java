package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.*;
import com.mythiccompanions.api.entity.Companion;
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

    @GetMapping("/{id}")
    public ResponseEntity<SanctuaryDto> getCompanionDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Companion companion = companionService.getCompanionByIdAndUsername(id, userDetails.getUsername());
        SanctuaryDto sanctuaryDto = convertToSanctuaryDto(companion);

        return ResponseEntity.ok(sanctuaryDto);
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

    private SanctuaryDto convertToSanctuaryDto(Companion companion) {
        final String speciesId = companion.getSpeciesId();
        StatsDto stats = new StatsDto(companion.getHealth(), companion.getEnergy(), companion.getHunger(), companion.getHappiness(), companion.getHygiene());
        CooldownsDto cooldowns = new CooldownsDto(companion.getNextFeedTimestamp(), companion.getNextPlayTimestamp(), companion.getNextCleanTimestamp(), companion.getNextSleepTimestamp(), companion.getNextTrainTimestamp());

        // TODO: Replace with real data from ProgressionService when implemented
        ProgressionDto progression = new ProgressionDto(companion.getExperiencePoints(), 1, companion.getExperiencePoints(), 100);

        SpeciesDto speciesDto = gameDataService.getSpeciesById(speciesId)
                .map(s -> new SpeciesDto(s.getSpeciesId(), s.getName(), s.getDescription()))
                .orElse(null);

        String universeId = gameDataService.getUniverses().stream()
                .filter(universe -> universe.getSpeciesIds().contains(speciesId))
                .findFirst()
                .map(Universe::getId)
                .orElse("UNKNOWN_UNIVERSE");

        EquippedWeaponDto weaponDto = null;

        return new SanctuaryDto(
                companion.getId(),
                companion.getName(),
                universeId,
                speciesDto,
                companion.getStatus(),
                stats,
                progression,
                weaponDto,
                cooldowns
        );
    }

    @PostMapping("/{id}/feed")
    public ResponseEntity<SanctuaryDto> feedCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.feedCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(convertToSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/play")
    public ResponseEntity<SanctuaryDto> playWithCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.playWithCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(convertToSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/clean")
    public ResponseEntity<SanctuaryDto> cleanCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.cleanCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(convertToSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/sleep")
    public ResponseEntity<SanctuaryDto> sleepCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            Companion updatedCompanion = companionService.sleepCompanion(id, userDetails.getUsername());
            return ResponseEntity.ok(convertToSanctuaryDto(updatedCompanion));
    }

    @PostMapping("/{id}/train")
    public ResponseEntity<SanctuaryDto> trainCompanion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Companion updatedCompanion = progressionService.trainCompanion(id, userDetails.getUsername());
        return ResponseEntity.ok(convertToSanctuaryDto(updatedCompanion));
    }
}
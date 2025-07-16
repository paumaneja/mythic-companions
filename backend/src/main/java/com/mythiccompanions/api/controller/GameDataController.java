package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.AdoptionUniverseDto;
import com.mythiccompanions.api.model.Species;
import com.mythiccompanions.api.model.Universe;
import com.mythiccompanions.api.service.GameDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/game-data")
@RequiredArgsConstructor
public class GameDataController {

    private final GameDataService gameDataService;

    @GetMapping("/universes")
    public ResponseEntity<List<Universe>> getAllUniverses() {
        return ResponseEntity.ok(gameDataService.getUniverses());
    }

    @GetMapping("/species")
    public ResponseEntity<List<Species>> getAllSpecies() {
        return ResponseEntity.ok(gameDataService.getSpecies());
    }

    @GetMapping("/adoption-options")
    public ResponseEntity<List<AdoptionUniverseDto>> getAdoptionOptions() {
        return ResponseEntity.ok(gameDataService.getAdoptionOptions());
    }

}

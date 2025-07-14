package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.CompanionAdoptionDto;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.service.CompanionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/companions")
@RequiredArgsConstructor
public class CompanionController {

    private final CompanionService companionService;

    @PostMapping
    public ResponseEntity<Companion> adoptCompanion(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CompanionAdoptionDto adoptionDto) {

        String username = userDetails.getUsername();
        Companion newCompanion = companionService.adoptCompanion(username, adoptionDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(newCompanion);
    }
}
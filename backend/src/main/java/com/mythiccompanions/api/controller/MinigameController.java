package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.MinigameResultDto;
import com.mythiccompanions.api.dto.SubmitScoreRequestDto;
import com.mythiccompanions.api.service.MinigameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/minigames")
@RequiredArgsConstructor
public class MinigameController {

    private final MinigameService minigameService;

    @PostMapping("/submit-score")
    public ResponseEntity<MinigameResultDto> submitScore(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitScoreRequestDto scoreRequest) {

        MinigameResultDto result = minigameService.submitScore(userDetails.getUsername(), scoreRequest);
        return ResponseEntity.ok(result);
    }
}
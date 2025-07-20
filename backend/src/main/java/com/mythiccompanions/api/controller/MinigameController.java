package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.RankingDto;
import com.mythiccompanions.api.dto.SubmitScoreRequestDto;
import com.mythiccompanions.api.dto.SubmitScoreResponseDto;
import com.mythiccompanions.api.mapper.UserMapper;
import com.mythiccompanions.api.service.MinigameService;
import com.mythiccompanions.api.service.ScoreSubmissionResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/minigames")
@RequiredArgsConstructor
public class MinigameController {

    private final MinigameService minigameService;
    private final UserMapper userMapper;

    @PostMapping("/submit-score")
    public ResponseEntity<SubmitScoreResponseDto> submitScore(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitScoreRequestDto scoreRequest) {

        ScoreSubmissionResult result = minigameService.submitScore(userDetails.getUsername(), scoreRequest);

        SubmitScoreResponseDto responseDto = new SubmitScoreResponseDto(
                result.gameResult(),
                userMapper.toDto(result.updatedUser())
        );

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/ranking/{gameId}")
    public ResponseEntity<List<RankingDto>> getRanking(@PathVariable String gameId) {
        List<RankingDto> ranking = minigameService.getRanking(gameId);
        return ResponseEntity.ok(ranking);
    }
}
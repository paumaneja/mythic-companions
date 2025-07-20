package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.MinigameResultDto;
import com.mythiccompanions.api.entity.User;

public record ScoreSubmissionResult(
        MinigameResultDto gameResult,
        User updatedUser
) {}
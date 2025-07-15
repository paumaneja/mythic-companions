package com.mythiccompanions.api.service;

import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.exception.ActionUnavailableException;
import com.mythiccompanions.api.model.ProgressionRules;
import com.mythiccompanions.api.model.Status;
import com.mythiccompanions.api.repository.CompanionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProgressionService {

    private final CompanionService companionService;
    private final CompanionRepository companionRepository;
    private final GameDataService gameDataService;

    @Transactional
    public Companion trainCompanion(Long companionId, String username) {
        Companion companion = companionService.getCompanionByIdAndUsername(companionId, username);

        if (companion.getStatus() != Status.ACTIVE) {
            throw new ActionUnavailableException("Cannot train: Companion status is " + companion.getStatus());
        }
        // TODO: Re-enable this check once the equipment system is implemented.
        /*
        if (companion.getEquippedWeaponId() == null) {
            throw new ActionUnavailableException("Cannot train: No weapon equipped.");
        }
        */
        if (companion.getNextTrainTimestamp() != null && LocalDateTime.now().isBefore(companion.getNextTrainTimestamp())) {
            throw new ActionUnavailableException("Action 'Train' is on cooldown.");
        }

        ProgressionRules rules = gameDataService.getProgressionRules();
        if (companion.getEnergy() < rules.getEnergyCostTrain()) {
            throw new ActionUnavailableException("Cannot train: Not enough energy.");
        }

        companion.setExperiencePoints(companion.getExperiencePoints() + rules.getTrainXpGain());
        companion.setEnergy(companion.getEnergy() - rules.getEnergyCostTrain());
        companion.setHygiene(companion.getHygiene() - rules.getHygieneCostTrain());

        long cooldownHours = gameDataService.getActionDefinition("TRAIN").getCooldownHours();
        companion.setNextTrainTimestamp(LocalDateTime.now().plusHours(cooldownHours));
        companion.setLastStatsUpdateTimestamp(LocalDateTime.now());

        return companionRepository.save(companion);
    }

    // TODO: We will implement the 'calculateLevel' method here when we need to display it.
}
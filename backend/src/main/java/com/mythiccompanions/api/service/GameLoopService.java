package com.mythiccompanions.api.service;

import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.model.DecayRates;
import com.mythiccompanions.api.model.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GameLoopService {

    private final GameDataService gameDataService;

    /**
     * Calculates and applies passive stat decay based on time passed.
     * This method MODIFIES the companion object but does NOT save it.
     * The calling service is responsible for persistence.
     * @param companion The companion to update.
     */
    public void applyPassiveEffects(Companion companion) {
        if (companion.getLastStatsUpdateTimestamp() == null) {
            companion.setLastStatsUpdateTimestamp(LocalDateTime.now());
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastUpdate = companion.getLastStatsUpdateTimestamp();
        long totalHoursToSimulate = Duration.between(lastUpdate, now).toHours();

        if (totalHoursToSimulate <= 0) {
            return;
        }

        for (int i = 0; i < totalHoursToSimulate; i++) {
            if (companion.getStatus() == Status.HOSPITALIZED) {
                break;
            }
            applyOneHourOfDecay(companion);
            checkAndApplyStatusChanges(companion);
        }

        companion.setLastStatsUpdateTimestamp(lastUpdate.plusHours(totalHoursToSimulate));
    }

    private void applyOneHourOfDecay(Companion companion) {
        DecayRates decayRates = gameDataService.getGameRules().getDecayRatesPerHour();

        companion.setEnergy(Math.max(0, companion.getEnergy() - decayRates.getEnergy()));
        companion.setHunger(Math.max(0, companion.getHunger() - decayRates.getHunger()));
        companion.setHappiness(Math.max(0, companion.getHappiness() - decayRates.getHappiness()));
        companion.setHygiene(Math.max(0, companion.getHygiene() - decayRates.getHygiene()));

        if (companion.getStatus() == Status.SICK) {
            int sicknessDecay = gameDataService.getGameRules().getSicknessHealthDecayPerHour();
            companion.setHealth(Math.max(0, companion.getHealth() - sicknessDecay));
        }
    }

    private void checkAndApplyStatusChanges(Companion companion) {
        if (companion.getStatus() == Status.ACTIVE) {
            if (companion.getHunger() == 0 || companion.getHygiene() == 0) {
                companion.setStatus(Status.SICK);
            }
        }

        if (companion.getStatus() == Status.SICK) {
            if (companion.getHealth() == 0) {
                companion.setStatus(Status.HOSPITALIZED);
            }
        }
    }
}
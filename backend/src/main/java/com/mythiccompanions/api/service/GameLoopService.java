package com.mythiccompanions.api.service;

import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.model.DecayRates;
import jakarta.transaction.Transactional;
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
    public void applyPassiveDecay(Companion companion) {
        if (companion.getLastStatsUpdateTimestamp() == null) {
            companion.setLastStatsUpdateTimestamp(LocalDateTime.now());
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        long hoursPassed = Duration.between(companion.getLastStatsUpdateTimestamp(), now).toHours();

        if (hoursPassed <= 0) {
            return;
        }

        DecayRates decayRates = gameDataService.getGameRules().getDecayRatesPerHour();

        companion.setEnergy(Math.max(0, companion.getEnergy() - (int)(decayRates.getEnergy() * hoursPassed)));
        companion.setHunger(Math.max(0, companion.getHunger() - (int)(decayRates.getHunger() * hoursPassed)));
        companion.setHappiness(Math.max(0, companion.getHappiness() - (int)(decayRates.getHappiness() * hoursPassed)));
        companion.setHygiene(Math.max(0, companion.getHygiene() - (int)(decayRates.getHygiene() * hoursPassed)));

        // TODO: Implement status change logic (SICK, HOSPITALIZED) here later.

        companion.setLastStatsUpdateTimestamp(companion.getLastStatsUpdateTimestamp().plusHours(hoursPassed));
    }
}
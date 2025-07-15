package com.mythiccompanions.api.service;

import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.model.DecayRates;
import com.mythiccompanions.api.model.GameRules;
import com.mythiccompanions.api.model.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GameLoopServiceTest {

    @Mock
    private GameDataService gameDataService;

    @InjectMocks
    private GameLoopService gameLoopService;

    private GameRules gameRules;

    @BeforeEach
    void setUp() {
        DecayRates decayRates = new DecayRates();
        decayRates.setHunger(5);
        decayRates.setHygiene(4);
        decayRates.setEnergy(2);
        decayRates.setHappiness(3);

        gameRules = new GameRules();
        gameRules.setDecayRatesPerHour(decayRates);
        gameRules.setSicknessHealthDecayPerHour(10);
    }

    @Test
    void shouldBecomeSick_WhenHungerReachesZero() {
        when(gameDataService.getGameRules()).thenReturn(gameRules);

        Companion companion = new Companion();
        companion.setStatus(Status.ACTIVE);
        companion.setHunger(20);
        companion.setLastStatsUpdateTimestamp(LocalDateTime.now().minusHours(5));

        gameLoopService.applyPassiveEffects(companion);

        assertEquals(Status.SICK, companion.getStatus());
        assertEquals(0, companion.getHunger());
    }

    @Test
    void shouldBecomeHospitalized_WhenHealthReachesZero() {
        when(gameDataService.getGameRules()).thenReturn(gameRules);

        Companion companion = new Companion();
        companion.setStatus(Status.SICK);
        companion.setHealth(50);
        companion.setLastStatsUpdateTimestamp(LocalDateTime.now().minusHours(6));

        gameLoopService.applyPassiveEffects(companion);

        assertEquals(Status.HOSPITALIZED, companion.getStatus());
        assertEquals(0, companion.getHealth());
    }

    @Test
    void shouldNotChangeStatus_WhenNotEnoughTimePasses() {
        Companion companion = new Companion();
        companion.setStatus(Status.ACTIVE);
        companion.setHunger(100);
        // Simulate only 30 minutes have passed (0 full hours)
        companion.setLastStatsUpdateTimestamp(LocalDateTime.now().minusMinutes(30));

        gameLoopService.applyPassiveEffects(companion);

        assertEquals(Status.ACTIVE, companion.getStatus());
        assertEquals(100, companion.getHunger());
    }
}
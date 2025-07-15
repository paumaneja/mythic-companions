package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.ProgressionDto;
import com.mythiccompanions.api.model.ProgressionRules;
import com.mythiccompanions.api.model.XpLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressionServiceTest {

    @Mock
    private GameDataService gameDataService;

    @InjectMocks
    private ProgressionService progressionService;

    @BeforeEach
    void setUp() {
        // Prepare the mock data that our tests will use
        ProgressionRules rules = new ProgressionRules();
        List<XpLevel> xpLevels = List.of(
                createXpLevel(1, 0),
                createXpLevel(2, 100),
                createXpLevel(3, 250),
                createXpLevel(4, 500)
        );
        rules.setXpLevels(xpLevels);

        // Program the fake GameDataService to return our test data
        when(gameDataService.getProgressionRules()).thenReturn(rules);
    }

    private XpLevel createXpLevel(int level, int xp) {
        XpLevel xpLevel = new XpLevel();
        xpLevel.setLevel(level);
        xpLevel.setXpRequired(xp);
        return xpLevel;
    }

    @Test
    void shouldBeLevel1_WhenXpIsZero() {
        // Arrange (Setup)
        int totalXp = 0;

        // Act (Execution)
        ProgressionDto result = progressionService.calculateLevel(totalXp);

        // Assert (Verification)
        assertEquals(1, result.level());
        assertEquals(0, result.currentXpInLevel());
        assertEquals(100, result.xpForNextLevel());
    }

    @Test
    void shouldBeLevel2_WhenXpIsExactly100() {
        // Arrange
        int totalXp = 100;

        // Act
        ProgressionDto result = progressionService.calculateLevel(totalXp);

        // Assert
        assertEquals(2, result.level());
        assertEquals(0, result.currentXpInLevel());
        assertEquals(250, result.xpForNextLevel());
    }

    @Test
    void shouldBeInProgressToLevel3_WhenXpIsBetweenLevels() {
        // Arrange
        int totalXp = 150;

        // Act
        ProgressionDto result = progressionService.calculateLevel(totalXp);

        // Assert
        assertEquals(2, result.level());
        assertEquals(50, result.currentXpInLevel()); // 150 total - 100 for level 2 = 50
        assertEquals(250, result.xpForNextLevel());
    }
}
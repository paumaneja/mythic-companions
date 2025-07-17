package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.MinigameResultDto;
import com.mythiccompanions.api.dto.MinigameRewardDto;
import com.mythiccompanions.api.dto.RankingDto;
import com.mythiccompanions.api.dto.SubmitScoreRequestDto;
import com.mythiccompanions.api.entity.RankingEntry;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.model.LootTableEntry;
import com.mythiccompanions.api.model.Minigame;
import com.mythiccompanions.api.repository.RankingRepository;
import com.mythiccompanions.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MinigameService {

    private final UserRepository userRepository;
    private final RankingRepository rankingRepository;
    private final InventoryService inventoryService;
    private final GameDataService gameDataService;
    private final Random random = new Random();

    @Transactional
    public MinigameResultDto submitScore(String username, SubmitScoreRequestDto scoreRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Minigame minigameData = gameDataService.getMinigameById(scoreRequest.gameId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid gameId: " + scoreRequest.gameId()));

        boolean isNewHighScore = rankingRepository.findByUserAndGameId(user, scoreRequest.gameId())
                .map(entry -> {
                    if (scoreRequest.score() > entry.getScore()) {
                        entry.setScore(scoreRequest.score());
                        entry.setLastUpdated(ZonedDateTime.now());
                        return true;
                    }
                    return false;
                })
                .orElseGet(() -> {
                    RankingEntry newEntry = new RankingEntry();
                    newEntry.setUser(user);
                    newEntry.setGameId(scoreRequest.gameId());
                    newEntry.setScore(scoreRequest.score());
                    newEntry.setLastUpdated(ZonedDateTime.now());
                    rankingRepository.save(newEntry);
                    return true;
                });

        int coinsEarned = (int) (scoreRequest.score() * minigameData.getRewards().getCoinMultiplier());
        user.setMythicCoins(user.getMythicCoins() + coinsEarned);

        String awardedItemId = null;
        if (Math.random() < minigameData.getRewards().getItemLootChance()) {
            awardedItemId = pickRandomItemFromLootTable(minigameData.getRewards().getLootTable());
            if (awardedItemId != null) {
                inventoryService.giveItemToUser(username, awardedItemId, 1);
            }
        }

        MinigameRewardDto rewards = new MinigameRewardDto(coinsEarned, awardedItemId, awardedItemId != null ? 1 : 0);
        return new MinigameResultDto(scoreRequest.score(), isNewHighScore, rewards);
    }

    private String pickRandomItemFromLootTable(List<LootTableEntry> lootTable) {
        if (lootTable == null || lootTable.isEmpty()) {
            return null;
        }
        int totalWeight = lootTable.stream().mapToInt(LootTableEntry::getWeight).sum();
        int randomValue = this.random.nextInt(totalWeight);

        int currentWeight = 0;
        for (LootTableEntry entry : lootTable) {
            currentWeight += entry.getWeight();
            if (randomValue < currentWeight) {
                return entry.getItemId();
            }
        }
        return null;
    }

    public List<RankingDto> getRanking(String gameId) {
        List<RankingEntry> rankingEntries = rankingRepository.findTop10ByGameIdOrderByScoreDesc(gameId);

        return rankingEntries.stream()
                .map(entry -> new RankingDto(
                        entry.getUser().getUsername(),
                        entry.getUser().getAvatarUrl(),
                        entry.getScore()
                ))
                .collect(Collectors.toList());
    }
}
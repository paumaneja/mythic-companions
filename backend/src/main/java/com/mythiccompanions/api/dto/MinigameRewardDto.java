package com.mythiccompanions.api.dto;

public record MinigameRewardDto(
        int mythicCoins,
        String awardedItemId,
        int awardedItemQuantity
) {}
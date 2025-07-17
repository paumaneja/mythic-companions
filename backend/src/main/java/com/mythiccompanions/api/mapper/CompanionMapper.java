package com.mythiccompanions.api.mapper;

import com.mythiccompanions.api.dto.*;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.model.Universe;
import com.mythiccompanions.api.service.GameDataService;
import com.mythiccompanions.api.service.ProgressionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanionMapper {

    private final GameDataService gameDataService;
    private final ProgressionService progressionService;

    public SanctuaryDto toSanctuaryDto(Companion companion) {
        User user = companion.getUser();
        final String speciesId = companion.getSpeciesId();

        StatsDto stats = new StatsDto(companion.getHealth(), companion.getEnergy(), companion.getHunger(), companion.getHappiness(), companion.getHygiene());
        CooldownsDto cooldowns = new CooldownsDto(companion.getNextFeedTimestamp(), companion.getNextPlayTimestamp(), companion.getNextCleanTimestamp(), companion.getNextSleepTimestamp(), companion.getNextTrainTimestamp());
        ProgressionDto progression = progressionService.calculateLevel(companion.getExperiencePoints());

        SpeciesDto speciesDto = gameDataService.getSpeciesById(speciesId)
                .map(s -> new SpeciesDto(s.getSpeciesId(), s.getName(), s.getDescription(), s.getAssets()))
                .orElse(null);

        String universeId = gameDataService.getUniverses().stream()
                .filter(universe -> universe.getSpeciesIds().contains(speciesId))
                .findFirst()
                .map(Universe::getId)
                .orElse("UNKNOWN_UNIVERSE");

        EquippedWeaponDto weaponDto = null;
        if (companion.getEquippedWeaponId() != null) {
            weaponDto = gameDataService.getItemById(companion.getEquippedWeaponId())
                    .map(itemData -> new EquippedWeaponDto(
                            itemData.getItemId(),
                            itemData.getName(),
                            itemData.getImageUrl()
                    ))
                    .orElse(null);
        }

        return new SanctuaryDto(
                companion.getId(),
                companion.getName(),
                universeId,
                speciesDto,
                companion.getStatus(),
                stats,
                progression,
                weaponDto,
                cooldowns
        );
    }

    public CompanionCardDto toCompanionCardDto(Companion companion) {
        String imageUrl = getCompanionImageUrl(companion);

        return new CompanionCardDto(
                companion.getId(),
                companion.getName(),
                companion.getSpeciesId(),
                companion.getStatus(),
                imageUrl,
                companion.getEquippedWeaponId()
        );
    }

    private String getCompanionImageUrl(Companion companion) {
        return gameDataService.getSpeciesById(companion.getSpeciesId())
                .map(species -> {
                    if (companion.getEquippedWeaponId() != null && species.getAssets().getStaticEquipped() != null) {
                        return species.getAssets().getStaticEquipped().getOrDefault(companion.getEquippedWeaponId(), species.getAssets().getStaticUnequipped());
                    }
                    return species.getAssets().getStaticUnequipped();
                })
                .orElse("/assets/companions/default.png");
    }
}
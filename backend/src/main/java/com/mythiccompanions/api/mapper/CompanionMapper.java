package com.mythiccompanions.api.mapper;

import com.mythiccompanions.api.dto.*;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.service.GameDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanionMapper {

    private final GameDataService gameDataService;

    public SanctuaryDto toSanctuaryDto(Companion companion) {
        User user = companion.getUser();
        final String speciesId = companion.getSpeciesId();

        StatsDto stats = new StatsDto(companion.getHealth(), companion.getEnergy(), companion.getHunger(), companion.getHappiness(), companion.getHygiene());
        CooldownsDto cooldowns = new CooldownsDto(companion.getNextFeedTimestamp(), companion.getNextPlayTimestamp(), companion.getNextCleanTimestamp(), companion.getNextSleepTimestamp(), companion.getNextTrainTimestamp());
        ProgressionDto progression = new ProgressionDto(companion.getExperiencePoints(), 1, companion.getExperiencePoints(), 100); // Placeholder

        SpeciesDto speciesDto = gameDataService.getSpeciesById(speciesId)
                .map(s -> new SpeciesDto(s.getSpeciesId(), s.getName(), s.getDescription()))
                .orElse(null);

        String universeId = gameDataService.getUniverses().stream()
                .filter(universe -> universe.getSpeciesIds().contains(speciesId))
                .findFirst()
                .map(universe -> universe.getId())
                .orElse("UNKNOWN_UNIVERSE");

        EquippedWeaponDto weaponDto = null; // TODO: Implement when equipment is done

        return new SanctuaryDto(
                companion.getId(), companion.getName(), universeId, speciesDto,
                companion.getStatus(), stats, progression, weaponDto, cooldowns
        );
    }
}
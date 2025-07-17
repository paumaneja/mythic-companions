package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.CompanionAdoptionDto;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.ActionUnavailableException;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.model.ActionDefinition;
import com.mythiccompanions.api.model.ActionEffects;
import com.mythiccompanions.api.model.Status;
import com.mythiccompanions.api.repository.CompanionRepository;
import com.mythiccompanions.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.function.IntUnaryOperator;

@Service
@RequiredArgsConstructor
public class CompanionService {

    private final CompanionRepository companionRepository;
    private final UserRepository userRepository;
    private final GameDataService gameDataService;
    private final GameLoopService gameLoopService;

    public Companion adoptCompanion(String username, CompanionAdoptionDto adoptionDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));

        if (companionRepository.countByUser(user) >= 6) {
            throw new IllegalStateException("Adoption failed: User already has the maximum number of companions (6).");
        }
        if (companionRepository.existsByUserAndSpeciesId(user, adoptionDto.speciesId())) {
            throw new IllegalStateException("Adoption failed: User already has a companion of species '" + adoptionDto.speciesId() + "'.");
        }
        gameDataService.getSpeciesById(adoptionDto.speciesId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid species ID: " + adoptionDto.speciesId()));

        Companion newCompanion = new Companion();
        newCompanion.setUser(user);
        newCompanion.setName(adoptionDto.name());
        newCompanion.setSpeciesId(adoptionDto.speciesId());
        newCompanion.setStatus(Status.ACTIVE);

        newCompanion.setHealth(100);
        newCompanion.setEnergy(100);
        newCompanion.setHunger(100);
        newCompanion.setHappiness(100);
        newCompanion.setHygiene(100);

        return companionRepository.save(newCompanion);
    }

    public List<Companion> findCompanionsByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(companionRepository::findByUser)
                .orElse(Collections.emptyList());
    }

    public Companion getCompanionByIdAndUsername(Long companionId, String username) {
        Companion companion = companionRepository.findById(companionId)
                .orElseThrow(() -> new ResourceNotFoundException("Companion not found with id: " + companionId));

        if (!companion.getUser().getUsername().equals(username)) {
            throw new AccessDeniedException("User does not have permission to access this companion.");
        }

        gameLoopService.applyPassiveEffects(companion);

        return companionRepository.save(companion);
    }

    @Transactional
    public Companion feedCompanion(Long companionId, String username) {
        Companion companion = getCompanionByIdAndUsername(companionId, username);

        if (companion.getStatus() != Status.ACTIVE) {
            throw new ActionUnavailableException("Action 'Feed' is unavailable. Companion status is " + companion.getStatus());
        }
        if (companion.getNextFeedTimestamp() != null && ZonedDateTime.now().isBefore(companion.getNextFeedTimestamp())) {
            throw new ActionUnavailableException("Action 'Feed' is on cooldown.");
        }

        ActionDefinition feedAction = gameDataService.getActionDefinition("FEED");
        ActionEffects effects = feedAction.getEffects();

        IntUnaryOperator clamp = value -> Math.max(0, Math.min(100, value));

        companion.setHunger(clamp.applyAsInt(companion.getHunger() + effects.getHunger()));
        companion.setHappiness(clamp.applyAsInt(companion.getHappiness() + effects.getHappiness()));
        companion.setHygiene(clamp.applyAsInt(companion.getHygiene() + effects.getHygiene()));
        companion.setEnergy(clamp.applyAsInt(companion.getEnergy() + effects.getEnergy()));

        companion.setNextFeedTimestamp(ZonedDateTime.now().plusHours(feedAction.getCooldownHours()));
        companion.setLastStatsUpdateTimestamp(ZonedDateTime.now());

        return companionRepository.save(companion);
    }

    @Transactional
    public Companion playWithCompanion(Long companionId, String username) {
        Companion companion = getCompanionByIdAndUsername(companionId, username);

        if (companion.getStatus() != Status.ACTIVE) {
            throw new ActionUnavailableException("Action 'Play' is unavailable. Companion status is " + companion.getStatus());
        }
        if (companion.getNextPlayTimestamp() != null && ZonedDateTime.now().isBefore(companion.getNextPlayTimestamp())) {
            throw new ActionUnavailableException("Action 'Play' is on cooldown.");
        }

        ActionDefinition playAction = gameDataService.getActionDefinition("PLAY");
        ActionEffects effects = playAction.getEffects();
        IntUnaryOperator clamp = value -> Math.max(0, Math.min(100, value));

        companion.setHappiness(clamp.applyAsInt(companion.getHappiness() + effects.getHappiness()));
        companion.setHygiene(clamp.applyAsInt(companion.getHygiene() + effects.getHygiene()));
        companion.setHunger(clamp.applyAsInt(companion.getHunger() + effects.getHunger()));
        companion.setEnergy(clamp.applyAsInt(companion.getEnergy() + effects.getEnergy()));

        companion.setNextPlayTimestamp(ZonedDateTime.now().plusHours(playAction.getCooldownHours()));
        companion.setLastStatsUpdateTimestamp(ZonedDateTime.now());

        return companionRepository.save(companion);
    }

    @Transactional
    public Companion cleanCompanion(Long companionId, String username) {
        Companion companion = getCompanionByIdAndUsername(companionId, username);

        if (companion.getStatus() != Status.ACTIVE) {
            throw new ActionUnavailableException("Action 'Clean' is unavailable. Companion status is " + companion.getStatus());
        }
        if (companion.getNextCleanTimestamp() != null && ZonedDateTime.now().isBefore(companion.getNextCleanTimestamp())) {
            throw new ActionUnavailableException("Action 'Clean' is on cooldown.");
        }

        ActionDefinition cleanAction = gameDataService.getActionDefinition("CLEAN");
        ActionEffects effects = cleanAction.getEffects();
        IntUnaryOperator clamp = value -> Math.max(0, Math.min(100, value));

        companion.setHygiene(clamp.applyAsInt(companion.getHygiene() + effects.getHygiene()));
        companion.setHappiness(clamp.applyAsInt(companion.getHappiness() + effects.getHappiness()));
        companion.setEnergy(clamp.applyAsInt(companion.getEnergy() + effects.getEnergy()));

        companion.setNextCleanTimestamp(ZonedDateTime.now().plusHours(cleanAction.getCooldownHours()));
        companion.setLastStatsUpdateTimestamp(ZonedDateTime.now());

        return companionRepository.save(companion);
    }

    @Transactional
    public Companion sleepCompanion(Long companionId, String username) {
        Companion companion = getCompanionByIdAndUsername(companionId, username);

        if (companion.getStatus() != Status.ACTIVE) {
            throw new ActionUnavailableException("Action 'Sleep' is unavailable. Companion status is " + companion.getStatus());
        }
        if (companion.getNextSleepTimestamp() != null && ZonedDateTime.now().isBefore(companion.getNextSleepTimestamp())) {
            throw new ActionUnavailableException("Action 'Sleep' is on cooldown.");
        }

        ActionDefinition sleepAction = gameDataService.getActionDefinition("SLEEP");

        companion.setEnergy(100);

        companion.setNextSleepTimestamp(ZonedDateTime.now().plusHours(sleepAction.getCooldownHours()));
        companion.setLastStatsUpdateTimestamp(ZonedDateTime.now());

        return companionRepository.save(companion);
    }
}
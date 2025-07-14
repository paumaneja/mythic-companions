package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.CompanionAdoptionDto;
import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.model.Status;
import com.mythiccompanions.api.repository.CompanionRepository;
import com.mythiccompanions.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

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

        gameLoopService.applyPassiveDecay(companion);

        return companionRepository.save(companion);
    }
}
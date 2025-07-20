package com.mythiccompanions.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.mythiccompanions.api.dto.AdoptionSpeciesDto;
import com.mythiccompanions.api.dto.AdoptionUniverseDto;
import com.mythiccompanions.api.model.*;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameDataService {

    private GameData gameData;
    private final ResourceLoader resourceLoader;

    @PostConstruct
    public void loadGameData() throws IOException {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        Resource resource = resourceLoader.getResource("classpath:game-data.yml");
        try (InputStream inputStream = resource.getInputStream()) {
            this.gameData = mapper.readValue(inputStream, GameData.class);
        }
    }

    public List<Species> getSpecies() {
        return gameData.getSpecies();
    }

    public Optional<Species> getSpeciesById(String speciesId) {
        return gameData.getSpecies().stream()
                .filter(species -> species.getSpeciesId().equals(speciesId))
                .findFirst();
    }

    public List<Universe> getUniverses() {
        return gameData.getUniverses();
    }

    public GameRules getGameRules() {
        return gameData.getGameRules();
    }

    public ActionDefinition getActionDefinition(String actionName) {
        return gameData.getGameRules().getActions().get(actionName);
    }

    public ProgressionRules getProgressionRules() {
        return gameData.getProgression();
    }

    public Optional<Item> getItemById(String itemId) {
        return gameData.getItems().stream()
                .filter(item -> item.getItemId().equals(itemId))
                .findFirst();
    }

    public List<Item> getItems() {
        return gameData.getItems();
    }

    public Optional<Minigame> getMinigameById(String gameId) {
        return gameData.getMinigames().stream()
                .filter(mg -> mg.getId().equals(gameId))
                .findFirst();
    }

    public List<AdoptionUniverseDto> getAdoptionOptions() {
        return getUniverses().stream()
                .map(universe -> {
                    List<AdoptionSpeciesDto> speciesInUniverse = getSpecies().stream()
                            .filter(species -> universe.getSpeciesIds().contains(species.getSpeciesId()))
                            .map(species -> new AdoptionSpeciesDto(species.getSpeciesId(), species.getName()))
                            .collect(Collectors.toList());

                    return new AdoptionUniverseDto(universe.getId(), universe.getName(), speciesInUniverse);
                })
                .collect(Collectors.toList());
    }

    public Map<String, UiTheme> getUiThemes() {
        return gameData.getUiThemes();
    }

    public List<Minigame> getMinigames() {
        return gameData.getMinigames();
    }
}
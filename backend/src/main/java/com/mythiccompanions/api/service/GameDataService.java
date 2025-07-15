package com.mythiccompanions.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.mythiccompanions.api.model.*;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

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

    public List<Species> getAllSpecies() {
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
}
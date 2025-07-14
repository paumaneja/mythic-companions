package com.mythiccompanions.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.mythiccompanions.api.model.GameData;
import com.mythiccompanions.api.model.Species;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class GameDataService {

    private GameData gameData;

    @PostConstruct
    public void loadGameData() throws IOException {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        File file = ResourceUtils.getFile("classpath:game-data.yml");
        this.gameData = mapper.readValue(file, GameData.class);
    }

    public List<Species> getAllSpecies() {
        return gameData.getSpecies();
    }

    public Optional<Species> getSpeciesById(String speciesId) {
        return gameData.getSpecies().stream()
                .filter(species -> species.getSpeciesId().equals(speciesId))
                .findFirst();
    }

    // We can add more methods here to get other game data as needed
}
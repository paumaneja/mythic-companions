package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class GameData {
    @JsonProperty("ui_themes")
    private Map<String, UiTheme> uiThemes;

    @JsonProperty("universes")
    private List<Universe> universes;

    @JsonProperty("species")
    private List<Species> species;

    @JsonProperty("items")
    private List<Item> items;

    @JsonProperty("game_rules")
    private GameRules gameRules;

    @JsonProperty("progression")
    private ProgressionRules progression;

    @JsonProperty("minigames")
    private List<Minigame> minigames;

    @JsonProperty("lore_quiz")
    private Map<String, List<LoreQuestion>> loreQuiz;
}
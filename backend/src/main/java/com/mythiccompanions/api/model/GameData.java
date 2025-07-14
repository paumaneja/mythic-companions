package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class GameData {
    @JsonProperty("ui_themes")
    private Map<String, UiTheme> uiThemes;
    private List<Universe> universes;
    private List<Species> species;
    // We will add items, progression, etc. here later
}
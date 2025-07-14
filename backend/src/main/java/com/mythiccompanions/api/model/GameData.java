package com.mythiccompanions.api.model;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class GameData {
    private Map<String, UiTheme> ui_themes;
    private List<Universe> universes;
    private List<Species> species;
    // We will add items, progression, etc. here later
}
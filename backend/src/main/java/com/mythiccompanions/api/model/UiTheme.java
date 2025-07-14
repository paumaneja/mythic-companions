package com.mythiccompanions.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UiTheme {
    @JsonProperty("action_icons")
    private ActionIcons actionIcons;
}
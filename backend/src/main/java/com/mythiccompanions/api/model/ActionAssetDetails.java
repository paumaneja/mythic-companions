package com.mythiccompanions.api.model;

import lombok.Data;

import java.util.Map;

@Data
public class ActionAssetDetails {
    private String play;
    private String feed;
    private String clean;
    private String sleep;
    private Map<String, String> train;
}

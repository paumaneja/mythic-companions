package com.mythiccompanions.api.model;

import lombok.Data;
import java.util.List;

@Data
public class Universe {
    private String id;
    private String name;
    private List<String> speciesIds;
}
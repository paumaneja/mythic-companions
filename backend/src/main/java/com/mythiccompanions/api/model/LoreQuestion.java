package com.mythiccompanions.api.model;

import lombok.Data;
import java.util.List;

@Data
public class LoreQuestion {
    private String question;
    private List<String> options;
    private int correctAnswer;
}
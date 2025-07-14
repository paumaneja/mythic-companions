package com.mythiccompanions.api.entity;

import com.mythiccompanions.api.model.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "companions")
@Getter
@Setter
public class Companion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String speciesId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private int health = 100;
    private int energy = 100;
    private int hunger = 100;
    private int happiness = 100;
    private int hygiene = 100;

    private int experiencePoints = 0;

    private LocalDateTime nextFeedTimestamp;
    private LocalDateTime nextPlayTimestamp;
    private LocalDateTime nextCleanTimestamp;
    private LocalDateTime nextSleepTimestamp;
    private LocalDateTime nextTrainTimestamp;

    private String equippedWeaponId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
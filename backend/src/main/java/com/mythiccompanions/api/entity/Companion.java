package com.mythiccompanions.api.entity;

import com.mythiccompanions.api.model.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@Table(name = "companions", indexes = {
        @Index(name = "idx_companion_user", columnList = "user_id")
})
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

    private ZonedDateTime nextFeedTimestamp;
    private ZonedDateTime nextPlayTimestamp;
    private ZonedDateTime nextCleanTimestamp;
    private ZonedDateTime nextSleepTimestamp;
    private ZonedDateTime nextTrainTimestamp;

    private ZonedDateTime lastStatsUpdateTimestamp;

    private String equippedWeaponId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
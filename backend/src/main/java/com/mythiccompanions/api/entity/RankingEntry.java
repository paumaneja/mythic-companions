package com.mythiccompanions.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.ZonedDateTime;

@Entity
@Table(name = "ranking_entries",
        uniqueConstraints = { @UniqueConstraint(columnNames = {"user_id", "game_id"}) },
        indexes = { @Index(name = "idx_ranking_game_score", columnList = "game_id, score DESC") }
)
@Data
public class RankingEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "game_id", nullable = false)
    private String gameId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private ZonedDateTime lastUpdated;
}
package com.mythiccompanions.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "ranking_entries", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "game_id"})
})
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
    private LocalDateTime lastUpdated;
}
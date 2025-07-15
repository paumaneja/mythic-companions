package com.mythiccompanions.api.repository;

import com.mythiccompanions.api.entity.RankingEntry;
import com.mythiccompanions.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingRepository extends JpaRepository<RankingEntry, Long> {
    Optional<RankingEntry> findByUserAndGameId(User user, String gameId);
    List<RankingEntry> findTop10ByGameIdOrderByScoreDesc(String gameId);
}
package com.mythiccompanions.api.repository;

import com.mythiccompanions.api.entity.Companion;
import com.mythiccompanions.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanionRepository extends JpaRepository<Companion, Long> {
    int countByUser(User user);
    boolean existsByUserAndSpeciesId(User user, String speciesId);
    List<Companion> findByUser(User user);
}
package com.mythiccompanions.api.repository;

import com.mythiccompanions.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u.avatarUrl FROM User u WHERE u.avatarUrl IS NOT NULL")
    List<String> findAllAvatarUrls();
}
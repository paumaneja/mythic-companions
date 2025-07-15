package com.mythiccompanions.api.repository;

import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.entity.UserInventory;
import com.mythiccompanions.api.entity.UserInventoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInventoryRepository extends JpaRepository<UserInventory, UserInventoryId> {
    List<UserInventory> findByUser(User user);
    Optional<UserInventory> findByUserAndId_ItemId(User user, String itemId);
}
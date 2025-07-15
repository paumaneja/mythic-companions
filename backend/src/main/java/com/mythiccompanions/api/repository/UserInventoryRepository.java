package com.mythiccompanions.api.repository;

import com.mythiccompanions.api.entity.UserInventory;
import com.mythiccompanions.api.entity.UserInventoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInventoryRepository extends JpaRepository<UserInventory, UserInventoryId> {
}
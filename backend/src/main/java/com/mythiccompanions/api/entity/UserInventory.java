package com.mythiccompanions.api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_inventory")
@Data
public class UserInventory {

    @EmbeddedId
    private UserInventoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private int quantity;
}
package com.mythiccompanions.api.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class UserInventoryId implements Serializable {
    private Long userId;
    private String itemId;
}
package com.mythiccompanions.api.mapper;

import com.mythiccompanions.api.dto.UserDto;
import com.mythiccompanions.api.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getMythicCoins()
        );
    }
}
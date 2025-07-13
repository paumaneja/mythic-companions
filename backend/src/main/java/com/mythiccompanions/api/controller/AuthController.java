package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.UserDto;
import com.mythiccompanions.api.dto.UserRegistrationDto;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        User savedUser = userService.createUser(registrationDto);

        UserDto responseDto = new UserDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getAvatarUrl(),
                savedUser.getMythicCoins()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
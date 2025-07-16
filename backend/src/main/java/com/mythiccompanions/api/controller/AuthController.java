package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.LoginRequestDto;
import com.mythiccompanions.api.dto.LoginResponseDto;
import com.mythiccompanions.api.dto.UserDto;
import com.mythiccompanions.api.dto.UserRegistrationDto;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.security.JwtTokenProvider;
import com.mythiccompanions.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

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

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> loginUser(@Valid @RequestBody LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        org.springframework.security.core.userdetails.User springUser =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        User ourUser = userService.findByUsername(springUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found after login"));

        UserDto userDto = new UserDto(
                ourUser.getId(),
                ourUser.getUsername(),
                ourUser.getEmail(),
                ourUser.getAvatarUrl(),
                ourUser.getMythicCoins()
        );

        return ResponseEntity.ok(new LoginResponseDto(token, userDto));
    }
}
package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.LoginRequestDto;
import com.mythiccompanions.api.dto.LoginResponseDto;
import com.mythiccompanions.api.dto.UserDto;
import com.mythiccompanions.api.dto.UserRegistrationDto;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.mapper.UserMapper;
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
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        User savedUser = userService.createUser(registrationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDto(savedUser));
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

        User user = userService.findByUsername(loginRequest.username())
                .orElseThrow(() -> new ResourceNotFoundException("User not found after login"));

        return ResponseEntity.ok(new LoginResponseDto(token, userMapper.toDto(user)));
    }
}
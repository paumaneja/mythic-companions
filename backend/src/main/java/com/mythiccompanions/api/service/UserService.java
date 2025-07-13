package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.UserRegistrationDto;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.UserAlreadyExistsException;
import com.mythiccompanions.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(UserRegistrationDto registrationDto) {
        if (userRepository.findByUsername(registrationDto.username()).isPresent()) {
            throw new UserAlreadyExistsException("Username '" + registrationDto.username() + "' is already taken.");
        }

        if (userRepository.findByEmail(registrationDto.email()).isPresent()) {
            throw new UserAlreadyExistsException("Email '" + registrationDto.email() + "' is already registered.");
        }

        User newUser = new User();
        newUser.setUsername(registrationDto.username());
        newUser.setEmail(registrationDto.email());
        newUser.setPassword(passwordEncoder.encode(registrationDto.password()));
        newUser.setRoles(Set.of("ROLE_USER"));

        return userRepository.save(newUser);
    }
}
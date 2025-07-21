package com.mythiccompanions.api.service;

import com.mythiccompanions.api.dto.UserRegistrationDto;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.exception.ResourceNotFoundException;
import com.mythiccompanions.api.exception.UserAlreadyExistsException;
import com.mythiccompanions.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

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
        newUser.setRoles(Set.of("USER"));

        return userRepository.save(newUser);
    }

    public User updateAvatar(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        String oldAvatarUrl = user.getAvatarUrl();

        String newAvatarFilename = storageService.store(file);
        String newAvatarUrl = "/avatars/" + newAvatarFilename;
        user.setAvatarUrl(newAvatarUrl);

        User updatedUser = userRepository.save(user);

        // If the update was successful and there was an old avatar, delete the old file
        if (oldAvatarUrl != null && !oldAvatarUrl.isBlank()) {
            String oldFilename = oldAvatarUrl.substring(oldAvatarUrl.lastIndexOf("/") + 1);
            storageService.delete(oldFilename);
        }

        return updatedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void updatePassword(String username, String oldPassword, String newPassword) {
        User user = findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid old password.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
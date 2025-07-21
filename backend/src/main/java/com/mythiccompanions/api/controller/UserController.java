package com.mythiccompanions.api.controller;

import com.mythiccompanions.api.dto.UpdatePasswordDto;
import com.mythiccompanions.api.dto.UserDto;
import com.mythiccompanions.api.entity.User;
import com.mythiccompanions.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/me/avatar")
    public ResponseEntity<UserDto> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        User updatedUser = userService.updateAvatar(userDetails.getUsername(), file);

        UserDto responseDto = new UserDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getAvatarUrl(),
                updatedUser.getMythicCoins()
        );

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updateCurrentUserPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdatePasswordDto updatePasswordDto) {
        userService.updatePassword(userDetails.getUsername(), updatePasswordDto.oldPassword(), updatePasswordDto.newPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }
}
package com.mythiccompanions.api.service;

import com.mythiccompanions.api.exception.StorageException;
import com.mythiccompanions.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class StorageService {

    private final Path rootLocation;
    private final UserRepository userRepository;

    public StorageService(@Value("${storage.upload-dir}") String uploadDir, UserRepository userRepository) {
        this.rootLocation = Paths.get(uploadDir);
        this.userRepository = userRepository;
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage location", e);
        }
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Failed to store empty file.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID() + extension;

        try (InputStream inputStream = file.getInputStream()) {
            Path destinationFile = this.rootLocation.resolve(uniqueFilename).normalize().toAbsolutePath();
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            return uniqueFilename;
        } catch (IOException e) {
            throw new StorageException("Failed to store file.", e);
        }
    }

    public void delete(String filename) {
        if (filename == null || filename.isBlank()) {
            return;
        }
        try {
            Path file = rootLocation.resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            // We log the error but don't stop the whole process
            // Failing to delete an old avatar should not prevent updating to a new one
            System.err.println("Failed to delete file: " + filename + " " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupOrphanedAvatars() {
        System.out.println("Running scheduled job: Cleaning up orphaned avatar files...");
        try {
            Set<String> activeAvatarFiles = userRepository.findAllAvatarUrls().stream()
                    .map(url -> url.substring(url.lastIndexOf("/") + 1))
                    .collect(Collectors.toSet());

            try (Stream<Path> filesOnDisk = Files.list(this.rootLocation)) {
                filesOnDisk.filter(file -> !activeAvatarFiles.contains(file.getFileName().toString()))
                        .forEach(file -> {
                            System.out.println("Deleting orphaned avatar: " + file.getFileName());
                            delete(file.getFileName().toString());
                        });
            }
            System.out.println("Cleanup job finished.");
        } catch (IOException e) {
            throw new StorageException("Failed to run orphaned file cleanup task", e);
        }
    }
}
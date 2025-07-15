package com.mythiccompanions.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mythiccompanions.api.dto.UserRegistrationDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldRegisterUserSuccessfully_WhenDataIsValid() throws Exception {
        // Arrange: Prepare the input data
        UserRegistrationDto registrationDto = new UserRegistrationDto(
                "testuser",
                "test@example.com",
                "password123"
        );

        // Act & Assert: Perform the mock HTTP request and verify the response
        mockMvc.perform(post("/api/v1/auth/register") // Simulate a POST request
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationDto))) // Set the JSON body
                .andExpect(status().isCreated()) // Expect HTTP 201 Created
                .andExpect(jsonPath("$.id").exists()) // Expect the response to have an 'id'
                .andExpect(jsonPath("$.username").value("testuser")) // Expect the username to match
                .andExpect(jsonPath("$.password").doesNotExist()); // CRUCIAL: Expect the password NOT to be in the response
    }

    @Test
    void shouldFailToRegister_WhenUsernameIsTaken() throws Exception {
        // Arrange: First, register a user
        UserRegistrationDto firstUser = new UserRegistrationDto("existinguser", "first@example.com", "password123");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstUser)));

        // Now, prepare a second user with the same username
        UserRegistrationDto secondUser = new UserRegistrationDto("existinguser", "second@example.com", "password456");

        // Act & Assert: Attempt to register the second user
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(secondUser)))
                .andExpect(status().isConflict()) // Expect HTTP 409 Conflict
                .andExpect(jsonPath("$.error").value("Username 'existinguser' is already taken."));
    }
}
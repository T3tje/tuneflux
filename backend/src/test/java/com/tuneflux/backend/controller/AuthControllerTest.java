package com.tuneflux.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getMe_whenCalledLoggedOut_expectResponseStatus401() throws Exception {
        // WHEN
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DirtiesContext
    void authenticateAndGetUser_whenCalledLoggedIn_expectResponseStatus200() throws Exception {
        // Perform the GET request to the /api/me endpoint
        mockMvc.perform(get("/api/me").with(oidcLogin().userInfoToken(token -> token.claim("login", "abc").claim("id", "123"))))

                // Expect a status code of 200 (OK)
                .andExpect(status().isOk())
                // Expect the content type to be JSON
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                // Map the response to an AppUser object using ObjectMapper and assert its properties
                .andExpect(jsonPath("$.username").value("abc"))
                .andExpect(jsonPath("$.id").exists());
    }
}

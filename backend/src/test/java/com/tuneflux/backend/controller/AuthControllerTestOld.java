package com.tuneflux.backend.controller;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc

class AuthControllerTestOld {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DirtiesContext
    void getMe_whenCalledLoggedOut_expectStatus401AndNullAsReturnValue() throws Exception {
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DirtiesContext
    void getMe_whenCalledLoggedIn_expectStatus200AndAppUserAsReturnValue() throws Exception {
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

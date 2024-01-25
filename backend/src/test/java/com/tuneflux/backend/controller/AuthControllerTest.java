package com.tuneflux.backend.controller;

import com.tuneflux.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    void getMe_whenCalled_authService_authenticateAndGetUserShouldBeCalled() throws Exception {
        //GIVEN: Keine expliziten Vorbereitungen erforderlich

        //WHEN
        mockMvc.perform(get("/api/me"));

        //THEN
        verify(authService, times(1)).authenticateAndGetUser();
    }
}

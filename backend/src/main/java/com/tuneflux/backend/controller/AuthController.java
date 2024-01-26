package com.tuneflux.backend.controller;

import com.tuneflux.backend.model.AppUserDTO;
import com.tuneflux.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<AppUserDTO> getMe() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof DefaultOAuth2User defaultOAuth2User) {
            String userId = defaultOAuth2User.getAttributes().get("id").toString();
            String login = defaultOAuth2User.getAttributes().get("login").toString();

            return ResponseEntity.ok(authService.getOrCreateUser(userId, login));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
}

package com.tuneflux.backend.controller;

import com.tuneflux.backend.model.AppUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
public class AuthController {

    Logger logger = Logger.getLogger(getClass().getName());

    @GetMapping("/me")
    public ResponseEntity<AppUser> getMe() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Is authenticated: " + authentication.isAuthenticated());

        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof DefaultOAuth2User defaultOAuth2User) {

            AppUser appUser = new AppUser(
                    defaultOAuth2User.getAttributes().get("login").toString(),
                    defaultOAuth2User.getAttributes().get("id").toString()
            );

            return ResponseEntity.ok(appUser);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

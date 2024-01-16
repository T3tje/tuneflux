package com.tuneflux.backend.controller;

import com.tuneflux.backend.model.AppUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/radio/auth")
public class AuthController {
    @GetMapping("/me")
    public AppUser getMe() {
        var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof DefaultOAuth2User defaultOAuth2User) {
            return new AppUser(
                    defaultOAuth2User.getName(),
                    defaultOAuth2User.getAttributes().get("id").toString()
            );
        }
        return null;
    }
}

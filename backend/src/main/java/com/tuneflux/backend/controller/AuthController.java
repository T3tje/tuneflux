package com.tuneflux.backend.controller;

import com.tuneflux.backend.model.AppUser;
import com.tuneflux.backend.repository.AppUserRepository;
import com.tuneflux.backend.repository.RadioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final RadioRepository radioRepository;

    @Autowired
    public AuthController(AppUserRepository appUserRepository, RadioRepository radioRepository) {
        this.appUserRepository = appUserRepository;
        this.radioRepository = radioRepository;
    }

    @Transactional
    @GetMapping("/me")
    public ResponseEntity<AppUser> getMe() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof DefaultOAuth2User defaultOAuth2User) {

            String userId = defaultOAuth2User.getAttributes().get("id").toString();

            // Überprüfe, ob der Benutzer bereits in der Datenbank vorhanden ist
            AppUser existingUser = appUserRepository.findByUserId(userId).orElse(null);

            if (existingUser != null) {
                // Benutzer bereits in der Datenbank vorhanden
                // Führe eine weitere Abfrage durch, um die bevorzugten Radiosender abzurufen
                existingUser.setFavoriteRadioStations(radioRepository.findAllById(existingUser.getFavoriteRadioStationIds()));
                return ResponseEntity.ok(existingUser);
            } else {
                // Benutzer nicht vorhanden, erstelle einen neuen mit einer leeren Favoritenliste
                AppUser appUser = new AppUser(
                        defaultOAuth2User.getAttributes().get("login").toString(),
                        userId,
                        List.of() // Leere Favoritenliste
                );

                // Speichere den Benutzer in der Datenbank
                AppUser savedUser = appUserRepository.save(appUser);

                return ResponseEntity.ok(savedUser);
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
}

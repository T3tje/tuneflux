package com.tuneflux.backend.controller;

import com.tuneflux.backend.model.AppUser;
import com.tuneflux.backend.model.AppUserDTO;
import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.model.RadioStationDTO;
import com.tuneflux.backend.repository.AppUserRepository;
import com.tuneflux.backend.repository.RadioRepository;
import com.tuneflux.backend.utils.RadioStationMapper;
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

import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AuthController {
    Logger logger = Logger.getLogger(getClass().getName());
    private final AppUserRepository appUserRepository;
    private final RadioRepository radioRepository;

    @Autowired
    public AuthController(AppUserRepository appUserRepository, RadioRepository radioRepository) {
        this.appUserRepository = appUserRepository;
        this.radioRepository = radioRepository;
    }

    @Transactional
    @GetMapping("/me")
    public ResponseEntity<AppUserDTO> getMe() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof DefaultOAuth2User defaultOAuth2User) {

            String userId = defaultOAuth2User.getAttributes().get("id").toString();

            // Überprüfe, ob der Benutzer bereits in der Datenbank vorhanden ist
            AppUser existingUser = appUserRepository.findById(userId).orElse(null);

            if (existingUser != null) {
                // Benutzer bereits in der Datenbank vorhanden
                // Führe eine weitere Abfrage durch, um die bevorzugten Radiosender abzurufen und Speichere diese in einem DTO

                List<RadioStationDTO> favoriteRadioStations = radioRepository
                        .findAllById(existingUser.favoriteRadioStationIds())
                        .stream()
                        .map(RadioStationMapper::mapToDTO)
                        .collect(Collectors.toList());

                // Erstelle eine neue Instanz des Records mit den aktualisierten Werten
                AppUserDTO updatedUser = new AppUserDTO(
                        existingUser.id(),
                        existingUser.username(),
                        favoriteRadioStations
                );

                return ResponseEntity.ok(updatedUser);
            } else {
                // Benutzer nicht vorhanden, erstelle einen neuen mit einer
                // leeren Favoritenliste (ids) für Datenbank
                AppUser appUser = new AppUser(
                        userId,
                        defaultOAuth2User.getAttributes().get("login").toString(),
                        List.of() // Leere Favoritenliste
                );

                // Speichere den Benutzer in der Datenbank
                appUserRepository.save(appUser);

                // Lege für die Response eine DTO von AppUser mit einer
                // leeren FavoritenListe (RadioStations) an und sende Ihne zurück
                AppUserDTO appUserDTO = new AppUserDTO(
                        userId,
                        defaultOAuth2User.getAttributes().get("login").toString(),
                        List.of() // Leere Favoritenliste
                );
                return ResponseEntity.ok(appUserDTO);
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
}

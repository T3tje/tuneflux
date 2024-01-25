package com.tuneflux.backend.service;

import com.tuneflux.backend.model.AppUser;
import com.tuneflux.backend.model.AppUserDTO;
import com.tuneflux.backend.model.RadioStationDTO;
import com.tuneflux.backend.repository.AppUserRepository;
import com.tuneflux.backend.repository.RadioRepository;
import com.tuneflux.backend.utils.RadioStationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final RadioRepository radioRepository;

    @Autowired
    public AuthService(AppUserRepository appUserRepository, RadioRepository radioRepository) {
        this.appUserRepository = appUserRepository;
        this.radioRepository = radioRepository;
    }

    @Transactional
    public ResponseEntity<AppUserDTO> authenticateAndGetUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof DefaultOAuth2User defaultOAuth2User) {
            String userId = defaultOAuth2User.getAttributes().get("id").toString();
            String login = defaultOAuth2User.getAttributes().get("login").toString();

            return ResponseEntity.ok(getOrCreateUser(userId, login));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    public AppUserDTO getOrCreateUser(String userId, String login) {
        Optional<AppUser> existingUserOptional = appUserRepository.findById(userId);
        if (existingUserOptional.isPresent()) {
            AppUser existingUser = existingUserOptional.get();
                List<RadioStationDTO> favoriteRadioStations = radioRepository
                    .findAllById(existingUser.favoriteRadioStationIds())
                    .stream()
                    .map(RadioStationMapper::mapToDTO)
                    .toList();

            return new AppUserDTO(
                    existingUser.id(),
                    existingUser.username(),
                    favoriteRadioStations
            );
        } else {
            AppUser appUser = new AppUser(
                    userId,
                    login,
                    List.of() // Leere Favoritenliste

            );
            appUserRepository.save(appUser);

            return new AppUserDTO(
                    userId,
                    login,
                    List.of() // Leere Favoritenliste
            );
        }
    }
}

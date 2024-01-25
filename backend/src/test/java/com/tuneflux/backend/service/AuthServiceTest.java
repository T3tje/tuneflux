package com.tuneflux.backend.service;

import com.tuneflux.backend.model.AppUser;
import com.tuneflux.backend.model.AppUserDTO;
import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.model.RadioStationDTO;
import com.tuneflux.backend.repository.AppUserRepository;
import com.tuneflux.backend.repository.RadioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
class AuthServiceTest {

    private final AppUserRepository mockAppUserRepository = mock(AppUserRepository.class);

    private final RadioRepository mockRadioRepository = mock(RadioRepository.class);

    @Autowired
    private final AuthService authService = new AuthService(mockAppUserRepository, mockRadioRepository);

    @DirtiesContext
    @Test
    void authenticateAndGetUser_whenCalledLoggedOut_expectResponseStatusException() {
        // GIVEN
        // Mock für Authentication erstellen (nicht eingeloggt)
        Authentication mockAuthentication = mock(Authentication.class);
        when(mockAuthentication.isAuthenticated()).thenReturn(false);

        // Mock für SecurityContext erstellen
        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuthentication);

        // SecurityContextHolder so konfigurieren, dass es den vorher erstellten SecurityContext verwendet
        SecurityContextHolder.setContext(mockSecurityContext);

        // WHEN & THEN
        ResponseEntity<AppUserDTO> responseEntity = authService.authenticateAndGetUser();

        // Verify that the response has the expected status code 401
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
    }

    @Test
    @DirtiesContext
    void authenticateAndGetUser_whenCalledLoggedIn_expectGetOrCreateUserCalledAndStatus200() {
        //GIVEN
        // Mock OAuth2 user
        DefaultOAuth2User defaultOAuth2User = new DefaultOAuth2User(
                Set.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of("id", "123", "login", "abc"),
                "id"
        );

        // Mock authentication context
        SecurityContextHolder.getContext().setAuthentication(new OAuth2AuthenticationToken(defaultOAuth2User, null, "oidc"));

        // WHEN
        ResponseEntity<AppUserDTO> responseEntity = authService.authenticateAndGetUser();

        // THEN
        // Verify that the response has the expected status code 200
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }

    @Test
    @DirtiesContext
    void getOrCreateUser_whenCalledWithExistingUserData_returnAppUserDTO_WithFavoriteStatioDTO() {

        //GIVEN
        // List of RadioStations and DTO for Test
        List<RadioStation> dummyList = List.of(new RadioStation(
                "stationuuid2", "changeuuid2", "serveruuid2", "Station 2",
                        "http://station2.com", "http://station2-resolved.com",
                        "http://station2-homepage.com", "http://station2-favicon.com",
                        "music, talk", "Country2", "CC2", "State2", "Language2",
                        "LC2", 150, "2022-02-01T00:00:00Z", "aac", 192,
                        (byte) 1, (byte) 1, "2022-02-02T00:00:00Z",
                        "2022-02-02T00:00:00Z", "2022-02-02T00:00:00Z",
                        "2022-02-03T00:00:00Z", 75, 8, (byte) 0,
                        List.of("userId3", "userId4")
        ));

        List<RadioStationDTO> dummyListDTO = List.of(new RadioStationDTO(
                "stationuuid2", "changeuuid2", "serveruuid2", "Station 2",
                "http://station2.com", "http://station2-resolved.com",
                "http://station2-homepage.com", "http://station2-favicon.com",
                "music, talk", "Country2", "CC2", "State2", "Language2",
                "LC2", 150, "2022-02-01T00:00:00Z", "aac", 192,
                (byte) 1, (byte) 1, "2022-02-02T00:00:00Z",
                "2022-02-02T00:00:00Z", "2022-02-02T00:00:00Z",
                "2022-02-03T00:00:00Z", 75, 8, (byte) 0
        ));

        // mock RadioRepository Response
        when(mockRadioRepository.findAllById(List.of("123", "321"))).thenReturn(dummyList);
        //mock AppUserRepository Response
        when(mockAppUserRepository.findById("valid")).thenReturn(Optional.of(new AppUser("valid", "anyUsername", List.of("123", "321"))));

        AppUserDTO expectedAppUserDTO = new AppUserDTO("valid", "anyUserName", dummyListDTO);
        //WHEN
        AppUserDTO actualAppUserDTO = authService.getOrCreateUser("valid", "anyUsername");

        //THEN
        assertEquals(expectedAppUserDTO, actualAppUserDTO);
    }
}

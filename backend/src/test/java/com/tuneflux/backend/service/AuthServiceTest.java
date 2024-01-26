package com.tuneflux.backend.service;

import com.tuneflux.backend.model.AppUser;
import com.tuneflux.backend.model.AppUserDTO;
import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.model.RadioStationDTO;
import com.tuneflux.backend.repository.AppUserRepository;
import com.tuneflux.backend.repository.RadioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.annotation.DirtiesContext;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private final AppUserRepository mockAppUserRepository = mock(AppUserRepository.class);

    private final RadioRepository mockRadioRepository = mock(RadioRepository.class);

    private final AuthService authService = new AuthService(mockAppUserRepository, mockRadioRepository);

    @Test
    @DirtiesContext
    void getOrCreateUser_whenCalledWithExistingUserData_returnAppUserDTO_WithFavoriteStationDTO() {

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

        AppUserDTO expectedAppUserDTO = new AppUserDTO("valid", "anyUsername", dummyListDTO);
        //WHEN
        AppUserDTO actualAppUserDTO = authService.getOrCreateUser("valid", "anyUsername");

        //THEN
        assertEquals(expectedAppUserDTO, actualAppUserDTO);
    }
}

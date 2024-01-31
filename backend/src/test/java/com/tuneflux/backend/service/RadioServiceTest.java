package com.tuneflux.backend.service;

import com.tuneflux.backend.exceptions.RadioStationNotFoundException;
import com.tuneflux.backend.exceptions.UserNotFoundException;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.tuneflux.backend.model.AppUser;
import com.tuneflux.backend.model.PostDTO;
import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.repository.AppUserRepository;
import com.tuneflux.backend.repository.RadioRepository;

@SpringBootTest

class RadioServiceTest {

    @Autowired
    private RadioService radioService;

    private static MockWebServer mockWebServer;

    @BeforeAll
    static void beforeAll() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @DynamicPropertySource
    static void backendProperties(DynamicPropertyRegistry registry) {
        registry.add("radio.base.url", () -> mockWebServer.url("/").toString());
    }

    //AppUsers festlegen
    //User mit leerer Liste
    AppUser existingAppUserWithOutExistingRadioStationId = new AppUser(
            "existingUserId",
            "username",
            new ArrayList<>() // Leere Liste für favoriteRadioStationId
    );

    //User mit gefüllter Liste
    AppUser getExistingAppUserWithAddedStationId = new AppUser(
            "existingUserId",
            "username",
            List.of("StationUuid")
    );

    // ============= GET =============
    @Test
    void radioService_getRadioStations_shouldReturnOneRadioStation_whenAskedForOne() throws InterruptedException {
        // GIVEN
        // Mock response for a single radio station
        String mockResponseString = """
                [{
                    "changeuuid": "599cf698-a707-4d50-8383-e5f342fb9c08",
                    "stationuuid": "78012206-1aa1-11e9-a80b-52543be04c81",
                    "serveruuid": "a67a5b07-6189-4442-b5e8-0100f7f56804",
                    "name": "MANGORADIO",
                    "url": "http://stream.mangoradio.de/",
                    "url_resolved": "https://mangoradio.stream.laut.fm/mangoradio?t302=2024-01-10_01-55-10&uuid=f691daf2-7614-483e-890b-62ea366620ce",
                    "homepage": "https://mangoradio.de/",
                    "favicon": "",
                    "tags": "mango,mangoradio,mongo,mongoradio,public radio,webradio",
                    "country": "Germany",
                    "countrycode": "DE",
                    "state": "",
                    "language": "german",
                    "languagecodes": "de",
                    "votes": 666324,
                    "lastchangetime_iso8601": "2023-11-04T17:12:56Z",
                    "codec": "MP3",
                    "bitrate": 128,
                    "hls": 0,
                    "lastcheckok": 1,
                    "lastchecktime_iso8601": "2024-01-10T01:01:52Z",
                    "lastcheckoktime_iso8601": "2024-01-10T01:01:52Z",
                    "lastlocalchecktime_iso8601": "2024-01-09T09:34:28Z",
                    "clicktimestamp_iso8601": "2024-01-10T07:37:25Z",
                    "clickcount": 1571,
                    "clicktrend": 35,
                    "ssl_error": 0
                }]
                """;
        MockResponse mockResponse = new MockResponse();
        mockResponse.setBody(mockResponseString);
        mockResponse.setHeader("Content-Type", "application/json");

        mockWebServer.enqueue(mockResponse);

        // WHEN
        // Call the radioService to get radio stations
        var radioStations = radioService.getRadioStations(1, "true", "votes", 0, "", "", "");

        // THEN
        // Verify that the radioStations list is not null and contains one station
        assertNotNull(radioStations);
        assertEquals(1, radioStations.size());


        // Verify that the request was made to the correct endpoint with the expected parameters
        RecordedRequest recordedRequest = mockWebServer.takeRequest();

        assertEquals("/stations/search?limit=1&reverse=true&order=votes&offset=0&tag=&name=&country=&hidebroken=true", recordedRequest.getPath());
        assertEquals("GET", recordedRequest.getMethod());

    }


    // ============= POST =============
    @Test
    @DirtiesContext
    void addRadioStationToFavorites_UserExistsAndRadioStationExists_ShouldReturnUpdatedRadioStation() {
        // GIVEN

        //Repositories Mocken
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);


        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden
        when(appUserRepository.findById(existingAppUserWithOutExistingRadioStationId.id())).thenReturn(Optional.of(existingAppUserWithOutExistingRadioStationId));
        //AppUser Repository verhalten festlegen, wenn appUser gespeichert wird
        when(appUserRepository.save(getExistingAppUserWithAddedStationId)).thenReturn(getExistingAppUserWithAddedStationId);

        // PostDTO erstellen mit existierender UserId und zu Adder Radiostation
        PostDTO postDTO = new PostDTO("existingUserId", RadioServiceUtils.radioStationWithExistingUserId);
        // WHEN

        // Methode ausführen
        radioService.addRadioStationToFavorites(postDTO);

        //THEN

        //Teste, ob AbuserRepository nach dem richtigen user sucht und
        // ob die .save Methode mit dem updatedUser durchgeführt wurde
        verify(appUserRepository).findById(existingAppUserWithOutExistingRadioStationId.id());
        verify(appUserRepository).save(getExistingAppUserWithAddedStationId);
    }

    @Test
    @DirtiesContext
    void addRadioStationToFavorites_userNotExistent_ShouldReturnNull() {
        // GIVEN

        //Repositories Mocken
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);

        //AppUser Repository verhalten festlegen: wenn AppUser nicht vorhanden leeres optional zurückgeben
        when(appUserRepository.findById("NotExistingId")).thenReturn(Optional.empty());

        // PostDTO erstellen mit existierender UserId und zu Adder Radiostation
        PostDTO postDTO = new PostDTO("NotExistingId", RadioServiceUtils.radioStationWithExistingUserId);
        // WHEN

        RadioStation resultActual = radioService.addRadioStationToFavorites(postDTO);

        //THEN

        //Teste, ob AbuserRepository nach dem richtigen user sucht und
        // ob die .save Methode mit dem updatedUser durchgeführt wurde
        verify(appUserRepository).findById("NotExistingId");
        assertNull(resultActual);
    }

    @Test
    @DirtiesContext
    void addRadioStationToFavorites_whenExecuteWithExistentUserAndWithExistentRadioStation_shouldReturnRadioStationWithNewUserId() {
        //GIVEN

        // Mock Repositories
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);

        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden
        when(appUserRepository.findById(existingAppUserWithOutExistingRadioStationId.id())).thenReturn(Optional.of(existingAppUserWithOutExistingRadioStationId));
        //AppUser Repository verhalten festlegen, wenn appUser gespeichert wird
        when(appUserRepository.save(getExistingAppUserWithAddedStationId)).thenReturn(getExistingAppUserWithAddedStationId);

        // Verhalten der Radio-repository festlegen
        when(radioRepository.findByStationuuid("StationUuid")).thenReturn(Optional.of(RadioServiceUtils.radioStationWithOutExistingUserId));
        when(radioRepository.save(RadioServiceUtils.radioStationWithOutExistingUserId)).thenReturn(RadioServiceUtils.radioStationWithOutExistingUserId);
        // PostDTO erstellen mit existierender UserId und zu Adder Radiostation
        PostDTO postDTO = new PostDTO("existingUserId", RadioServiceUtils.radioStationWithOutExistingUserId);

        // WHEN

        // Methode ausführen
        radioService.addRadioStationToFavorites(postDTO);

        // THEN

        //radioRepository.save sollte mit der Radiostation mit der hinzugefügten UserId ausgeführt werden
        verify(radioRepository).save(RadioServiceUtils.radioStationWithExistingUserId);
    }

    @Test
    @DirtiesContext
    void addRadioStationToFavorites_whenExecuteWithExistentUserAndWithNotExistentRadioStation_shouldReturnRadioStationWithNewUserId() {
        //GIVEN

        // Mock Repositories
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);

        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden
        when(appUserRepository.findById(existingAppUserWithOutExistingRadioStationId.id())).thenReturn(Optional.of(existingAppUserWithOutExistingRadioStationId));
        //AppUser Repository verhalten festlegen, wenn appUser gespeichert wird
        when(appUserRepository.save(getExistingAppUserWithAddedStationId)).thenReturn(getExistingAppUserWithAddedStationId);

        // Verhalten der Radio-repository festlegen
        when(radioRepository.findByStationuuid("NotExistingStationUuid")).thenReturn(Optional.empty()); // NotExisting RadioStation
        when(radioRepository.save(RadioServiceUtils.radioStationWithExistingUserId)).thenReturn(RadioServiceUtils.radioStationWithExistingUserId);
        // PostDTO erstellen mit existierender UserId und zu Adder Radiostation
        PostDTO postDTO = new PostDTO("existingUserId", RadioServiceUtils.radioStationWithOutExistingUserId);

        // WHEN

        // Methode ausführen
        radioService.addRadioStationToFavorites(postDTO);

        // THEN

        //radioRepository.save sollte mit der Radiostation mit der hinzugefügten UserId ausgeführt werden
        verify(radioRepository).save(RadioServiceUtils.radioStationWithExistingUserId);
    }

    // ============= DELETE =============
    @Test
    @DirtiesContext
    void deleteRadioStationToFavorites_whenExecuteWithExistentUserAndExistentRadioStation_shouldSaveRadioStationWithOutNewUserId() {
        // GIVEN

        // Mock Repositories
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);

        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden
        when(appUserRepository.findById(getExistingAppUserWithAddedStationId.id())).thenReturn(Optional.of(getExistingAppUserWithAddedStationId));
        //AppUser Repository verhalten festlegen, wenn appUser gespeichert wird
        when(appUserRepository.save(existingAppUserWithOutExistingRadioStationId)).thenReturn(existingAppUserWithOutExistingRadioStationId);

        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden, da sonst exception geworfen wird
        when(radioRepository.findByStationuuid("StationUuid")).thenReturn(Optional.of(RadioServiceUtils.radioStationWithExistingUserId)); // NotExisting RadioStation

        // PostDTO erstellen mit existierender UserId und RadioStation mit User Id
        PostDTO postDTO = new PostDTO("existingUserId", RadioServiceUtils.radioStationWithExistingUserId);

        // WHEN

        // Methode ausführen
        radioService.deleteRadioStationFromFavorites(postDTO);

        // THEN

        //appUserRepository.save soll ausgeführt werden mit Radiostation OHNE UserId (Wird im Service gelöscht)
        verify(appUserRepository).save(existingAppUserWithOutExistingRadioStationId);
    }

    @Test
    @DirtiesContext
    void deleteRadioStationToFavorites_whenExecuteWithNotExistentUser_shouldThrowUserNotFoundException() {
        // GIVEN

        // Mock Repositories
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);

        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden
        when(appUserRepository.findById("NotExistingUserId")).thenReturn(Optional.empty());

        // PostDTO erstellen mit existierender UserId und RadioStation mit User Id
        PostDTO postDTO = new PostDTO("NotExistingUserId", RadioServiceUtils.radioStationWithExistingUserId);

        // WHEN & THEN
        // Überprüfen, ob die UserNotFoundException geworfen wird
        assertThrows(UserNotFoundException.class, () -> radioService.deleteRadioStationFromFavorites(postDTO));

        // Verifizieren, dass appUserRepository.save NICHT aufgerufen wurde, da die UserNotFoundException ausgelöst wurde
        verify(appUserRepository, never()).save(any());
    }

    @Test
    @DirtiesContext
    void deleteRadioStationToFavorites_whenExecuteWithExistentUserAndExistentRadioStation_shouldDeleteRadioStationUuIdFromAppUser() {
        // GIVEN

        // Mock Repositories
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);

        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden
        when(appUserRepository.findById(getExistingAppUserWithAddedStationId.id())).thenReturn(Optional.of(getExistingAppUserWithAddedStationId));
        //AppUser Repository verhalten festlegen, wenn appUser gespeichert wird
        when(appUserRepository.save(existingAppUserWithOutExistingRadioStationId)).thenReturn(existingAppUserWithOutExistingRadioStationId);

        // Verhalten der Radio-repository festlegen
        when(radioRepository.findByStationuuid("StationUuid")).thenReturn(Optional.of(RadioServiceUtils.radioStationWithExistingUserId)); // NotExisting RadioStation
        when(radioRepository.save(RadioServiceUtils.radioStationWithOutExistingUserId)).thenReturn(RadioServiceUtils.radioStationWithOutExistingUserId);

        // PostDTO erstellen mit existierender UserId und RadioStation mit User Id
        PostDTO postDTO = new PostDTO("existingUserId", RadioServiceUtils.radioStationWithExistingUserId);

        // WHEN

        // Methode ausführen
        radioService.deleteRadioStationFromFavorites(postDTO);

        // THEN

        //appUserRepository.save soll ausgeführt werden mit Radiostation OHNE UserId (Wird im Service gelöscht)
        verify(radioRepository).save(RadioServiceUtils.radioStationWithOutExistingUserId);
    }

    @Test
    @DirtiesContext
    void deleteRadioStationToFavorites_whenExecuteWithExistentUserAndNOTExistentRadioStation_shouldThrowRadioStationNotFoundException() {
        // GIVEN

        // Mock Repositories
        AppUserRepository appUserRepository = mock(AppUserRepository.class);
        RadioRepository radioRepository = mock(RadioRepository.class);
        //RadioService mit den entsprechenden Repositories instantiieren
        RadioService radioService = new RadioService(appUserRepository, radioRepository);

        //AppUser Repository verhalten festlegen, wenn AppUser vorhanden
        when(appUserRepository.findById(getExistingAppUserWithAddedStationId.id())).thenReturn(Optional.of(getExistingAppUserWithAddedStationId));
        //AppUser Repository verhalten festlegen, wenn appUser gespeichert wird
        when(appUserRepository.save(existingAppUserWithOutExistingRadioStationId)).thenReturn(existingAppUserWithOutExistingRadioStationId);

        // Verhalten der Radio-repository festlegen
        when(radioRepository.findByStationuuid("StationUuid")).thenReturn(Optional.empty()); // NotExisting RadioStation

        // PostDTO erstellen mit existierender UserId und RadioStation mit User Id
        PostDTO postDTO = new PostDTO("existingUserId", RadioServiceUtils.radioStationWithExistingUserId);

        // WHEN & THEN
        // Überprüfen, ob die UserNotFoundException geworfen wird
        assertThrows(RadioStationNotFoundException.class, () -> radioService.deleteRadioStationFromFavorites(postDTO));

        // Verifizieren, dass appUserRepository.save NICHT aufgerufen wurde, da die UserNotFoundException ausgelöst wurde
        verify(radioRepository, never()).save(any());
    }
}



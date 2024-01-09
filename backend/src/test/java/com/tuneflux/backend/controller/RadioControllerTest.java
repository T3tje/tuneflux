package com.tuneflux.backend.controller;

import static org.mockito.Mockito.*;

import com.tuneflux.backend.service.RadioService;
import org.junit.jupiter.api.Test;
import java.util.Collections;

class RadioControllerTest {

    // Create a mock instance of RadioService
    RadioService radioService = mock(RadioService.class);

    // Create an instance of RadioController using the mock RadioService
    RadioController radioController = new RadioController(radioService);

    @Test
    void getRadioStations_shouldCallServiceFunctionGetRadioStationsWithStandardparameters_whenRequestIsEmpty() {
        // GIVEN
        // Define the behavior of the mock RadioService:
        // When getRadioStations is called with any String parameter, then return an empty list
        when(radioService.getRadioStations(anyString())).thenReturn(Collections.emptyList());

        // WHEN
        // Call the getRadioStations method on the RadioController
        // This will internally call the mocked RadioService
        radioController.getRadioStations(10, "true", "votes", 0, "", "", "");

        // THEN
        // Verify that the getRadioStations method on the mock RadioService was called
        // with the expected URL parameter
        verify(radioService).getRadioStations("https://de1.api.radio-browser.info/json/stations/search?limit=10&reverse=true&order=votes&offset=0&tagList=&name=&country=");
    }
    @Test
    void getRadioStations_shouldCallServiceFunctionGetRadioStationsWithCorrectUri_whenRequestIsCorrect() {
        // GIVEN
        // Define the behavior of the mock RadioService:
        // When getRadioStations is called with any String parameter, then return an empty list
        when(radioService.getRadioStations(anyString())).thenReturn(Collections.emptyList());

        // WHEN
        // Call the getRadioStations method on the RadioController
        // This will internally call the mocked RadioService
        radioController.getRadioStations(20, "false", "clickcount", 20, "jazz,cool jazz", "", "The United States Of America");

        // THEN
        // Verify that the getRadioStations method on the mock RadioService was called
        // with the expected URL parameter
        verify(radioService).getRadioStations("https://de1.api.radio-browser.info/json/stations/search?limit=20&reverse=false&order=clickcount&offset=20&tagList=jazz,cool%20jazz&name=&country=The%20United%20States%20Of%20America");
    }
}

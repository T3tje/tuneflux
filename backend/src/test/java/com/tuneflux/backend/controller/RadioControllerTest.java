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
    void Controller_GetRadioStations_shouldCall_Service_FunctionGetRadioStationsWithGivenParameters() {
        // GIVEN
        // Define the behavior of the mock RadioService:
        // When getRadioStations is called with any String parameter, then return an empty list
        when(radioService.getRadioStations(anyInt(), anyString(), anyString(), anyInt(), anyString(), anyString(), anyString())).thenReturn(Collections.emptyList());

        // WHEN
        // Call the getRadioStations method on the RadioController
        // This will internally call the mocked RadioService
        radioController.getRadioStations(10, "true", "votes", 0, "", "", "");

        // THEN
        // Verify that the getRadioStations method on the mock RadioService was called
        // with the expected URL parameter
        verify(radioService).getRadioStations(10, "true", "votes", 0, "", "", "");
    }
}

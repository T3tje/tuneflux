package com.tuneflux.backend.service;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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

        assertEquals("/stations/search?limit=1&reverse=true&order=votes&offset=0&tagList=&name=&country=", recordedRequest.getPath());
        assertEquals("GET", recordedRequest.getMethod());

    }
}

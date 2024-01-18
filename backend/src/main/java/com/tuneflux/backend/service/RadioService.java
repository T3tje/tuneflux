package com.tuneflux.backend.service;

import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.repository.RadioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Objects;

@Service
public class RadioService {

    // Mongo Repository
    private final RadioRepository radioRepository;

    // Constructor für MongoRepository
    @Autowired
    public RadioService(RadioRepository radioRepository) {
        this.radioRepository = radioRepository;
    }

    /**
     * Retrieves radio station information from the specified API URL.
     * <p>
     * param limit    The maximum number of radio stations to retrieve.
     * param reverse  Indicates whether the order should be reversed.
     * param order    The sorting order for the radio stations.
     * param offset   The offset for paginating through the results.
     * param tagList  The tag list for filtering radio stations.
     * param name     The name for filtering radio stations.
     * param country  The country for filtering radio stations.
     * return A list of RadioStation objects representing the retrieved radio stations.
     * </p>
     */

    // Bind Radio Base Url from application.properties to Variable
    @Value("${radio.base.url}")
    private String radioBaseUrl;

    //Function for Radio Api Request
    public List<RadioStation> getRadioStations(int limit, String reverse, String order, int offset, String tagList, String name, String country) {

        // Use UriComponentsBuilder for secure and clean URL composition
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(radioBaseUrl + "/stations/search")
                .queryParam("limit", limit)                         // 'limit' added to the URL
                .queryParam("reverse", reverse)                     // 'reverse' added to the URL
                .queryParam("order", order)                         // 'order' added to the URL
                .queryParam("offset", offset)                       // 'offset' added to the URL
                .queryParam("tagList", tagList)                     // 'tagList' added to the URL
                .queryParam("name", name)                           // 'name' added to the URL
                .queryParam("country", country)                     // 'country' added to the URL
                .queryParam("hidebroken", true);               // 'hidebroken' added to the URL

        // Retrieve the constructed URL string
        String apiUrl = builder.toUriString();

        // Create a WebClient for making HTTP requests
        WebClient webClient = WebClient.create();

        // Retrieve radio station information as a list of RadioStation objects from the API URL
        return Objects.requireNonNull(
                        webClient
                                .get()
                                .uri(apiUrl)
                                .accept(MediaType.APPLICATION_JSON)
                                .retrieve()
                                .toEntityList(RadioStation.class) // <-- Hier verwenden wir toEntityList
                                .block())
                .getBody();

    }

    // Function for adding a radioStation to MongoDB
    public RadioStation addRadioStationToFavorites(RadioStation radiostation) {
        return radioRepository.save(radiostation);
    }
}

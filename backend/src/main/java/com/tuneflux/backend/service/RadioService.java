package com.tuneflux.backend.service;

import com.tuneflux.backend.model.AppUser;
import com.tuneflux.backend.model.PostDTO;
import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.model.RadioStationDTO;
import com.tuneflux.backend.repository.AppUserRepository;
import com.tuneflux.backend.repository.RadioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class RadioService {

    private final AppUserRepository appUserRepository;
    private final RadioRepository radioRepository;

    @Autowired
    public RadioService(AppUserRepository appUserRepository, RadioRepository radioRepository) {
        this.appUserRepository = appUserRepository;
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
    public List<RadioStationDTO> getRadioStations(int limit, String reverse, String order, int offset, String tagList, String name, String country) {

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
                                .toEntityList(RadioStationDTO.class) // <-- Hier verwenden wir toEntityList
                                .block())
                .getBody();

    }
    /**
     * Adds a radio station to a user's favorites and Favorite-Database and A UserId to RadioStations
     *
     * @param postDTO The Data Transfer Object (DTO) containing userId and stationUuid.
     * @return The updated RadioStation if successfully added, otherwise null.
     */
    public RadioStation addRadioStationToFavorites(PostDTO postDTO) {
        // Find the AppUser with the given userId
        Optional<AppUser> optionalAppUser = appUserRepository.findById(postDTO.userId());

        if (optionalAppUser.isPresent()) {
            AppUser appUser = optionalAppUser.get();

            // Füge stationUuid am Anfang der favoriteRadioStationIds-Liste hinzu
            appUser.favoriteRadioStationIds().add(0, postDTO.radioStation().stationuuid());

            // Save the updated AppUser to the database
            appUserRepository.save(appUser);
        } else {
            // User not found, error handling may be required
            return null; // You could also throw an exception or return a specific status code here
        }

        // Find the RadioStation with the given stationUuid
        Optional<RadioStation> optionalRadioStation = radioRepository.findByStationuuid(postDTO.radioStation().stationuuid());

        if (optionalRadioStation.isPresent()) {
            RadioStation radioStation = optionalRadioStation.get();
            // Add userId to the appUserIds list
            radioStation.appUserIds().add(postDTO.userId());
            // Save the updated RadioStation to the database
            return radioRepository.save(radioStation);
        } else {
            // If Radiostation isn't present in Database, Add it
            RadioStation newRadioStation = postDTO.radioStation();

            // Überprüfe, ob appUserIds null ist, und initialisiere es dann mit einer Liste, die postDTO.userId() enthält
            newRadioStation = newRadioStation.withAppUserIds(
                    new ArrayList<>(List.of(postDTO.userId()))
            );

            // Speichere die neue Radiostation
            return radioRepository.save(newRadioStation);
        }
    }

    // Delete a Radiostation uuid from User's Favorite list and
    // the User's id from Radiostations UserId List
    public void deleteRadioStationFromFavorites(PostDTO postDTO) {
        // Find the AppUser with the given userId
        Optional<AppUser> optionalAppUser = appUserRepository.findById(postDTO.userId());

        if (optionalAppUser.isPresent()) {
            AppUser appUser = optionalAppUser.get();

            // Remove stationUuid from the favoriteRadioStationIds list
            appUser.favoriteRadioStationIds().remove(postDTO.radioStation().stationuuid());

            // Save the updated AppUser to the database
            appUserRepository.save(appUser);
        }

        // Find the RadioStation with the given stationUuid
        Optional<RadioStation> optionalRadioStation = radioRepository.findByStationuuid(postDTO.radioStation().stationuuid());

        if (optionalRadioStation.isPresent()) {
            RadioStation radioStation = optionalRadioStation.get();

            // Remove userId from the appUserIds list
            radioStation.appUserIds().remove(postDTO.userId());

            // Save the updated RadioStation to the database
            radioRepository.save(radioStation);
        }
    }
}


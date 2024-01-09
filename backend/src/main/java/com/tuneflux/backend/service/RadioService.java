package com.tuneflux.backend.service;

import com.tuneflux.backend.model.RadioStation;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Objects;


@Service
public class RadioService {

    /**
     * Ruft Radiosenderinformationen von der angegebenen API-URL ab.
     *
     * @param apiUrl Die URL, von der die Radiosenderinformationen abgerufen werden sollen.
     * @return Eine Liste von RadioStation-Objekten, die die abgerufenen Radiosender repräsentieren.
     */
    public List<RadioStation> getRadioStations(String apiUrl) {
        // Erstellt ein WebClient für HTTP-Anfragen
        WebClient webClient = WebClient.create();

        // Ruft die Radiosenderinformationen als Liste von RadioStation-Objekten von der API-URL ab
        List<RadioStation> radioStations = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToFlux(RadioStation.class)
                .collectList()
                .block();

        // Stellt sicher, dass die Liste nicht null ist (könnte bei Problemen mit der API passieren)
        return Objects.requireNonNull(radioStations);
    }
}

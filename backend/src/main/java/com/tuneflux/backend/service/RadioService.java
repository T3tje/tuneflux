package com.tuneflux.backend.service;

import com.tuneflux.backend.model.RadioStation;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Stream;

@Service
public class RadioService {

    /**
     * Ruft Radiosenderinformationen von der angegebenen API-URL ab.
     *
     * @param apiUrl Die URL, von der die Radiosenderinformationen abgerufen werden sollen.
     * @return Eine Liste von RadioStation-Objekten, die die abgerufenen Radiosender repräsentieren.
     */
    public List<RadioStation> getRadioStations(String apiUrl) {
        // Erstellt ein RestTemplate für HTTP-Anfragen
        RestTemplate restTemplate = new RestTemplate();

        // Ruft die Radiosenderinformationen als Array von RadioStation-Objekten von der API-URL ab
        RadioStation[] stationsArray = restTemplate.getForObject(apiUrl, RadioStation[].class);

        // Stellt sicher, dass das Array nicht null ist (könnte bei Problemen mit der API passieren)
        assert stationsArray != null;

        // Wandelt das Array in eine Liste von RadioStation-Objekten um und gibt es zurück
        return Stream.of(stationsArray).toList();
    }
}

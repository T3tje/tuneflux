package com.tuneflux.backend.controller;

import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.service.RadioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/radio")
public class RadioController {
    private final RadioService radioService;

    @Autowired
    // Konstruktor für die Injektion des RadioService
    public RadioController(RadioService radioService) {
        this.radioService = radioService;
    }

    @GetMapping
    public List<RadioStation> getRadioStations(
            // Standardwerte werden durch 'defaultValue' festgelegt, um sicherzustellen, dass Parameter nicht null sind
            @RequestParam(defaultValue = "10") int limit,            // Standard-Limit ist 10
            @RequestParam(defaultValue = "true") String reverse,    // Standard-Reihenfolge ist absteigend (true)
            @RequestParam(defaultValue = "votes") String order,      // Standard-Sortierung ist nach Stimmen (votes)
            @RequestParam(defaultValue = "0") int offset,            // Standard-Offset ist 0
            @RequestParam(defaultValue = "") String tagList,         // Standard-Tag-Liste ist leer
            @RequestParam(defaultValue = "") String name,            // Standard-Name ist leer
            @RequestParam(defaultValue = "") String country          // Standard-Land ist leer
    ) {
        // Verwende UriComponentsBuilder für die sichere und saubere URL-Zusammensetzung
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("https://de1.api.radio-browser.info/json/stations/search")
                .queryParam("limit", limit)                        // 'limit' wird zur URL hinzugefügt
                .queryParam("reverse", reverse)                    // 'reverse' wird zur URL hinzugefügt
                .queryParam("order", order)                        // 'order' wird zur URL hinzugefügt
                .queryParam("offset", offset)                      // 'offset' wird zur URL hinzugefügt
                .queryParam("tagList", tagList)                    // 'tagList' wird zur URL hinzugefügt, wird bei leerem String ignoriert
                .queryParam("name", name)                          // 'name' wird zur URL hinzugefügt, wird bei leerem String ignoriert
                .queryParam("country", country);                   // 'country' wird zur URL hinzugefügt, wird bei leerem String ignoriert

        // Rufe den aufgebauten URL-String ab
        String apiUrl = builder.toUriString();

        // Aufruf des RadioService mit der aufgebauten URL
        return radioService.getRadioStations(apiUrl);
    }
}

package com.tuneflux.backend.controller;

import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.service.RadioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
public class RadioController {
    private final RadioService radioService;


    @Autowired
    // Konstruktor für die Injektion des RadioService
    public RadioController(RadioService radioService) {
        this.radioService = radioService;
    }

    @GetMapping("/radio")
    public List<RadioStation> getRadioStations(
            // Standardwerte werden durch 'defaultValue' festgelegt, um sicherzustellen, dass Parameter nicht null sind
            @RequestParam(defaultValue = "10") int limit,            // Standard-Limit ist 10
            @RequestParam(defaultValue = "true") String reverse,    // Standard-Reihenfolge ist absteigend (true)
            @RequestParam(defaultValue = "votes") String order,      // Standard-Sortierung ist nach Stimmen (votes)
            @RequestParam(defaultValue = "0") int offset,            // Standard-Offset ist 0
            @RequestParam(defaultValue = "") String tagList,         // Standard-Tag-Liste ist leer
            @RequestParam(defaultValue = "") String name,            // Standard-Name ist leer
            @RequestParam(defaultValue = "") String country         // Standard-Land ist leer
    ) {

        // Aufruf des RadioService mit der Requestparametern für den Zusammenbau der Url
        return radioService.getRadioStations(limit, reverse, order, offset, tagList, name, country);
    }

    @PostMapping("/radio")
    public RadioStation addRadioStationToFavorites(@RequestBody RadioStation radioStation) {
        return radioService.addRadioStationToFavorites(radioStation);
    }
}

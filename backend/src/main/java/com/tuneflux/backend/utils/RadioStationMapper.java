package com.tuneflux.backend.utils;

import com.tuneflux.backend.model.RadioStation;
import com.tuneflux.backend.model.RadioStationDTO;

public class RadioStationMapper {
    private RadioStationMapper() {
        // Privater Konstruktor, um die Instanziierung der Klasse zu verhindern
        throw new UnsupportedOperationException("Utility class should not be instantiated");
    }

    public static RadioStationDTO mapToDTO(RadioStation radioStation) {
        return new RadioStationDTO(
                radioStation.stationuuid(),
                radioStation.changeuuid(),
                radioStation.serveruuid(),
                radioStation.name(),
                radioStation.url(),
                radioStation.url_resolved(),
                radioStation.homepage(),
                radioStation.favicon(),
                radioStation.tags(),
                radioStation.country(),
                radioStation.countrycode(),
                radioStation.state(),
                radioStation.language(),
                radioStation.languagecodes(),
                radioStation.votes(),
                radioStation.lastchangetime_iso8601(),
                radioStation.codec(),
                radioStation.bitrate(),
                radioStation.hls(),
                radioStation.lastcheckok(),
                radioStation.lastchecktime_iso8601(),
                radioStation.lastcheckoktime_iso8601(),
                radioStation.lastlocalchecktime_iso8601(),
                radioStation.clicktimestamp_iso8601(),
                radioStation.clickcount(),
                radioStation.clicktrend(),
                radioStation.ssl_error()
        );
    }
}

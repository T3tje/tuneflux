package com.tuneflux.backend.model;

import org.springframework.data.annotation.Id;

import java.util.List;

public record RadioStation(
        @Id String stationuuid,
        String changeuuid,
        String serveruuid,
        String name,
        String url,
        String url_resolved,
        String homepage,
        String favicon,
        String tags,
        String country,
        String countrycode,
        String state,
        String language,
        String languagecodes,
        int votes,
        String lastchangetime_iso8601,
        String codec,
        int bitrate,
        byte hls,
        byte lastcheckok,
        String lastchecktime_iso8601,
        String lastcheckoktime_iso8601,
        String lastlocalchecktime_iso8601,
        String clicktimestamp_iso8601,
        int clickcount,
        int clicktrend,
        byte ssl_error,
        List<String> appUserIds
) {
    // Benutzerdefinierte Methode, um appUserIds zu aktualisieren
    public RadioStation withAppUserIds(List<String> newAppUserIds) {
        return new RadioStation(
                stationuuid, changeuuid, serveruuid, name, url, url_resolved,
                homepage, favicon, tags, country, countrycode, state, language,
                languagecodes, votes, lastchangetime_iso8601, codec, bitrate,
                hls, lastcheckok, lastchecktime_iso8601, lastcheckoktime_iso8601,
                lastlocalchecktime_iso8601, clicktimestamp_iso8601, clickcount,
                clicktrend, ssl_error, newAppUserIds
        );
    }
}

package com.tuneflux.backend.model;
import org.springframework.data.annotation.Id;

public record RadioStationDTO(
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
        byte ssl_error
){
}

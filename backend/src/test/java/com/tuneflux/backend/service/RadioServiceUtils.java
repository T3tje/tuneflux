package com.tuneflux.backend.service;

import com.tuneflux.backend.model.RadioStation;
import java.util.ArrayList;
import java.util.List;

public class RadioServiceUtils {

    public final static RadioStation radioStationWithExistingUserId = new RadioStation(
        "StationUuid",
                "anotherChangeuuidValue",
                "anotherServeruuidValue",
                "Another Radio Station",
                "http://another-example.com",
                "http://resolved.another-example.com",
                "Another Homepage Value",
                "Another Favicon Value",
                "Another Tags Value",
                "Another Country Value",
                "Another Country Code Value",
                "Another State Value",
                "Another Language Value",
                "Another Language Codes Value",
                120, // Votes
                "2022-01-27T14:30:00Z", // lastchangetime_iso8601
                "Another Codec Value",
                192, // Bitrate
                (byte) 0, // hls
            (byte) 1, // lastcheckok
            "2022-01-27T14:35:00Z", // lastchecktime_iso8601
            "2022-01-27T14:35:00Z", // lastcheckoktime_iso8601
            "2022-01-27T14:30:00Z", // lastlocalchecktime_iso8601
            "2022-01-27T14:40:00Z", // clicktimestamp_iso8601
            70, // clickcount
            10, // clicktrend
            (byte) 1, // ssl_error
            List.of("existingUserId") // appUserIds
            );
    //NICHT VERÄNDERN
    public final static RadioStation radioStationWithOutExistingUserId = new RadioStation(
            "StationUuid",
            "anotherChangeuuidValue",
            "anotherServeruuidValue",
            "Another Radio Station",
            "http://another-example.com",
            "http://resolved.another-example.com",
            "Another Homepage Value",
            "Another Favicon Value",
            "Another Tags Value",
            "Another Country Value",
            "Another Country Code Value",
            "Another State Value",
            "Another Language Value",
            "Another Language Codes Value",
            120, // Votes
            "2022-01-27T14:30:00Z", // lastchangetime_iso8601
            "Another Codec Value",
            192, // Bitrate
            (byte) 0, // hls
            (byte) 1, // lastcheckok
            "2022-01-27T14:35:00Z", // lastchecktime_iso8601
            "2022-01-27T14:35:00Z", // lastcheckoktime_iso8601
            "2022-01-27T14:30:00Z", // lastlocalchecktime_iso8601
            "2022-01-27T14:40:00Z", // clicktimestamp_iso8601
            70, // clickcount
            10, // clicktrend
            (byte) 1, // ssl_error
            new ArrayList<>() // appUserIds
    );
}

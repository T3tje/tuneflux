package com.tuneflux.backend.model;

import org.springframework.data.annotation.Id;

import java.util.List;

public record AppUserDTO(
        @Id String id,
        String username,
        List<RadioStationDTO> favoriteRadioStations

) {

}


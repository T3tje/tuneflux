package com.tuneflux.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "appUsers")
public record AppUser(
        @Id String id,
        String username,
        List<String> favoriteRadioStationIds
) {

    // Benutzerdefinierte Methode, um favoriteRadioStationIds zu aktualisieren
    public AppUser withFavoriteRadioStationIds(List<String> newFavoriteRadioStationIds) {
        return new AppUser(id, username, newFavoriteRadioStationIds);
    }
}

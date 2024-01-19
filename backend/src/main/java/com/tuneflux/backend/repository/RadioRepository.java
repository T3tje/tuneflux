package com.tuneflux.backend.repository;

import com.tuneflux.backend.model.RadioStation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RadioRepository extends MongoRepository<RadioStation, String> {
    Optional<RadioStation> findByStationuuid(String stationuuid);
}

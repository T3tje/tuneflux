package com.tuneflux.backend.repository;


import com.tuneflux.backend.model.RadioStation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RadioRepository extends MongoRepository<RadioStation, String> {
}

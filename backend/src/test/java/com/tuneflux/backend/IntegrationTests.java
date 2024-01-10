package com.tuneflux.backend;

import com.jayway.jsonpath.JsonPath;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;



@SpringBootTest
@AutoConfigureMockMvc
class IntegrationTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void requestShouldReturnFiveRadioStations_WhenAskedForFive() throws Exception {
        String BASE_URL = "/api/radio";
        String jsonResponse = mvc.perform(MockMvcRequestBuilders.get(BASE_URL + "?limit=5"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn().getResponse().getContentAsString();

        int arrayLength = JsonPath.parse(jsonResponse).read("$.length()", Integer.class);

        // Überprüfe, ob die Länge des Arrays 5 ist
        assertThat(arrayLength, equalTo(5));
    }

}

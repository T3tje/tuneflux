package com.tuneflux.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class BackendApplicationTests {

	@Test
			void exampleTest() {
		boolean expected = true;
		boolean actual = true;

		assertEquals(actual, expected);
	}

}

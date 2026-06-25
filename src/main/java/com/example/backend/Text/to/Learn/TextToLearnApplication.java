package com.example.backend.Text.to.Learn;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import lombok.AllArgsConstructor;

/**
 * Main entry point for the Text-to-Learn AI Course Generator application.
 *
 * <p>This Spring Boot application exposes REST APIs that allow clients to:
 * <ul>
 *   <li>Generate structured AI-powered courses from a topic prompt</li>
 *   <li>Manage courses, modules, and lessons (CRUD)</li>
 *   <li>Enrich lessons with YouTube video links</li>
 * </ul>
 *
 * <p>Application context is bootstrapped by {@link SpringApplication#run}.
 */
@SpringBootApplication
@AllArgsConstructor
public class TextToLearnApplication {

	/** SLF4J logger for startup diagnostics. */
	private static final Logger log = LoggerFactory.getLogger(TextToLearnApplication.class);

	/**
	 * Application entry point.
	 *
	 * @param args command-line arguments passed at startup (currently unused)
	 */
	public static void main(String[] args) {
		log.info("Starting Text-to-Learn AI Course Generator application...");
		SpringApplication.run(TextToLearnApplication.class, args);
		log.info("Text-to-Learn application started successfully.");
	}
}

package com.example.backend.Text.to.Learn.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/**
 * Spring configuration class that registers a Jackson {@link ObjectMapper} bean.
 *
 * <p>{@link ObjectMapper} is the primary Jackson class used for serializing Java objects
 * to JSON and deserializing JSON back to Java objects. In this application it is used
 * in {@code CourseServiceImpl} to parse the raw JSON string returned by the AI service
 * into an {@code AddCourseRequestDTO}.
 *
 * <p>Exposing it as a Spring bean ensures a single, shared instance is reused across
 * the application (ObjectMapper instances are thread-safe once configured).
 */
@Configuration
public class ObjectMapperConfig {

    /** SLF4J logger for bean creation diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(ObjectMapperConfig.class);

    /**
     * Creates and registers a default Jackson {@link ObjectMapper} bean.
     *
     * <p>The default configuration supports standard JSON parsing. Additional
     * features (e.g., date formatting, unknown property handling) can be configured
     * here if needed in the future.
     *
     * @return a new, default-configured {@link ObjectMapper} instance
     */
    @Bean
    public ObjectMapper objectMapper() {
        log.info("Registering Jackson ObjectMapper bean.");
        return new ObjectMapper();
    }
}
package com.example.backend.Text.to.Learn.configuration;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring configuration class that registers a {@link ModelMapper} bean.
 *
 * <p>{@link ModelMapper} is used throughout the application to convert between
 * JPA entity objects (e.g., {@code CourseEntity}) and their corresponding Data Transfer
 * Objects (e.g., {@code CourseDTO}), reducing boilerplate mapping code.
 *
 * <p>A single shared bean is registered in the Spring application context and
 * injected wherever mapping is required (typically in service implementations).
 */
@Configuration
public class ModelMapperConfig {

    /** SLF4J logger for bean creation diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(ModelMapperConfig.class);

    /**
     * Creates and registers a {@link ModelMapper} bean in the Spring context.
     *
     * <p>ModelMapper introspects source and destination types at runtime and
     * automatically maps matching property names. The default configuration uses
     * standard matching strategy, which is sufficient for this application.
     *
     * @return a new, default-configured {@link ModelMapper} instance
     */
    @Bean
    public ModelMapper modelMapper() {
        log.info("Registering ModelMapper bean.");
        return new ModelMapper();
    }
}
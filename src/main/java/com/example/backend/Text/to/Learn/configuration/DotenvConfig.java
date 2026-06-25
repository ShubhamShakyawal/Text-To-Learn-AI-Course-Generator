package com.example.backend.Text.to.Learn.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class that loads environment variables from a {@code .env} file
 * into Java system properties at application startup.
 *
 * <p>Uses the {@code io.github.cdimascio:dotenv-java} library to read the {@code .env}
 * file located in the project root. If the file is missing, loading is silently skipped
 * ({@code ignoreIfMissing()}) so the application can still start using OS-level
 * environment variables or externalized Spring config.
 *
 * <p>All key-value pairs from the {@code .env} file are propagated as
 * {@link System#setProperty(String, String)} entries, making them available to
 * Spring's {@code @Value} annotations and {@code Environment} abstraction.
 */
@Configuration
public class DotenvConfig {

    /** SLF4J logger for dotenv loading diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(DotenvConfig.class);

    /*
     * Static initializer block — runs once when the class is first loaded by the JVM.
     * Placing the dotenv loading here ensures environment variables are available
     * before Spring attempts to resolve any @Value placeholders.
     */
    static {
        log.info("Loading environment variables from .env file...");

        // Configure dotenv: silently skip if .env file is absent
        io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
                .ignoreIfMissing() // do not throw if .env is not present
                .load();

        // Push every entry from .env into system properties so Spring can read them
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        log.info(".env file loaded successfully. {} properties registered.", dotenv.entries().size());
    }
}
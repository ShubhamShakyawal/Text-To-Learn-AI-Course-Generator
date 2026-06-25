package com.example.backend.Text.to.Learn.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Spring configuration class that registers a reactive {@link WebClient} bean
 * pre-configured to communicate with the OpenRouter AI API.
 *
 * <p>The base URL is injected from the application properties key
 * {@code spring.ai.openrouter.baseurl} (typically defined in
 * {@code application.yml} or via the {@code .env} file loaded by {@link DotenvConfig}).
 *
 * <p>The resulting bean ({@code openRouterClient}) is injected into
 * {@code AiService} to send chat completion requests to OpenRouter's API endpoint.
 */
@Configuration
public class WebClientConfig {

    /** SLF4J logger for bean creation diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(WebClientConfig.class);

    /**
     * Creates a {@link WebClient} bean configured with the OpenRouter base URL.
     *
     * <p>All requests made through this client will automatically use the
     * provided {@code baseUrl} as the root, so individual callers only need
     * to specify the relative path (e.g., {@code /chat/completions}).
     *
     * @param baseUrl the base URL of the OpenRouter API, injected from
     *                {@code spring.ai.openrouter.baseurl} in application properties
     * @return a configured {@link WebClient} instance for OpenRouter API calls
     */
    @Bean
    public WebClient openRouterClient(
            @Value("${spring.ai.openrouter.baseurl}") String baseUrl) {

        log.info("Registering OpenRouter WebClient bean with base URL: {}", baseUrl);

        return WebClient.builder()
                .baseUrl(baseUrl) // set the root URL for all requests made via this client
                .build();
    }
}
package com.example.backend.Text.to.Learn.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * Service responsible for generating AI-powered course content via the OpenRouter API.
 *
 * <p>OpenRouter is an LLM gateway that routes requests to various language models
 * (e.g., GPT-4, Claude, Mistral). This service sends a structured prompt asking the
 * model to return a course outline in JSON format, then returns the raw JSON string
 * for the caller to parse.
 *
 * <p>The {@link WebClient} bean ({@code openRouterClient}) is pre-configured with
 * the OpenRouter base URL in {@link com.example.backend.Text.to.Learn.configuration.WebClientConfig}.
 *
 * <p>Required application properties:
 * <ul>
 *   <li>{@code spring.ai.openai.api-key}       — API key for authenticating with OpenRouter</li>
 *   <li>{@code spring.ai.openrouter.model-name} — the model to use (e.g., "openai/gpt-4o")</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
public class AiService {

    /** SLF4J logger for AI request/response diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    /** Pre-configured WebClient pointing to the OpenRouter base URL. */
    private final WebClient openRouterClient;

    /** API key used in the Authorization header for OpenRouter requests. */
    @Value("${spring.ai.api-key}")
    private String apiKey;

    /** The AI model name to use for chat completions (e.g., "openai/gpt-4o-mini"). */
    @Value("${spring.ai.openrouter.model-name}")
    private String modelName;

    /** Application URL used as HTTP-Referer header for tracking in OpenRouter. */
    @Value("${app.url}")
    private String appUrl;

    /**
     * Sends a structured prompt to the OpenRouter chat completions API and returns
     * the raw JSON course content produced by the AI model.
     *
     * <p>The prompt instructs the model to respond with a JSON object conforming to
     * {@link com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO} structure:
     * {@code { title, description, modules: [ { title, lessons: [ { title, content, youtubeQuery } ] } ] }}
     *
     * <p>This method blocks until the HTTP response is received ({@code .block()}).
     *
     * @param topic the subject or keyword for which a course should be generated
     * @return the raw AI-generated JSON string representing the course structure
     */
    public String generateCourse(String topic) {
        log.info("Requesting AI-generated course for topic: '{}'", topic);
        log.debug("Using model: '{}' via OpenRouter API", modelName);

        // Build the prompt instructing the AI to return ONLY valid JSON in the expected schema
        String prompt = """
        Generate a structured course in JSON format.

        Topic: %s

        Rules:
        - Return ONLY JSON
        - Include title, description
        - Include modules
        - Each module should have lessons
        - Each lesson must include:
            title, content, youtubeQuery

        Example format:
        {
          "title": "",
          "description": "",
          "modules": [
            {
              "title": "",
              "lessons": [
                {
                  "title": "",
                  "content": "",
                  "youtubeQuery": ""
                }
              ]
            }
          ]
        }
        """.formatted(topic);

        // Assemble the OpenRouter-compatible request body (matches OpenAI chat completions spec)
        Map<String, Object> request = getRequestObject(prompt);

        log.debug("Sending POST request to /chat/completions with topic: '{}'", topic);

        // Execute the HTTP request and extract the generated content string from the response
        String result = createExecutePostRequestToClient(request);

        log.info("AI course generation complete for topic: '{}'. Response length: {} chars",
                topic, result != null ? result.length() : 0);

        return result;
    }

    public String get() {
        log.info("Requesting AI  for Connection Status: ");
        log.debug("Using model: '{}' via OpenRouter API", modelName);

        log.debug("Sending GET request to /chat/completions for Connection Check ");

        return openRouterClient.get()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)   // API key authentication
                .header("HTTP-Referer", appUrl) // recommended by OpenRouter for tracking
                .header("X-Title", "Course Generator")           // app identifier shown in OpenRouter dashboard
                .header("Content-Type", "application/json")
                .retrieve()
                .toString();
    }

    private Map<String, Object> getRequestObject(String prompt) {
        return Map.of(
                "model", modelName,
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                }
        );
    }

    private String createExecutePostRequestToClient(Map<String, Object> request) {
        try {
            return openRouterClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)   // API key authentication
                    .header("HTTP-Referer", appUrl) // recommended by OpenRouter for tracking
                    .header("X-Title", "Course Generator")           // app identifier shown in OpenRouter dashboard
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(res -> {
                        // Navigate the response structure: choices[0].message.content
                        var choices = (List<Map<String, Object>>) res.get("choices");
                        var message = (Map<String, Object>) choices.get(0).get("message");
                        return (String) message.get("content");
                    })
                    .block(); // block the reactive call — acceptable in this synchronous service context
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
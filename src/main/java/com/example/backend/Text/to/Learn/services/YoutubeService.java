package com.example.backend.Text.to.Learn.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Objects;

/**
 * Service responsible for fetching YouTube video links relevant to a given lesson topic.
 *
 * <p>Uses the YouTube Data API v3 ({@code /search} endpoint) to perform keyword-based
 * video searches and returns the URL of the top result.
 *
 * <p>Required application property (set via {@code .env} or OS environment):
 * <ul>
 *   <li>{@code YOUTUBE_API_KEY} — a valid Google/YouTube Data API key with
 *       the "YouTube Data API v3" service enabled in Google Cloud Console</li>
 * </ul>
 *
 * <p>The WebClient is created inline rather than injected from a bean, since the
 * base URL for the YouTube API ({@code https://www.googleapis.com/youtube/v3})
 * is different from the OpenRouter base URL used by {@link AiService}.
 */
@Service
@RequiredArgsConstructor
public class YoutubeService {

    /** SLF4J logger for YouTube API request/response diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(YoutubeService.class);

    /**
     * Dedicated WebClient for the YouTube Data API v3.
     * Created inline because a separate base URL is needed (different from the AI API client).
     */
    private final WebClient webClient = WebClient.create("https://www.googleapis.com/youtube/v3");

    /** YouTube Data API key injected from the environment variable {@code YOUTUBE_API_KEY}. */
    @Value("${YOUTUBE_API_KEY}")
    private String apiKey;

    /**
     * Searches the YouTube Data API for the most relevant video matching {@code query}
     * and returns its full watch URL.
     *
     * <p>API call: {@code GET /search?part=snippet&q={query}&maxResults=1&type=video&key={apiKey}}
     *
     * <p>This method blocks until the HTTP response is received ({@code .block()}).
     *
     * @param query the search term (typically auto-generated from the lesson/module/course titles)
     * @return the YouTube watch URL (e.g., {@code https://www.youtube.com/watch?v=dQw4w9WgXcQ}),
     *         or {@code null} if no video results were found
     */
    public String getVideoLink(String query) {
        log.info("Searching YouTube for query: '{}'", query);

        // Send a search request to the YouTube Data API
        Map response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("part", "snippet")      // return snippet metadata for each result
                        .queryParam("q", query)              // the search term
                        .queryParam("maxResults", 1)         // we only need the top result
                        .queryParam("type", "video")         // filter to videos only (exclude channels/playlists)
                        .queryParam("key", apiKey)           // authenticate the API request
                        .build())
                .retrieve()
                // Handle 4xx errors (e.g., 403 Forbidden = invalid/missing API key, quota exceeded)
                .onStatus(status -> status.is4xxClientError(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .doOnNext(body -> log.error(
                                        "YouTube API 4xx error for query '{}'. Status: {}. Body: {}",
                                        query, clientResponse.statusCode(), body))
                                .thenReturn(new RuntimeException(
                                        "YouTube API client error: " + clientResponse.statusCode())))
                // Handle 5xx server errors
                .onStatus(status -> status.is5xxServerError(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .doOnNext(body -> log.error(
                                        "YouTube API 5xx error for query '{}'. Status: {}. Body: {}",
                                        query, clientResponse.statusCode(), body))
                                .thenReturn(new RuntimeException(
                                        "YouTube API server error: " + clientResponse.statusCode())))
                .bodyToMono(Map.class)
                // Graceful fallback: log and return empty Mono so course generation continues
                .onErrorResume(ex -> {
                    log.warn("YouTube API call failed for query '{}': {}. Skipping video.", query, ex.getMessage());
                    return reactor.core.publisher.Mono.empty();
                })
                .block(); // block the reactive call — acceptable in this synchronous context

        // Guard: return null if the API call failed or returned no response
        if (response == null) {
            return null;
        }

        // Extract the items list from the response
        var items = (java.util.List<Map<String, Object>>) response.get("items");

        // Guard: return null if the search returned no results
        if (items == null || items.isEmpty()) {
            log.warn("No YouTube results found for query: '{}'", query);
            return null;
        }

        // Extract the videoId from the first result's id object
        var id = (Map<String, Object>) items.get(0).get("id");
        String videoUrl = "https://www.youtube.com/watch?v=" + id.get("videoId");

        log.info("YouTube video found for query '{}': {}", query, videoUrl);
        return videoUrl;
    }

    public boolean isHealthy() {
        try {
            String response = Objects.requireNonNull(webClient.get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/channels")
                                    .queryParam("part", "id")
                                    .queryParam("mine", "true")
                                    .queryParam("key", apiKey)
                                    .build())
                            .retrieve()
                            .toBodilessEntity()
                            .block())
                    .toString();

            log.info("Youtube service health response : '{}' ", response);

            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
//            return false;
        }
    }
}
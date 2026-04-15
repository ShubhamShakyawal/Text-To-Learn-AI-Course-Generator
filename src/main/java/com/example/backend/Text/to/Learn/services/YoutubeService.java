package com.example.backend.Text.to.Learn.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class YoutubeService {

    private final WebClient webClient = WebClient.create("https://www.googleapis.com/youtube/v3");

    @Value("${YOUTUBE_API_KEY}")
    private String apiKey;

    public String getVideoLink(String query) {

        Map response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("part", "snippet")
                        .queryParam("q", query)
                        .queryParam("maxResults", 1)
                        .queryParam("type", "video")
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        var items = (java.util.List<Map<String, Object>>) response.get("items");

        if (items.isEmpty()) return null;

        var id = (Map<String, Object>) items.get(0).get("id");

        return "https://www.youtube.com/watch?v=" + id.get("videoId");
    }
}
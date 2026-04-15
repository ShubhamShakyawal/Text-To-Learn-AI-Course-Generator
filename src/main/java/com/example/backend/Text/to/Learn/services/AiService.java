package com.example.backend.Text.to.Learn.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final WebClient openRouterClient;

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    @Value("${spring.ai.openrouter.model-name}")
    private String modelName;

    public String generateCourse(String topic) {
        System.out.println("API KEY :" + apiKey);
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

        Map<String, Object> request = Map.of(
                "model", modelName,
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                }
        );

        return openRouterClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("HTTP-Referer", "http://localhost:8080")
                .header("X-Title", "Course Generator")
                .header("Content-Type", "application/json")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .map(res -> {
                    var choices = (List<Map<String, Object>>) res.get("choices");
                    var message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                })
                .block();
    }
}
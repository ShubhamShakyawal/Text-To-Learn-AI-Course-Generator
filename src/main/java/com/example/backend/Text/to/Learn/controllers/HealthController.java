package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.dto.HealthDTO;
import com.example.backend.Text.to.Learn.services.AiService;
import com.example.backend.Text.to.Learn.services.YoutubeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final DataSource dataSource;
    private final AiService aiService;
    private final YoutubeService youtubeService;

    public HealthController(DataSource dataSource, AiService aiService, YoutubeService youtubeService) {
        this.dataSource = dataSource;
        this.aiService = aiService;
        this.youtubeService = youtubeService;
    }

    @GetMapping("/server")
    public ResponseEntity<HealthDTO> getServerHealth() {
        HealthDTO healthDTO = new HealthDTO();
        healthDTO.setStatus("Running");
        healthDTO.setResponse(String.valueOf(LocalDateTime.now()));
        return ResponseEntity.ok(healthDTO);
    }


    @GetMapping("/db")
    public ResponseEntity<HealthDTO> getDatabaseHealth() {

        HealthDTO healthDTO = new HealthDTO();

        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(2)) {
                healthDTO.setStatus("Running");
                healthDTO.setResponse("Database connection is valid.");

                return ResponseEntity.ok(healthDTO);
            }
            healthDTO.setStatus("Down");
            healthDTO.setResponse("Database connection is invalid.");

            return ResponseEntity.ok(healthDTO);
        } catch (Exception e) {
            healthDTO.setStatus("Down");
            healthDTO.setResponse(e.getMessage());

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(healthDTO);
        }
    }

    @GetMapping("/ai")
    public ResponseEntity<HealthDTO> getAiServiceHealth() {
        HealthDTO healthDTO = new HealthDTO();
        try {

            String response = aiService.get();
            healthDTO.setStatus("Running");
            healthDTO.setResponse(response);

            return ResponseEntity.ok(healthDTO);

        } catch (Exception e) {
            healthDTO.setStatus("Down");
            healthDTO.setResponse(e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(healthDTO);
        }
    }

    @GetMapping("/youtube")
    public ResponseEntity<HealthDTO> getYoutubeServiceHealth() {
        if (youtubeService.getVideoLink("India").contains("youtube")) {
            return ResponseEntity.ok(new HealthDTO("Running", "YouTube API is reachable"));
        }
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new HealthDTO("Down", "Service not reachable"));
    }
//        try {
//            if (youtubeService.isHealthy()) {
//                return ResponseEntity.ok(new HealthDTO("Running", "YouTube API is reachable."));
//            }
//            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new HealthDTO("Down", "No response received from YouTube API."));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new HealthDTO("Down", e.getMessage()));
//        }
//    }

    @GetMapping
    public Map<String, Object> getServicesHealth() {
        try {
            Map<String, Object> result = new HashMap<>();

            result.put("server", "Running");

            result.put("database", getDatabaseHealth().getBody());

            result.put("ai service", getAiServiceHealth().getBody());

            result.put("youtube service", getYoutubeServiceHealth().getBody());

            return result;
        } catch (Exception e) {
            return Map.of(
                    "status", "error",
                    "error", e.getMessage());
        }
    }
}

package com.example.backend.Text.to.Learn.configuration;

//import lombok.Value;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient openRouterClient(
            @Value("${spring.ai.openrouter.baseurl}") String baseUrl) {

        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }
}
package com.example.backend.Text.to.Learn.configuration;

import com.example.backend.Text.to.Learn.dto.UserDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security configuration for the Text-to-Learn application.
 *
 * <p>Security design:
 * <ul>
 *   <li>CSRF is disabled — the API is consumed by a React SPA, not a browser form.</li>
 *   <li>Session-based authentication — Spring creates an {@code HttpSession} on login
 *       and issues a {@code JSESSIONID} cookie to the browser.</li>
 *   <li>{@code /api/auth/**} is public (register, login, logout, me, google).</li>
 *   <li>All other {@code /api/**} endpoints require an active session.</li>
 *   <li>CORS is configured to allow the React dev server ({@code localhost:5173})
 *       with {@code allowCredentials = true} so the session cookie is forwarded.</li>
 *   <li>Unauthenticated requests receive a clean {@code 401 JSON} response instead
 *       of a redirect to a login page.</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableScheduling
public class SecurityConfig {

    /**
     * Provides a BCrypt password encoder bean used by {@link com.example.backend.Text.to.Learn.services.impl.AuthServiceImpl}.
     *
     * @return a {@link BCryptPasswordEncoder} with the default cost factor (10)
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the main Spring Security filter chain.
     *
     * @param http the {@link HttpSecurity} builder
     * @return the built {@link SecurityFilterChain}
     * @throws Exception if security configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // ── CSRF ── disabled for stateless REST API consumed by SPA
            .csrf(AbstractHttpConfigurer::disable)

            // ── CORS ── delegate to the CorsConfigurationSource bean
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ── Authorization rules ──────────────────────────────────────────
            .authorizeHttpRequests(auth -> auth
                    // Auth endpoints are public
                    .requestMatchers(
                            "/api/auth/register",
                            "/api/auth/login",
                            "/api/auth/logout",
                            "/api/auth/me",
                            "/api/auth/google"
                    ).permitAll()
                    // Health check public
                    .requestMatchers("/api/health").permitAll()
                    // Course endpoints open to both authenticated users AND guest sessions.
                    // Ownership is enforced inside CourseController via session/cookie.
                    .requestMatchers("/api/courses/**").permitAll()
                    // Everything else requires authentication
                    .requestMatchers("/api/**").authenticated()
                    .anyRequest().permitAll()
            )

            // ── Session management ───────────────────────────────────────────
            // IF_REQUIRED: Spring creates a session when needed (e.g. on login).
            // The JSESSIONID cookie is HttpOnly and sent back to the browser.
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )

            // ── Exception handling ───────────────────────────────────────────
            // Return 401 JSON instead of redirecting to a login page
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"error\":\"Unauthorized\",\"message\":\"" +
                                authException.getMessage() + "\"}"
                        );
                    })
                    .accessDeniedHandler((request, response, accessDeniedException) -> {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"error\":\"Forbidden\",\"message\":\"" +
                                accessDeniedException.getMessage() + "\"}"
                        );
                    })
            );

        return http.build();
    }

    /**
     * Configures CORS to allow the React Vite dev server to send credentialed
     * (cookie-bearing) requests to the Spring Boot backend.
     *
     * <p>In production, replace {@code http://localhost:5173} with your actual
     * frontend origin (e.g. {@code https://app.example.com}).
     *
     * @return the configured {@link CorsConfigurationSource}
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allowed origins — add your production domain here when deploying
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        // CRITICAL: Must be true so the browser sends the JSESSIONID cookie
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
package com.example.backend.Text.to.Learn.configuration;

import org.springframework.context.annotation.Configuration;
// Uncomment the imports below when security is re-enabled:
//import org.springframework.context.annotation.Bean;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

/**
 * Spring Security configuration class for the Text-to-Learn application.
 *
 * <p>Currently, the security filter chain is <strong>disabled</strong> (all endpoints
 * are publicly accessible). The commented-out bean below shows the intended configuration
 * when authentication is re-enabled:
 * <ul>
 *   <li>CSRF protection is disabled (suitable for stateless REST APIs)</li>
 *   <li>All requests require authentication</li>
 *   <li>HTTP Basic authentication is used as the default mechanism</li>
 * </ul>
 *
 * <p>To re-enable security, uncomment the imports above and the {@code @Bean} method below,
 * then add the appropriate Spring Security dependency to {@code pom.xml}.
 */
@Configuration
public class SecurityConfig {

//    /**
//     * Configures the Spring Security filter chain.
//     *
//     * <ul>
//     *   <li>Disables CSRF (Cross-Site Request Forgery) protection — safe for stateless APIs</li>
//     *   <li>Requires authentication for every HTTP request</li>
//     *   <li>Enables HTTP Basic authentication with default settings</li>
//     * </ul>
//     *
//     * @param http the {@link HttpSecurity} object used to build the security configuration
//     * @return the configured {@link SecurityFilterChain}
//     * @throws Exception if an error occurs while configuring security
//     */
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http.csrf(AbstractHttpConfigurer::disable)           // disable CSRF for REST APIs
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().authenticated()        // all endpoints require a valid user
//                )
//                .httpBasic(Customizer.withDefaults());       // enable HTTP Basic auth
//
//        return http.build();
//    }
}
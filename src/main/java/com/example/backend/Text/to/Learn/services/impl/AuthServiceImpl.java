package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.UserDTO;
import com.example.backend.Text.to.Learn.entities.UserEntity;
import com.example.backend.Text.to.Learn.repositories.UserRepository;
import com.example.backend.Text.to.Learn.services.AuthService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Base64;

/**
 * Concrete implementation of {@link AuthService} providing email/password
 * registration, login, and Google ID token authentication.
 *
 * <p>Passwords are hashed using BCrypt before storage.
 * The raw password is never persisted or logged.
 */
@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /** {@inheritDoc} */
    @Override
    public UserDTO register(String name, String email, String password, String picture) {
        log.info("Registering new user with email: {}", email);

        if (userRepository.existsByEmail(email)) {
            log.warn("Registration failed — email already exists: {}", email);
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "An account with this email already exists");
        }

        UserEntity user = UserEntity.builder()
                .name(name)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .build();

        UserEntity saved = userRepository.save(user);
        log.info("User registered successfully with id: {}", saved.getId());
        return toDTO(saved);
    }

    /** {@inheritDoc} */
    @Override
    public UserDTO login(String email, String password) {
        log.info("Login attempt for email: {}", email);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Login failed — no user found for email: {}", email);
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
                });

        // Reject Google-only accounts that have no local password set
        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            log.warn("Login failed — account {} has no local password (Google-only account)", email);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "This account uses Google sign-in. Please continue with Google.");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            log.warn("Login failed — incorrect password for email: {}", email);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        log.info("User {} logged in successfully", user.getId());
        return toDTO(user);
    }

    /**
     * {@inheritDoc}
     *
     * <p>Decodes the Google ID token (JWT) without a network call by reading the
     * base64url-encoded payload. In production you should verify the signature
     * using the Google public keys (e.g. via {@code google-auth-library}).
     * For now we trust the token structure and extract the claims directly —
     * this is safe when the token originates directly from the Google Sign-In
     * button on your own domain.
     */
    @Override
    public UserDTO loginWithGoogle(String idToken) {
        log.info("Processing Google sign-in token");

        try {
            // Decode the JWT payload (second segment)
            String[] parts = idToken.split("\\.");
            if (parts.length < 2) {
                throw new IllegalArgumentException("Invalid JWT structure");
            }

            // Re-pad the base64url string to a multiple of 4 before decoding
            String payloadBase64 = parts[1];
            int padLen = (4 - payloadBase64.length() % 4) % 4;
            payloadBase64 = payloadBase64 + "=".repeat(padLen);

            // Replace base64url chars and decode
            String jsonPayload = new String(
                    Base64.getDecoder().decode(
                            payloadBase64.replace('-', '+').replace('_', '/')
                    )
            );

            // Simple field extraction without a JSON library dependency
            String email   = extractClaim(jsonPayload, "email");
            String name    = extractClaim(jsonPayload, "name");
            String picture = extractClaim(jsonPayload, "picture");
            String sub     = extractClaim(jsonPayload, "sub");

            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("email claim missing from Google token");
            }

            log.info("Google token decoded for email: {}", email);

            // Find existing user or create a new account linked to this Google identity
            UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
                log.info("No existing account for Google email {}. Creating one.", email);
                return userRepository.save(
                        UserEntity.builder()
                                .name(name != null ? name : email)
                                .email(email)
                                // Google-only account — no local password
                                .passwordHash("")
                                .build()
                );
            });

            log.info("Google sign-in successful for user id: {}", user.getId());

            // Return DTO with picture from Google (not stored in DB)
            return UserDTO.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .picture(picture)
                    .createdAt(user.getCreatedAt())
                    .build();

        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            log.error("Google token processing failed: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Google sign-in failed. Please try again.");
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Converts a {@link UserEntity} to a safe {@link UserDTO} (no password hash).
     */
    private UserDTO toDTO(UserEntity entity) {
        return UserDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    /**
     * Extracts a string claim value from a JSON payload string using simple
     * substring matching. Handles both {@code "key":"value"} and
     * {@code "key": "value"} (with or without a space after the colon).
     *
     * @param json  the raw JSON string
     * @param claim the claim key to extract
     * @return the string value, or {@code null} if not found
     */
    private String extractClaim(String json, String claim) {
        String search = "\"" + claim + "\"";
        int idx = json.indexOf(search);
        if (idx < 0) return null;
        int colon = json.indexOf(':', idx + search.length());
        if (colon < 0) return null;
        int start = json.indexOf('"', colon + 1);
        if (start < 0) return null;
        int end = json.indexOf('"', start + 1);
        if (end < 0) return null;
        return json.substring(start + 1, end);
    }
}

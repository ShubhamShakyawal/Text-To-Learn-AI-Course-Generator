package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.UserDTO;

/**
 * Service interface defining the contract for authentication operations.
 *
 * <p>Implemented by
 * {@link com.example.backend.Text.to.Learn.services.impl.AuthServiceImpl}.
 */
public interface AuthService {

    /**
     * Registers a new user account.
     *
     * @param name     the user's display name
     * @param email    the user's unique email address
     * @param password the raw password (will be BCrypt-hashed before storage)
     * @param picture  optional avatar URL (may be null)
     * @return the created user as a {@link UserDTO} (no password hash exposed)
     * @throws org.springframework.web.server.ResponseStatusException 409 if email already exists
     */
    UserDTO register(String name, String email, String password, String picture);

    /**
     * Authenticates an existing user with email and password.
     *
     * @param email    the user's email address
     * @param password the raw password to verify against the stored BCrypt hash
     * @return the authenticated user as a {@link UserDTO}
     * @throws org.springframework.web.server.ResponseStatusException 401 if credentials are invalid
     */
    UserDTO login(String email, String password);

    /**
     * Authenticates (or registers) a user via a Google ID token credential.
     *
     * <p>Decodes the JWT, extracts the Google subject ({@code sub}), name, email and picture.
     * If no account exists with that email, a new one is created without a local password.
     *
     * @param idToken the raw Google ID token (JWT) from the browser sign-in flow
     * @return the authenticated or newly created user as a {@link UserDTO}
     * @throws org.springframework.web.server.ResponseStatusException 401 if the token is invalid
     */
    UserDTO loginWithGoogle(String idToken);
}

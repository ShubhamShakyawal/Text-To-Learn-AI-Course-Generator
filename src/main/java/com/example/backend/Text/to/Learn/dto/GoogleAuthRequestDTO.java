package com.example.backend.Text.to.Learn.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for the {@code POST /api/auth/google} request body.
 *
 * <p>The frontend decodes the Google ID token credential and sends the
 * extracted user fields. The backend verifies the token audience and
 * creates or retrieves the matching user account.
 */
@Data
public class GoogleAuthRequestDTO {

    /** The raw Google ID token credential returned by the Google sign-in button. */
    @NotBlank(message = "Google credential token is required")
    private String credential;
}

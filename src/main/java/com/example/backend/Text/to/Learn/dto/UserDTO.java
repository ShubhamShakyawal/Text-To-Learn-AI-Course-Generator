package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object representing a {@code User} in API responses.
 *
 * <p>The {@code passwordHash} field is <strong>never</strong> included here —
 * this DTO is safe to serialize and return to clients.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    /** Database primary key of the user. */
    private Long id;

    /** Full display name. */
    private String name;

    /** Unique email address / login identifier. */
    private String email;

    /** URL to the user's avatar picture (may be null for email-registered users). */
    private String picture;

    /** Timestamp when the account was created. */
    private LocalDateTime createdAt;
}

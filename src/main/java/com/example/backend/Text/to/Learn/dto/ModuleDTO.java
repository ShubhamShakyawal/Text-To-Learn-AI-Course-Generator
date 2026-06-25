package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object (DTO) representing a {@code Module} in API responses.
 *
 * <p>This DTO is the outbound representation of a module returned to the client.
 * A module is a logical grouping of related lessons within a course and sits
 * in the middle of the hierarchy: Course → Module → Lesson.
 *
 * <p>Fields:
 * <ul>
 *   <li>{@code id}      — the database-generated primary key of the module</li>
 *   <li>{@code title}   — the display name of the module</li>
 *   <li>{@code lessons} — the ordered list of lessons within this module</li>
 * </ul>
 */
@Data           // generates getters, setters, equals, hashCode, and toString
@AllArgsConstructor
@NoArgsConstructor
public class ModuleDTO {

    /** Database-generated unique identifier for the module. */
    private Long id;

    /** Display name of the module (e.g., "Getting Started with Java"). */
    private String title;

    /**
     * Ordered list of lessons contained in this module.
     * Each lesson holds the actual educational content.
     */
    private List<LessonDTO> lessons;
}